"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@opencensus/core");
const shimmer = require("shimmer");
class NetPlugin extends core_1.BasePlugin {
    constructor(moduleName) {
        super(moduleName);
    }
    applyPatch() {
        this.logger.debug('applying patch to %s@%s', this.moduleName, this.version);
        if (this.moduleExports && this.moduleExports.Server &&
            this.moduleExports.Server.prototype) {
            shimmer.wrap(this.moduleExports.Server.prototype, 'emit', this.getPatchIncomingRequestFunction());
        }
        else {
            this.logger.error('Could not apply patch to %s.emit. Interface is not as expected.', this.moduleName);
        }
        return this.moduleExports;
    }
    applyUnpatch() {
        if (this.moduleExports && this.moduleExports.Server &&
            this.moduleExports.Server.prototype) {
            shimmer.unwrap(this.moduleExports.Server.prototype, 'emit');
        }
        else {
            this.logger.error('Could not unapply patch to %s.emit. Interface is not as expected.', this.moduleName);
        }
    }
    getPatchIncomingRequestFunction() {
        return (original) => {
            const plugin = this;
            return function incomingRequest(event, ...args) {
                if (event !== 'connection') {
                    return original.apply(this, arguments);
                }
                const socket = args[0];
                plugin.logger.debug('%s plugin incomingRequest', plugin.moduleName);
                const traceOptions = {
                    name: 'socket',
                    kind: core_1.SpanKind.SERVER,
                    spanContext: undefined
                };
                return plugin.tracer.startRootSpan(traceOptions, rootSpan => {
                    if (!rootSpan)
                        return original.apply(this, arguments);
                    plugin.tracer.wrapEmitter(socket);
                    const address = socket.address();
                    if (typeof address === 'string') {
                        rootSpan.addAttribute('net.address', address);
                    }
                    else {
                        rootSpan.addAttribute('net.host', address.address);
                        rootSpan.addAttribute('net.port', address.port);
                        rootSpan.addAttribute('net.family', address.family);
                    }
                    socket.on('error', (err) => {
                        rootSpan.addAttribute('net.error', err.message);
                    });
                    const originalEnd = socket.end;
                    socket.end = function () {
                        if (rootSpan.ended === false) {
                            rootSpan.end();
                        }
                        return originalEnd.apply(this, arguments);
                    };
                    socket.on('close', () => {
                        if (rootSpan.ended === false) {
                            rootSpan.end();
                        }
                    });
                    return original.apply(this, arguments);
                });
            };
        };
    }
}
exports.NetPlugin = NetPlugin;
exports.plugin = new NetPlugin('net');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NlbnN1cy9wbHVnaW5zL25ldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWdCQSwyQ0FBcUU7QUFFckUsbUNBQWtDO0FBR2xDLE1BQWEsU0FBVSxTQUFRLGlCQUFVO0lBR3ZDLFlBQWEsVUFBa0I7UUFDN0IsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ25CLENBQUM7SUFLUyxVQUFVO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRTNFLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU07WUFDL0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ3ZDLE9BQU8sQ0FBQyxJQUFJLENBQ1IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFDM0MsSUFBSSxDQUFDLCtCQUErQixFQUFFLENBQUMsQ0FBQTtTQUM1QzthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ2IsaUVBQWlFLEVBQ2pFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtTQUNyQjtRQUVELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQTtJQUMzQixDQUFDO0lBR0QsWUFBWTtRQUNWLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU07WUFDL0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ3ZDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1NBQzVEO2FBQU07WUFDTCxJQUFJLENBQUMsTUFB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