"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const featureManager_1 = require("../featureManager");
const eventLoopMetrics_1 = require("../metrics/eventLoopMetrics");
const network_1 = require("../metrics/network");
const httpMetrics_1 = require("../metrics/httpMetrics");
const v8_1 = require("../metrics/v8");
const runtime_1 = require("../metrics/runtime");
exports.defaultMetricConf = {
    eventLoop: true,
    network: false,
    http: true,
    runtime: true,
    v8: true
};
class MetricConfig {
}
exports.MetricConfig = MetricConfig;
class AvailableMetric {
}
const availableMetrics = [
    {
        name: 'eventloop',
        module: eventLoopMetrics_1.default,
        optionsPath: 'eventLoop'
    },
    {
        name: 'http',
        module: httpMetrics_1.default,
        optionsPath: 'http'
    },
    {
        name: 'network',
        module: network_1.default,
        optionsPath: 'network'
    },
    {
        name: 'v8',
        module: v8_1.default,
        optionsPath: 'v8'
    },
    {
        name: 'runtime',
        module: runtime_1.default,
        optionsPath: 'runtime'
    }
];
class MetricsFeature {
    constructor() {
        this.logger = debug_1.default('axm:features:metrics');
    }
    init(options) {
        if (typeof options !== 'object')
            options = {};
        this.logger('init');
        for (let availableMetric of availableMetrics) {
            const metric = new availableMetric.module();
            let config = undefined;
            if (typeof availableMetric.optionsPath !== 'string') {
                config = {};
            }
            else if (availableMetric.optionsPath === '.') {
                config = options;
            }
            else {
                config = featureManager_1.getObjectAtPath(options, availableMetric.optionsPath);
            }
            metric.init(config);
            availableMetric.instance = metric;
        }
    }
    get(name) {
        const metric = availableMetrics.find(metric => metric.name === name);
        if (metric === undefined)
            return undefined;
        return metric.instance;
    }
    destroy() {
        this.logger('destroy');
        for (let availableMetric of availableMetrics) {
            if (availableMetric.instance === undefined)
                continue;
            availableMetric.instance.destroy();
        }
    }
}
exports.MetricsFeature = MetricsFeature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mZWF0dXJlcy9tZXRyaWNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQXlCO0FBQ3pCLHNEQUE0RDtBQUM1RCxrRUFBbUc7QUFDbkcsZ0RBQXdFO0FBQ3hFLHdEQUF1RTtBQUN2RSxzQ0FBeUQ7QUFDekQsZ0RBQTBFO0FBRTdELFFBQUEsaUJBQWlCLEdBQWlCO0lBQzdDLFNBQVMsRUFBRSxJQUFJO0lBQ2YsT0FBTyxFQUFFLEtBQUs7SUFDZCxJQUFJLEVBQUUsSUFBSTtJQUNWLE9BQU8sRUFBRSxJQUFJO0lBQ2IsRUFBRSxFQUFFLElBQUk7Q0FDVCxDQUFBO0FBRUQsTUFBYSxZQUFZO0NBdUJ4QjtBQXZCRCxvQ0F1QkM7QUFFRCxNQUFNLGVBQWU7Q0FxQnBCO0FBRUQsTUFBTSxnQkFBZ0IsR0FBc0I7SUFDMUM7UUFDRSxJQUFJLEVBQUUsV0FBVztRQUNqQixNQUFNLEVBQUUsMEJBQThCO1FBQ3RDLFdBQVcsRUFBRSxXQUFXO0tBQ3pCO0lBQ0Q7UUFDRSxJQUFJLEVBQUUsTUFBTTtRQUNaLE1BQU0sRUFBRSxxQkFBVztRQUNuQixXQUFXLEVBQUUsTUFBTTtLQUNwQjtJQUNEO1FBQ0UsSUFBSSxFQUFFLFNBQVM7UUFDZixNQUFNLEVBQUUsaUJBQWE7UUFDckIsV0FBVyxFQUFFLFNBQVM7S0FDdkI7SUFDRDtRQUNFLElBQUksRUFBRSxJQUFJO1FBQ1YsTUFBTSxFQUFFLFlBQVE7UUFDaEIsV0FBVyxFQUFFLElBQUk7S0FDbEI7SUFDRDtRQUNFLElBQUksRUFBRSxTQUFTO1FBQ2YsTUFBTSxFQUFFLGlCQUFjO1FBQ3RCLFdBQVcsRUFBRSxTQUFTO0tBQ3ZCO0NBQ0YsQ0FBQTtBQU9ELE1BQWEsY0FBYztJQUEzQjtRQUVVLFdBQU0sR0FBYSxlQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtJQXFDMUQsQ0FBQztJQW5DQyxJQUFJLENBQUUsT0FBZ0I7UUFDcEIsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRO1lBQUUsT0FBTyxHQUFHLEVBQUUsQ0FBQTtRQUM3QyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRW5CLEtBQUssSUFBSSxlQUFlLElBQUksZ0JBQWdCLEVBQUU7WUFDNUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7WUFDM0MsSUFBSSxNQUFNLEdBQVEsU0FBUyxDQUFBO1lBQzNCLElBQUksT0FBTyxlQUFlLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtnQkFDbkQsTUFBTSxHQUFHLEVBQUUsQ0FBQTthQUNaO2lCQUFNLElBQUksZUFBZSxDQUFDLFdBQVcsS0FBSyxHQUFHLEVBQUU7Z0JBQzlDLE1BQU0sR0FBRyxPQUFPLENBQUE7YUFDakI7aUJBQU07Z0JBQ0wsTUFBTSxHQUFHLGdDQUFlLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQTthQUMvRDtZQUlELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDbkIsZUFBZSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUE7U0FDbEM7SUFDSCxDQUFDO0lBRUQsR0FBRyxDQUFFLElBQVk7UUFDZixNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFBO1FBQ3BFLElBQUksTUFBTSxLQUFLLFNBQVM7WUFBRSxPQUFPLFNBQVMsQ0FBQTtRQUMxQyxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUE7SUFDeEIsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ3RCLEtBQUssSUFBSSxlQUFlLElBQUksZ0JBQWdCLEVBQUU7WUFDNUMsSUFBSSxlQUFlLENBQUMsUUFBUSxLQUFLLFNBQVM7Z0JBQUUsU0FBUTtZQUNwRCxlQUFlLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO1NBQ25DO0lBQ0gsQ0FBQztDQUNGO0FBdkNELHdDQXVDQyJ9