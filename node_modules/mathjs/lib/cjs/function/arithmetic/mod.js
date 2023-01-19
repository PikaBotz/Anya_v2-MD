"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMod = void 0;
var _factory = require("../../utils/factory.js");
var _matAlgo02xDS = require("../../type/matrix/utils/matAlgo02xDS0.js");
var _matAlgo03xDSf = require("../../type/matrix/utils/matAlgo03xDSf.js");
var _matAlgo05xSfSf = require("../../type/matrix/utils/matAlgo05xSfSf.js");
var _matAlgo11xS0s = require("../../type/matrix/utils/matAlgo11xS0s.js");
var _matAlgo12xSfs = require("../../type/matrix/utils/matAlgo12xSfs.js");
var _index = require("../../plain/number/index.js");
var _matrixAlgorithmSuite = require("../../type/matrix/utils/matrixAlgorithmSuite.js");
var name = 'mod';
var dependencies = ['typed', 'matrix', 'equalScalar', 'DenseMatrix'];
var createMod = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
    matrix = _ref.matrix,
    equalScalar = _ref.equalScalar,
    DenseMatrix = _ref.DenseMatrix;
  var matAlgo02xDS0 = (0, _matAlgo02xDS.createMatAlgo02xDS0)({
    typed: typed,
    equalScalar: equalScalar
  });
  var matAlgo03xDSf = (0, _matAlgo03xDSf.createMatAlgo03xDSf)({
    typed: typed
  });
  var matAlgo05xSfSf = (0, _matAlgo05xSfSf.createMatAlgo05xSfSf)({
    typed: typed,
    equalScalar: equalScalar
  });
  var matAlgo11xS0s = (0, _matAlgo11xS0s.createMatAlgo11xS0s)({
    typed: typed,
    equalScalar: equalScalar
  });
  var matAlgo12xSfs = (0, _matAlgo12xSfs.createMatAlgo12xSfs)({
    typed: typed,
    DenseMatrix: DenseMatrix
  });
  var matrixAlgorithmSuite = (0, _matrixAlgorithmSuite.createMatrixAlgorithmSuite)({
    typed: typed,
    matrix: matrix
  });

  /**
   * Calculates the modulus, the remainder of an integer division.
   *
   * For matrices, the function is evaluated element wise.
   *
   * The modulus is defined as:
   *
   *     x - y * floor(x / y)
   *
   * See https://en.wikipedia.org/wiki/Modulo_operation.
   *
   * Syntax:
   *
   *    math.mod(x, y)
   *
   * Examples:
   *
   *    math.mod(8, 3)                // returns 2
   *    math.mod(11, 2)               // returns 1
   *
   *    function isOdd(x) {
   *      return math.mod(x, 2) != 0
   *    }
   *
   *    isOdd(2)                      // returns false
   *    isOdd(3)                      // returns true
   *
   * See also:
   *
   *    divide
   *
   * @param  {number | BigNumber | Fraction | Array | Matrix} x Dividend
   * @param  {number | BigNumber | Fraction | Array | Matrix} y Divisor
   * @return {number | BigNumber | Fraction | Array | Matrix} Returns the remainder of `x` divided by `y`.
   */
  return typed(name, {
    'number, number': _index.modNumber,
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      if (y.isNeg()) {
        throw new Error('Cannot calculate mod for a negative divisor');
      }
      return y.isZero() ? x : x.mod(y);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      if (y.compare(0) < 0) {
        throw new Error('Cannot calculate mod for a negative divisor');
      }
      // Workaround suggested in Fraction.js library to calculate correct modulo for negative dividend
      return x.compare(0) >= 0 ? x.mod(y) : x.mod(y).add(y).mod(y);
    }
  }, matrixAlgorithmSuite({
    SS: matAlgo05xSfSf,
    DS: matAlgo03xDSf,
    SD: matAlgo02xDS0,
    Ss: matAlgo11xS0s,
    sS: matAlgo12xSfs
  }));
});
exports.createMod = createMod;