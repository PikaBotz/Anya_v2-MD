export interface PromiseCallback<T = any, E = Error> {
    resolve: ResolveFunction<T>;
    reject: RejectFunction<E>;
}
export type ResolveFunction<T = any> = (value: T | PromiseLike<T>) => void;
export type RejectFunction<E = Error> = (reason: E) => void;
