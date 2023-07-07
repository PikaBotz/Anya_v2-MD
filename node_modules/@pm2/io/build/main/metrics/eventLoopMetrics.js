'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const metrics_1 = require("../services/metrics");
const serviceManager_1 = require("../serviceManager");
const Debug = require("debug");
const histogram_1 = require("../utils/metrics/histogram");
class EventLoopMetricOption {
}
exports.EventLoopMetricOption = EventLoopMetricOption;
const defaultOptions = {
    eventLoopActive: true,
    eventLoopDelay: true
};
class EventLoopHandlesRequestsMetric {
    constructor() {
        this.logger = Debug('axm:features:metrics:eventloop');
        this.delayLoopInterval = 1000;
    }
    init(config) {
        if (config === false)
            return;
        if (config === undefined) {
            config = defaultOptions;
        }
        if (config === true) {
            config = defaultOptions;
        }
        this.metricService = serviceManager_1.ServiceManager.get('metrics');
        if (this.metricService === undefined)
            return this.logger('Failed to load metric service');
        this.logger('init');
        if (typeof process._getActiveRequests === 'function' && config.eventLoopActive === true) {
            const requestMetric = this.metricService.metric({
                name: 'Active requests',
                id: 'internal/libuv/requests',
                historic: true
            });
            this.requestTimer = setInterval(_ => {
                requestMetric.set(process._getActiveRequests().length);
            }, 1000);
            this.requestTimer.unref();
        }
        if (typeof process._getActiveHandles === 'function' && config.eventLoopActive === true) {
            const handleMetric = this.metricService.metric({
                name: 'Active handles',
                id: 'internal/libuv/handles',
                historic: true
            });
            this.handleTimer = setInterval(_ => {
                handleMetric.set(process._getActiveHandles().length);
            }, 1000);
            this.handleTimer.unref();
        }
        if (config.eventLoopDelay === false)
            return;
        const histogram = new histogram_1.default();
        const uvLatencyp50 = {
            name: 'Event Loop Latency',
            id: 'internal/libuv/latency/p50',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            handler: function () {
                const percentiles = this.implementation.percentiles([0.5]);
                if (percentiles[0.5] === null)
                    return null;
                return percentiles[0.5].toFixed(2);
            },
            unit: 'ms'
        };
        const uvLatencyp95 = {
            name: 'Event Loop Latency p95',
            id: 'internal/libuv/latency/p95',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            handler: function () {
                const percentiles = this.implementation.percentiles([0.95]);
                if (percentiles[0.95] === null)
                    return null;
                return percentiles[0.95].toFixed(2);
            },
            unit: 'ms'
        };
        this.metricService.registerMetric(uvLatencyp50);
        this.metricService.registerMetric(uvLatencyp95);
        this.runtimeStatsService = serviceManager_1.ServiceManager.get('runtimeStats');
        if (this.runtimeStatsService === undefined) {
            this.logger('runtimeStats module not found, fallbacking into pure js method');
            let oldTime = process.hrtime();
            this.delayTimer = setInterval(() => {
                const newTime = process.hrtime();
                const delay = (newTime[0] - oldTime[0]) * 1e3 + (newTime[1] - oldTime[1]) / 1e6 - this.delayLoopInterval;
                oldTime = newTime;
                histogram.update(delay);
            }, this.delayLoopInterval);
            this.delayTimer.unref();
        }
        else {
            this.logger('using runtimeStats module as data source for event loop latency');
            this.handle = (stats) => {
                if (typeof stats !== 'object' || !Array.isArray(stats.ticks))
                    return;
                stats.ticks.forEach((tick) => {
                    histogram.update(tick);
                });
            };
            this.runtimeStatsService.on('data', this.handle);
        }
    }
    destroy() {
        if (this.requestTimer !== undefined) {
            clearInterval(this.requestTimer);
        }
        if (this.handleTimer !== undefined) {
            clearInterval(this.handleTimer);
        }
        if (this.delayTimer !== undefined) {
            clearInterval(this.delayTimer);
        }
        if (this.runtimeStatsService !== undefined) {
            this.runtimeStatsService.removeListener('data', this.handle);
        }
        this.logger('destroy');
    }
}
exports.default = EventLoopHandlesRequestsMetric;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRMb29wTWV0cmljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tZXRyaWNzL2V2ZW50TG9vcE1ldHJpY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOztBQUVaLGlEQUErRTtBQUMvRSxzREFBa0Q7QUFDbEQsK0JBQThCO0FBRTlCLDBEQUFrRDtBQUdsRCxNQUFhLHFCQUFxQjtDQVdqQztBQVhELHNEQVdDO0FBRUQsTUFBTSxjQUFjLEdBQTBCO0lBQzVDLGVBQWUsRUFBRSxJQUFJO0lBQ3JCLGNBQWMsRUFBRSxJQUFJO0NBQ3JCLENBQUE7QUFFRCxNQUFxQiw4QkFBOEI7SUFBbkQ7UUFHVSxXQUFNLEdBQVEsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7UUFJckQsc0JBQWlCLEdBQVcsSUFBSSxDQUFBO0lBaUgxQyxDQUFDO0lBN0dDLElBQUksQ0FBRSxNQUF3QztRQUM1QyxJQUFJLE1BQU0sS0FBSyxLQUFLO1lBQUUsT0FBTTtRQUM1QixJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDeEIsTUFBTSxHQUFHLGNBQWMsQ0FBQTtTQUN4QjtRQUNELElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtZQUNuQixNQUFNLEdBQUcsY0FBYyxDQUFBO1NBQ3hCO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNsRCxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUztZQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO1FBRXpGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbkIsSUFBSSxPQUFRLE9BQWUsQ0FBQyxrQkFBa0IsS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLGVBQWUsS0FBSyxJQUFJLEVBQUU7WUFDaEcsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEs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