"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coalesceAsync = void 0;
const callbacks = new Map();
/**
 * Enqueue a promise for the group identified by `key`.
 *
 * All requests received for the same key while a request for that key
 * is already being executed will wait. Once the running request settles
 * then all the waiting requests in the group will settle, too.
 * This minimizes how many times the function itself runs at the same time.
 * This function resolves or rejects according to the given function argument.
 */
async function coalesceAsync(
/**
 * Any identifier to group requests together.
 */
key, 
/**
 * The function to run.
 */
fn) {
    if (!hasKey(key)) {
        addKey(key);
        try {
            const result = await Promise.resolve(fn());
            coalesce({ key, result });
            return result;
        }
        catch (error) {
            coalesce({ key, error });
            throw error;
        }
    }
    return enqueue(key);
}
exports.coalesceAsync = coalesceAsync;
function hasKey(key) {
    return callbacks.has(key);
}
function addKey(key) {
    callbacks.set(key, []);
}
function removeKey(key) {
    callbacks.delete(key);
}
function addCallbackToKey(key, callback) {
    const stash = getCallbacksByKey(key);
    stash.push(callback);
    callbacks.set(key, stash);
}
function getCallbacksByKey(key) {
    return callbacks.get(key) ?? [];
}
function enqueue(key) {
    return new Promise((resolve, reject) => {
        const callback = { resolve, reject };
        addCallbackToKey(key, callback);
    });
}
function dequeue(key) {
    const stash = getCallbacksByKey(key);
    removeKey(key);
    return stash;
}
function coalesce(options) {
    const { key, error, result } = options;
    dequeue(key).forEach((callback) => {
        if (error) {
            callback.reject(error);
        }
        else {
            callback.resolve(result);
        }
    });
}
//# sourceMappingURL=coalesce.js.map