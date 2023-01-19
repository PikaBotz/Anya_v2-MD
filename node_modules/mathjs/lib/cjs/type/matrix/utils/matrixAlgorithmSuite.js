"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMatrixAlgorithmSuite = void 0;
var _factory = require("../../../utils/factory.js");
var _object = require("../../../utils/object.js");
var _matAlgo13xDD = require("./matAlgo13xDD.js");
var _matAlgo14xDs = require("./matAlgo14xDs.js");
var name = 'matrixAlgorithmSuite';
var dependencies = ['typed', 'matrix'];
var createMatrixAlgorithmSuite = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
    matrix = _ref.matrix;
  var matAlgo13xDD = (0, _matAlgo13xDD.createMatAlgo13xDD)({
    typed: typed
  });
  var matAlgo14xDs = (0, _matAlgo14xDs.createMatAlgo14xDs)({
    typed: typed
  });

  /**
   * Return a signatures object with the usual boilerplate of
   * matrix algorithms, based on a plain options object with the
   * following properties:
   *   elop: function -- the elementwise operation to use, defaults to self
   *   SS: function -- the algorithm to apply for two sparse matrices
   *   DS: function -- the algorithm to apply for a dense and a sparse matrix
   *   SD: function -- algo for a sparse and a dense; defaults to SD flipped
   *   Ss: function -- the algorithm to apply for a sparse matrix and scalar
   *   sS: function -- algo for scalar and sparse; defaults to Ss flipped
   *   scalar: string -- typed-function type for scalars, defaults to 'any'
   *
   * If Ss is not specified, no matrix-scalar signatures are generated.
   *
   * @param {object} options
   * @return {Object<string, function>} signatures
   */
  return function matrixAlgorithmSuite(options) {
    var elop = options.elop;
    var SD = options.SD || options.DS;
    var matrixSignatures;
    if (elop) {
      // First the dense ones
      matrixSignatures = {
        'DenseMatrix, DenseMatrix': function DenseMatrixDenseMatrix(x, y) {
          return matAlgo13xDD(x, y, elop);
        },
        'Array, Array': function ArrayArray(x, y) {
          return matAlgo13xDD(matrix(x), matrix(y), elop).valueOf();
        },
        'Array, DenseMatrix': function ArrayDenseMatrix(x, y) {
          return matAlgo13xDD(matrix(x), y, elop);
        },
        'DenseMatrix, Array': function DenseMatrixArray(x, y) {
          return matAlgo13xDD(x, matrix(y), elop);
        }
      };
      // Now incorporate sparse matrices
      if (options.SS) {
        matrixSignatures['SparseMatrix, SparseMatrix'] = function (x, y) {
          return options.SS(x, y, elop, false);
        };
      }
      if (options.DS) {
        matrixSignatures['DenseMatrix, SparseMatrix'] = function (x, y) {
          return options.DS(x, y, elop, false);
        };
        matrixSignatures['Array, SparseMatrix'] = function (x, y) {
          return options.DS(matrix(x), y, elop, false);
        };
      }
      if (SD) {
        matrixSignatures['SparseMatrix, DenseMatrix'] = function (x, y) {
          return SD(y, x, elop, true);
        };
        matrixSignatures['SparseMatrix, Array'] = function (x, y) {
          return SD(matrix(y), x, elop, true);
        };
      }
    } else {
      // No elop, use this
      // First the dense ones
      matrixSignatures = {
        'DenseMatrix, DenseMatrix': typed.referToSelf(function (self) {
          return function (x, y) {
            return matAlgo13xDD(x, y, self);
          };
        }),
        'Array, Array': typed.referToSelf(function (self) {
          return function (x, y) {
            return matAlgo13xDD(matrix(x), matrix(y), self).valueOf();
          };
        }),
        'Array, DenseMatrix': typed.referToSelf(function (self) {
          return function (x, y) {
            return matAlgo13xDD(matrix(x), y, self);
          };
        }),
        'DenseMatrix, Array': typed.referToSelf(function (self) {
          return function (x, y) {
            return matAlgo13xDD(x, matrix(y), self);
          };
        })
      };
      // Now incorporate sparse matrices
      if (options.SS) {
        matrixSignatures['SparseMatrix, SparseMatrix'] = typed.referToSelf(function (self) {
          return function (x, y) {
            return options.SS(x, y, self, false);
          };
        });
      }
      if (options.DS) {
        matrixSignatures['DenseMatrix, SparseMatrix'] = typed.referToSelf(function (self) {
          return function (x, y) {
            return options.DS(x, y, self, false);
          };
        });
        matrixSignatures['Array, SparseMatrix'] = typed.referToSelf(function (self) {
          return function (x, y) {
            return options.DS(matrix(x), y, self, false);
          };
        });
      }
      if (SD) {
        matrixSignatures['SparseMatrix, DenseMatrix'] = typed.referToSelf(function (self) {
          return function (x, y) {
            return SD(y, x, self, true);
          };
        });
        matrixSignatures['SparseMatrix, Array'] = typed.referToSelf(function (self) {
          return function (x, y) {
            return SD(matrix(y), x, self, true);
          };
        });
      }
    }

    // Now add the scalars
    var scalar = options.scalar || 'any';
    var Ds = options.Ds || options.Ss;
    if (Ds) {
      if (elop) {
        matrixSignatures['DenseMatrix,' + scalar] = function (x, y) {
          return matAlgo14xDs(x, y, elop, false);
        };
        matrixSignatures[scalar + ', DenseMatrix'] = function (x, y) {
          return matAlgo14xDs(y, x, elop, true);
        };
        matrixSignatures['Array,' + scalar] = function (x, y) {
          return matAlgo14xDs(matrix(x), y, elop, false).valueOf();
        };
        matrixSignatures[scalar + ', Array'] = function (x, y) {
          return matAlgo14xDs(matrix(y), x, elop, true).valueOf();
        };
      } else {
        matrixSignatures['DenseMatrix,' + scalar] = typed.referToSelf(function (self) {
          return function (x, y) {
            return matAlgo14xDs(x, y, self, false);
          };
        });
        matrixSignatures[scalar + ', DenseMatrix'] = typed.referToSelf(function (self) {
          return function (x, y) {
            return matAlgo14xDs(y, x, self, true);
          };
        });
        matrixSignatures['Array,' + scalar] = typed.referToSelf(function (self) {
          return function (x, y) {
            return matAlgo14xDs(matrix(x), y, self, false).valueOf();
          };
        });
        matrixSignatures[scalar + ', Array'] = typed.referToSelf(function (self) {
          return function (x, y) {
            return matAlgo14xDs(matrix(y), x, self, true).valueOf();
          };
        });
      }
    }
    var sS = options.sS !== undefined ? options.sS : options.Ss;
    if (elop) {
      if (options.Ss) {
        matrixSignatures['SparseMatrix,' + scalar] = function (x, y) {
          return options.Ss(x, y, elop, false);
        };
      }
      if (sS) {
        matrixSignatures[scalar + ', SparseMatrix'] = function (x, y) {
          return sS(y, x, elop, true);
        };
      }
    } else {
      if (options.Ss) {
        matrixSignatures['SparseMatrix,' + scalar] = typed.referToSelf(function (self) {
          return function (x, y) {
            return options.Ss(x, y, self, false);
          };
        });
      }
      if (sS) {
        matrixSignatures[scalar + ', SparseMatrix'] = typed.referToSelf(function (self) {
          return function (x, y) {
            return sS(y, x, self, true);
          };
        });
      }
    }
    // Also pull in the scalar signatures if the operator is a typed function
    if (elop && elop.signatures) {
      (0, _object.extend)(matrixSignatures, elop.signatures);
    }
    return matrixSignatures;
  };
});
exports.createMatrixAlgorithmSuite = createMatrixAlgorithmSuite;