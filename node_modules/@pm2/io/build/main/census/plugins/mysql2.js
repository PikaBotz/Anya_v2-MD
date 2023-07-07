"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@opencensus/core");
const shimmer = require("shimmer");
class Mysql2Plugin extends core_1.BasePlugin {
    constructor(moduleName) {
        super(moduleName);
        this.internalFileList = {
            '1 - 3': {
                'Connection': 'lib/connection',
                'Pool': 'lib/pool'
            }
        };
    }
    applyPatch() {
        this.logger.debug('Patched Mysql2');
        if (this.internalFilesExports.Connection) {
            this.logger.debug('patching mysql2.Connection.createQuery');
            shimmer.wrap(this.internalFilesExports.Connection, 'createQuery', this.getPatchCreateQuery());
        }
        if (this.internalFilesExports.Pool) {
            this.logger.debug('patching mysql2.Pool.prototype.getConnection');
            shimmer.wrap(this.internalFilesExports.Pool.prototype, 'getConnection', this.getPatchGetConnection());
        }
        return this.moduleExports;
    }
    applyUnpatch() {
        shimmer.unwrap(this.internalFilesExports.Connection, 'createQuery');
        shimmer.unwrap(this.internalFilesExports.Pool.prototype, 'getConnection');
    }
    getPatchCreateQuery() {
        const plugin = this;
        return (original) => {
            return function (...args) {
                const span = plugin.tracer.startChildSpan('mysql-query', core_1.SpanKind.CLIENT);
                if (span === null)
                    return original.apply(this, arguments);
                const query = original.apply(this, arguments);
                span.addAttribute('sql', query.sql);
                if (plugin.options.detailedCommands === true && query.values) {
                    span.addAttribute('values', query.values);
                }
                if (typeof query._callback === 'function') {
                    query._callback = plugin.patchEnd(span, query._callback);
                }
                else {
                    query.on('end', function () {
                        span.end();
                    });
                }
                return query;
            };
        };
    }
    getPatchGetConnection() {
        const plugin = this;
        return (original) => {
            return function (cb) {
                return original.call(this, plugin.tracer.wrap(cb));
            };
        };
    }
    patchEnd(span, resultHandler) {
        const plugin = this;
        const patchedEnd = function (err, res) {
            if (plugin.options.detailedCommands === true && err instanceof Error) {
                span.addAttribute('error', err.message);
            }
            if (span.ended === false) {
                span.end();
            }
            if (resultHandler) {
                return resultHandler.apply(this, arguments);
            }
        };
        return this.tracer.wrap(patchedEnd);
    }
}
exports.Mysql2Plugin = Mysql2Plugin;
const plugin = new Mysql2Plugin('mysql2');
exports.plugin = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NlbnN1cy9wbHVnaW5zL215c3FsMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWdCQSwyQ0FBNkQ7QUFDN0QsbUNBQWtDO0FBVWxDLE1BQWEsWUFBYSxTQUFRLGlCQUFVO0lBVzFDLFlBQWEsVUFBa0I7UUFDN0IsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBVEEscUJBQWdCLEdBQUc7WUFDcEMsT0FBTyxFQUFFO2dCQUNQLFlBQVksRUFBRSxnQkFBZ0I7Z0JBQzlCLE1BQU0sRUFBRSxVQUFVO2FBQ25CO1NBQ0YsQ0FBQTtJQUtELENBQUM7SUFLUyxVQUFVO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFFbkMsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUE7WUFDM0QsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFBO1NBQzlGO1FBRUQsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUE7WUFDakUsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQTtTQUN0RztRQUVELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQTtJQUMzQixDQUFDO0lBR0QsWUFBWTtRQUNWLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFv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