"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const core_1 = require("@opencensus/core");
const shimmer = require("shimmer");
class PGPlugin extends core_1.BasePlugin {
    constructor(moduleName) {
        super(moduleName);
        this.internalFileList = {
            '6 - 7': {
                'client': 'lib/client'
            }
        };
    }
    applyPatch() {
        this.logger.debug('Patched PG');
        if (this.internalFilesExports.client) {
            this.logger.debug('patching pq.client.prototype.query');
            shimmer.wrap(this.internalFilesExports.client.prototype, 'query', this.getPatchCreateQuery());
        }
        return this.moduleExports;
    }
    applyUnpatch() {
        shimmer.unwrap(this.internalFilesExports.client.prototype, 'query');
    }
    getPatchCreateQuery() {
        const plugin = this;
        return (original) => {
            return function (...args) {
                const span = plugin.tracer.startChildSpan('pg-query', core_1.SpanKind.CLIENT);
                if (span === null)
                    return original.apply(this, arguments);
                let pgQuery;
                if (arguments.length >= 1) {
                    const args = Array.prototype.slice.call(arguments, 0);
                    plugin.populateLabelsFromInputs(span, args);
                    const callback = args[args.length - 1];
                    if (typeof callback === 'function') {
                        args[args.length - 1] = plugin.patchCallback(callback, span);
                    }
                    else if (typeof args[0] === 'object') {
                        plugin.patchSubmittable(args[0], span);
                    }
                    pgQuery = original.apply(this, args);
                }
                else {
                    pgQuery = original.apply(this, arguments);
                }
                if (pgQuery) {
                    if (pgQuery instanceof EventEmitter) {
                        plugin.tracer.wrapEmitter(pgQuery);
                    }
                    else if (typeof pgQuery.then === 'function') {
                        plugin.patchPromise(pgQuery, span);
                    }
                }
                return pgQuery;
            };
        };
    }
    patchCallback(callback, span) {
        const plugin = this;
        return plugin.tracer.wrap((err, res) => {
            plugin.populateLabelsFromOutputs(span, err, res);
            span.end();
            callback(err, res);
        });
    }
    patchSubmittable(pgQuery, span) {
        const plugin = this;
        let spanEnded = false;
        if (pgQuery.handleError) {
            shimmer.wrap(pgQuery, 'handleError', (origCallback) => {
                return this.tracer.wrap(function (...args) {
                    if (!spanEnded) {
                        const err = args[0];
                        plugin.populateLabelsFromOutputs(span, err);
                        span.end();
                        spanEnded = true;
                    }
                    if (origCallback) {
                        origCallback.apply(this, args);
                    }
                });
            });
        }
        if (pgQuery.handleReadyForQuery) {
            shimmer.wrap(pgQuery, 'handleReadyForQuery', (origCallback) => {
                return this.tracer.wrap(function (...args) {
                    if (!spanEnded) {
                        plugin.populateLabelsFromOutputs(span, null, this._result);
                        span.end();
                        spanEnded = true;
                    }
                    if (origCallback) {
                        origCallback.apply(this, args);
                    }
                });
            });
        }
        return pgQuery;
    }
    patchPromise(promise, span) {
        return promise = promise.then((res) => {
            plugin.populateLabelsFromOutputs(span, null, res);
            span.end();
            return res;
        }, (err) => {
            plugin.populateLabelsFromOutputs(span, err);
            span.end();
            throw err;
        });
    }
    populateLabelsFromInputs(span, args) {
        const queryObj = args[0];
        if (typeof queryObj === 'object') {
            if (queryObj.text) {
                span.addAttribute('query', queryObj.text);
            }
            if (plugin.options.detailedCommands === true && queryObj.values) {
                span.addAttribute('values', queryObj.values);
            }
        }
        else if (typeof queryObj === 'string') {
            span.addAttribute('query', queryObj);
            if (plugin.options.detailedCommands === true && args.length >= 2 && typeof args[1] !== 'function') {
                span.addAttribute('values', args[1]);
            }
        }
    }
    populateLabelsFromOutputs(span, err, res) {
        if (plugin.options.detailedCommands !== true)
            return;
        if (err) {
            span.addAttribute('error', err.toString());
        }
        if (res) {
            span.addAttribute('row_count', res.rowCount);
            span.addAttribute('oid', res.oid);
            span.addAttribute('rows', res.rows);
            span.addAttribute('fields', res.fields);
        }
    }
}
exports.PGPlugin = PGPlugin;
const plugin = new PGPlugin('pg');
exports.plugin = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY2Vuc3VzL3BsdWdpbnMvcGcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFlQSx1Q0FBc0M7QUFFdEMsMkNBQTZEO0FBQzdELG1DQUFrQztBQVVsQyxNQUFhLFFBQVMsU0FBUSxpQkFBVTtJQVV0QyxZQUFhLFVBQWtCO1FBQzdCLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQVJBLHFCQUFnQixHQUFHO1lBQ3BDLE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUUsWUFBWTthQUN2QjtTQUNGLENBQUE7SUFLRCxDQUFDO0lBS1MsVUFBVTtRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUUvQixJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUU7WUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQTtZQUN2RCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFBO1NBQzlGO1FBRUQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFBO0lBQzNCLENBQUM7SUFHRCxZQUFZO1FBQ1YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNyRSxDQUFDO0lBRU8sbUJBQW1CO1FBQ3pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQTtRQUNuQixPQUFPLENBQUMsUUFBa0IsRUFBRSxFQUFFO1lBQzVCLE9BQU8sVUFBVSxHQUFHLElBQVc7Z0JBQzdCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxlQUFRLENB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