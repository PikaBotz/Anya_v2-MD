export declare type MissFunction = (key: string) => any;
export declare type CacheOptions = {
    miss: MissFunction;
    ttl?: number;
};
export declare type StackContext = {
    callsite: string;
    context: string;
};
export declare type FrameMetadata = {
    line_number: number;
    file_name: string;
};
export declare class Cache {
    private cache;
    private ttlCache;
    private worker;
    private tllTime;
    private onMiss;
    constructor(opts: CacheOptions);
    workerFn(): void;
    get(key: string): any;
    set(key: string, value: any): boolean;
    reset(): void;
}
export declare type StackTraceParserOptions = {
    cache: Cache;
    contextSize: number;
};
export declare class StackTraceParser {
    private cache;
    private contextSize;
    constructor(options: StackTraceParserOptions);
    isAbsolute(path: any): boolean;
    parse(stack: FrameMetadata[]): StackContext | null;
    retrieveContext(error: Error): StackContext | null;
}
