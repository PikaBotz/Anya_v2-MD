'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const eventemitter2_1 = require("eventemitter2");
const EWMA_1 = require("./EWMA");
const histogram_1 = require("./metrics/histogram");
const fclone = (data) => JSON.parse(JSON.stringify(data));
const log = Debug('axm:features:tracing:aggregator');
class TransactionAggregator extends eventemitter2_1.EventEmitter2 {
    constructor() {
        super(...arguments);
        this.spanTypes = ['redis', 'mysql', 'pg', 'mongo', 'outbound_http'];
        this.cache = {
            routes: {},
            meta: {
                trace_count: 0,
                http_meter: new EWMA_1.default(),
                db_meter: new EWMA_1.default(),
                histogram: new histogram_1.default({ measurement: 'median' }),
                db_histograms: {}
            }
        };
        this.privacyRegex = /":(?!\[|{)\\"[^"]*\\"|":(["'])(?:(?=(\\?))\2.)*?\1|":(?!\[|{)[^,}\]]*|":\[[^{]*]/g;
    }
    init(sendInterval = 30000) {
        this.worker = setInterval(_ => {
            let data = this.prepareAggregationforShipping();
            this.emit('packet', { data });
        }, sendInterval);
    }
    destroy() {
        if (this.worker !== undefined) {
            clearInterval(this.worker);
        }
        this.cache.routes = {};
    }
    getAggregation() {
        return this.cache;
    }
    validateData(packet) {
        if (!packet) {
            log('Packet malformated', packet);
            return false;
        }
        if (!packet.spans || !packet.spans[0]) {
            log('Trace without spans: %s', Object.keys(packet.data));
            return false;
        }
        if (!packet.spans[0].labels) {
            log('Trace spans without labels: %s', Object.keys(packet.spans));
            return false;
        }
        return true;
    }
    aggregate(packet) {
        if (this.validateData(packet) === false)
            return false;
        let path = packet.spans[0].labels['http/path'];
        if (process.env.PM2_APM_CENSOR_SPAMS !== '0') {
            this.censorSpans(packet.spans);
        }
        packet.spans = packet.spans.filter((span) => {
            return span.endTime !== span.startTime;
        });
        packet.spans.forEach((span) => {
            span.mean = Math.round(new Date(span.endTime).getTime() - new Date(span.startTime).getTime());
            delete span.endTime;
        });
        packet.spans.forEach((span) => {
            if (!span.name || !span.kind)
                return false;
            if (span.kind === 'RPC_SERVER') {
                this.cache.meta.histogram.update(span.mean);
                return this.cache.meta.http_meter.update(1);
            }
            if (span.labels && span.labels['http/method'] && span.labels['http/status_code']) {
                span.labels['service'] = span.name;
                span.name = 'outbound_http';
            }
            for (let i = 0; i < this.spanTypes.length; i++) {
                if (span.name.indexOf(this.spanTypes[i]) > -1) {
                    this.cache.meta.db_meter.update(1);
                    if (!this.cache.meta.db_histograms[this.spanTypes[i]]) {
                        this.cache.meta.db_histograms[this.spanTypes[i]] = new histogram_1.default({ measurement: 'mean' });
                    }
                    this.cache.meta.db_histograms[this.spanTypes[i]].update(span.mean);
                    break;
                }
            }
        });
        this.cache.meta.trace_count++;
        if (path[0] === '/' && path !== '/') {
            path = path.substr(1, path.length - 1);
        }
        let matched = this.matchPath(path, this.cache.routes);
        if (!matched) {
            this.cache.routes[path] = [];
            this.mergeTrace(this.cache.routes[path], packet);
        }
        else {
            this.mergeTrace(this.cache.routes[matched], packet);
        }
        return this.cache;
    }
    mergeTrace(aggregated, trace) {
        if (!aggregated || !trace)
            return;
        if (trace.spans.length === 0)
            return;
        if (!aggregated.variances)
            aggregated.variances = [];
        if (!aggregated.meta) {
            aggregated.meta = {
                histogram: new histogram_1.default({ measurement: 'median' }),
                meter: new EWMA_1.default()
            };
        }
        aggregated.meta.histogram.update(trace.spans[0].mean);
        aggregated.meta.meter.update();
        const merge = (variance) => {
            if (variance == null) {
                delete trace.projectId;
                delete trace.traceId;
                trace.histogram = new histogram_1.default({ measurement: 'median' });
                trace.histogram.update(trace.spans[0].mean);
                trace.spans.forEach((span) => {
                    span.histogram = new histogram_1.default({ measurement: 'median' });
                    span.histogram.update(span.mean);
                    delete span.mean;
                });
                aggregated.variances.push(trace);
            }
            else {
                variance.histogram.update(trace.spans[0].mean);
                this.updateSpanDuration(variance.spans, trace.spans);
                trace.spans.forEach((span) => {
                    delete span.labels.stacktrace;
                });
            }
        };
        for (let i = 0; i < aggregated.variances.length; i++) {
            if (this.compareList(aggregated.variances[i].spans, trace.spans)) {
                return merge(aggregated.variances[i]);
            }
        }
        return merge(null);
    }
    updateSpanDuration(spans, newSpans) {
        for (let i = 0; i < spans.length; i++) {
            if (!newSpans[i])
                continue;
            spans[i].histogram.update(newSpans[i].mean);
        }
    }
    compareList(one, two) {
        if (one.length !== two.length)
            return false;
        for (let i = 0; i < one.length; i++) {
            if (one[i].name !== two[i].name)
                return false;
            if (one[i].kind !== two[i].kind)
                return false;
            if (!one[i].labels && two[i].labels)
                return false;
            if (one[i].labels && !two[i].labels)
                return false;
            if (one[i].labels.length !== two[i].labels.length)
                return false;
        }
        return true;
    }
    matchPath(path, routes) {
        if (!path || !routes)
            return false;
        if (path === '/')
            return routes[path] ? path : null;
        if (path[path.length - 1] === '/') {
            path = path.substr(0, path.length - 1);
        }
        path = path.split('/');
        if (path.length === 1)
            return routes[path[0]] ? routes[path[0]] : null;
        let keys = Object.keys(routes);
        for (let i = 0; i < keys.length; i++) {
            let route = keys[i];
            let segments = route.split('/');
            if (segments.length !== path.length)
                continue;
            for (let j = path.length - 1; j >= 0; j--) {
                if (path[j] !== segments[j]) {
                    if (this.isIdentifier(path[j]) && segments[j] === '*' && path[j - 1] === segments[j - 1]) {
                        return segments.join('/');
                    }
                    else if (path[j - 1] !== undefined && path[j - 1] === segments[j - 1] && this.isIdentifier(path[j]) && this.isIdentifier(segments[j])) {
                        segments[j] = '*';
                        routes[segments.join('/')] = routes[route];
                        delete routes[keys[i]];
                        return segments.join('/');
                    }
                    else {
                        break;
                    }
                }
                if (j === 0)
                    return segments.join('/');
            }
        }
    }
    prepareAggregationforShipping() {
        let routes = this.cache.routes;
        const normalized = {
            routes: [],
            meta: {
                trace_count: this.cache.meta.trace_count,
                http_meter: Math.round(this.cache.meta.http_meter.rate(1000) * 100) / 100,
                db_meter: Math.round(this.cache.meta.db_meter.rate(1000) * 100) / 100,
                http_percentiles: {
                    median: this.cache.meta.histogram.percentiles([0.5])[0.5],
                    p95: this.cache.meta.histogram.percentiles([0.95])[0.95],
                    p99: this.cache.meta.histogram.percentiles([0.99])[0.99]
                },
                db_percentiles: {}
            }
        };
        this.spanTypes.forEach((name) => {
            let histogram = this.cache.meta.db_histograms[name];
            if (!histogram)
                return;
            normalized.meta.db_percentiles[name] = histogram.percentiles([0.5])[0.5];
        });
        Object.keys(routes).forEach((path) => {
            let data = routes[path];
            if (!data.variances || data.variances.length === 0)
                return;
            const variances = data.variances.sort((a, b) => {
                return b.count - a.count;
            }).slice(0, 5);
            let routeCopy = {
                path: path === '/' ? '/' : '/' + path,
                meta: {
                    min: data.meta.histogram.getMin(),
                    max: data.meta.histogram.getMax(),
                    count: data.meta.histogram.getCount(),
                    meter: Math.round(data.meta.meter.rate(1000) * 100) / 100,
                    median: data.meta.histogram.percentiles([0.5])[0.5],
                    p95: data.meta.histogram.percentiles([0.95])[0.95]
                },
                variances: []
            };
            variances.forEach((variance) => {
                if (!variance.spans || variance.spans.length === 0)
                    return;
                let tmp = {
                    spans: [],
                    count: variance.histogram.getCount(),
                    min: variance.histogram.getMin(),
                    max: variance.histogram.getMax(),
                    median: variance.histogram.percentiles([0.5])[0.5],
                    p95: variance.histogram.percentiles([0.95])[0.95]
                };
                variance.spans.forEach((oldSpan) => {
                    const span = fclone({
                        name: oldSpan.name,
                        labels: oldSpan.labels,
                        kind: oldSpan.kind,
                        startTime: oldSpan.startTime,
                        min: oldSpan.histogram ? oldSpan.histogram.getMin() : undefined,
                        max: oldSpan.histogram ? oldSpan.histogram.getMax() : undefined,
                        median: oldSpan.histogram ? oldSpan.histogram.percentiles([0.5])[0.5] : undefined
                    });
                    tmp.spans.push(span);
                });
                routeCopy.variances.push(tmp);
            });
            normalized.routes.push(routeCopy);
        });
        log(`sending formatted trace to remote endpoint`);
        return normalized;
    }
    isIdentifier(id) {
        id = typeof (id) !== 'string' ? id + '' : id;
        if (id.match(/[0-9a-f]{8}-[0-9a-f]{4}-[14][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-f]{12}[14][0-9a-f]{19}/i)) {
            return true;
        }
        else if (id.match(/\d+/)) {
            return true;
        }
        else if (id.match(/[0-9]+[a-z]+|[a-z]+[0-9]+/)) {
            return true;
        }
        else if (id.match(/((?:[0-9a-zA-Z]+[@\-_.][0-9a-zA-Z]+|[0-9a-zA-Z]+[@\-_.]|[@\-_.][0-9a-zA-Z]+)+)/)) {
            return true;
        }
        return false;
    }
    censorSpans(spans) {
        if (!spans)
            return log('spans is null');
        spans.forEach((span) => {
            if (!span.labels)
                return;
            delete span.labels.results;
            delete span.labels.result;
            delete span.spanId;
            delete span.parentSpanId;
            delete span.labels.values;
            delete span.labels.stacktrace;
            Object.keys(span.labels).forEach((key) => {
                if (typeof (span.labels[key]) === 'string' && key !== 'stacktrace') {
                    span.labels[key] = span.labels[key].replace(this.privacyRegex, '\": \"?\"');
                }
            });
        });
    }
}
exports.TransactionAggregator = TransactionAggregator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb25BZ2dyZWdhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3RyYW5zYWN0aW9uQWdncmVnYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7O0FBRVosK0JBQThCO0FBQzlCLGlEQUE2QztBQUM3QyxpQ0FBeUI7QUFDekIsbURBQTJDO0FBRTNDLE1BQU0sTUFBTSxHQUFHLENBQUMsSUFBWSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtBQUNqRSxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtBQTREcEQsTUFBYSxxQkFBc0IsU0FBUSw2QkFBYTtJQUF4RDs7UUFFVSxjQUFTLEdBQWEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUE7UUFDeEUsVUFBSyxHQUFlO1lBQzFCLE1BQU0sRUFBRSxFQUFFO1lBQ1YsSUFBSSxFQUFFO2dCQUNKLFdBQVcsRUFBRSxDQUFDO2dCQUNkLFVBQVUsRUFBRSxJQUFJLGNBQUksRUFBRTtnQkFDdEIsUUFBUSxFQUFFLElBQUksY0FBSSxFQUFFO2dCQUNwQixTQUFTLEVBQUUsSUFBSSxtQkFBUyxDQUFDLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxDQUFDO2dCQUNuRCxhQUFhLEVBQUUsRUFBRTthQUNsQjtTQUNGLENBQUE7UUFDTyxpQkFBWSxHQUFXLG1GQUFtRixDQUFBO0lBK1lwSCxDQUFDO0lBNVlDLElBQUksQ0FBRSxlQUF1QixLQUFLO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzVCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFBO1lBQy9DLElBQUksQ0FBQyxJQUFJ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SUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtnQkFBRSxPQUFPLEtBQUssQ0FBQTtZQUM3QyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7Z0JBQUUsT0FBTyxLQUFLLENBQUE7WUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07Z0JBQUUsT0FBTyxLQUFLLENBQUE7WUFDakQsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07Z0JBQUUsT0FBTyxLQUFLLENBQUE7WUFDakQsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU07Z0JBQUUsT0FBTyxLQUFLLENBQUE7U0FDaEU7UUFDRCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFLRCxTQUFTLENBQUUsSUFBSSxFQUFFLE1BQU07UUFFckIsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPLEtBQUssQ0FBQTtRQUNsQyxJQUFJLElBQUksS0FBSyxHQUFHO1lBQUUsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO1FBR25ELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQ2pDLElBQUksR0FBRyxJQUFJLENBQUMs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