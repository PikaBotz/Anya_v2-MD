"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schurDocs = void 0;
var schurDocs = {
  name: 'schur',
  category: 'Matrix',
  syntax: ['schur(A)'],
  description: 'Performs a real Schur decomposition of the real matrix A = UTU\'',
  examples: ['schur([[1, 0], [-4, 3]])', 'schur(A)'],
  seealso: ['lyap', 'sylvester']
};
exports.schurDocs = schurDocs;