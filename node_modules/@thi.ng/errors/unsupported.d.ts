/// <reference types="node" />
export declare const UnsupportedOperationError: {
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
export declare const unsupported: (msg?: any) => never;
//# sourceMappingURL=unsupported.d.ts.map