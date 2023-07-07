"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceManager_1 = require("../serviceManager");
const Debug = require("debug");
class Action {
}
exports.Action = Action;
class ActionService {
    constructor() {
        this.timer = undefined;
        this.transport = undefined;
        this.actions = new Map();
        this.logger = Debug('axm:services:actions');
    }
    listener(data) {
        this.logger(`Received new message from reverse`);
        if (!data)
            return false;
        const actionName = data.msg ? data.msg : data.action_name ? data.action_name : data;
        let action = this.actions.get(actionName);
        if (typeof action !== 'object') {
            return this.logger(`Received action ${actionName} but failed to find the implementation`);
        }
        if (!action.isScoped) {
            this.logger(`Succesfully called custom action ${action.name} with arity ${action.handler.length}`);
            if (action.handler.length === 2) {
                let params = {};
                if (typeof data === 'object') {
                    params = data.opts;
                }
                return action.handler(params, action.callback);
            }
            return action.handler(action.callback);
        }
        if (data.uuid === undefined) {
            return this.logger(`Received scoped action ${action.name} but without uuid`);
        }
        const stream = {
            send: (dt) => {
                this.transport.send('axm:scoped_action:stream', {
                    data: dt,
                    uuid: data.uuid,
                    action_name: actionName
                });
            },
            error: (dt) => {
                this.transport.send('axm:scoped_action:error', {
                    data: dt,
                    uuid: data.uuid,
                    action_name: actionName
                });
            },
            end: (dt) => {
                this.transport.send('axm:scoped_action:end', {
                    data: dt,
                    uuid: data.uuid,
                    action_name: actionName
                });
            }
        };
        this.logger(`Succesfully called scoped action ${action.name}`);
        return action.handler(data.opts || {}, stream);
    }
    init() {
        this.transport = serviceManager_1.ServiceManager.get('transport');
        if (this.transport === undefined) {
            return this.logger(`Failed to load transport service`);
        }
        this.actions.clear();
        this.transport.on('data', this.listener.bind(this));
    }
    destroy() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
        }
        if (this.transport !== undefined) {
            this.transport.removeListener('data', this.listener.bind(this));
        }
    }
    registerAction(actionName, opts, handler) {
        if (typeof opts === 'function') {
            handler = opts;
            opts = undefined;
        }
        if (typeof actionName !== 'string') {
            console.error(`You must define an name when registering an action`);
            return;
        }
        if (typeof handler !== 'function') {
            console.error(`You must define an callback when registering an action`);
            return;
        }
        if (this.transport === undefined) {
            return this.logger(`Failed to load transport service`);
        }
        let type = 'custom';
        if (actionName.indexOf('km:') === 0 || actionName.indexOf('internal:') === 0) {
            type = 'internal';
        }
        const reply = (data) => {
            this.transport.send('axm:reply', {
                at: new Date().getTime(),
                action_name: actionName,
                return: data
            });
        };
        const action = {
            name: actionName,
            callback: reply,
            handler,
            type,
            isScoped: false,
            arity: handler.length,
            opts
        };
        this.logger(`Succesfully registered custom action ${action.name}`);
        this.actions.set(actionName, action);
        this.transport.addAction(action);
    }
    scopedAction(actionName, handler) {
        if (typeof actionName !== 'string') {
            console.error(`You must define an name when registering an action`);
            return -1;
        }
        if (typeof handler !== 'function') {
            console.error(`You must define an callback when registering an action`);
            return -1;
        }
        if (this.transport === undefined) {
            return this.logger(`Failed to load transport service`);
        }
        const action = {
            name: actionName,
            handler,
            type: 'scoped',
            isScoped: true,
            arity: handler.length,
            opts: null
        };
        this.logger(`Succesfully registered scoped action ${action.name}`);
        this.actions.set(actionName, action);
        this.transport.addAction(action);
    }
}
exports.ActionService = ActionService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9hY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0RBQWtEO0FBRWxELCtCQUE4QjtBQUU5QixNQUFhLE1BQU07Q0FRbEI7QUFSRCx3QkFRQztBQUVELE1BQWEsYUFBYTtJQUExQjtRQUVVLFVBQUssR0FBNkIsU0FBUyxDQUFBO1FBQzNDLGNBQVMsR0FBMEIsU0FBUyxDQUFBO1FBQzVDLFlBQU8sR0FBd0IsSUFBSSxHQUFHLEVBQWtCLENBQUE7UUFDeEQsV0FBTSxHQUFhLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO0lBaUsxRCxDQUFDO0lBL0pTLFFBQVEsQ0FBRSxJQUFJO1FBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU8sS0FBSyxDQUFBO1FBRXZCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtRQUNuRixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUN6QyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLFVBQVUsd0NBQXdDLENBQUMsQ0FBQTtTQUMxRjtRQUdELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsb0NBQW9DLE1BQU0sQ0FBQyxJQUFJLGVBQWUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1lB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