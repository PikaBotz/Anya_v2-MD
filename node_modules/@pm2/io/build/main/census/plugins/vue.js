'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@opencensus/core");
const shimmer = require("shimmer");
var RendererType;
(function (RendererType) {
    RendererType["NORMAL"] = "normal";
    RendererType["BUNDLE"] = "bundle";
})(RendererType || (RendererType = {}));
class VuePlugin extends core_1.BasePlugin {
    constructor(moduleName) {
        super(moduleName);
        this.rendererResults = [];
    }
    applyPatch() {
        this.logger.debug('Patched vue-server-renderer');
        if (this.moduleExports) {
            this.logger.debug('patching vue-server-renderer.prototype.createRenderer');
            shimmer.wrap(this.moduleExports, 'createRenderer', this.getPatchCreateRenderer(RendererType.NORMAL));
            this.logger.debug('patching vue-server-renderer.prototype.createBundleRenderer');
            shimmer.wrap(this.moduleExports, 'createBundleRenderer', this.getPatchCreateRenderer(RendererType.BUNDLE));
        }
        return this.moduleExports;
    }
    applyUnpatch() {
        shimmer.unwrap(this.moduleExports, 'createRenderer');
        shimmer.unwrap(this.moduleExports, 'createBundleRenderer');
        for (let result of this.rendererResults) {
            shimmer.unwrap(result, 'renderToString');
        }
    }
    getPatchCreateRenderer(type) {
        const plugin = this;
        return function createRendererWrap(original) {
            return function create_renderer_trace() {
                const result = original.apply(this, arguments);
                plugin.logger.debug(`patching ${type}.renderToString`);
                shimmer.wrap(result, 'renderToString', plugin.getPatchRenderToString(type));
                plugin.rendererResults.push(result);
                return result;
            };
        };
    }
    getPatchRenderToString(type) {
        const plugin = this;
        return function renderToStringWrap(original) {
            return function render_string_trace() {
                if (!plugin.tracer.currentRootSpan) {
                    return original.apply(this, arguments);
                }
                const span = plugin.tracer.startChildSpan(`vue-renderer`, core_1.SpanKind.CLIENT);
                if (span === null)
                    return original.apply(this, arguments);
                const promise = original.apply(this, arguments);
                if (promise instanceof Promise) {
                    promise.then(plugin.patchEnd(span)).catch(plugin.patchEnd(span));
                }
                return promise;
            };
        };
    }
    patchEnd(span) {
        const plugin = this;
        const patchedEnd = function (err) {
            if (plugin.options.detailedCommands === true && err instanceof Error) {
                span.addAttribute('error', err.message);
            }
            if (span.ended === false) {
                span.end();
            }
        };
        return this.tracer.wrap(patchedEnd);
    }
}
exports.VuePlugin = VuePlugin;
const plugin = new VuePlugin('vue-server-renderer');
exports.plugin = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NlbnN1cy9wbHVnaW5zL3Z1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxZQUFZLENBQUE7O0FBRVosMkNBQTZEO0FBQzdELG1DQUFrQztBQU9sQyxJQUFLLFlBR0o7QUFIRCxXQUFLLFlBQVk7SUFDZixpQ0FBaUIsQ0FBQTtJQUNqQixpQ0FBaUIsQ0FBQTtBQUNuQixDQUFDLEVBSEksWUFBWSxLQUFaLFlBQVksUUFHaEI7QUFHRCxNQUFhLFNBQVUsU0FBUSxpQkFBVTtJQVN2QyxZQUFhLFVBQWtCO1FBQzdCLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUpYLG9CQUFlLEdBQTJCLEVBQUUsQ0FBQTtJQUtwRCxDQUFDO0lBS1MsVUFBVTtRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO1FBRWhELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFBO1lBQzFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsRUFDL0MsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1lBQ25ELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDZEQUE2RCxDQUFDLENBQUE7WUFDaEYsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLHNCQUFzQixFQUNyRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7U0FDcEQ7UUFDRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUE7SUFDM0IsQ0FBQztJQUdELFlBQVk7UUFDVixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUs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