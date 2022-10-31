"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGcd = void 0;
var _factory = require("../../utils/factory.js");
var _matAlgo01xDSid = require("../../type/matrix/utils/matAlgo01xDSid.js");
var _matAlgo04xSidSid = require("../../type/matrix/utils/matAlgo04xSidSid.js");
var _matAlgo10xSids = require("../../type/matrix/utils/matAlgo10xSids.js");
var _matrixAlgorithmSuite = require("../../type/matrix/utils/matrixAlgorithmSuite.js");
var _index = require("../../plain/number/index.js");
var name = 'gcd';
var dependencies = ['typed', 'matrix', 'equalScalar', 'BigNumber', 'DenseMatrix'];
var createGcd = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
    matrix = _ref.matrix,
    equalScalar = _ref.equalScalar,
    BigNumber = _ref.BigNumber,
    DenseMatrix = _ref.DenseMatrix;
  var matAlgo01xDSid = (0, _matAlgo01xDSid.createMatAlgo01xDSid)({
    typed: typed
  });
  var matAlgo04xSidSid = (0, _matAlgo04xSidSid.createMatAlgo04xSidSid)({
    typed: typed,
    equalScalar: equalScalar
  });
  var matAlgo10xSids = (0, _matAlgo10xSids.createMatAlgo10xSids)({
    typed: typed,
    DenseMatrix: DenseMatrix
  });
  var matrixAlgorithmSuite = (0, _matrixAlgorithmSuite.createMatrixAlgorithmSuite)({
    typed: typed,
    matrix: matrix
  });
  var gcdTypes = 'number | BigNumber | Fraction | Matrix | Array';
  var gcdManySignature = {};
  gcdManySignature["".concat(gcdTypes, ", ").concat(gcdTypes, ", ...").concat(gcdTypes)] = typed.referToSelf(function (self) {
    return function (a, b, args) {
      var res = self(a, b);
      for (var i = 0; i < args.length; i++) {
        res = self(res, args[i]);
      }
      return res;
    };
  });

  /**
   * Calculate the greatest common divisor for two or more values or arrays.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.gcd(a, b)
   *    math.gcd(a, b, c, ...)
   *
   * Examples:
   *
   *    math.gcd(8, 12)              // returns 4
   *    math.gcd(-4, 6)              // returns 2
   *    math.gcd(25, 15, -10)        // returns 5
   *
   *    math.gcd([8, -4], [12, 6])   // returns [4, 2]
   *
   * See also:
   *
   *    lcm, xgcd
   *
   * @param {... number | BigNumber | Fraction | Array | Matrix} args  Two or more integer numbers
   * @return {number | BigNumber | Fraction | Array | Matrix}                           The greatest common divisor
   */
  return typed(name, {
    'number, number': _index.gcdNumber,
    'BigNumber, BigNumber': _gcdBigNumber,
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.gcd(y);
    }
  }, matrixAlgorithmSuite({
    SS: matAlgo04xSidSid,
    DS: matAlgo01xDSid,
    Ss: matAlgo10xSids
  }), gcdManySignature);

  /**
   * Calculate gcd for BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} Returns greatest common denominator of a and b
   * @private
   */
  function _gcdBigNumber(a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function gcd must be integer numbers');
    }

    // https://en.wikipedia.org/wiki/Euclidean_algorithm
    var zero = new BigNumber(0);
    while (!b.isZero()) {
      var r = a.mod(b);
      a = b;
      b = r;
    }
    return a.lt(zero) ? a.neg() : a;
  }
});
exports.createGcd = createGcd;