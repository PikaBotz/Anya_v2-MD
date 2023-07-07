"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@opencensus/core");
const http_1 = require("./http");
const shimmer = require("shimmer");
const url = require("url");
const uuid = require("uuid");
class Http2Plugin extends http_1.HttpPlugin {
    constructor() {
        super('http2');
    }
    applyPatch() {
        shimmer.wrap(this.moduleExports, 'createServer', this.getPatchCreateServerFunction());
        shimmer.wrap(this.moduleExports, 'createSecureServer', this.getPatchCreateServerFunction());
        shimmer.wrap(this.moduleExports, 'connect', this.getPatchConnectFunction());
        return this.moduleExports;
    }
    applyUnpatch() {
        shimmer.unwrap(this.moduleExports, 'createServer');
        shimmer.unwrap(this.moduleExports, 'createSecureServer');
        shimmer.unwrap(this.moduleExports, 'connect');
    }
    getPatchConnectFunction() {
        const plugin = this;
        return (original) => {
            return function patchedConnect(authority) {
                const client = original.apply(this, arguments);
                shimmer.wrap(client, 'request', (original) => (plugin.getPatchRequestFunction())(original, authority));
                shimmer.unwrap(plugin.moduleExports, 'connect');
                return client;
            };
        };
    }
    getPatchRequestFunction() {
        const plugin = this;
        return (original, authority) => {
            return function patchedRequest(headers) {
                if (headers['x-opencensus-outgoing-request']) {
                    return original.apply(this, arguments);
                }
                const request = original.apply(this, arguments);
                plugin.tracer.wrapEmitter(request);
                const traceOptions = {
                    name: `http2-${(headers[':method'] || 'GET').toLowerCase()}`,
                    kind: core_1.SpanKind.CLIENT
                };
                if (!plugin.tracer.currentRootSpan) {
                    return plugin.tracer.startRootSpan(traceOptions, plugin.getMakeHttp2RequestTraceFunction(request, headers, authority, plugin));
                }
                else {
                    const span = plugin.tracer.startChildSpan(traceOptions.name, traceOptions.kind);
                    return (plugin.getMakeHttp2RequestTraceFunction(request, headers, authority, plugin))(span);
                }
            };
        };
    }
    getMakeHttp2RequestTraceFunction(request, headers, authority, plugin) {
        return (span) => {
            if (!span)
                return request;
            const setter = {
                setHeader(name, value) {
                    headers[name] = value;
                }
            };
            const propagation = plugin.tracer.propagation;
            if (propagation) {
                propagation.inject(setter, span.spanContext);
            }
            request.on('response', (responseHeaders) => {
                const status = `${responseHeaders[':status']}`;
                span.addAttribute(Http2Plugin.ATTRIBUTE_HTTP_STATUS_CODE, status);
                span.setStatus(Http2Plugin.convertTraceStatus(parseInt(status, 10)));
            });
            request.on('end', () => {
                const userAgent = headers['user-agent'] || headers['User-Agent'] || null;
                span.addAttribute(Http2Plugin.ATTRIBUTE_HTTP_HOST, `${url.parse(authority).host}`);
                span.addAttribute(Http2Plugin.ATTRIBUTE_HTTP_METHOD, `${headers[':method']}`);
                span.addAttribute(Http2Plugin.ATTRIBUTE_HTTP_PATH, `${headers[':path']}`);
                span.addAttribute(Http2Plugin.ATTRIBUTE_HTTP_ROUTE, `${headers[':path']}`);
                if (userAgent) {
                    span.addAttribute(Http2Plugin.ATTRIBUTE_HTTP_USER_AGENT, `${userAgent}`);
                }
                span.addMessageEvent(core_1.MessageEventType.SENT, uuid.v4().split('-').join(''));
                span.end();
            });
            request.on('error', (err) => {
                span.addAttribute(http_1.HttpPlugin.ATTRIBUTE_HTTP_ERROR_NAME, err.name);
                span.addAttribute(http_1.HttpPlugin.ATTRIBUTE_HTTP_ERROR_MESSAGE, err.message);
                span.setStatus(core_1.CanonicalCode.UNKNOWN, err.message);
                span.end();
            });
            return request;
        };
    }
    getPatchCreateServerFunction() {
        const plugin = this;
        return (original) => {
            return function patchedCreateServer() {
                const server = original.apply(this, arguments);
                shimmer.wrap(server.constructor.prototype, 'emit', plugin.getPatchEmitFunction());
                shimmer.unwrap(plugin.moduleExports, 'createServer');
                shimmer.unwrap(plugin.moduleExports, 'createSecureServer');
                return server;
            };
        };
    }
    getPatchEmitFunction() {
        const plugin = this;
        return (original) => {
            return function patchedEmit(event, stream, headers) {
                if (event !== 'stream') {
                    return original.apply(this, arguments);
                }
                const propagation = plugin.tracer.propagation;
                const getter = {
                    getHeader(name) {
                        return headers[name];
                    }
                };
                const traceOptions = {
                    name: headers[':path'],
                    kind: core_1.SpanKind.SERVER,
                    spanContext: propagation ? propagation.extract(getter) : null
                };
                let statusCode = 0;
                const originalRespond = stream.respond;
                stream.respond = function () {
                    stream.respond = originalRespond;
                    statusCode = arguments[0][':status'];
                    return stream.respond.apply(this, arguments);
                };
                return plugin.tracer.startRootSpan(traceOptions, rootSpan => {
                    if (!rootSpan)
                        return original.apply(this, arguments);
                    plugin.tracer.wrapEmitter(stream);
                    const originalEnd = stream.end;
                    stream.end = function () {
                        stream.end = originalEnd;
                        const returned = stream.end.apply(this, arguments);
                        const userAgent = (headers['user-agent'] || headers['User-Agent'] ||
                            null);
                        rootSpan.addAttribute(Http2Plugin.ATTRIBUTE_HTTP_HOST, `${headers[':authority']}`);
                        rootSpan.addAttribute(Http2Plugin.ATTRIBUTE_HTTP_METHOD, `${headers[':method']}`);
                        rootSpan.addAttribute(Http2Plugin.ATTRIBUTE_HTTP_PATH, `${headers[':path']}`);
                        rootSpan.addAttribute(Http2Plugin.ATTRIBUTE_HTTP_ROUTE, `${headers[':path']}`);
                        rootSpan.addAttribute(Http2Plugin.ATTRIBUTE_HTTP_USER_AGENT, userAgent);
                        rootSpan.addAttribute(Http2Plugin.ATTRIBUTE_HTTP_STATUS_CODE, `${statusCode}`);
                        rootSpan.setStatus(Http2Plugin.convertTraceStatus(statusCode));
                        rootSpan.addMessageEvent(core_1.MessageEventType.RECEIVED, uuid.v4().split('-').join(''));
                        rootSpan.end();
                        return returned;
                    };
                    return original.apply(this, arguments);
                });
            };
        };
    }
}
exports.Http2Plugin = Http2Plugin;
const plugin = new Http2Plugin();
exports.plugin = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cDIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY2Vuc3VzL3BsdWdpbnMvaHR0cDIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFnQkEsMkNBQTBJO0FBQzFJLGlDQUFtQztBQUVuQyxtQ0FBa0M7QUFDbEMsMkJBQTBCO0FBQzFCLDZCQUE0QjtBQVU1QixNQUFhLFdBQVksU0FBUSxpQkFBVTtJQUV6QztRQUNFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNoQixDQUFDO0lBS1MsVUFBVTtRQUNsQixPQUFPLENBQUMsSUFBSSxDQUNSLElBQUksQ0FBQyxhQUFhLEVBQUUsY0FBYyxFQUNsQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsQ0FBQyxDQUFBO1FBQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQ1IsSUFBSSxDQUFDLGFBQWEsRUFBRSxvQkFBb0IsRUFDeEMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUMsQ0FBQTtRQUV4QyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLENBQUE7UUFFM0UsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFBO0lBQzNCLENBQUM7SUFHUyxZQUFZO1FBR3BCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQTtRQUNsRCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLENBQUMsQ0FBQTtRQUN4RCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUE7SUFDL0MsQ0FBQztJQUVPLHVCQUF1QjtRQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUE7UUFDbkIsT0FBTyxDQUFDLFFBQXlCLEVBQWtDLEVBQUU7WUFDbkUsT0FBTyxTQUFTLGNBQWMsQ0FBcUIsU0FBaUI7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