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
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
test('Search for Dua Lipa and get more data', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const query = 'Dua Lipa';
    const results = yield src_1.searchArtists(query);
    expect(results.length).toBeGreaterThanOrEqual(1);
    const firstResult = results[0];
    expect(firstResult).toBeDefined();
    const data = yield src_1.getArtist(firstResult.artistId);
    expect(data).toBeDefined();
    expect((_a = data.suggestedArtists) === null || _a === void 0 ? void 0 : _a.length).toBeGreaterThanOrEqual(1);
    expect((_b = data.albums) === null || _b === void 0 ? void 0 : _b.length).toBeGreaterThanOrEqual(1);
    expect((_c = data.singles) === null || _c === void 0 ? void 0 : _c.length).toBeGreaterThanOrEqual(1);
    console.log(data);
}));
