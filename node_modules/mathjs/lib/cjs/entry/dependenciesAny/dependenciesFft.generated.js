"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fftDependencies = void 0;
var _dependenciesAddScalarGenerated = require("./dependenciesAddScalar.generated.js");
var _dependenciesDivideScalarGenerated = require("./dependenciesDivideScalar.generated.js");
var _dependenciesExpGenerated = require("./dependenciesExp.generated.js");
var _dependenciesIGenerated = require("./dependenciesI.generated.js");
var _dependenciesMatrixGenerated = require("./dependenciesMatrix.generated.js");
var _dependenciesMultiplyScalarGenerated = require("./dependenciesMultiplyScalar.generated.js");
var _dependenciesTauGenerated = require("./dependenciesTau.generated.js");
var _dependenciesTypedGenerated = require("./dependenciesTyped.generated.js");
var _factoriesAny = require("../../factoriesAny.js");
/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */

var fftDependencies = {
  addScalarDependencies: _dependenciesAddScalarGenerated.addScalarDependencies,
  divideScalarDependencies: _dependenciesDivideScalarGenerated.divideScalarDependencies,
  expDependencies: _dependenciesExpGenerated.expDependencies,
  iDependencies: _dependenciesIGenerated.iDependencies,
  matrixDependencies: _dependenciesMatrixGenerated.matrixDependencies,
  multiplyScalarDependencies: _dependenciesMultiplyScalarGenerated.multiplyScalarDependencies,
  tauDependencies: _dependenciesTauGenerated.tauDependencies,
  typedDependencies: _dependenciesTypedGenerated.typedDependencies,
  createFft: _factoriesAny.createFft
};
exports.fftDependencies = fftDependencies;