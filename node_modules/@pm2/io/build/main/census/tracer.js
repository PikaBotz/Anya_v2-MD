"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@opencensus/core");
const default_config_1 = require("./config/default-config");
const constants_1 = require("./constants");
const plugin_loader_1 = require("./instrumentation/plugin-loader");
class Tracing {
    constructor() {
        this.configLocal = {};
        this.tracer = new core.CoreTracer();
        this.defaultPlugins = plugin_loader_1.PluginLoader.defaultPluginsFromArray(constants_1.Constants.DEFAULT_INSTRUMENTATION_MODULES);
    }
    static get instance() {
        return this.singletonInstance || (this.singletonInstance = new this());
    }
    get active() {
        return this.activeLocal;
    }
    get config() {
        return this.configLocal;
    }
    start(userConfig) {
        this.configLocal = Object.assign(default_config_1.defaultConfig, { plugins: this.defaultPlugins }, userConfig);
        this.logger =
            this.configLocal.logger || core.logger.logger(this.configLocal.logLevel);
        this.configLocal.logger = this.logger;
        this.logger.debug('config: %o', this.configLocal);
        this.pluginLoader = new plugin_loader_1.PluginLoader(this.logger, this.tracer);
        this.pluginLoader.loadPlugins(this.configLocal.plugins);
        if (!this.configLocal.exporter) {
            const exporter = new core.ConsoleExporter(this.configLocal);
            this.registerExporter(exporter);
        }
        else {
            this.registerExporter(this.configLocal.exporter);
        }
        this.activeLocal = true;
        this.tracer.start(this.configLocal);
        return this;
    }
    stop() {
        this.activeLocal = false;
        this.tracer.stop();
        this.pluginLoader.unloadPlugins();
        this.configLocal = {};
    }
    get exporter() {
        return this.configLocal.exporter;
    }
    registerExporter(exporter) {
        if (this.configLocal.exporter) {
            this.unregisterExporter(this.configLocal.exporter);
        }
        if (exporter) {
            this.configLocal.exporter = exporter;
            this.tracer.registerSpanEventListener(exporter);
        }
        return this;
    }
    unregisterExporter(exporter) {
        this.tracer.unregisterSpanEventListener(exporter);
        this.configLocal.exporter = undefined;
        return this;
    }
}
exports.Tracing = Tracing;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NlbnN1cy90cmFjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFlQSx5Q0FBd0M7QUFFeEMsNERBQXVEO0FBQ3ZELDJDQUF1QztBQUN2QyxtRUFBOEQ7QUFHOUQsTUFBYSxPQUFPO0lBaUJsQjtRQVRRLGdCQUFXLEdBQWdCLEVBQUUsQ0FBQTtRQVVuQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQ25DLElBQUksQ0FBQyxjQUFjLEdBQUcsNEJBQVksQ0FBQyx1QkFBdUIsQ0FDdEQscUJBQVMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO0lBQ2hELENBQUM7SUFHRCxNQUFNLEtBQUssUUFBUTtRQUNqQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUE7SUFDeEUsQ0FBQztJQUdELElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQTtJQUN6QixDQUFDO0lBR0QsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFBO0lBQ3pCLENBQUM7SUFPRCxLQUFLLENBQUUsVUFBd0I7UUFDN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLDhCQUFhLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFBO1FBRTdGLElBQUksQ0FBQyxNQUFNO1lBQ1AsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUM1RSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDakQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLDRCQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDOUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUEyQixDQUFDLENBQUE7UUFFM0UsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFO1lBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDM0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQ2hDO2FBQU07WUFDTCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUNqRDtRQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFHRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUNsQixJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2pDLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFBO0lBQ3ZCLENBQUM7SUFHRCxJQUFJLFFBQVE7UUFFVixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFBO0lBQ2xDLENBQUM7SUFNRCxnQkFBZ0IsQ0FBRSxRQUF1QjtRQUN2QyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFO1lBQzdCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQ25EO1FBQ0QsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7WUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUNoRDtRQUNELE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQU1ELGtCQUFrQixDQUFFLFFBQXVCO1FBQ3pDLElBQUksQ0FBQyxNQUFNLENBQUMsMkJBQTJCLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDakQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFBO1FBQ3JDLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztDQUNGO0FBdEdELDBCQXNHQyJ9