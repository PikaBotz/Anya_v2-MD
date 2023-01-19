"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sylvesterDocs = void 0;
var sylvesterDocs = {
  name: 'sylvester',
  category: 'Matrix',
  syntax: ['sylvester(A,B,C)'],
  description: 'Solves the real-valued Sylvester equation AX+XB=C for X',
  examples: ['sylvester([[-1, -2], [1, 1]], [[-2, 1], [-1, 2]], [[-3, 2], [3, 0]])', 'sylvester(A,B,C)'],
  seealso: ['schur', 'lyap']
};
exports.sylvesterDocs = sylvesterDocs;