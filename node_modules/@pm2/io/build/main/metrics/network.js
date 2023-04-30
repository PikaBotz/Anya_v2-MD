"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const netModule = require("net");
const metrics_1 = require("../services/metrics");
const Debug = require("debug");
const meter_1 = require("../utils/metrics/meter");
const shimmer = require("shimmer");
const serviceManager_1 = require("../serviceManager");
class NetworkTrafficConfig {
}
exports.NetworkTrafficConfig = NetworkTrafficConfig;
const defaultConfig = {
    upload: false,
    download: false
};
const allEnabled = {
    upload: true,
    download: true
};
class NetworkMetric {
    constructor() {
        this.logger = Debug('axm:features:metrics:network');
    }
    init(config) {
        if (config === false)
            return;
        if (config === true) {
            config = allEnabled;
        }
        if (config === undefined) {
            config = defaultConfig;
        }
        this.metricService = serviceManager_1.ServiceManager.get('metrics');
        if (this.metricService === undefined) {
            return this.logger(`Failed to load metric service`);
        }
        if (config.download === true) {
            this.catchDownload();
        }
        if (config.upload === true) {
            this.catchUpload();
        }
        this.logger('init');
    }
    destroy() {
        if (this.timer !== undefined) {
            clearTimeout(this.timer);
        }
        if (this.socketProto !== undefined && this.socketProto !== null) {
            shimmer.unwrap(this.socketProto, 'read');
            shimmer.unwrap(this.socketProto, 'write');
        }
        this.logger('destroy');
    }
    catchDownload() {
        if (this.metricService === undefined)
            return this.logger(`Failed to load metric service`);
        const downloadMeter = new meter_1.default({});
        this.metricService.registerMetric({
            name: 'Network In',
            id: 'internal/network/in',
            historic: true,
            type: metrics_1.MetricType.meter,
            implementation: downloadMeter,
            unit: 'kb/s',
            handler: function () {
                return Math.floor(this.implementation.val() / 1024 * 1000) / 1000;
            }
        });
        setTimeout(() => {
            const property = netModule.Socket.prototype.read;
            const isWrapped = property && property.__wrapped === true;
            if (isWrapped) {
                return this.logger(`Already patched socket read, canceling`);
            }
            shimmer.wrap(netModule.Socket.prototype, 'read', function (original) {
                return function () {
                    this.on('data', (data) => {
                        if (typeof data.length === 'number') {
                            downloadMeter.mark(data.length);
                        }
                    });
                    return original.apply(this, arguments);
                };
            });
        }, 500);
    }
    catchUpload() {
        if (this.metricService === undefined)
            return this.logger(`Failed to load metric service`);
        const uploadMeter = new meter_1.default();
        this.metricService.registerMetric({
            name: 'Network Out',
            id: 'internal/network/out',
            type: metrics_1.MetricType.meter,
            historic: true,
            implementation: uploadMeter,
            unit: 'kb/s',
            handler: function () {
                return Math.floor(this.implementation.val() / 1024 * 1000) / 1000;
            }
        });
        setTimeout(() => {
            const property = netModule.Socket.prototype.write;
            const isWrapped = property && property.__wrapped === true;
            if (isWrapped) {
                return this.logger(`Already patched socket write, canceling`);
            }
            shimmer.wrap(netModule.Socket.prototype, 'write', function (original) {
                return function (data) {
                    if (typeof data.length === 'number') {
                        uploadMeter.mark(data.length);
                    }
                    return original.apply(this, arguments);
                };
            });
        }, 500);
    }
}
exports.default = NetworkMetric;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tZXRyaWNzL25ldHdvcmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBZ0M7QUFDaEMsaURBQStEO0FBRS9ELCtCQUE4QjtBQUM5QixrREFBMEM7QUFDMUMsbUNBQWtDO0FBQ2xDLHNEQUFrRDtBQUVsRCxNQUFhLG9CQUFvQjtDQUdoQztBQUhELG9EQUdDO0FBRUQsTUFBTSxhQUFhLEdBQXlCO0lBQzFDLE1BQU0sRUFBRSxLQUFLO0lBQ2IsUUFBUSxFQUFFLEtBQUs7Q0FDaEIsQ0FBQTtBQUVELE1BQU0sVUFBVSxHQUF5QjtJQUN2QyxNQUFNLEVBQUUsSUFBSTtJQUNaLFFBQVEsRUFBRSxJQUFJO0NBQ2YsQ0FBQTtBQUVELE1BQXFCLGFBQWE7SUFBbEM7UUFHVSxXQUFNLEdBQWEsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUE7SUEyR2xFLENBQUM7SUF4R0MsSUFBSSxDQUFFLE1BQXVDO1FBQzNDLElBQUksTUFBTSxLQUFLLEtBQUs7WUFBRSxPQUFNO1FBQzVCLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtZQUNuQixNQUFNLEdBQUcsVUFBVSxDQUFBO1NBQ3BCO1FBQ0QsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3hCLE1BQU0sR0FBRyxhQUFhLENBQUE7U0FDdkI7UUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ2xELElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxTQUFTLEVBQUU7WUFDcEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLCtCQUErQixDQUFDLENBQUE7U0FDcEQ7UUFFRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLEtBQUssSUFBSSxFQUFFO1lBQzVCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtTQUNyQjtRQUNELElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxJ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