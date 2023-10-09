/// <reference types="node" />
import { EventEmitter } from 'events';
export default class Doujin extends EventEmitter {
    id: string;
    private _info;
    constructor(id: string);
    get info(): IDoujinInfo;
    private get _url();
    validate: () => Promise<boolean>;
    fetch: () => Promise<IDoujinInfo>;
    pdf: (filename?: string | undefined) => Promise<Buffer>;
    save: (filename?: string | undefined) => Promise<string>;
}
export interface IDoujinInfo {
    title: string;
    details: {
        parodies: string[];
        characters: string[];
        tags: string[];
        artists: string[];
        groups: string[];
        languages: string[];
        categories: string[];
        pages: number;
    };
    pages: string[];
    link: string;
}
