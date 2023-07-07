"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addonProfiler_1 = require("../profilers/addonProfiler");
const inspectorProfiler_1 = require("../profilers/inspectorProfiler");
const constants_1 = require("../constants");
const Debug = require("debug");
class ProfilingConfig {
}
exports.ProfilingConfig = ProfilingConfig;
const defaultProfilingConfig = {
    cpuJS: true,
    heapSnapshot: true,
    heapSampling: true,
    implementation: 'both'
};
const disabledProfilingConfig = {
    cpuJS: false,
    heapSnapshot: false,
    heapSampling: false,
    implementation: 'none'
};
class ProfilingFeature {
    constructor() {
        this.logger = Debug('axm:features:profiling');
    }
    init(config) {
        if (config === true) {
            config = defaultProfilingConfig;
        }
        else if (config === false) {
            config = disabledProfilingConfig;
        }
        else if (config === undefined) {
            config = defaultProfilingConfig;
        }
        if (process.env.PM2_PROFILING_FORCE_FALLBACK === 'true') {
            config.implementation = 'addon';
        }
        if (config.implementation === undefined || config.implementation === 'both') {
            config.implementation = constants_1.canUseInspector() === true ? 'inspector' : 'addon';
        }
        switch (config.implementation) {
            case 'inspector': {
                this.logger('using inspector implementation');
                this.profiler = new inspectorProfiler_1.default();
                break;
            }
            case 'addon': {
                this.logger('using addon implementation');
                this.profiler = new addonProfiler_1.default();
                break;
            }
            default: {
                return this.logger(`Invalid profiler implementation choosen: ${config.implementation}`);
            }
        }
        this.logger('init');
        this.profiler.init();
    }
    destroy() {
        this.logger('destroy');
        if (this.profiler === undefined)
            return;
        this.profiler.destroy();
    }
}
exports.ProfilingFeature = ProfilingFeature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL3Byb2ZpbGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhEQUFzRDtBQUN0RCxzRUFBOEQ7QUFDOUQsNENBQThDO0FBQzlDLCtCQUE4QjtBQVE5QixNQUFhLGVBQWU7Q0FLM0I7QUFMRCwwQ0FLQztBQUVELE1BQU0sc0JBQXNCLEdBQW9CO0lBQzlDLEtBQUssRUFBRSxJQUFJO0lBQ1gsWUFBWSxFQUFFLElBQUk7SUFDbEIsWUFBWSxFQUFFLElBQUk7SUFDbEIsY0FBYyxFQUFFLE1BQU07Q0FDdkIsQ0FBQTtBQUVELE1BQU0sdUJBQXVCLEdBQW9CO0lBQy9DLEtBQUssRUFBRSxLQUFLO0lBQ1osWUFBWSxFQUFFLEtBQUs7SUFDbkIsWUFBWSxFQUFFLEtBQUs7SUFDbkIsY0FBYyxFQUFFLE1BQU07Q0FDdkIsQ0FBQTtBQUVELE1BQWEsZ0JBQWdCO0lBQTdCO1FBR1UsV0FBTSxHQUFhLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0lBNEM1RCxDQUFDO0lBMUNDLElBQUksQ0FBRSxNQUFrQztRQUN0QyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDbkIsTUFBTSxHQUFHLHNCQUFzQixDQUFBO1NBQ2hDO2FBQU0sSUFBSSxNQUFNLEtBQUssS0FBSyxFQUFFO1lBQzNCLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQTtTQUNqQzthQUFNLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUMvQixNQUFNLEdBQUcsc0JBQXNCLENBQUE7U0FDaEM7UUFHRCxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEtBQUssTUFBTSxFQUFFO1lBQ3ZELE1BQU0sQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFBO1NBQ2hDO1FBRUQsSUFBSSxNQUFNLENBQUMsY0FBYyxLQUFLLFNBQVMsSUFBSSxNQUFNLENBQUMsY0FBYyxLQUFLLE1BQU0sRUFBRTtZQUMzRSxNQUFNLENBQUMsY0FBYyxHQUFHLDJCQUFlLEVBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1NBQzNFO1FBRUQsUUFBUSxNQUFNLENBQUMsY0FBYyxFQUFFO1lBQzdCLEtBQUssV0FBVyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtnQkFDN0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLDJCQUFpQixFQUFFLENBQUE7Z0JBQ3ZDLE1BQUs7YUFDTjtZQUNELEtBQUssT0FBTyxDQUFDLENBQUM7Z0JBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO2dCQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksdUJBQWEsRUFBRSxDQUFBO2dCQUNuQyxNQUFLO2FBQ047WUFDRCxPQUFPLENBQUMsQ0FBQztnQkFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsNENBQTRDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFBO2FBQ3hGO1NBQ0Y7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDdEIsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ3RCLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTO1lBQUUsT0FBTTtRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ3pCLENBQUM7Q0FDRjtBQS9DRCw0Q0ErQ0MifQ==