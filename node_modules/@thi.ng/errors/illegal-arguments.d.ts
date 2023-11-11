/// <reference types="node" />
export declare const IllegalArgumentError: {
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
export declare const illegalArgs: (msg?: any) => never;
//# sourceMappingURL=illegal-arguments.d.ts.map