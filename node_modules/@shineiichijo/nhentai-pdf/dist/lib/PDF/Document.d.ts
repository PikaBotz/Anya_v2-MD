/// <reference types="node" />
import sizes from './sizes.json';
export declare class Document {
    pages: string[];
    size: keyof typeof sizes;
    constructor(pages: string[], size?: keyof typeof sizes);
    build: () => Promise<Buffer>;
}
