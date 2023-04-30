"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const debug = debug_1.default('axm:configuration');
const serviceManager_1 = require("./serviceManager");
const autocast_1 = require("./utils/autocast");
const path = require("path");
const fs = require("fs");
const util = require("util");
class Configuration {
    static configureModule(opts) {
        if (serviceManager_1.ServiceManager.get('transport'))
            serviceManager_1.ServiceManager.get('transport').setOptions(opts);
    }
    static findPackageJson() {
        try {
            require.main = Configuration.getMain();
        }
        catch (_e) {
        }
        if (!require.main) {
            return;
        }
        if (!require.main.paths) {
            return;
        }
        let pkgPath = path.resolve(path.dirname(require.main.filename), 'package.json');
        try {
            fs.statSync(pkgPath);
        }
        catch (e) {
            try {
                pkgPath = path.resolve(path.dirname(require.main.filename), '..', 'package.json');
                fs.statSync(pkgPath);
            }
            catch (e) {
                debug('Cannot find package.json');
                try {
                    pkgPath = path.resolve(path.dirname(require.main.filename), '..', '..', 'package.json');
                    fs.statSync(pkgPath);
                }
                catch (e) {
                    debug('Cannot find package.json');
                    return null;
                }
            }
            return pkgPath;
        }
        return pkgPath;
    }
    static init(conf, doNotTellPm2) {
        const packageFilepath = Configuration.findPackageJson();
        let packageJson;
        if (!conf.module_conf) {
            conf.module_conf = {};
        }
        conf.apm = {
            type: 'node',
            version: null
        };
        try {
            const prefix = __dirname.replace(/\\/g, '/').indexOf('/build/') >= 0 ? '../../' : '../';
            const pkg = require(prefix + 'package.json');
            conf.apm.version = pkg.version || null;
        }
        catch (err) {
            debug('Failed to fetch current apm version: ', err.message);
        }
        if (conf.isModule === true) {
            try {
                packageJson = require(packageFilepath || '');
                conf.module_version = packageJson.version;
                conf.module_name = packageJson.name;
                conf.description = packageJson.description;
                if (packageJson.config) {
                    conf = util['_extend'](conf, packageJson.config);
                    conf.module_conf = packageJson.config;
                }
            }
            catch (e) {
                throw new Error(e);
            }
        }
        else {
            conf.module_name = process.env.name || 'outside-pm2';
            try {
                packageJson = require(packageFilepath || '');
                conf.module_version = packageJson.version;
                if (packageJson.config) {
                    conf = util['_extend'](conf, packageJson.config);
                    conf.module_conf = packageJson.config;
                }
            }
            catch (e) {
                debug(e.message);
            }
        }
        try {
            if (process.env[conf.module_name]) {
                const castedConf = new autocast_1.default().autocast(JSON.parse(process.env[conf.module_name] || ''));
                conf = util['_extend'](conf, castedConf);
                delete castedConf.probes;
                conf.module_conf = JSON.parse(JSON.stringify(util['_extend'](conf.module_conf, castedConf)));
                Object.keys(conf.module_conf).forEach(function (key) {
                    if ((key === 'password' || key === 'passwd') &&
                        conf.module_conf[key].length >= 1) {
                        conf.module_conf[key] = 'Password hidden';
                    }
                });
            }
        }
        catch (e) {
            debug(e);
        }
        if (doNotTellPm2 === true)
            return conf;
        Configuration.configureModule(conf);
        return conf;
    }
    static getMain() {
        return require.main || { filename: './somefile.js' };
    }
}
exports.default = Configuration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25maWd1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQXlCO0FBQ3pCLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBRXhDLHFEQUFpRDtBQUNqRCwrQ0FBdUM7QUFDdkMsNkJBQTRCO0FBQzVCLHlCQUF3QjtBQUN4Qiw2QkFBNEI7QUFFNUIsTUFBcUIsYUFBYTtJQUVoQyxNQUFNLENBQUMsZUFBZSxDQUFFLElBQUk7UUFDMUIsSUFBSSwrQkFBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7WUFBRSwrQkFBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdkYsQ0FBQztJQUVELE1BQU0sQ0FBQyxlQUFlO1FBQ3BCLElBQUk7WUFDRixPQUFPLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtTQUN2QztRQUFDLE9BQU8sRUFBRSxFQUFFO1NBRVo7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtZQUNqQixPQUFNO1NBQ1A7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDdkIsT0FBTTtTQUNQO1FBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUE7UUFDL0UsSUFBSTtZQUNGLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUE7U0FDckI7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLElBQUk7Z0JBQ0YsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMs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