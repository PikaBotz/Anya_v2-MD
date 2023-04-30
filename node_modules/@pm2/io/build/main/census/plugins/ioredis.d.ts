import { BasePlugin, Span } from '@opencensus/core';
export declare type IgnoreMatcher = string | RegExp;
export declare type IORedisPluginConfig = {
    detailedCommands: boolean;
};
export declare type IORedisCommand = {
    reject: (err: Error) => void | undefined;
    resolve: (result: any) => void | undefined;
    promise: Promise<any>;
    args: Array<string | Buffer | number>;
    callback: Function | undefined;
    name: string;
};
export declare class IORedisPlugin extends BasePlugin {
    protected options: IORedisPluginConfig;
    constructor(moduleName: string);
    protected applyPatch(): any;
    applyUnpatch(): void;
    private getPatchSendCommand;
    patchEnd(span: Span, resultHandler: Function): Function;
}
declare const plugin: IORedisPlugin;
export { plugin };
