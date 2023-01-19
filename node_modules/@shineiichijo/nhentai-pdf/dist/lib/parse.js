"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const parse = (text, link) => {
    const parseText = (text) => text
        .split(/[0-9]K/g)
        .join('10')
        .split(/\d/g)
        .filter((tag) => tag);
    const $ = cheerio_1.default.load(text);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const details = {};
    $('.tag-container.field-name')
        .text()
        .split('\n')
        .map((string) => string.trim())
        .filter((u) => u)
        .map((tag, i, tags) => {
        if (tag.endsWith(':') && !tags[i + 1].endsWith(':'))
            details[tag.substring(0, tag.length - 1).toLowerCase()] = tags[i + 1]
                .replace(/(\([0-9]+\))([a-zA-Z])/g, '$1 $2')
                .split(/(?<=\))\s(?=[a-zA-Z])/);
    });
    for (const key of ['parodies', 'tags', 'languages', 'characters', 'categories', 'groups', 'artists'])
        details[key] = parseText((details[key] || [''])[0]);
    details.pages = Number(details.pages[0] || 0);
    details.uploaded = details.uploaded[0];
    return {
        title: $('#info').find('h1').text(),
        details: details,
        pages: Object.entries($('.gallerythumb').find('img'))
            .map((image) => {
            return image[1].attribs
                ? image[1].attribs['data-src'].replace(/t(\.(jpg|png))/, '$1').replace('t.nhentai', 'i.nhentai')
                : null;
        })
            .filter((link) => link),
        link
    };
};
exports.default = parse;
