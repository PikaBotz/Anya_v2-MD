"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const axios_1 = __importDefault(require("axios"));
const events_1 = require("events");
const parse_1 = __importDefault(require("./parse"));
const ValidateID_1 = __importDefault(require("./Decorators/ValidateID"));
const fetcher_1 = __importDefault(require("./Utils/fetcher"));
const PDF_1 = require("./PDF");
const promises_1 = require("fs/promises");
class Doujin extends events_1.EventEmitter {
    constructor(id) {
        super();
        this._info = null;
        this.validate = () => axios_1.default
            .get(this._url)
            .then(() => true)
            .catch(() => false);
        this.fetch = () => __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, fetcher_1.default)('get')(this._url, 'json');
            this._info = (0, parse_1.default)(result, this._url);
            return this.info;
        });
        this.pdf = (filename) => __awaiter(this, void 0, void 0, function* () {
            if (!this._info)
                yield this.fetch();
            const PDF = new PDF_1.Document(yield (yield this.fetch()).pages, 'A4');
            const buffer = yield PDF.build();
            if (filename)
                yield (0, promises_1.writeFile)(filename, buffer);
            return buffer;
        });
        this.save = (filename) => __awaiter(this, void 0, void 0, function* () {
            if (!this._info)
                yield this.fetch();
            filename = filename || `${this.info.title}.pdf`;
            yield this.pdf(filename);
            return filename;
        });
        this.id = id;
    }
    get info() {
        if (!this._info)
            throw new Error('Invalid');
        return this._info;
    }
    get _url() {
        return `https://nhentai.net/g/${this.id}`;
    }
}
__decorate([
    (0, ValidateID_1.default)()
], Doujin.prototype, "id", void 0);
exports.default = Doujin;
