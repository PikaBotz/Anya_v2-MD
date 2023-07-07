"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notify_1 = require("./features/notify");
const profiling_1 = require("./features/profiling");
const events_1 = require("./features/events");
const metrics_1 = require("./features/metrics");
const tracing_1 = require("./features/tracing");
const dependencies_1 = require("./features/dependencies");
const Debug = require("debug");
function getObjectAtPath(context, path) {
    if (path.indexOf('.') === -1 && path.indexOf('[') === -1) {
        return context[path];
    }
    let crumbs = path.split(/\.|\[|\]/g);
    let i = -1;
    let len = crumbs.length;
    let result;
    while (++i < len) {
        if (i === 0)
            result = context;
        if (!crumbs[i])
            continue;
        if (result === undefined)
            break;
        result = result[crumbs[i]];
    }
    return result;
}
exports.getObjectAtPath = getObjectAtPath;
class AvailableFeature {
}
const availablesFeatures = [
    {
        name: 'notify',
        optionsPath: '.',
        module: notify_1.NotifyFeature
    },
    {
        name: 'profiler',
        optionsPath: 'profiling',
        module: profiling_1.ProfilingFeature
    },
    {
        name: 'events',
        module: events_1.EventsFeature
    },
    {
        name: 'metrics',
        optionsPath: 'metrics',
        module: metrics_1.MetricsFeature
    },
    {
        name: 'tracing',
        optionsPath: '.',
        module: tracing_1.TracingFeature
    },
    {
        name: 'dependencies',
        module: dependencies_1.DependenciesFeature
    }
];
class FeatureManager {
    constructor() {
        this.logger = Debug('axm:features');
    }
    init(options) {
        for (let availableFeature of availablesFeatures) {
            this.logger(`Creating feature ${availableFeature.name}`);
            const feature = new availableFeature.module();
            let config = undefined;
            if (typeof availableFeature.optionsPath !== 'string') {
                config = {};
            }
            else if (availableFeature.optionsPath === '.') {
                config = options;
            }
            else {
                config = getObjectAtPath(options, availableFeature.optionsPath);
            }
            this.logger(`Init feature ${availableFeature.name}`);
            feature.init(config);
            availableFeature.instance = feature;
        }
    }
    get(name) {
        const feature = availablesFeatures.find(feature => feature.name === name);
        if (feature === undefined || feature.instance === undefined) {
            throw new Error(`Tried to call feature ${name} which doesn't exist or wasn't initiated`);
        }
        return feature.instance;
    }
    destroy() {
        for (let availableFeature of availablesFeatures) {
            if (availableFeature.instance === undefined)
                continue;
            this.logger(`Destroy feature ${availableFeature.name}`);
            availableFeature.instance.destroy();
        }
    }
}
exports.FeatureManager = FeatureManager;
class FeatureConfig {
}
exports.FeatureConfig = FeatureConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhdHVyZU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmVhdHVyZU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4Q0FBaUQ7QUFDakQsb0RBQXVEO0FBQ3ZELDhDQUFpRDtBQUVqRCxnREFBbUQ7QUFDbkQsZ0RBQW1EO0FBQ25ELDBEQUE2RDtBQUM3RCwrQkFBOEI7QUFFOUIsU0FBZ0IsZUFBZSxDQUFFLE9BQWUsRUFBRSxJQUFZO0lBQzVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ3hELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3JCO0lBRUQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUNWLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUE7SUFDdkIsSUFBSSxNQUFNLENBQUE7SUFFVixPQUFPLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRTtRQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDO1lBQUUsTUFBTSxHQUFHLE9BQU8sQ0FBQTtRQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUFFLFNBQVE7UUFDeEIsSUFBSSxNQUFNLEtBQUssU0FBUztZQUFFLE1BQUs7UUFDL0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUMzQjtJQUVELE9BQU8sTUFBTSxDQUFBO0FBQ2YsQ0FBQztBQWxCRCwwQ0FrQkM7QUFFRCxNQUFNLGdCQUFnQjtDQXFCckI7QUFFRCxNQUFNLGtCQUFrQixHQUF1QjtJQUM3QztRQUNFLElBQUksRUFBRSxRQUFR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