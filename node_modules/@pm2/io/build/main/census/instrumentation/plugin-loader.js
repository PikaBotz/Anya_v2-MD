"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const hook = require("require-in-the-middle");
const constants_1 = require("../constants");
var HookState;
(function (HookState) {
    HookState[HookState["UNINITIALIZED"] = 0] = "UNINITIALIZED";
    HookState[HookState["ENABLED"] = 1] = "ENABLED";
    HookState[HookState["DISABLED"] = 2] = "DISABLED";
})(HookState || (HookState = {}));
class PluginLoader {
    constructor(logger, tracer) {
        this.plugins = [];
        this.hookState = HookState.UNINITIALIZED;
        this.tracer = tracer;
        this.logger = logger;
    }
    static defaultPackageName(moduleName) {
        return `${constants_1.Constants.OPENCENSUS_SCOPE}/${constants_1.Constants.DEFAULT_PLUGIN_PACKAGE_NAME_PREFIX}-${moduleName}`;
    }
    static defaultPluginsFromArray(modulesToPatch) {
        const plugins = modulesToPatch.reduce((plugins, moduleName) => {
            plugins[moduleName] = PluginLoader.defaultPackageName(moduleName);
            return plugins;
        }, {});
        return plugins;
    }
    getPackageVersion(name, basedir) {
        let version = '';
        if (basedir) {
            const pkgJson = path.join(basedir, 'package.json');
            try {
                version = JSON.parse(fs.readFileSync(pkgJson).toString()).version;
            }
            catch (e) {
                this.logger.error('could not get version of %s module: %s', name, e.message);
            }
        }
        else {
            version = process.versions.node;
        }
        return version;
    }
    loadPlugins(pluginList) {
        if (this.hookState === HookState.UNINITIALIZED) {
            hook(Object.keys(pluginList), (exports, name, basedir) => {
                if (this.hookState !== HookState.ENABLED) {
                    return exports;
                }
                const plugin = pluginList[name];
                const version = this.getPackageVersion(name, basedir);
                this.logger.info('trying loading %s.%s', name, version);
                if (!version) {
                    return exports;
                }
                this.logger.debug('applying patch to %s@%s module', name, version);
                let moduleName;
                let moduleConfig = {};
                if (typeof plugin === 'string') {
                    moduleName = plugin;
                }
                else {
                    moduleConfig = plugin.config;
                    moduleName = plugin.module;
                }
                this.logger.debug('using package %s to patch %s', moduleName, name);
                try {
                    const plugin = require(moduleName).plugin;
                    this.plugins.push(plugin);
                    return plugin.enable(exports, this.tracer, version, moduleConfig, basedir);
                }
                catch (e) {
                    this.logger.error('could not load plugin %s of module %s. Error: %s', moduleName, name, e.message);
                    return exports;
                }
            });
        }
        this.hookState = HookState.ENABLED;
    }
    unloadPlugins() {
        for (const plugin of this.plugins) {
            plugin.disable();
        }
        this.plugins = [];
        this.hookState = HookState.DISABLED;
    }
    static set searchPathForTest(searchPath) {
        module.paths.push(searchPath);
    }
}
exports.PluginLoader = PluginLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLWxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jZW5zdXMvaW5zdHJ1bWVudGF0aW9uL3BsdWdpbi1sb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFpQkEseUJBQXdCO0FBQ3hCLDZCQUE0QjtBQUM1Qiw4Q0FBNkM7QUFFN0MsNENBQXdDO0FBRXhDLElBQUssU0FJSjtBQUpELFdBQUssU0FBUztJQUNaLDJEQUFhLENBQUE7SUFDYiwrQ0FBTyxDQUFBO0lBQ1AsaURBQVEsQ0FBQTtBQUNWLENBQUMsRUFKSSxTQUFTLEtBQVQsU0FBUyxRQUliO0FBT0QsTUFBYSxZQUFZO0lBaUJ2QixZQUFhLE1BQWMsRUFBRSxNQUFjO1FBWDNDLFlBQU8sR0FBYSxFQUFFLENBQUE7UUFLZCxjQUFTLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQTtRQU96QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtJQUN0QixDQUFDO0lBUU8sTUFBTSxDQUFDLGtCQUFrQixDQUFFLFVBQWtCO1FBQ25ELE9BQU8sR0FBRyxxQkFBUyxDQUFDLGdCQUFnQixJQUNoQyxxQkFBUyxDQUFDLGtDQUFrQyxJQUFJLFVBQVUsRUFBRSxDQUFBO0lBQ2xFLENBQUM7SUFRRCxNQUFNLENBQUMsdUJBQXVCLENBQUUsY0FBd0I7UUFDdEQsTUFBTSxPQUFPLEdBQ1QsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQW9CLEVBQUUsVUFBa0IsRUFBRSxFQUFFO1lBQ2pFLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxZQUFZLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDakUsT0FBTyxPQUFPLENBQUE7UUFDaEIsQ0FBQyxFQUFFLEVBQWlCLENBQUMsQ0FBQTtRQUN6QixPQUFPLE9BQU8sQ0FBQTtJQUNoQixDQUFDO0lBT08saUJBQWlCLENBQUUs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