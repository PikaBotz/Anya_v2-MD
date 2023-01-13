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
exports.Document = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const sizes_json_1 = __importDefault(require("./sizes.json"));
const fs_1 = require("fs");
const download_1 = __importDefault(require("../Utils/download"));
const os_1 = require("os");
class Document {
    constructor(pages, size = 'A4') {
        this.pages = pages;
        this.size = size;
        this.build = () => __awaiter(this, void 0, void 0, function* () {
            const document = new pdfkit_1.default({ margin: 0, size: sizes_json_1.default[this.size] });
            for (const image of this.pages) {
                const file = (0, fs_1.existsSync)(image) ? image : yield (0, download_1.default)(image);
                document.image(file, 0, 0, {
                    fit: sizes_json_1.default[this.size],
                    align: 'center',
                    valign: 'center'
                });
                if (this.pages.indexOf(image) === this.pages.length - 1)
                    break;
                else
                    document.addPage();
            }
            document.end();
            const filename = `${(0, os_1.tmpdir)()}/${this.size}_${Math.random().toString()}.pdf`;
            const stream = (0, fs_1.createWriteStream)(filename);
            document.pipe(stream);
            yield new Promise((resolve, reject) => {
                stream.on('finish', () => resolve(filename));
                stream.on('error', reject);
            });
            const buffer = yield fs_1.promises.readFile(filename);
            return buffer;
        });
    }
}
exports.Document = Document;
