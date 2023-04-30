'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@opencensus/core");
const shimmer = require("shimmer");
const semver = require("semver");
exports.kMiddlewareStack = Symbol('express-middleware-stack');
class ExpressPlugin extends core_1.BasePlugin {
    constructor(moduleName) {
        super(moduleName);
        this.kPatched = Symbol('express-layer-patched');
    }
    applyPatch() {
        this.logger.debug('Patched express');
        if (!semver.satisfies(this.version, '^4.0.0')) {
            this.logger.debug('express version %s not supported - aborting...', this.version);
            return this.moduleExports;
        }
        if (this.moduleExports) {
            const routerProto = semver.satisfies(this.version, '^5')
                ? (this.moduleExports.Router && this.moduleExports.Router.prototype)
                : this.moduleExports.Router;
            const plugin = this;
            this.logger.debug('patching express.Router.prototype.route');
            shimmer.wrap(routerProto, 'route', (original) => {
                return function route_trace(path) {
                    const route = original.apply(this, arguments);
                    const layer = this.stack[this.stack.length - 1];
                    plugin.applyLayerPatch(layer, path);
                    return route;
                };
            });
            this.logger.debug('patching express.Router.prototype.use');
            shimmer.wrap(routerProto, 'use', (original) => {
                return function use(path) {
                    const route = original.apply(this, arguments);
                    const layer = this.stack[this.stack.length - 1];
                    plugin.applyLayerPatch(layer, path);
                    return route;
                };
            });
            this.logger.debug('patching express.Application.use');
            shimmer.wrap(this.moduleExports.application, 'use', (original) => {
                return function use(path) {
                    const route = original.apply(this, arguments);
                    const layer = this._router.stack[this._router.stack.length - 1];
                    plugin.applyLayerPatch(layer, path);
                    return route;
                };
            });
        }
        return this.moduleExports;
    }
    applyUnpatch() {
        if (!semver.satisfies(this.version, '^4.0.0')) {
            return this.moduleExports;
        }
        const routerProto = semver.satisfies(this.version, '^5')
            ? (this.moduleExports.Router && this.moduleExports.Router.prototype)
            : this.moduleExports.Router;
        shimmer.unwrap(routerProto, 'use');
        shimmer.unwrap(routerProto, 'route');
        shimmer.unwrap(this.moduleExports.application, 'use');
    }
    applyLayerPatch(layer, layerPath) {
        const plugin = this;
        if (layer[this.kPatched] === true)
            return;
        layer[this.kPatched] = true;
        plugin.logger.debug('patching express.Router.Layer.handle');
        shimmer.wrap(layer, 'handle', function (original) {
            if (original.length !== 4) {
                return function (req, res, next) {
                    plugin.safePush(req, exports.kMiddlewareStack, layerPath);
                    let spanName = `Middleware - ${layer.name}`;
                    if (layer.route) {
                        spanName = `Route - ${layer.route.path}`;
                    }
                    else if (layer.name === 'router') {
                        spanName = `Router - ${layerPath}`;
                    }
                    const span = plugin.tracer.startChildSpan(spanName, core_1.SpanKind.CLIENT);
                    if (span === null)
                        return original.apply(this, arguments);
                    arguments[2] = function () {
                        if (!(req.route && arguments[0] instanceof Error)) {
                            req[exports.kMiddlewareStack].pop();
                        }
                        return plugin.patchEnd(span, next)();
                    };
                    return original.apply(this, arguments);
                };
            }
            return function (_err, req, res, next) {
                return original.apply(this, arguments);
            };
        });
    }
    safePush(obj, prop, value) {
        if (!obj[prop])
            obj[prop] = [];
        obj[prop].push(value);
    }
    patchEnd(span, callback) {
        const plugin = this;
        const patchedEnd = function (err) {
            if (plugin.options.detailedCommands === true && err instanceof Error) {
                span.addAttribute('error', err.message);
            }
            if (span.ended === false) {
                span.end();
            }
            return callback.apply(this, arguments);
        };
        return this.tracer.wrap(patchedEnd);
    }
}
exports.ExpressPlugin = ExpressPlugin;
const plugin = new ExpressPlugin('express');
exports.plugin = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jZW5zdXMvcGx1Z2lucy9leHByZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLFlBQVksQ0FBQTs7QUFFWiwyQ0FBNkQ7QUFDN0QsbUNBQWtDO0FBQ2xDLGlDQUFnQztBQUduQixRQUFBLGdCQUFnQixHQUFHLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0FBR2xFLE1BQWEsYUFBYyxTQUFRLGlCQUFVO0lBSzNDLFlBQWEsVUFBa0I7UUFDN0IsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBSlgsYUFBUSxHQUFHLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0lBS2xELENBQUM7SUFLUyxVQUFVO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUE7UUFFcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsRUFBRTtZQUM3QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDakYsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFBO1NBQzFCO1FBRUQsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLE1BQU0sV0FBVyxHQUFtQixNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDO2dCQUN0RSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7Z0JBQ3BFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQTtZQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUE7WUFFbkIsSUFBSSxDQUFDLE1BQU0sQ0FB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