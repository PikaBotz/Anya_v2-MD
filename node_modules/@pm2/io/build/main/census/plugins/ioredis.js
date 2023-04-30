'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@opencensus/core");
const shimmer = require("shimmer");
const semver = require("semver");
class IORedisPlugin extends core_1.BasePlugin {
    constructor(moduleName) {
        super(moduleName);
    }
    applyPatch() {
        this.logger.debug('Patched redis');
        if (!semver.satisfies(this.version, '>=2.0.0 <5.0.0')) {
            this.logger.info('disabling ioredis plugin because version isnt supported');
            return this.moduleExports;
        }
        if (this.moduleExports) {
            this.logger.debug('patching ioredis.prototype.sendCommand');
            shimmer.wrap(this.moduleExports.prototype, 'sendCommand', this.getPatchSendCommand());
        }
        return this.moduleExports;
    }
    applyUnpatch() {
        if (!semver.satisfies(this.version, '>=2.0.0 <5.0.0'))
            return;
        shimmer.unwrap(this.moduleExports.prototype, 'sendCommand');
    }
    getPatchSendCommand() {
        const plugin = this;
        const addArguments = typeof this.options === 'object'
            && this.options.detailedCommands === true;
        return function internalSendCommandWrap(original) {
            return function internal_send_command_trace(command) {
                if (!plugin.tracer.currentRootSpan) {
                    return original.apply(this, arguments);
                }
                const span = plugin.tracer.startChildSpan(`redis-${command.name}`, core_1.SpanKind.CLIENT);
                if (span === null)
                    return original.apply(this, arguments);
                span.addAttribute('command', command.name);
                if (addArguments) {
                    span.addAttribute('arguments', JSON.stringify(command.args));
                }
                if (typeof command.reject === 'function') {
                    command.reject = plugin.tracer.wrap(command.reject);
                }
                if (typeof command.resolve === 'function') {
                    command.resolve = plugin.tracer.wrap(command.resolve);
                }
                if (typeof command.callback === 'function') {
                    command.callback = plugin.patchEnd(span, command.callback);
                }
                if (typeof command.promise === 'object') {
                    const patchedEnd = function (err) {
                        if (plugin.options.detailedCommands === true && err instanceof Error) {
                            span.addAttribute('error', err.message);
                        }
                        if (span.ended === false) {
                            span.end();
                        }
                    };
                    if (typeof command.promise.finally === 'function') {
                        command.promise.finally(patchedEnd);
                    }
                    else if (typeof command.promise.then === 'function') {
                        command.promise.then(patchedEnd).catch(patchedEnd);
                    }
                }
                return original.apply(this, arguments);
            };
        };
    }
    patchEnd(span, resultHandler) {
        const plugin = this;
        const patchedEnd = function (err) {
            if (plugin.options.detailedCommands === true && err instanceof Error) {
                span.addAttribute('error', err.message);
            }
            if (span.ended === false) {
                span.end();
            }
            return resultHandler.apply(this, arguments);
        };
        return this.tracer.wrap(patchedEnd);
    }
}
exports.IORedisPlugin = IORedisPlugin;
const plugin = new IORedisPlugin('ioredis');
exports.plugin = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9yZWRpcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jZW5zdXMvcGx1Z2lucy9pb3JlZGlzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLFlBQVksQ0FBQTs7QUFFWiwyQ0FBNkQ7QUFDN0QsbUNBQWtDO0FBQ2xDLGlDQUFnQztBQXFCaEMsTUFBYSxhQUFjLFNBQVEsaUJBQVU7SUFLM0MsWUFBYSxVQUFrQjtRQUM3QixLQUFLLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDbkIsQ0FBQztJQUtTLFVBQVU7UUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUE7UUFFbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3JELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHlEQUF5RCxDQUFDLENBQUE7WUFDM0UsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFBO1NBQzFCO1FBRUQsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUE7WUFDM0QsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQ3RELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUE7U0FDOUI7UUFFRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUE7SUFDM0IsQ0FBQztJQUdELFlBQVk7UUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDO1lBQUUsT0FBTTtRQUU3RCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFBO0lBQzdELENBQUM7SUFHTyxtQkFB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