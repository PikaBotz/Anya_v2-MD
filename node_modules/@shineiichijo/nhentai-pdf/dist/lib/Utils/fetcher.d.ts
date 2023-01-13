/// <reference types="node" />
declare type Headers = {
    [Header: string]: string;
};
declare const get: <T extends "json" | "arraybuffer", R>(url: string, type: T, headers?: Headers | undefined) => Promise<T extends "buffer" ? Buffer : R>;
declare const post: <R>(url: string, data: string, headers?: Headers | undefined) => Promise<R>;
declare const fetcher: <M extends Methods>(method: M) => Method<M>;
export default fetcher;
declare type Methods = 'get' | 'post';
declare type Method<M extends Methods> = M extends 'post' ? typeof post : typeof get;
