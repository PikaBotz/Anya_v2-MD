"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetcher_1 = __importDefault(require("./fetcher"));
const promises_1 = require("fs/promises");
const os_1 = require("os");
const fileformat = (url) => {
    const array = url.split('/');
    return array[array.length - 1].split('.')[1];
};
const download = (url, filename = `${(0, os_1.tmpdir)()}/${Math.random().toString()}.${fileformat(url)}`) => __awaiter(void 0, void 0, void 0, function* () {
    const image = yield (0, fetcher_1.default)('get')(url, 'arraybuffer');
    yield (0, promises_1.writeFile)(filename, image);
    return filename;
});
exports.default = download;
