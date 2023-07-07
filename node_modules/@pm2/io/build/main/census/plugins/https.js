"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./http");
const https = require("https");
const semver = require("semver");
const shimmer = require("shimmer");
class HttpsPlugin extends http_1.HttpPlugin {
    constructor() {
        super('https');
    }
    applyPatch() {
        this.logger.debug('applying patch to %s@%s', this.moduleName, this.version);
        if (this.moduleExports && this.moduleExports.Server &&
            this.moduleExports.Server.prototype) {
            shimmer.wrap(this.moduleExports && this.moduleExports.Server &&
                this.moduleExports.Server.prototype, 'emit', this.getPatchIncomingRequestFunction());
        }
        else {
            this.logger.error('Could not apply patch to %s.emit. Interface is not as expected.', this.moduleName);
        }
        shimmer.wrap(this.moduleExports, 'request', this.getPatchHttpsOutgoingRequest());
        if (semver.satisfies(this.version, '>=8.0.0')) {
            shimmer.wrap(this.moduleExports, 'get', () => {
                return function getTrace(options, callback) {
                    const req = https.request(options, callback);
                    req.end();
                    return req;
                };
            });
        }
        return this.moduleExports;
    }
    getPatchHttpsOutgoingRequest() {
        return (original) => {
            const plugin = this;
            return function httpsOutgoingRequest(options, callback) {
                if (typeof (options) !== 'string') {
                    options.protocol = options.protocol || 'https:';
                    options.port = options.port || 443;
                    options.agent = options.agent || https.globalAgent;
                }
                return (plugin.getPatchOutgoingRequestFunction())(original)(options, callback);
            };
        };
    }
    applyUnpatch() {
        if (this.moduleExports && this.moduleExports.Server &&
            this.moduleExports.Server.prototype) {
            shimmer.unwrap(this.moduleExports && this.moduleExports.Server &&
                this.moduleExports.Server.prototype, 'emit');
        }
        shimmer.unwrap(this.moduleExports, 'request');
        if (semver.satisfies(this.version, '>=8.0.0')) {
            shimmer.unwrap(this.moduleExports, 'get');
        }
    }
}
exports.HttpsPlugin = HttpsPlugin;
const plugin = new HttpsPlugin();
exports.plugin = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY2Vuc3VzL3BsdWdpbnMvaHR0cHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFpQkEsaUNBQW1DO0FBRW5DLCtCQUE4QjtBQUM5QixpQ0FBZ0M7QUFDaEMsbUNBQWtDO0FBR2xDLE1BQWEsV0FBWSxTQUFRLGlCQUFVO0lBRXpDO1FBQ0UsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2hCLENBQUM7SUFLUyxVQUFVO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRTNFLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU07WUFDL0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ3ZDLE9BQU8sQ0FBQyxJQUFJLENBQ1IsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU07Z0JBQzNDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFDdkMsTUFBTSxFQUFFLElBQUksQ0FBQywrQkFBK0IsRUFBRSxDQUFDLENBQUE7U0FDcEQ7YUFBTTtZQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUNiLGlFQUFpRSxFQUNqRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7U0FDckI7UUFFRCxPQUFPLENBQUMsSUFBSSxDQUNSLElBQUksQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDLENBQUE7UUFDdkUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLEVBQUU7WUFDN0MsT0FBTyxDQUFDLElBQUksQ0FDVixJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7Z0JBWTlCLE9BQU8sU0FBUyxRQUFRLENBQUUsT0FBTyxFQUFFLFFBQVE7b0JBQ3pDLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO29CQUM1QyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUE7b0JBQ1QsT0FBTyxHQUFHLENBQUE7Z0JBQ1osQ0FBQyxDQUFBO1lBQ0gsQ0FBQyxDQUFDLENBQUE7U0FDTDtRQUVELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQTtJQUMzQixDQUFDO0lBR08sNEJBQTRCO1FBQ2xDLE9BQU8sQ0FBQyxRQUFrQyxFQUE0QixFQUFFO1lBQ3RFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQTtZQUNuQixPQUFPLFNBQVMsb0JBQW9CLENBQ3pCLE9BQU8sRUFBRSxRQUFRO2dCQUUxQixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7b0JBQ2pDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUE7b0JBQy9DLE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUE7b0JBQ2xDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFBO2lCQUNuRDtnQkFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLCtCQUErQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDdkQsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO1lBQ3hCLENBQUMsQ0FBQTtRQUNILENBQUMsQ0FBQTtJQUNILENBQUM7SUFHUyxZQUFZO1FBQ3BCLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU07WUFDL0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ3ZDLE9BQU8sQ0FBQyxNQUFNLENBQ1YsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU07Z0JBQzNDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFDdkMsTUFBTSxDQUFDLENBQUE7U0FDWjtRQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQTtRQUM3QyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsRUFBRTtZQUM3QyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUE7U0FDMUM7SUFDSCxDQUFDO0NBQ0Y7QUFuRkQsa0NBbUZDO0FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQTtBQUN2Qix3QkFBTSJ9