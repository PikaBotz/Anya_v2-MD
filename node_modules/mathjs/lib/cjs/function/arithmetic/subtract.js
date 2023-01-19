"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSubtract = void 0;
var _factory = require("../../utils/factory.js");
var _matAlgo01xDSid = require("../../type/matrix/utils/matAlgo01xDSid.js");
var _matAlgo03xDSf = require("../../type/matrix/utils/matAlgo03xDSf.js");
var _matAlgo05xSfSf = require("../../type/matrix/utils/matAlgo05xSfSf.js");
var _matAlgo10xSids = require("../../type/matrix/utils/matAlgo10xSids.js");
var _matAlgo12xSfs = require("../../type/matrix/utils/matAlgo12xSfs.js");
var _matrixAlgorithmSuite = require("../../type/matrix/utils/matrixAlgorithmSuite.js");
var name = 'subtract';
var dependencies = ['typed', 'matrix', 'equalScalar', 'addScalar', 'unaryMinus', 'DenseMatrix'];
var createSubtract = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
    matrix = _ref.matrix,
    equalScalar = _ref.equalScalar,
    addScalar = _ref.addScalar,
    unaryMinus = _ref.unaryMinus,
    DenseMatrix = _ref.DenseMatrix;
  // TODO: split function subtract in two: subtract and subtractScalar

  var matAlgo01xDSid = (0, _matAlgo01xDSid.createMatAlgo01xDSid)({
    typed: typed
  });
  var matAlgo03xDSf = (0, _matAlgo03xDSf.createMatAlgo03xDSf)({
    typed: typed
  });
  var matAlgo05xSfSf = (0, _matAlgo05xSfSf.createMatAlgo05xSfSf)({
    typed: typed,
    equalScalar: equalScalar
  });
  var matAlgo10xSids = (0, _matAlgo10xSids.createMatAlgo10xSids)({
    typed: typed,
    DenseMatrix: DenseMatrix
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
   * Subtract two values, `x - y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.subtract(x, y)
   *
   * Examples:
   *
   *    math.subtract(5.3, 2)        // returns number 3.3
   *
   *    const a = math.complex(2, 3)
   *    const b = math.complex(4, 1)
   *    math.subtract(a, b)          // returns Complex -2 + 2i
   *
   *    math.subtract([5, 7, 4], 4)  // returns Array [1, 3, 0]
   *
   *    const c = math.unit('2.1 km')
   *    const d = math.unit('500m')
   *    math.subtract(c, d)          // returns Unit 1.6 km
   *
   * See also:
   *
   *    add
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x
   *            Initial value
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y
   *            Value to subtract from `x`
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}
   *            Subtraction of `x` and `y`
   */
  return typed(name, {
    'number, number': function numberNumber(x, y) {
      return x - y;
    },
    'Complex, Complex': function ComplexComplex(x, y) {
      return x.sub(y);
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return x.minus(y);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.sub(y);
    },
    'Unit, Unit': typed.referToSelf(function (self) {
      return function (x, y) {
        if (x.value === null) {
          throw new Error('Parameter x contains a unit with undefined value');
        }
        if (y.value === null) {
          throw new Error('Parameter y contains a unit with undefined value');
        }
        if (!x.equalBase(y)) {
          throw new Error('Units do not match');
        }
        var res = x.clone();
        res.value = typed.find(self, [res.valueType(), y.valueType()])(res.value, y.value);
        res.fixPrefix = false;
        return res;
      };
    })
  }, matrixAlgorithmSuite({
    SS: matAlgo05xSfSf,
    DS: matAlgo01xDSid,
    SD: matAlgo03xDSf,
    Ss: matAlgo12xSfs,
    sS: matAlgo10xSids
  }));
});
exports.createSubtract = createSubtract;