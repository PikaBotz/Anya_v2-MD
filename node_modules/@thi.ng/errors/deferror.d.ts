/// <reference types="node" />
export declare const defError: <T = string>(prefix: (msg?: T | undefined) => string, suffix?: (msg?: T | undefined) => string) => {
    new (msg?: T | undefined): {
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
//# sourceMappingURL=deferror.d.ts.map