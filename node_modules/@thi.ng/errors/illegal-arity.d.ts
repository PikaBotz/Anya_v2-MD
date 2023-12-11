/// <reference types="node" />
export declare const IllegalArityError: {
    new (msg?: number | undefined): {
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const illegalArity: (n: number) => never;
//# sourceMappingURL=illegal-arity.d.ts.map