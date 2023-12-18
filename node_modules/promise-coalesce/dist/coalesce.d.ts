/**
 * Enqueue a promise for the group identified by `key`.
 *
 * All requests received for the same key while a request for that key
 * is already being executed will wait. Once the running request settles
 * then all the waiting requests in the group will settle, too.
 * This minimizes how many times the function itself runs at the same time.
 * This function resolves or rejects according to the given function argument.
 */
export declare function coalesceAsync<T>(
/**
 * Any identifier to group requests together.
 */
key: string, 
/**
 * The function to run.
 */
fn: () => T | PromiseLike<T>): Promise<T>;
