'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("./configuration");
const debug_1 = require("debug");
const serviceManager_1 = require("./serviceManager");
const transport_1 = require("./services/transport");
const featureManager_1 = require("./featureManager");
const actions_1 = require("./services/actions");
const metrics_1 = require("./services/metrics");
const constants_1 = require("./constants");
const runtimeStats_1 = require("./services/runtimeStats");
const entrypoint_1 = require("./features/entrypoint");
class IOConfig {
    constructor() {
        this.catchExceptions = true;
        this.profiling = true;
        this.tracing = false;
        this.standalone = false;
    }
}
exports.IOConfig = IOConfig;
exports.defaultConfig = {
    catchExceptions: true,
    profiling: true,
    metrics: {
        v8: true,
        network: false,
        eventLoop: true,
        runtime: true,
        http: true
    },
    standalone: false,
    apmOptions: undefined,
    tracing: {
        enabled: false,
        outbound: false
    }
};
class PMX {
    constructor() {
        this.featureManager = new featureManager_1.FeatureManager();
        this.transport = null;
        this.actionService = null;
        this.metricService = null;
        this.runtimeStatsService = null;
        this.logger = debug_1.default('axm:main');
        this.initialized = false;
        this.Entrypoint = entrypoint_1.Entrypoint;
    }
    init(config) {
        const callsite = (new Error().stack || '').split('\n')[2];
        if (callsite && callsite.length > 0) {
            this.logger(`init from ${callsite}`);
        }
        if (this.initialized === true) {
            this.logger(`Calling init but was already the case, destroying and recreating`);
            this.destroy();
        }
        if (config === undefined) {
            config = exports.defaultConfig;
        }
        if (!config.standalone) {
            const autoStandalone = process.env.PM2_SECRET_KEY && process.env.PM2_PUBLIC_KEY && process.env.PM2_APP_NAME;
            config.standalone = !!autoStandalone;
            config.apmOptions = autoStandalone ? {
                secretKey: process.env.PM2_SECRET_KEY,
                publicKey: process.env.PM2_PUBLIC_KEY,
                appName: process.env.PM2_APP_NAME
            } : undefined;
        }
        this.transport = transport_1.createTransport(config.standalone === true ? 'websocket' : 'ipc', config.apmOptions);
        serviceManager_1.ServiceManager.set('transport', this.transport);
        if (constants_1.canUseInspector()) {
            const Inspector = require('./services/inspector');
            const inspectorService = new Inspector();
            inspectorService.init();
            serviceManager_1.ServiceManager.set('inspector', inspectorService);
        }
        this.actionService = new actions_1.ActionService();
        this.actionService.init();
        serviceManager_1.ServiceManager.set('actions', this.actionService);
        this.metricService = new metrics_1.MetricService();
        this.metricService.init();
        serviceManager_1.ServiceManager.set('metrics', this.metricService);
        this.runtimeStatsService = new runtimeStats_1.RuntimeStatsService();
        this.runtimeStatsService.init();
        if (this.runtimeStatsService.isEnabled()) {
            serviceManager_1.ServiceManager.set('runtimeStats', this.runtimeStatsService);
        }
        this.featureManager.init(config);
        configuration_1.default.init(config);
        this.initialConfig = config;
        this.initialized = true;
        return this;
    }
    destroy() {
        this.logger('destroy');
        this.featureManager.destroy();
        if (this.actionService !== null) {
            this.actionService.destroy();
        }
        if (this.transport !== null) {
            this.transport.destroy();
        }
        if (this.metricService !== null) {
            this.metricService.destroy();
        }
        if (this.runtimeStatsService !== null) {
            this.runtimeStatsService.destroy();
        }
        const inspectorService = serviceManager_1.ServiceManager.get('inspector');
        if (inspectorService !== undefined) {
            inspectorService.destroy();
        }
    }
    getConfig() {
        return this.initialConfig;
    }
    notifyError(error, context) {
        const notify = this.featureManager.get('notify');
        return notify.notifyError(error, context);
    }
    metrics(metric) {
        const res = [];
        if (metric === undefined || metric === null) {
            console.error(`Received empty metric to create`);
            console.trace();
            return [];
        }
        let metrics = !Array.isArray(metric) ? [metric] : metric;
        for (let metric of metrics) {
            if (typeof metric.name !== 'string') {
                console.error(`Trying to create a metrics without a name`, metric);
                console.trace();
                res.push({});
                continue;
            }
            if (metric.type === undefined) {
                metric.type = metrics_1.MetricType.gauge;
            }
            switch (metric.type) {
                case metrics_1.MetricType.counter: {
                    res.push(this.counter(metric));
                    continue;
                }
                case metrics_1.MetricType.gauge: {
                    res.push(this.gauge(metric));
                    continue;
                }
                case metrics_1.MetricType.histogram: {
                    res.push(this.histogram(metric));
                    continue;
                }
                case metrics_1.MetricType.meter: {
                    res.push(this.meter(metric));
                    continue;
                }
                case metrics_1.MetricType.metric: {
                    res.push(this.gauge(metric));
                    continue;
                }
                default: {
                    console.error(`Invalid metric type ${metric.type} for metric ${metric.name}`);
                    console.trace();
                    res.push({});
                    continue;
                }
            }
        }
        return res;
    }
    histogram(config) {
        if (typeof config === 'string') {
            config = {
                name: config,
                measurement: metrics_1.MetricMeasurements.mean
            };
        }
        if (this.metricService === null) {
            return console.trace(`Tried to register a metric without initializing @pm2/io`);
        }
        return this.metricService.histogram(config);
    }
    metric(config) {
        if (typeof config === 'string') {
            config = {
                name: config
            };
        }
        if (this.metricService === null) {
            return console.trace(`Tried to register a metric without initializing @pm2/io`);
        }
        return this.metricService.metric(config);
    }
    gauge(config) {
        if (typeof config === 'string') {
            config = {
                name: config
            };
        }
        if (this.metricService === null) {
            return console.trace(`Tried to register a metric without initializing @pm2/io`);
        }
        return this.metricService.metric(config);
    }
    counter(config) {
        if (typeof config === 'string') {
            config = {
                name: config
            };
        }
        if (this.metricService === null) {
            return console.trace(`Tried to register a metric without initializing @pm2/io`);
        }
        return this.metricService.counter(config);
    }
    meter(config) {
        if (typeof config === 'string') {
            config = {
                name: config
            };
        }
        if (this.metricService === null) {
            return console.trace(`Tried to register a metric without initializing @pm2/io`);
        }
        return this.metricService.meter(config);
    }
    action(name, opts, fn) {
        if (typeof name === 'object') {
            const tmp = name;
            name = tmp.name;
            opts = tmp.options;
            fn = tmp.action;
        }
        if (this.actionService === null) {
            return console.trace(`Tried to register a action without initializing @pm2/io`);
        }
        return this.actionService.registerAction(name, opts, fn);
    }
    onExit(callback) {
        if (typeof callback === 'function') {
            const onExit = require('signal-exit');
            return onExit(callback);
        }
    }
    emit(name, data) {
        const events = this.featureManager.get('events');
        return events.emit(name, data);
    }
    getTracer() {
        const tracing = this.featureManager.get('tracing');
        return tracing.getTracer();
    }
    initModule(opts, cb) {
        if (!opts)
            opts = {};
        if (opts.reference) {
            opts.name = opts.reference;
            delete opts.reference;
        }
        opts = Object.assign({
            widget: {}
        }, opts);
        opts.widget = Object.assign({
            type: 'generic',
            logo: 'https://app.keymetrics.io/img/logo/keymetrics-300.png',
            theme: ['#111111', '#1B2228', '#807C7C', '#807C7C']
        }, opts.widget);
        opts.isModule = true;
        opts = configuration_1.default.init(opts);
        return typeof cb === 'function' ? cb(null, opts) : opts;
    }
    expressErrorHandler() {
        const notify = this.featureManager.get('notify');
        return notify.expressErrorHandler();
    }
    koaErrorHandler() {
        const notify = this.featureManager.get('notify');
        return notify.koaErrorHandler();
    }
}
exports.default = PMX;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG14LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BteC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7O0FBRVosbURBQTJDO0FBQzNDLGlDQUF5QjtBQUN6QixxREFBaUQ7QUFDakQsb0RBQWtGO0FBQ2xGLHFEQUFpRDtBQUNqRCxnREFBa0Q7QUFFbEQsZ0RBQXdIO0FBUXhILDJDQUE2QztBQUc3QywwREFBNkQ7QUFDN0Qsc0RBQWtEO0FBR2xELE1BQWEsUUFBUTtJQUFyQjtRQUlFLG9CQUFlLEdBQWEsSUFBSSxDQUFBO1FBY2hDLGNBQVMsR0FBK0IsSUFBSSxDQUFBO1FBSTVDLFlBQU8sR0FBNkIsS0FBSyxDQUFBO1FBS3pDLGVBQVUsR0FBYSxLQUFLLENBQUE7SUFLOUIsQ0FBQztDQUFBO0FBaENELDRCQWdDQztBQUVZLFFBQUEsYUFBYSxHQUFhO0lBQ3JDLGVBQWUsRUFBRSxJQUFJO0lBQ3JCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsT0FBTyxFQUFFO1FBQ1AsRUFBRSxFQUFFLElBQUk7UUFDUixPQUFPLEVBQUUsS0FBSztRQUNkLFNBQVMsRUFBRSxJQUFJO1FBQ2YsT0FBTyxFQUFFLElBQUk7UUFDYixJQUFJLEVBQUUsSUFBSTtLQUNYO0lBQ0QsVUFBVSxFQUFFLEtBQUs7SUFDakIsVUFBVSxFQUFFLFNBQVM7SUFDckIsT0FBTyxFQUFFO1FBQ1AsT0FBTyxFQUFFLEtBQUs7UUFDZCxRQUFRLEVBQUUsS0FBSztLQUNoQjtDQUNGLENBQUE7QUFFRCxNQUFxQixHQUFHO0lBQXhCO1FBR1UsbUJBQWMsR0FBbUIsSUFBSSwrQkFBYyxFQUFFLENBQUE7UUFDckQsY0FBUyxHQUFxQixJQUFJLENBQUE7UUFDbEMsa0JBQWEsR0FBeUIsSUFBSSxDQUFBO1FBQzFDLGtCQUFhLEdBQXlCLElBQUksQ0FBQTtRQUMxQyx3QkFBbUIsR0FBK0IsSUFBSSxDQUFBO1FBQ3RELFdBQU0sR0FBYSxlQUFLLENBQUMsVUFBVSxD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