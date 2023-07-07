"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doujin = exports.default = void 0;
var Doujin_1 = require("./lib/Doujin");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(Doujin_1).default; } });
var Doujin_2 = require("./lib/Doujin");
Object.defineProperty(exports, "Doujin", { enumerable: true, get: function () { return __importDefault(Doujin_2).default; } });
__exportStar(require("./lib/PDF"), exports);
