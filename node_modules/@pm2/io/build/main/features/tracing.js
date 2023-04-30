"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const configuration_1 = require("../configuration");
const path_1 = require("path");
const httpMethodToIgnore = [
    'options',
    'head'
];
const defaultTracingConfig = {
    enabled: false,
    outbound: false,
    samplingRate: 0,
    ignoreIncomingPaths: [],
    ignoreOutgoingUrls: [],
    detailedDatabasesCalls: false,
    createSpanWithNet: false
};
const enabledTracingConfig = {
    enabled: true,
    outbound: false,
    samplingRate: 0.5,
    ignoreIncomingPaths: [
        (url, request) => {
            const method = (request.method || 'GET').toLowerCase();
            return httpMethodToIgnore.indexOf(method) > -1;
        },
        /(.*).js/,
        /(.*).css/,
        /(.*).png/,
        /(.*).ico/,
        /(.*).svg/,
        /webpack/
    ],
    ignoreOutgoingUrls: [],
    detailedDatabasesCalls: false,
    createSpanWithNet: false
};
class TracingFeature {
    constructor() {
        this.logger = Debug('axm:tracing');
    }
    init(config) {
        this.logger('init tracing');
        if (config.tracing === undefined) {
            config.tracing = defaultTracingConfig;
        }
        else if (config.tracing === true) {
            config.tracing = enabledTracingConfig;
        }
        else if (config.tracing === false) {
            config.tracing = defaultTracingConfig;
        }
        if (config.tracing.enabled === false) {
            return this.logger('tracing disabled');
        }
        this.options = Object.assign(enabledTracingConfig, config.tracing);
        if (typeof config.apmOptions === 'object' && typeof config.apmOptions.appName === 'string') {
            this.options.serviceName = config.apmOptions.appName;
        }
        else if (typeof process.env.name === 'string') {
            this.options.serviceName = process.env.name;
        }
        if (config.tracing.ignoreOutgoingUrls === undefined) {
            config.tracing.ignoreOutgoingUrls = enabledTracingConfig.ignoreOutgoingUrls;
        }
        if (config.tracing.ignoreIncomingPaths === undefined) {
            config.tracing.ignoreIncomingPaths = enabledTracingConfig.ignoreIncomingPaths;
        }
        const B3Format = require('@opencensus/propagation-b3').B3Format;
        const CustomCensusExporter = require('../census/exporter').CustomCensusExporter;
        const Tracing = require('../census/tracer').Tracing;
        this.exporter = new CustomCensusExporter(this.options);
        if (this.tracer && this.tracer.active) {
            throw new Error(`Tracing was already enabled`);
        }
        this.logger('start census tracer');
        const tracer = Tracing.instance;
        const plugins = {
            'http': {
                module: path_1.resolve(__dirname, '../census/plugins/http'),
                config: config.tracing
            },
            'http2': path_1.resolve(__dirname, '../census/plugins/http2'),
            'https': path_1.resolve(__dirname, '../census/plugins/https'),
            'mongodb-core': {
                module: path_1.resolve(__dirname, '../census/plugins/mongodb'),
                config: { detailedCommands: config.tracing.detailedDatabasesCalls }
            },
            'mysql': {
                module: path_1.resolve(__dirname, '../census/plugins/mysql'),
                config: { detailedCommands: config.tracing.detailedDatabasesCalls }
            },
            'mysql2': {
                module: path_1.resolve(__dirname, '../census/plugins/mysql2'),
                config: { detailedCommands: config.tracing.detailedDatabasesCalls }
            },
            'redis': {
                module: path_1.resolve(__dirname, '../census/plugins/redis'),
                config: { detailedCommands: config.tracing.detailedDatabasesCalls }
            },
            'ioredis': {
                module: path_1.resolve(__dirname, '../census/plugins/ioredis'),
                config: { detailedCommands: config.tracing.detailedDatabasesCalls }
            },
            'pg': {
                module: path_1.resolve(__dirname, '../census/plugins/pg'),
                config: { detailedCommands: config.tracing.detailedDatabasesCalls }
            },
            'vue-server-renderer': {
                module: path_1.resolve(__dirname, '../census/plugins/vue'),
                config: {}
            }
        };
        if (this.options.createSpanWithNet === true) {
            plugins['net'] = {
                module: path_1.resolve(__dirname, '../census/plugins/net')
            };
        }
        this.tracer = tracer.start({
            exporter: this.exporter,
            plugins,
            propagation: new B3Format(),
            samplingRate: this.options.samplingRate || 0.5,
            logLevel: this.isDebugEnabled() ? 4 : 1
        });
        configuration_1.default.configureModule({
            census_tracing: true
        });
    }
    isDebugEnabled() {
        return typeof process.env.DEBUG === 'string' &&
            (process.env.DEBUG.indexOf('axm:*') >= 0 || process.env.DEBUG.indexOf('axm:tracing') >= 0);
    }
    getTracer() {
        return this.tracer ? this.tracer.tracer : undefined;
    }
    destroy() {
        if (!this.tracer)
            return;
        this.logger('stop census tracer');
        configuration_1.default.configureModule({
            census_tracing: false
        });
        this.tracer.stop();
    }
}
exports.TracingFeature = TracingFeature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mZWF0dXJlcy90cmFjaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsK0JBQThCO0FBQzlCLG9EQUE0QztBQUU1QywrQkFBOEI7QUE0QzlCLE1BQU0sa0JBQWtCLEdBQUc7SUFDekIsU0FBUztJQUNULE1BQU07Q0FDUCxDQUFBO0FBQ0QsTUFBTSxvQkFBb0IsR0FBa0I7SUFDMUMsT0FBTyxFQUFFLEtBQUs7SUFDZCxRQUFRLEVBQUUsS0FBSztJQUNmLFlBQVksRUFBRSxDQUFDO0lBQ2YsbUJBQW1CLEVBQUUsRUFBRTtJQUN2QixrQkFBa0IsRUFBRSxFQUFFO0lBQ3RCLHNCQUFzQixFQUFFLEtBQUs7SUFDN0IsaUJBQWlCLEVBQUUsS0FBSztDQUN6QixDQUFBO0FBRUQsTUFBTSxvQkFBb0IsR0FBa0I7SUFDMUMsT0FBTyxFQUFFLElBQUk7SUFDYixRQUFRLEVBQUUsS0FBSztJQUNmLFlBQVksRUFBRSxHQUFHO0lBQ2pCLG1CQUFtQixFQUFFO1FBQ25CLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ2YsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1lBQ3RELE9BQU8sa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ2hELENBQUM7UUFDRCxTQUFTO1FBQ1QsVUFBVTtRQUNWLFVBQVU7UUFDVixVQUFVO1FBQ1YsVUFBVTtRQUNWLFNBQVM7S0FDVjtJQUNELGtCQUFrQixFQUFFLEVBQUU7SUFDdEIsc0JBQXNCLEVBQUUsS0FBSztJQUM3QixpQkFBaUIsRUFBRSxLQUFLO0NBQ3pCLENBQUE7QUFFRCxNQUFhLGNBQWM7SUFBM0I7UUFJVSxXQUFNLEdBQWEsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBOEdqRCxD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