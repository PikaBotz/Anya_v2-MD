"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@opencensus/core");
const httpModule = require("http");
const semver = require("semver");
const shimmer = require("shimmer");
const url = require("url");
const uuid = require("uuid");
const express_1 = require("./express");
class HttpPlugin extends core_1.BasePlugin {
    constructor(moduleName) {
        super(moduleName);
    }
    applyPatch() {
        this.logger.debug('applying patch to %s@%s', this.moduleName, this.version);
        shimmer.wrap(this.moduleExports, 'request', this.getPatchOutgoingRequestFunction());
        if (semver.satisfies(this.version, '>=8.0.0')) {
            shimmer.wrap(this.moduleExports, 'get', () => {
                return function getTrace(options, callback) {
                    const req = httpModule.request(options, callback);
                    req.end();
                    return req;
                };
            });
        }
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
        shimmer.unwrap(this.moduleExports, 'request');
        if (semver.satisfies(this.version, '>=8.0.0')) {
            shimmer.unwrap(this.moduleExports, 'get');
        }
        if (this.moduleExports && this.moduleExports.Server &&
            this.moduleExports.Server.prototype) {
            shimmer.unwrap(this.moduleExports.Server.prototype, 'emit');
        }
    }
    isIgnored(url, request, list) {
        if (!list) {
            return false;
        }
        for (const pattern of list) {
            if (this.isSatisfyPattern(url, request, pattern)) {
                return true;
            }
        }
        return false;
    }
    isSatisfyPattern(url, request, pattern) {
        if (typeof pattern === 'string') {
            return pattern === url;
        }
        else if (pattern instanceof RegExp) {
            return pattern.test(url);
        }
        else if (typeof pattern === 'function') {
            return pattern(url, request);
        }
        else {
            throw new TypeError('Pattern is in unsupported datatype');
        }
    }
    getPatchIncomingRequestFunction() {
        return (original) => {
            const plugin = this;
            return function incomingRequest(event, ...args) {
                if (event !== 'request') {
                    return original.apply(this, arguments);
                }
                const request = args[0];
                const response = args[1];
                const path = url.parse(request.url).pathname;
                plugin.logger.debug('%s plugin incomingRequest', plugin.moduleName);
                if (plugin.isIgnored(path, request, plugin.options.ignoreIncomingPaths)) {
                    return original.apply(this, arguments);
                }
                const propagation = plugin.tracer.propagation;
                const headers = request.headers;
                const getter = {
                    getHeader(name) {
                        return headers[name];
                    }
                };
                const context = propagation ? propagation.extract(getter) : null;
                const traceOptions = {
                    name: path,
                    kind: core_1.SpanKind.SERVER,
                    spanContext: context !== null ? context : undefined
                };
                return plugin.createSpan(traceOptions, rootSpan => {
                    if (!rootSpan)
                        return original.apply(this, arguments);
                    plugin.tracer.wrapEmitter(request);
                    plugin.tracer.wrapEmitter(response);
                    const originalEnd = response.end;
                    response.end = function () {
                        response.end = originalEnd;
                        const returned = response.end.apply(this, arguments);
                        const requestUrl = url.parse(request.url || 'localhost');
                        const host = headers.host || 'localhost';
                        const userAgent = (headers['user-agent'] || headers['User-Agent']);
                        rootSpan.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_HOST, host.replace(/^(.*)(\:[0-9]{1,5})/, '$1'));
                        rootSpan.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_METHOD, request.method || 'GET');
                        rootSpan.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_PATH, `${requestUrl.pathname}`);
                        let route = `${requestUrl.path}`;
                        const middlewareStack = request[express_1.kMiddlewareStack];
                        if (middlewareStack) {
                            route = middlewareStack
                                .filter(path => path !== '/')
                                .map(path => {
                                return path[0] === '/' ? path : '/' + path;
                            }).join('');
                        }
                        rootSpan.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_ROUTE, route);
                        rootSpan.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_USER_AGENT, userAgent);
                        rootSpan.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_STATUS_CODE, response.statusCode.toString());
                        rootSpan.setStatus(HttpPlugin.convertTraceStatus(response.statusCode));
                        rootSpan.addMessageEvent(core_1.MessageEventType.RECEIVED, uuid.v4().split('-').join(''));
                        rootSpan.end();
                        return returned;
                    };
                    return original.apply(this, arguments);
                });
            };
        };
    }
    getPatchOutgoingRequestFunction() {
        return (original) => {
            const plugin = this;
            const kind = plugin.moduleName === 'https' ? 'HTTPS' : 'HTTP';
            return function outgoingRequest(options, callback) {
                if (!options) {
                    return original.apply(this, arguments);
                }
                let pathname = '';
                let method = 'GET';
                let origin = '';
                if (typeof (options) === 'string') {
                    const parsedUrl = url.parse(options);
                    options = parsedUrl;
                    pathname = parsedUrl.pathname || '/';
                    origin = `${parsedUrl.protocol || 'http:'}//${parsedUrl.host}`;
                }
                else {
                    if (options.headers &&
                        options.headers['x-opencensus-outgoing-request']) {
                        plugin.logger.debug('header with "x-opencensus-outgoing-request" - do not trace');
                        return original.apply(this, arguments);
                    }
                    try {
                        pathname = options.pathname || '';
                        if (pathname.length === 0 && typeof options.path === 'string') {
                            pathname = url.parse(options.path).pathname || '';
                        }
                        method = options.method || 'GET';
                        origin = `${options.protocol || 'http:'}//${options.host}`;
                    }
                    catch (e) {
                        return original.apply(this, arguments);
                    }
                }
                const request = original.apply(this, arguments);
                if (plugin.isIgnored(origin + pathname, request, plugin.options.ignoreOutgoingUrls)) {
                    return request;
                }
                plugin.tracer.wrapEmitter(request);
                plugin.logger.debug('%s plugin outgoingRequest', plugin.moduleName);
                const traceOptions = {
                    name: `${kind.toLowerCase()}-${(method || 'GET').toLowerCase()}`,
                    kind: core_1.SpanKind.CLIENT
                };
                if (!plugin.tracer.currentRootSpan) {
                    plugin.logger.debug('outgoingRequest starting a root span');
                    return plugin.tracer.startRootSpan(traceOptions, plugin.getMakeRequestTraceFunction(request, options, plugin));
                }
                else {
                    plugin.logger.debug('outgoingRequest starting a child span');
                    const span = plugin.tracer.startChildSpan(traceOptions.name, traceOptions.kind);
                    return (plugin.getMakeRequestTraceFunction(request, options, plugin))(span);
                }
            };
        };
    }
    getMakeRequestTraceFunction(request, options, plugin) {
        return (span) => {
            plugin.logger.debug('makeRequestTrace');
            if (!span) {
                plugin.logger.debug('makeRequestTrace span is null');
                return request;
            }
            const setter = {
                setHeader(name, value) {
                    if (plugin.hasExpectHeader(options) && options.headers) {
                        if (options.__cloned !== true) {
                            options = Object.assign({}, options);
                            options.headers = Object.assign({}, options.headers);
                            options.__cloned = true;
                        }
                        options.headers[name] = value;
                    }
                    else {
                        request.setHeader(name, value);
                    }
                }
            };
            const propagation = plugin.tracer.propagation;
            if (propagation) {
                propagation.inject(setter, span.spanContext);
            }
            request.on('response', (response) => {
                plugin.tracer.wrapEmitter(response);
                plugin.logger.debug('outgoingRequest on response()');
                response.on('end', () => {
                    plugin.logger.debug('outgoingRequest on end()');
                    const method = response.method ? response.method : 'GET';
                    const headers = options.headers;
                    const userAgent = headers ? (headers['user-agent'] || headers['User-Agent']) : null;
                    if (options.host || options.hostname) {
                        const value = options.host || options.hostname;
                        span.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_HOST, `${value}`);
                    }
                    span.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_METHOD, method);
                    span.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_PATH, `${options.path}`);
                    span.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_ROUTE, `${options.path}`);
                    if (userAgent) {
                        span.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_USER_AGENT, userAgent.toString());
                    }
                    span.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_STATUS_CODE, `${response.statusCode}`);
                    span.setStatus(HttpPlugin.convertTraceStatus(response.statusCode || 0));
                    span.addMessageEvent(core_1.MessageEventType.SENT, uuid.v4().split('-').join(''));
                    span.end();
                });
                response.on('error', error => {
                    span.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_ERROR_NAME, error.name);
                    span.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_ERROR_MESSAGE, error.message);
                    span.setStatus(core_1.CanonicalCode.UNKNOWN);
                    span.end();
                });
            });
            request.on('error', error => {
                span.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_ERROR_NAME, error.name);
                span.addAttribute(HttpPlugin.ATTRIBUTE_HTTP_ERROR_MESSAGE, error.message);
                span.setStatus(core_1.CanonicalCode.UNKNOWN);
                span.end();
            });
            plugin.logger.debug('makeRequestTrace return request');
            return request;
        };
    }
    createSpan(options, fn) {
        const forceChildspan = this.options.createSpanWithNet === true;
        if (forceChildspan) {
            const span = this.tracer.startChildSpan(options.name, options.kind);
            return fn(span);
        }
        else {
            return this.tracer.startRootSpan(options, fn);
        }
    }
    static convertTraceStatus(statusCode) {
        if (statusCode < 200 || statusCode > 504) {
            return TraceStatusCodes.UNKNOWN;
        }
        else if (statusCode >= 200 && statusCode < 400) {
            return TraceStatusCodes.OK;
        }
        else {
            switch (statusCode) {
                case (400):
                    return TraceStatusCodes.INVALID_ARGUMENT;
                case (504):
                    return TraceStatusCodes.DEADLINE_EXCEEDED;
                case (404):
                    return TraceStatusCodes.NOT_FOUND;
                case (403):
                    return TraceStatusCodes.PERMISSION_DENIED;
                case (401):
                    return TraceStatusCodes.UNAUTHENTICATED;
                case (429):
                    return TraceStatusCodes.RESOURCE_EXHAUSTED;
                case (501):
                    return TraceStatusCodes.UNIMPLEMENTED;
                case (503):
                    return TraceStatusCodes.UNAVAILABLE;
                default:
                    return TraceStatusCodes.UNKNOWN;
            }
        }
    }
    hasExpectHeader(options) {
        return !!(options.headers &&
            options.headers.Expect);
    }
}
HttpPlugin.ATTRIBUTE_HTTP_HOST = 'http.host';
HttpPlugin.ATTRIBUTE_HTTP_METHOD = 'http.method';
HttpPlugin.ATTRIBUTE_HTTP_PATH = 'http.path';
HttpPlugin.ATTRIBUTE_HTTP_ROUTE = 'http.route';
HttpPlugin.ATTRIBUTE_HTTP_USER_AGENT = 'http.user_agent';
HttpPlugin.ATTRIBUTE_HTTP_STATUS_CODE = 'http.status_code';
HttpPlugin.ATTRIBUTE_HTTP_ERROR_NAME = 'http.error_name';
HttpPlugin.ATTRIBUTE_HTTP_ERROR_MESSAGE = 'http.error_message';
exports.HttpPlugin = HttpPlugin;
var TraceStatusCodes;
(function (TraceStatusCodes) {
    TraceStatusCodes[TraceStatusCodes["UNKNOWN"] = 2] = "UNKNOWN";
    TraceStatusCodes[TraceStatusCodes["OK"] = 0] = "OK";
    TraceStatusCodes[TraceStatusCodes["INVALID_ARGUMENT"] = 3] = "INVALID_ARGUMENT";
    TraceStatusCodes[TraceStatusCodes["DEADLINE_EXCEEDED"] = 4] = "DEADLINE_EXCEEDED";
    TraceStatusCodes[TraceStatusCodes["NOT_FOUND"] = 5] = "NOT_FOUND";
    TraceStatusCodes[TraceStatusCodes["PERMISSION_DENIED"] = 7] = "PERMISSION_DENIED";
    TraceStatusCodes[TraceStatusCodes["UNAUTHENTICATED"] = 16] = "UNAUTHENTICATED";
    TraceStatusCodes[TraceStatusCodes["RESOURCE_EXHAUSTED"] = 8] = "RESOURCE_EXHAUSTED";
    TraceStatusCodes[TraceStatusCodes["UNIMPLEMENTED"] = 12] = "UNIMPLEMENTED";
    TraceStatusCodes[TraceStatusCodes["UNAVAILABLE"] = 14] = "UNAVAILABLE";
})(TraceStatusCodes = exports.TraceStatusCodes || (exports.TraceStatusCodes = {}));
exports.plugin = new HttpPlugin('http');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jZW5zdXMvcGx1Z2lucy9odHRwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBZ0JBLDJDQUE4STtBQUM5SSxtQ0FBa0M7QUFDbEMsaUNBQWdDO0FBQ2hDLG1DQUFrQztBQUNsQywyQkFBMEI7QUFDMUIsNkJBQTRCO0FBQzVCLHVDQUE0QztBQXdCNUMsTUFBYSxVQUFXLFNBQVEsaUJBQVU7SUFrQnhDLFlBQWEsVUFBa0I7UUFDN0IsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ25CLENBQUM7SUFLUyxVQUFVO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRTNFLE9BQU8sQ0FBQyxJQUFJLENBQ1IsSUFBSSxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLCtCQUErQixFQUFFLENBQUMsQ0FBQTtRQUkxRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsRUFBRTtZQUM3QyxPQUFPLENBQUMsSUFBSSxDQUNSLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtnQkFZOUIsT0FBTyxTQUFTLFFBQVEsQ0FBRSxPQUFPLEVBQUUsUUFBUTtvQkFDekMsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7b0JBQ2pELEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtvQkFDVCxPQUFPLEdBQUcsQ0FBQTtnQkFDWixDQUFDLENBQUE7WUFDSCxDQUFDLENBQUMsQ0FBQTtTQUNQO1FBRUQsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTTtZQUMvQyxJQUFJLENBQUMs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