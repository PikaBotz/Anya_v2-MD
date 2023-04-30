'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const metrics_1 = require("../services/metrics");
const serviceManager_1 = require("../serviceManager");
const Debug = require("debug");
const histogram_1 = require("../utils/metrics/histogram");
class RuntimeMetricsOptions {
}
exports.RuntimeMetricsOptions = RuntimeMetricsOptions;
const defaultOptions = {
    gcNewPause: true,
    gcOldPause: true,
    pageFaults: true,
    contextSwitchs: true
};
class RuntimeMetrics {
    constructor() {
        this.logger = Debug('axm:features:metrics:runtime');
        this.metrics = new Map();
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
        this.runtimeStatsService = serviceManager_1.ServiceManager.get('runtimeStats');
        if (this.runtimeStatsService === undefined)
            return this.logger('Failed to load runtime stats service');
        this.logger('init');
        const newHistogram = new histogram_1.default();
        if (config.gcNewPause === true) {
            this.metricService.registerMetric({
                name: 'GC New Space Pause',
                id: 'internal/v8/gc/new/pause/p50',
                type: metrics_1.MetricType.histogram,
                historic: true,
                implementation: newHistogram,
                unit: 'ms',
                handler: function () {
                    const percentiles = this.implementation.percentiles([0.5]);
                    return percentiles[0.5];
                }
            });
            this.metricService.registerMetric({
                name: 'GC New Space Pause p95',
                id: 'internal/v8/gc/new/pause/p95',
                type: metrics_1.MetricType.histogram,
                historic: true,
                implementation: newHistogram,
                unit: 'ms',
                handler: function () {
                    const percentiles = this.implementation.percentiles([0.95]);
                    return percentiles[0.95];
                }
            });
        }
        const oldHistogram = new histogram_1.default();
        if (config.gcOldPause === true) {
            this.metricService.registerMetric({
                name: 'GC Old Space Pause',
                id: 'internal/v8/gc/old/pause/p50',
                type: metrics_1.MetricType.histogram,
                historic: true,
                implementation: oldHistogram,
                unit: 'ms',
                handler: function () {
                    const percentiles = this.implementation.percentiles([0.5]);
                    return percentiles[0.5];
                }
            });
            this.metricService.registerMetric({
                name: 'GC Old Space Pause p95',
                id: 'internal/v8/gc/old/pause/p95',
                type: metrics_1.MetricType.histogram,
                historic: true,
                implementation: oldHistogram,
                unit: 'ms',
                handler: function () {
                    const percentiles = this.implementation.percentiles([0.95]);
                    return percentiles[0.95];
                }
            });
        }
        if (config.contextSwitchs === true) {
            const volontarySwitchs = this.metricService.histogram({
                name: 'Volontary CPU Context Switch',
                id: 'internal/uv/cpu/contextswitch/volontary',
                measurement: metrics_1.MetricMeasurements.mean
            });
            const inVolontarySwitchs = this.metricService.histogram({
                name: 'Involuntary CPU Context Switch',
                id: 'internal/uv/cpu/contextswitch/involontary',
                measurement: metrics_1.MetricMeasurements.mean
            });
            this.metrics.set('inVolontarySwitchs', inVolontarySwitchs);
            this.metrics.set('volontarySwitchs', volontarySwitchs);
        }
        if (config.pageFaults === true) {
            const softPageFault = this.metricService.histogram({
                name: 'Minor Page Fault',
                id: 'internal/uv/memory/pagefault/minor',
                measurement: metrics_1.MetricMeasurements.mean
            });
            const hardPageFault = this.metricService.histogram({
                name: 'Major Page Fault',
                id: 'internal/uv/memory/pagefault/major',
                measurement: metrics_1.MetricMeasurements.mean
            });
            this.metrics.set('softPageFault', softPageFault);
            this.metrics.set('hardPageFault', hardPageFault);
        }
        this.handle = (stats) => {
            if (typeof stats !== 'object' || typeof stats.gc !== 'object')
                return;
            newHistogram.update(stats.gc.newPause);
            oldHistogram.update(stats.gc.oldPause);
            if (typeof stats.usage !== 'object')
                return;
            const volontarySwitchs = this.metrics.get('volontarySwitchs');
            if (volontarySwitchs !== undefined) {
                volontarySwitchs.update(stats.usage.ru_nvcsw);
            }
            const inVolontarySwitchs = this.metrics.get('inVolontarySwitchs');
            if (inVolontarySwitchs !== undefined) {
                inVolontarySwitchs.update(stats.usage.ru_nivcsw);
            }
            const softPageFault = this.metrics.get('softPageFault');
            if (softPageFault !== undefined) {
                softPageFault.update(stats.usage.ru_minflt);
            }
            const hardPageFault = this.metrics.get('hardPageFault');
            if (hardPageFault !== undefined) {
                hardPageFault.update(stats.usage.ru_majflt);
            }
        };
        this.runtimeStatsService.on('data', this.handle);
    }
    destroy() {
        if (this.runtimeStatsService !== undefined) {
            this.runtimeStatsService.removeListener('data', this.handle);
        }
        this.logger('destroy');
    }
}
exports.default = RuntimeMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tZXRyaWNzL3J1bnRpbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOztBQUVaLGlEQUFtRjtBQUNuRixzREFBa0Q7QUFDbEQsK0JBQThCO0FBRTlCLDBEQUFrRDtBQUdsRCxNQUFhLHFCQUFxQjtDQWFqQztBQWJELHNEQWFDO0FBRUQsTUFBTSxjQUFjLEdBQTBCO0lBQzVDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLGNBQWMsRUFBRSxJQUFJO0NBQ3JCLENBQUE7QUFFRCxNQUFxQixjQUFjO0lBQW5DO1FBR1UsV0FBTSxHQUFRLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO1FBR25ELFlBQU8sR0FBMkIsSUFBSSxHQUFHLEVBQXFCLENBQUE7SUF5SXhFLENBQUM7SUF2SUMsSUFBSSxDQUFFLE1BQXdDO1FBQzVDLElBQUksTUFBTSxLQUFLLEtBQUs7WUFBRSxPQUFNO1FBQzVCLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUN4QixNQUFNLEdBQUcsY0FBYyxDQUFBO1NBQ3hCO1FBQ0QsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO1lBQ25CLE1BQU0sR0FBRyxjQUFjLENBQUE7U0FDeEI7UUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ2xELElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxTQUFTO1lBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLCtCQUErQixDQUFDLENBQUE7UUFFekYsSUFBSSxDQUFDLG1CQUFtQixHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQzdELElBQUksSUFBSSxDQUFDLG1CQUFtQixLQUFLLFNBQVM7WUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtRQUV0RyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRW5CLE1BQU0sWUFBWSxHQUFHLElBQUksbUJBQVMsRUFBRSxDQUFBO1FBQ3BDLElBQUksTUFBTSxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUU7WUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUM7Z0JBQ2hDLElBQUksRUFBRSxvQkFBb0I7Z0JBQzFCLEVBQUUsRUFBRSw4QkFBOEI7Z0JBQ2xDLElBQUksRUFBRSxvQkFBVSxDQUFDLFNBQVM7Z0JBQzFCLFFBQVEsRUFBRSxJQUFJO2dCQUNkLGNBQWMsRUFBRSxZQUFZO2dCQUM1QixJQUFJLEVBQUUsSUFBSTtnQkFDVixPQUFPLEVBQUU7b0JBQ1AsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBRSxHQUFHLENBQUUsQ0FBQyxDQUFBO29CQUM1RCxPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDekIsQ0FBQzthQUNGLENBQUMsQ0FBQTtZQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDO2dCQUNoQyxJQUFJLEVBQUUsd0JBQXdCO2dCQUM5QixFQUFFLEVBQUUsOEJBQThCO2dCQUNsQyxJQUFJLEVBQUUsb0JBQVUsQ0FBQyxTQUFTO2dCQUMxQixRQUFRLEVBQUUsSUFBSTtnQkFDZCxjQUFjLEVBQUUsWUFBWTtnQkFDNUIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsT0FBTyxFQUFFO29CQUNQLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUUsSUFBSSxDQUFFLENBQUMsQ0FBQTtvQkFDN0QsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQzFCLENBQUM7YUFDRixDQUFDLENBQUE7U0FDSDtRQUVELE1BQU0sWUFBWSxHQUFHLElBQUksbUJBQVMsRUFBRSxDQUFBO1FBQ3BDLElBQUksTUFBTSxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUU7WUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUM7Z0JBQ2hDLElBQUksRUFBRSxvQkFBb0I7Z0JBQzFCLEVBQUUsRUFBRSw4QkFBOEI7Z0JBQ2xDLElBQUksRUFBRSxvQkFBVSxDQUFDLFNBQVM7Z0JBQzFCLFFBQVEsRUFBRSxJQUFJO2dCQUNkLGNBQWMsRUFBRSxZQUFZO2dCQUM1QixJQUFJLEVBQUUsSUFBSTtnQkFDVixPQUFPLEVBQUU7b0JBQ1AsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBRSxHQUFHLENBQUUsQ0FBQyxDQUFBO29CQUM1RCxPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDekIsQ0FBQzthQUNGLENBQUMsQ0FBQTtZQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDO2dCQUNoQyxJQUFJLEVBQUUsd0JBQXdCO2dCQUM5QixFQUFFLEVBQUUsOEJBQThCO2dCQUNsQyxJQUFJLEVBQUUsb0JBQVUsQ0FBQyxTQUFTO2dCQUMxQixRQUFRLEVBQUUsSUFBSTtnQkFDZCxjQUFjLEVBQUUsWUFBWTtnQkFDNUIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsT0FBTyxFQUFFO29CQUNQLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUUsSUFBSSxDQUFFLENBQUMsQ0FBQTtvQkFDN0QsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQzFCLENBQUM7YUFDRixDQUFDLENBQUE7U0FDSDtRQUVELElBQUksTUFBTSxDQUFDLGNBQWMsS0FBSyxJQUFJLEVBQUU7WUFDbEMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztnQkFDcEQsSUFBSSxFQUFFLDhCQUE4QjtnQkFDcEMsRUFBRSxFQUFFLHlDQUF5QztnQkFDN0MsV0FBVyxFQUFFLDRCQUFrQixDQUFDLElBQUk7YUFDckMsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztnQkFDdEQsSUFBSSxFQUFFLGdDQUFnQztnQkFDdEMsRUFBRSxFQUFFLDJDQUEyQztnQkFDL0MsV0FBVyxFQUFFLDRCQUFrQixDQUFDLElBQUk7YUFDckMsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsa0JBQWtCLENBQUMsQ0FBQTtZQUMxRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO1NBQ3ZEO1FBRUQsSUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLElBQUksRUFBRTtZQUM5QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztnQkFDakQsSUFBSSxFQUFFLGtCQUFrQjtnQkFDeEIsRUFBRSxFQUFFLG9DQUFvQztnQkFDeEMsV0FBVyxFQUFFLDRCQUFrQixDQUFDLElBQUk7YUFDckMsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7Z0JBQ2pELElBQUksRUFBRSxrQkFBa0I7Z0JBQ3hCLEVBQUUsRUFBRSxvQ0FBb0M7Z0JBQ3hDLFdBQVcsRUFBRSw0QkFBa0IsQ0FBQyxJQUFJO2FBQ3JDLENBQUMsQ0FBQTtZQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQTtZQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsYUFBYSxDQUFDLENBQUE7U0FDakQ7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUU7WUFDM0IsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksT0FBTyxLQUFLLENBQUMsRUFBRSxLQUFLLFFBQVE7Z0JBQUUsT0FBTTtZQUNyRSxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDdEMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3RDLElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxLQUFLLFFBQVE7Z0JBQUUsT0FBTTtZQUMzQyxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUE7WUFDN0QsSUFBSSxnQkFBZ0IsS0FBSyxTQUFTLEVBQUU7Z0JBQ2xDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFBO2FBQzlDO1lBQ0QsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO1lBQ2pFLElBQUksa0JBQWtCLEtBQUssU0FBUyxFQUFFO2dCQUNwQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTthQUNqRDtZQUNELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBQ3ZELElBQUksYUFBYSxLQUFLLFNBQVMsRUFBRTtnQkFDL0IsYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO2FBQzVDO1lBQ0QsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUE7WUFDdkQsSUFBSSxhQUFhLEtBQUssU0FBUyxFQUFFO2dCQUMvQixhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUE7YUFDNUM7UUFDSCxDQUFDLENBQUE7UUFFRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEQsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxTQUFTLEVBQUU7WUFDMUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQzdEO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN4QixDQUFDO0NBQ0Y7QUEvSUQsaUNBK0lDIn0=