"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@opencensus/core");
const shimmer = require("shimmer");
class MongoDBPlugin extends core_1.BasePlugin {
    constructor(moduleName) {
        super(moduleName);
        this.internalFileList = {
            '1 - 3': {
                'ConnectionPool': 'lib/connection/pool'
            }
        };
    }
    applyPatch() {
        this.logger.debug('Patched MongoDB');
        if (this.moduleExports.Server) {
            this.logger.debug('patching mongodb-core.Server.prototype functions: insert, remove, command, update');
            shimmer.wrap(this.moduleExports.Server.prototype, 'insert', this.getPatchCommand('mongodb-insert'));
            shimmer.wrap(this.moduleExports.Server.prototype, 'remove', this.getPatchCommand('mongodb-remove'));
            shimmer.wrap(this.moduleExports.Server.prototype, 'command', this.getPatchCommand('mongodb-command'));
            shimmer.wrap(this.moduleExports.Server.prototype, 'update', this.getPatchCommand('mongodb-update'));
        }
        if (this.moduleExports.Cursor) {
            this.logger.debug('patching mongodb-core.Cursor.prototype.next');
            shimmer.wrap(this.moduleExports.Cursor.prototype, 'next', this.getPatchCursor());
        }
        if (this.internalFilesExports.ConnectionPool) {
            this.logger.debug('patching mongodb-core/lib/connection/pool');
            shimmer.wrap(this.internalFilesExports.ConnectionPool.prototype, 'once', this.getPatchEventEmitter());
        }
        return this.moduleExports;
    }
    applyUnpatch() {
        shimmer.unwrap(this.moduleExports.Server.prototype, 'insert');
        shimmer.unwrap(this.moduleExports.Server.prototype, 'remove');
        shimmer.unwrap(this.moduleExports.Server.prototype, 'command');
        shimmer.unwrap(this.moduleExports.Server.prototype, 'update');
        shimmer.unwrap(this.moduleExports.Cursor.prototype, 'next');
        if (this.internalFilesExports.ConnectionPool) {
            shimmer.unwrap(this.internalFilesExports.ConnectionPool.prototype, 'once');
        }
    }
    getPatchCommand(label) {
        const plugin = this;
        return (original) => {
            return function (ns, command, options, callback) {
                const resultHandler = typeof options === 'function' ? options : callback;
                if (plugin.tracer.currentRootSpan && typeof resultHandler === 'function') {
                    let type;
                    if (command.createIndexes) {
                        type = 'createIndexes';
                    }
                    else if (command.findandmodify) {
                        type = 'findAndModify';
                    }
                    else if (command.ismaster) {
                        type = 'isMaster';
                    }
                    else if (command.count) {
                        type = 'count';
                    }
                    else {
                        type = 'command';
                    }
                    const span = plugin.tracer.startChildSpan(label, core_1.SpanKind.CLIENT);
                    if (span === null)
                        return original.apply(this, arguments);
                    span.addAttribute('database', ns);
                    span.addAttribute('type', type);
                    if (plugin.options.detailedCommands === true) {
                        span.addAttribute('command', JSON.stringify(command));
                    }
                    if (typeof options === 'function') {
                        return original.call(this, ns, command, plugin.patchEnd(span, options));
                    }
                    else {
                        return original.call(this, ns, command, options, plugin.patchEnd(span, callback));
                    }
                }
                return original.apply(this, arguments);
            };
        };
    }
    getPatchCursor() {
        const plugin = this;
        return (original) => {
            return function (...args) {
                let resultHandler = args[0];
                if (plugin.tracer.currentRootSpan && typeof resultHandler === 'function') {
                    const span = plugin.tracer.startChildSpan('mongodb-find', core_1.SpanKind.CLIENT);
                    if (span === null)
                        return original.apply(this, arguments);
                    resultHandler = plugin.patchEnd(span, resultHandler);
                    span.addAttribute('database', this.ns);
                    if (plugin.options.detailedCommands === true && typeof this.cmd.query === 'object') {
                        span.addAttribute('command', JSON.stringify(this.cmd.query));
                    }
                }
                return original.call(this, resultHandler);
            };
        };
    }
    getPatchEventEmitter() {
        const plugin = this;
        return (original) => {
            return function (event, cb) {
                return original.call(this, event, plugin.tracer.wrap(cb));
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
            return resultHandler.apply(this, arguments);
        };
        return this.tracer.wrap(patchedEnd);
    }
}
exports.MongoDBPlugin = MongoDBPlugin;
const plugin = new MongoDBPlugin('mongodb-core');
exports.plugin = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ29kYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jZW5zdXMvcGx1Z2lucy9tb25nb2RiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBZ0JBLDJDQUFtRTtBQUNuRSxtQ0FBa0M7QUFVbEMsTUFBYSxhQUFjLFNBQVEsaUJBQVU7SUFVM0MsWUFBYSxVQUFrQjtRQUM3QixLQUFLLENBQUMsVUFBVSxDQUFDLENBQUE7UUFSQSxxQkFBZ0IsR0FBRztZQUNwQyxPQUFPLEVBQUU7Z0JBQ1AsZ0JBQWdCLEVBQUUscUJBQXFCO2FBQ3hDO1NBQ0YsQ0FBQTtJQUtELENBQUM7SUFLUyxVQUFVO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUE7UUFFcEMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxtRkFBbUYsQ0FBQyxDQUFBO1lBQ3RHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUNuRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFDbkcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFBO1lBQ3JHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtTQUNwRztRQUVELElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQTtZQUNoRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUE7U0FDakY7UUFFRCxJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLEVBQUU7WUFDNUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQTtZQUM5RCxPQUFPLENBQUMsSUFBSSxDQUNWLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLE1BQWUsRUFDbkUsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQTtTQUMvQjtRQUVELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQTtJQUMzQixDQUFDO0lBR0QsWUFBWTtRQUNWLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQzdELE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQzdELE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBQzlELE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQzdELE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQzNELElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLGNBQWMsRUFBRTtZQUM1QyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1NBQzNFO0lBQ0gsQ0FBQztJQUdPLGVBQWUsQ0FBRSxLQUFhO1FBQ3BDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQTtRQUNuQixPQUFPLENBQUMsUUFBa0IsRUFBRSxFQUFFO1lBQzVCLE9BQU8sVUFBVSxFQUFVLEVBQUUsT0FBWSxFQUFFLE9BQVksRUFBRSxRQUFrQjtnQkFDekUsTUFBTSxhQUFhLEdBQUcsT0FBTyxPQUFPLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQTtnQkFDeEUsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsSUFBSSxPQUFPLGFBQWEsS0FBSyxVQUFVLEVBQUU7b0JBQ3hFLElBQUksSUFBWSxDQUFBO29CQUNoQixJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUU7d0JBQ3pCLElBQUksR0FBRyxlQUFlLENBQUE7cUJBQ3ZCO3lCQUFNLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRTt3QkFDaEMsSUFBSSxHQUFHLGVBQWUsQ0FBQTtxQkFDdkI7eUJBQU0sSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO3dCQUMzQixJQUFJLEdBQUcsVUFBVSxDQUFBO3FCQUNsQjt5QkFBTSxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7d0JBQ3hCLElBQUksR0FBRyxPQUFPLENBQUE7cUJBQ2Y7eUJBQU07d0JBQ0wsSUFBSSxHQUFHLFNBQVMsQ0FBQTtxQkFDakI7b0JBRUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLGVBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtvQkFDakUsSUFBSSxJQUFJLEtBQUssSUFBSTt3QkFBRSxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFBO29CQUN6RCxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQTtvQkFDakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7b0JBRS9CLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLEVBQUU7d0JBQzVDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtxQkFDdEQ7b0JBRUQsSUFBSSxPQUFPLE9BQU8sS0FBSyxVQUFVLEVBQUU7d0JBQ2pDLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO3FCQUN4RTt5QkFBTTt3QkFDTCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQ2xDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO3FCQUM5QztpQkFDRjtnQkFFRCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1lBQ3hDLENBQUMsQ0FBQTtRQUNILENBQUMsQ0FBQTtJQUNILENBQUM7SUFHTyxjQUFjO1FBQ3BCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQTtRQUNuQixPQUFPLENBQUMsUUFBa0IsRUFBRSxFQUFFO1lBQzVCLE9BQU8sVUFBVSxHQUFHLElBQVc7Z0JBQzdCLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDM0IsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsSUFBSSxPQUFPLGFBQWEsS0FBSyxVQUFVLEVBQUU7b0JBQ3hFLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBRSxlQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7b0JBQzFFLElBQUksSUFBSSxLQUFLLElBQUk7d0JBQUUsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQTtvQkFFekQsYUFBYSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFBO29CQUNwRCxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7b0JBQ3RDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7d0JBQ2xGLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO3FCQUM3RDtpQkFDRjtnQkFFRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFBO1lBQzNDLENBQUMsQ0FBQTtRQUNILENBQUMsQ0FBQTtJQUNILENBQUM7SUFFTyxvQkFBb0I7UUFDMUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFBO1FBQ25CLE9BQU8sQ0FBQyxRQUFrQixFQUFFLEVBQUU7WUFDNUIsT0FBTyxVQUFVLEtBQUssRUFBRSxFQUFFO2dCQUN4QixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQzNELENBQUMsQ0FBQTtRQUNILENBQUMsQ0FBQTtJQUNILENBQUM7SUFPRCxRQUFRLENBQUUsSUFBVSxFQUFFLGFBQXVCO1FBQzNDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQTtRQUNuQixNQUFNLFVBQVUsR0FBRyxVQUFVLEdBQUcsRUFBRSxHQUFHO1lBQ25DLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLElBQUksR0FBRyxZQUFZLEtBQUssRUFBRTtnQkFDcEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQ3hDO1lBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBRTtnQkFDeEIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO2FBQ1g7WUFDRCxPQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBQzdDLENBQUMsQ0FBQTtRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDckMsQ0FBQztDQUNGO0FBbEpELHNDQWtKQztBQUVELE1BQU0sTUFBTSxHQUFHLElBQUksYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3ZDLHdCQUFNIn0=