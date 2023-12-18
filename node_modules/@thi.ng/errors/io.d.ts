/// <reference types="node" />
export declare const IOError: {
    new (msg?: any): {
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const ioerror: (msg?: any) => never;
export declare const FileNotFoundError: {
    new (msg?: any): {
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const fileNotFound: (path: string) => never;
//# sourceMappingURL=io.d.ts.map