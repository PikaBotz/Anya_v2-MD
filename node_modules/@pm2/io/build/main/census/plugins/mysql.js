"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@opencensus/core");
const shimmer = require("shimmer");
class MysqlPlugin extends core_1.BasePlugin {
    constructor(moduleName) {
        super(moduleName);
        this.internalFileList = {
            '1 - 3': {
                'Connection': 'lib/Connection',
                'Pool': 'lib/Pool'
            }
        };
    }
    applyPatch() {
        this.logger.debug('Patched Mysql');
        if (this.internalFilesExports.Connection) {
            this.logger.debug('patching mysql.Connection.createQuery');
            shimmer.wrap(this.internalFilesExports.Connection, 'createQuery', this.getPatchCreateQuery());
        }
        if (this.internalFilesExports.Pool) {
            this.logger.debug('patching mysql.Pool.prototype.getConnection');
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
exports.MysqlPlugin = MysqlPlugin;
const plugin = new MysqlPlugin('mysql');
exports.plugin = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY2Vuc3VzL3BsdWdpbnMvbXlzcWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFnQkEsMkNBQTZEO0FBQzdELG1DQUFrQztBQVVsQyxNQUFhLFdBQVksU0FBUSxpQkFBVTtJQVd6QyxZQUFhLFVBQWtCO1FBQzdCLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQVRBLHFCQUFnQixHQUFHO1lBQ3BDLE9BQU8sRUFBRTtnQkFDUCxZQUFZLEVBQUUsZ0JBQWdCO2dCQUM5QixNQUFNLEVBQUUsVUFBVTthQUNuQjtTQUNGLENBQUE7SUFLRCxDQUFDO0lBS1MsVUFBVTtRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQTtRQUVsQyxJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLEVBQUU7WUFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQTtZQUMxRCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUE7U0FDOUY7UUFFRCxJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUU7WUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQTtZQUNoRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFBO1NBQ3RHO1FBRUQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFBO0lBQzNCLENBQUM7SUFHRCxZQUFZO1FBQ1YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENB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