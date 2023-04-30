'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@opencensus/core");
const shimmer = require("shimmer");
const semver = require("semver");
class RedisPlugin extends core_1.BasePlugin {
    constructor(moduleName) {
        super(moduleName);
    }
    applyPatch() {
        this.logger.debug('Patched redis');
        if (semver.lt(this.version, '2.4.0')) {
            this.logger.info('disabling redis plugin because version isnt supported');
            return this.moduleExports;
        }
        if (this.moduleExports.RedisClient) {
            this.logger.debug('patching redis.RedisClient.prototype.create_stream');
            shimmer.wrap(this.moduleExports.RedisClient.prototype, 'create_stream', this.getPatchCreateStream());
            this.logger.debug('patching redis.RedisClient.prototype.internal_send');
            shimmer.wrap(this.moduleExports.RedisClient.prototype, 'internal_send_command', this.getPatchSendCommand());
            this.logger.debug('patching redis.RedisClient.prototype.createClient');
            shimmer.wrap(this.moduleExports, 'createClient', this.getPatchCreateClient());
        }
        return this.moduleExports;
    }
    applyUnpatch() {
        if (semver.lt(this.version, '2.4.0'))
            return;
        shimmer.unwrap(this.moduleExports.RedisClient.prototype, 'internal_send_command');
        shimmer.unwrap(this.moduleExports, 'createClient');
        shimmer.unwrap(this.moduleExports.RedisClient.prototype, 'create_stream');
    }
    getPatchCreateStream() {
        const plugin = this;
        return function createStreamWrap(original) {
            return function create_stream_trace() {
                if (!this.stream) {
                    Object.defineProperty(this, 'stream', {
                        get: function () { return this._patched_redis_stream; },
                        set: function (val) {
                            plugin.tracer.wrapEmitter(val);
                            this._patched_redis_stream = val;
                        }
                    });
                }
                return original.apply(this, arguments);
            };
        };
    }
    getPatchCreateClient() {
        const plugin = this;
        return function createClientWrap(original) {
            return function createClientTrace() {
                const client = original.apply(this, arguments);
                plugin.tracer.wrapEmitter(client);
                return client;
            };
        };
    }
    getPatchSendCommand() {
        const plugin = this;
        const addArguments = typeof this.options === 'object'
            && this.options.detailedCommands === true;
        return function internalSendCommandWrap(original) {
            return function internal_send_command_trace(cmd, args, cb) {
                if (!plugin.tracer.currentRootSpan) {
                    return original.apply(this, arguments);
                }
                if (arguments.length === 1 && typeof cmd === 'object') {
                    const span = plugin.tracer.startChildSpan(`redis-${cmd.command}`, core_1.SpanKind.CLIENT);
                    if (span === null)
                        return original.apply(this, arguments);
                    span.addAttribute('command', cmd.command);
                    if (addArguments) {
                        span.addAttribute('arguments', JSON.stringify(cmd.args || []));
                    }
                    cmd.callback = plugin.patchEnd(span, cmd.callback);
                    return original.apply(this, arguments);
                }
                if (typeof cmd === 'string' && Array.isArray(args) && typeof cb === 'function') {
                    const span = plugin.tracer.startChildSpan(`redis-${cmd}`, core_1.SpanKind.CLIENT);
                    if (span === null)
                        return original.apply(this, arguments);
                    span.addAttribute('command', cmd);
                    if (addArguments) {
                        span.addAttribute('arguments', JSON.stringify(args));
                    }
                    cb = plugin.patchEnd(span, cb);
                    return original.apply(this, arguments);
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
            if (typeof resultHandler === 'function') {
                return resultHandler.apply(this, arguments);
            }
        };
        return this.tracer.wrap(patchedEnd);
    }
}
exports.RedisPlugin = RedisPlugin;
const plugin = new RedisPlugin('redis');
exports.plugin = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY2Vuc3VzL3BsdWdpbnMvcmVkaXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsWUFBWSxDQUFBOztBQUVaLDJDQUE2RDtBQUM3RCxtQ0FBa0M7QUFDbEMsaUNBQWdDO0FBZWhDLE1BQWEsV0FBWSxTQUFRLGlCQUFVO0lBSXpDLFlBQWEsVUFBa0I7UUFDN0IsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ25CLENBQUM7SUFLUyxVQUFVO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFBO1FBRWxDLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUE7WUFDekUsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFBO1NBQzFCO1FBRUQsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRTtZQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFBO1lBQ3ZFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFDcEUsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQTtZQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFBO1lBQ3ZFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLHVCQUF1QixFQUM1RSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFBO1lBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG1EQUFtRCxDQUFDLENBQUE7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