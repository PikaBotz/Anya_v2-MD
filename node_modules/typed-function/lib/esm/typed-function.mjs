function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function ok() {
  return true;
}

function notOk() {
  return false;
}

function undef() {
  return undefined;
}

var NOT_TYPED_FUNCTION = 'Argument is not a typed-function.';
/**
 * @typedef {{
 *   params: Param[],
 *   fn: function,
 *   test: function,
 *   implementation: function
 * }} Signature
 *
 * @typedef {{
 *   types: Type[],
 *   hasAny: boolean,
 *   hasConversion: boolean,
 *   restParam: boolean
 * }} Param
 *
 * @typedef {{
 *   name: string,
 *   typeIndex: number,
 *   test: function,
 *   isAny: boolean,
 *   conversion?: ConversionDef,
 *   conversionIndex: number,
 * }} Type
 *
 * @typedef {{
 *   from: string,
 *   to: string,
 *   convert: function (*) : *
 * }} ConversionDef
 *
 * @typedef {{
 *   name: string,
 *   test: function(*) : boolean,
 *   isAny?: boolean
 * }} TypeDef
 */

/**
 * @returns {() => function}
 */

function create() {
  // data type tests

  /**
   * Returns true if the argument is a non-null "plain" object
   */
  function isPlainObject(x) {
    return _typeof(x) === 'object' && x !== null && x.constructor === Object;
  }

  var _types = [{
    name: 'number',
    test: function test(x) {
      return typeof x === 'number';
    }
  }, {
    name: 'string',
    test: function test(x) {
      return typeof x === 'string';
    }
  }, {
    name: 'boolean',
    test: function test(x) {
      return typeof x === 'boolean';
    }
  }, {
    name: 'Function',
    test: function test(x) {
      return typeof x === 'function';
    }
  }, {
    name: 'Array',
    test: Array.isArray
  }, {
    name: 'Date',
    test: function test(x) {
      return x instanceof Date;
    }
  }, {
    name: 'RegExp',
    test: function test(x) {
      return x instanceof RegExp;
    }
  }, {
    name: 'Object',
    test: isPlainObject
  }, {
    name: 'null',
    test: function test(x) {
      return x === null;
    }
  }, {
    name: 'undefined',
    test: function test(x) {
      return x === undefined;
    }
  }];
  var anyType = {
    name: 'any',
    test: ok,
    isAny: true
  }; // Data structures to track the types. As these are local variables in
  // create(), each typed universe will get its own copy, but the variables
  // will only be accessible through the (closures of the) functions supplied
  // as properties of the typed object, not directly.
  // These will be initialized in clear() below

  var typeMap; // primary store of all types

  var typeList; // Array of just type names, for the sake of ordering
  // And similar data structures for the type conversions:

  var nConversions = 0; // the actual conversions are stored on a property of the destination types
  // This is a temporary object, will be replaced with a function at the end

  var typed = {
    createCount: 0
  };
  /**
   * Takes a type name and returns the corresponding official type object
   * for that type.
   *
   * @param {string} typeName
   * @returns {TypeDef} type
   */

  function findType(typeName) {
    var type = typeMap.get(typeName);

    if (type) {
      return type;
    } // Remainder is error handling


    var message = 'Unknown type "' + typeName + '"';
    var name = typeName.toLowerCase();
    var otherName;

    var _iterator = _createForOfIteratorHelper(typeList),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        otherName = _step.value;

        if (otherName.toLowerCase() === name) {
          message += '. Did you mean "' + otherName + '" ?';
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    throw new TypeError(message);
  }
  /**
   * Adds an array `types` of type definitions to this typed instance.
   * Each type definition should be an object with properties:
   * 'name' - a string giving the name of the type; 'test' - function
   * returning a boolean that tests membership in the type; and optionally
   * 'isAny' - true only for the 'any' type.
   *
   * The second optional argument, `before`, gives the name of a type that
   * these types should be added before. The new types are added in the
   * order specified.
   * @param {TypeDef[]} types
   * @param {string | boolean} [beforeSpec='any'] before
   */


  function addTypes(types) {
    var beforeSpec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'any';
    var beforeIndex = beforeSpec ? findType(beforeSpec).index : typeList.length;
    var newTypes = [];

    for (var i = 0; i < types.length; ++i) {
      if (!types[i] || typeof types[i].name !== 'string' || typeof types[i].test !== 'function') {
        throw new TypeError('Object with properties {name: string, test: function} expected');
      }

      var typeName = types[i].name;

      if (typeMap.has(typeName)) {
        throw new TypeError('Duplicate type name "' + typeName + '"');
      }

      newTypes.push(typeName);
      typeMap.set(typeName, {
        name: typeName,
        test: types[i].test,
        isAny: types[i].isAny,
        index: beforeIndex + i,
        conversionsTo: [] // Newly added type can't have any conversions to it

      });
    } // update the typeList


    var affectedTypes = typeList.slice(beforeIndex);
    typeList = typeList.slice(0, beforeIndex).concat(newTypes).concat(affectedTypes); // Fix the indices

    for (var _i = beforeIndex + newTypes.length; _i < typeList.length; ++_i) {
      typeMap.get(typeList[_i]).index = _i;
    }
  }
  /**
   * Removes all types and conversions from this typed instance.
   * May cause previously constructed typed-functions to throw
   * strange errors when they are called with types that do not
   * match any of their signatures.
   */


  function clear() {
    typeMap = new Map();
    typeList = [];
    nConversions = 0;
    addTypes([anyType], false);
  } // initialize the types to the default list


  clear();
  addTypes(_types);
  /**
   * Removes all conversions, leaving the types alone.
   */

  function clearConversions() {
    var typeName;

    var _iterator2 = _createForOfIteratorHelper(typeList),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        typeName = _step2.value;
        typeMap.get(typeName).conversionsTo = [];
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    nConversions = 0;
  }
  /**
   * Find the type names that match a value.
   * @param {*} value
   * @return {string[]} Array of names of types for which
   *                  the type test matches the value.
   */


  function findTypeNames(value) {
    var matches = typeList.filter(function (name) {
      var type = typeMap.get(name);
      return !type.isAny && type.test(value);
    });

    if (matches.length) {
      return matches;
    }

    return ['any'];
  }
  /**
   * Check if an entity is a typed function created by any instance
   * @param {any} entity
   * @returns {boolean}
   */


  function isTypedFunction(entity) {
    return entity && typeof entity === 'function' && '_typedFunctionData' in entity;
  }
  /**
   * Find a specific signature from a (composed) typed function, for example:
   *
   *   typed.findSignature(fn, ['number', 'string'])
   *   typed.findSignature(fn, 'number, string')
   *   typed.findSignature(fn, 'number,string', {exact: true})
   *
   * This function findSignature will by default return the best match to
   * the given signature, possibly employing type conversions.
   *
   * The (optional) third argument is a plain object giving options
   * controlling the signature search. Currently the only implemented
   * option is `exact`: if specified as true (default is false), only
   * exact matches will be returned (i.e. signatures for which `fn` was
   * directly defined). Note that a (possibly different) type matching
   * `any`, or one or more instances of TYPE matching `...TYPE` are
   * considered exact matches in this regard, as no conversions are used.
   *
   * This function returns a "signature" object, as does `typed.resolve()`,
   * which is a plain object with four keys: `params` (the array of parameters
   * for this signature), `fn` (the originally supplied function for this
   * signature), `test` (a generated function that determines if an argument
   * list matches this signature, and `implementation` (the function to call
   * on a matching argument list, that performs conversions if necessary and
   * then calls the originally supplied function).
   *
   * @param {Function} fn                   A typed-function
   * @param {string | string[]} signature
   *     Signature to be found, can be an array or a comma separated string.
   * @param {object} options  Controls the signature search as documented
   * @return {{ params: Param[], fn: function, test: function, implementation: function }}
   *     Returns the matching signature, or throws an error when no signature
   *     is found.
   */


  function findSignature(fn, signature, options) {
    if (!isTypedFunction(fn)) {
      throw new TypeError(NOT_TYPED_FUNCTION);
    } // Canonicalize input


    var exact = options && options.exact;
    var stringSignature = Array.isArray(signature) ? signature.join(',') : signature;
    var params = parseSignature(stringSignature);
    var canonicalSignature = stringifyParams(params); // First hope we get lucky and exactly match a signature

    if (!exact || canonicalSignature in fn.signatures) {
      // OK, we can check the internal signatures
      var match = fn._typedFunctionData.signatureMap.get(canonicalSignature);

      if (match) {
        return match;
      }
    } // Oh well, we did not; so we have to go back and check the parameters
    // one by one, in order to catch things like `any` and rest params.
    // Note here we can assume there is at least one parameter, because
    // the empty signature would have matched successfully above.


    var nParams = params.length;
    var remainingSignatures;

    if (exact) {
      remainingSignatures = [];
      var name;

      for (name in fn.signatures) {
        remainingSignatures.push(fn._typedFunctionData.signatureMap.get(name));
      }
    } else {
      remainingSignatures = fn._typedFunctionData.signatures;
    }

    for (var i = 0; i < nParams; ++i) {
      var want = params[i];
      var filteredSignatures = [];
      var possibility = void 0;

      var _iterator3 = _createForOfIteratorHelper(remainingSignatures),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          possibility = _step3.value;
          var have = getParamAtIndex(possibility.params, i);

          if (!have || want.restParam && !have.restParam) {
            continue;
          }

          if (!have.hasAny) {
            var _ret = function () {
              // have to check all of the wanted types are available
              var haveTypes = paramTypeSet(have);

              if (want.types.some(function (wtype) {
                return !haveTypes.has(wtype.name);
              })) {
                return "continue";
              }
            }();

            if (_ret === "continue") continue;
          } // OK, this looks good


          filteredSignatures.push(possibility);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      remainingSignatures = filteredSignatures;
      if (remainingSignatures.length === 0) break;
    } // Return the first remaining signature that was totally matched:


    var candidate;

    var _iterator4 = _createForOfIteratorHelper(remainingSignatures),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        candidate = _step4.value;

        if (candidate.params.length <= nParams) {
          return candidate;
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }

    throw new TypeError('Signature not found (signature: ' + (fn.name || 'unnamed') + '(' + stringifyParams(params, ', ') + '))');
  }
  /**
   * Find the proper function to call for a specific signature from
   * a (composed) typed function, for example:
   *
   *   typed.find(fn, ['number', 'string'])
   *   typed.find(fn, 'number, string')
   *   typed.find(fn, 'number,string', {exact: true})
   *
   * This function find will by default return the best match to
   * the given signature, possibly employing type conversions (and returning
   * a function that will perform those conversions as needed). The
   * (optional) third argument is a plain object giving options contolling
   * the signature search. Currently only the option `exact` is implemented,
   * which defaults to "false". If `exact` is specified as true, then only
   * exact matches will be returned (i.e. signatures for which `fn` was
   * directly defined). Uses of `any` and `...TYPE` are considered exact if
   * no conversions are necessary to apply the corresponding function.
   *
   * @param {Function} fn                   A typed-function
   * @param {string | string[]} signature
   *     Signature to be found, can be an array or a comma separated string.
   * @param {object} options  Controls the signature match as documented
   * @return {function}
   *     Returns the function to call for the given signature, or throws an
   *     error if no match is found.
   */


  function find(fn, signature, options) {
    return findSignature(fn, signature, options).implementation;
  }
  /**
   * Convert a given value to another data type, specified by type name.
   *
   * @param {*} value
   * @param {string} typeName
   */


  function convert(value, typeName) {
    // check conversion is needed
    var type = findType(typeName);

    if (type.test(value)) {
      return value;
    }

    var conversions = type.conversionsTo;

    if (conversions.length === 0) {
      throw new Error('There are no conversions to ' + typeName + ' defined.');
    }

    for (var i = 0; i < conversions.length; i++) {
      var fromType = findType(conversions[i].from);

      if (fromType.test(value)) {
        return conversions[i].convert(value);
      }
    }

    throw new Error('Cannot convert ' + value + ' to ' + typeName);
  }
  /**
   * Stringify parameters in a normalized way
   * @param {Param[]} params
   * @param {string} [','] separator
   * @return {string}
   */


  function stringifyParams(params) {
    var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';
    return params.map(function (p) {
      return p.name;
    }).join(separator);
  }
  /**
   * Parse a parameter, like "...number | boolean"
   * @param {string} param
   * @return {Param} param
   */


  function parseParam(param) {
    var restParam = param.indexOf('...') === 0;
    var types = !restParam ? param : param.length > 3 ? param.slice(3) : 'any';
    var typeDefs = types.split('|').map(function (s) {
      return findType(s.trim());
    });
    var hasAny = false;
    var paramName = restParam ? '...' : '';
    var exactTypes = typeDefs.map(function (type) {
      hasAny = type.isAny || hasAny;
      paramName += type.name + '|';
      return {
        name: type.name,
        typeIndex: type.index,
        test: type.test,
        isAny: type.isAny,
        conversion: null,
        conversionIndex: -1
      };
    });
    return {
      types: exactTypes,
      name: paramName.slice(0, -1),
      // remove trailing '|' from above
      hasAny: hasAny,
      hasConversion: false,
      restParam: restParam
    };
  }
  /**
   * Expands a parsed parameter with the types available from currently
   * defined conversions.
   * @param {Param} param
   * @return {Param} param
   */


  function expandParam(param) {
    var typeNames = param.types.map(function (t) {
      return t.name;
    });
    var matchingConversions = availableConversions(typeNames);
    var hasAny = param.hasAny;
    var newName = param.name;
    var convertibleTypes = matchingConversions.map(function (conversion) {
      var type = findType(conversion.from);
      hasAny = type.isAny || hasAny;
      newName += '|' + conversion.from;
      return {
        name: conversion.from,
        typeIndex: type.index,
        test: type.test,
        isAny: type.isAny,
        conversion: conversion,
        conversionIndex: conversion.index
      };
    });
    return {
      types: param.types.concat(convertibleTypes),
      name: newName,
      hasAny: hasAny,
      hasConversion: convertibleTypes.length > 0,
      restParam: param.restParam
    };
  }
  /**
   * Return the set of type names in a parameter.
   * Caches the result for efficiency
   *
   * @param {Param} param
   * @return {Set<string>} typenames
   */


  function paramTypeSet(param) {
    if (!param.typeSet) {
      param.typeSet = new Set();
      param.types.forEach(function (type) {
        return param.typeSet.add(type.name);
      });
    }

    return param.typeSet;
  }
  /**
   * Parse a signature with comma separated parameters,
   * like "number | boolean, ...string"
   *
   * @param {string} signature
   * @return {Param[]} params
   */


  function parseSignature(rawSignature) {
    var params = [];

    if (typeof rawSignature !== 'string') {
      throw new TypeError('Signatures must be strings');
    }

    var signature = rawSignature.trim();

    if (signature === '') {
      return params;
    }

    var rawParams = signature.split(',');

    for (var i = 0; i < rawParams.length; ++i) {
      var parsedParam = parseParam(rawParams[i].trim());

      if (parsedParam.restParam && i !== rawParams.length - 1) {
        throw new SyntaxError('Unexpected rest parameter "' + rawParams[i] + '": ' + 'only allowed for the last parameter');
      } // if invalid, short-circuit (all the types may have been filtered)


      if (parsedParam.types.length === 0) {
        return null;
      }

      params.push(parsedParam);
    }

    return params;
  }
  /**
   * Test whether a set of params contains a restParam
   * @param {Param[]} params
   * @return {boolean} Returns true when the last parameter is a restParam
   */


  function hasRestParam(params) {
    var param = last(params);
    return param ? param.restParam : false;
  }
  /**
   * Create a type test for a single parameter, which can have one or multiple
   * types.
   * @param {Param} param
   * @return {function(x: *) : boolean} Returns a test function
   */


  function compileTest(param) {
    if (!param || param.types.length === 0) {
      // nothing to do
      return ok;
    } else if (param.types.length === 1) {
      return findType(param.types[0].name).test;
    } else if (param.types.length === 2) {
      var test0 = findType(param.types[0].name).test;
      var test1 = findType(param.types[1].name).test;
      return function or(x) {
        return test0(x) || test1(x);
      };
    } else {
      // param.types.length > 2
      var tests = param.types.map(function (type) {
        return findType(type.name).test;
      });
      return function or(x) {
        for (var i = 0; i < tests.length; i++) {
          if (tests[i](x)) {
            return true;
          }
        }

        return false;
      };
    }
  }
  /**
   * Create a test for all parameters of a signature
   * @param {Param[]} params
   * @return {function(args: Array<*>) : boolean}
   */


  function compileTests(params) {
    var tests, test0, test1;

    if (hasRestParam(params)) {
      // variable arguments like '...number'
      tests = initial(params).map(compileTest);
      var varIndex = tests.length;
      var lastTest = compileTest(last(params));

      var testRestParam = function testRestParam(args) {
        for (var i = varIndex; i < args.length; i++) {
          if (!lastTest(args[i])) {
            return false;
          }
        }

        return true;
      };

      return function testArgs(args) {
        for (var i = 0; i < tests.length; i++) {
          if (!tests[i](args[i])) {
            return false;
          }
        }

        return testRestParam(args) && args.length >= varIndex + 1;
      };
    } else {
      // no variable arguments
      if (params.length === 0) {
        return function testArgs(args) {
          return args.length === 0;
        };
      } else if (params.length === 1) {
        test0 = compileTest(params[0]);
        return function testArgs(args) {
          return test0(args[0]) && args.length === 1;
        };
      } else if (params.length === 2) {
        test0 = compileTest(params[0]);
        test1 = compileTest(params[1]);
        return function testArgs(args) {
          return test0(args[0]) && test1(args[1]) && args.length === 2;
        };
      } else {
        // arguments.length > 2
        tests = params.map(compileTest);
        return function testArgs(args) {
          for (var i = 0; i < tests.length; i++) {
            if (!tests[i](args[i])) {
              return false;
            }
          }

          return args.length === tests.length;
        };
      }
    }
  }
  /**
   * Find the parameter at a specific index of a Params list.
   * Handles rest parameters.
   * @param {Param[]} params
   * @param {number} index
   * @return {Param | null} Returns the matching parameter when found,
   *                        null otherwise.
   */


  function getParamAtIndex(params, index) {
    return index < params.length ? params[index] : hasRestParam(params) ? last(params) : null;
  }
  /**
   * Get all type names of a parameter
   * @param {Params[]} params
   * @param {number} index
   * @return {string[]} Returns an array with type names
   */


  function getTypeSetAtIndex(params, index) {
    var param = getParamAtIndex(params, index);

    if (!param) {
      return new Set();
    }

    return paramTypeSet(param);
  }
  /**
   * Test whether a type is an exact type or conversion
   * @param {Type} type
   * @return {boolean} Returns true when
   */


  function isExactType(type) {
    return type.conversion === null || type.conversion === undefined;
  }
  /**
   * Helper function for creating error messages: create an array with
   * all available types on a specific argument index.
   * @param {Signature[]} signatures
   * @param {number} index
   * @return {string[]} Returns an array with available types
   */


  function mergeExpectedParams(signatures, index) {
    var typeSet = new Set();
    signatures.forEach(function (signature) {
      var paramSet = getTypeSetAtIndex(signature.params, index);
      var name;

      var _iterator5 = _createForOfIteratorHelper(paramSet),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          name = _step5.value;
          typeSet.add(name);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    });
    return typeSet.has('any') ? ['any'] : Array.from(typeSet);
  }
  /**
   * Create
   * @param {string} name             The name of the function
   * @param {array.<*>} args          The actual arguments passed to the function
   * @param {Signature[]} signatures  A list with available signatures
   * @return {TypeError} Returns a type error with additional data
   *                     attached to it in the property `data`
   */


  function createError(name, args, signatures) {
    var err, expected;

    var _name = name || 'unnamed'; // test for wrong type at some index


    var matchingSignatures = signatures;
    var index;

    var _loop = function _loop() {
      var nextMatchingDefs = [];
      matchingSignatures.forEach(function (signature) {
        var param = getParamAtIndex(signature.params, index);
        var test = compileTest(param);

        if ((index < signature.params.length || hasRestParam(signature.params)) && test(args[index])) {
          nextMatchingDefs.push(signature);
        }
      });

      if (nextMatchingDefs.length === 0) {
        // no matching signatures anymore, throw error "wrong type"
        expected = mergeExpectedParams(matchingSignatures, index);

        if (expected.length > 0) {
          var actualTypes = findTypeNames(args[index]);
          err = new TypeError('Unexpected type of argument in function ' + _name + ' (expected: ' + expected.join(' or ') + ', actual: ' + actualTypes.join(' | ') + ', index: ' + index + ')');
          err.data = {
            category: 'wrongType',
            fn: _name,
            index: index,
            actual: actualTypes,
            expected: expected
          };
          return {
            v: err
          };
        }
      } else {
        matchingSignatures = nextMatchingDefs;
      }
    };

    for (index = 0; index < args.length; index++) {
      var _ret2 = _loop();

      if (_typeof(_ret2) === "object") return _ret2.v;
    } // test for too few arguments


    var lengths = matchingSignatures.map(function (signature) {
      return hasRestParam(signature.params) ? Infinity : signature.params.length;
    });

    if (args.length < Math.min.apply(null, lengths)) {
      expected = mergeExpectedParams(matchingSignatures, index);
      err = new TypeError('Too few arguments in function ' + _name + ' (expected: ' + expected.join(' or ') + ', index: ' + args.length + ')');
      err.data = {
        category: 'tooFewArgs',
        fn: _name,
        index: args.length,
        expected: expected
      };
      return err;
    } // test for too many arguments


    var maxLength = Math.max.apply(null, lengths);

    if (args.length > maxLength) {
      err = new TypeError('Too many arguments in function ' + _name + ' (expected: ' + maxLength + ', actual: ' + args.length + ')');
      err.data = {
        category: 'tooManyArgs',
        fn: _name,
        index: args.length,
        expectedLength: maxLength
      };
      return err;
    } // Generic error


    var argTypes = [];

    for (var i = 0; i < args.length; ++i) {
      argTypes.push(findTypeNames(args[i]).join('|'));
    }

    err = new TypeError('Arguments of type "' + argTypes.join(', ') + '" do not match any of the defined signatures of function ' + _name + '.');
    err.data = {
      category: 'mismatch',
      actual: argTypes
    };
    return err;
  }
  /**
   * Find the lowest index of all exact types of a parameter (no conversions)
   * @param {Param} param
   * @return {number} Returns the index of the lowest type in typed.types
   */


  function getLowestTypeIndex(param) {
    var min = typeList.length + 1;

    for (var i = 0; i < param.types.length; i++) {
      if (isExactType(param.types[i])) {
        min = Math.min(min, param.types[i].typeIndex);
      }
    }

    return min;
  }
  /**
   * Find the lowest index of the conversion of all types of the parameter
   * having a conversion
   * @param {Param} param
   * @return {number} Returns the lowest index of the conversions of this type
   */


  function getLowestConversionIndex(param) {
    var min = nConversions + 1;

    for (var i = 0; i < param.types.length; i++) {
      if (!isExactType(param.types[i])) {
        min = Math.min(min, param.types[i].conversionIndex);
      }
    }

    return min;
  }
  /**
   * Compare two params
   * @param {Param} param1
   * @param {Param} param2
   * @return {number} returns -1 when param1 must get a lower
   *                  index than param2, 1 when the opposite,
   *                  or zero when both are equal
   */


  function compareParams(param1, param2) {
    // We compare a number of metrics on a param in turn:
    // 1) 'any' parameters are the least preferred
    if (param1.hasAny) {
      if (!param2.hasAny) {
        return 1;
      }
    } else if (param2.hasAny) {
      return -1;
    } // 2) Prefer non-rest to rest parameters


    if (param1.restParam) {
      if (!param2.restParam) {
        return 1;
      }
    } else if (param2.restParam) {
      return -1;
    } // 3) Prefer exact type match to conversions


    if (param1.hasConversion) {
      if (!param2.hasConversion) {
        return 1;
      }
    } else if (param2.hasConversion) {
      return -1;
    } // 4) Prefer lower type index:


    var typeDiff = getLowestTypeIndex(param1) - getLowestTypeIndex(param2);

    if (typeDiff < 0) {
      return -1;
    }

    if (typeDiff > 0) {
      return 1;
    } // 5) Prefer lower conversion index


    var convDiff = getLowestConversionIndex(param1) - getLowestConversionIndex(param2);

    if (convDiff < 0) {
      return -1;
    }

    if (convDiff > 0) {
      return 1;
    } // Don't have a basis for preference


    return 0;
  }
  /**
   * Compare two signatures
   * @param {Signature} signature1
   * @param {Signature} signature2
   * @return {number} returns a negative number when param1 must get a lower
   *                  index than param2, a positive number when the opposite,
   *                  or zero when both are equal
   */


  function compareSignatures(signature1, signature2) {
    var pars1 = signature1.params;
    var pars2 = signature2.params;
    var last1 = last(pars1);
    var last2 = last(pars2);
    var hasRest1 = hasRestParam(pars1);
    var hasRest2 = hasRestParam(pars2); // We compare a number of metrics on signatures in turn:
    // 1) An "any rest param" is least preferred

    if (hasRest1 && last1.hasAny) {
      if (!hasRest2 || !last2.hasAny) {
        return 1;
      }
    } else if (hasRest2 && last2.hasAny) {
      return -1;
    } // 2) Minimize the number of 'any' parameters


    var any1 = 0;
    var conv1 = 0;
    var par;

    var _iterator6 = _createForOfIteratorHelper(pars1),
        _step6;

    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        par = _step6.value;
        if (par.hasAny) ++any1;
        if (par.hasConversion) ++conv1;
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }

    var any2 = 0;
    var conv2 = 0;

    var _iterator7 = _createForOfIteratorHelper(pars2),
        _step7;

    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        par = _step7.value;
        if (par.hasAny) ++any2;
        if (par.hasConversion) ++conv2;
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }

    if (any1 !== any2) {
      return any1 - any2;
    } // 3) A conversion rest param is less preferred


    if (hasRest1 && last1.hasConversion) {
      if (!hasRest2 || !last2.hasConversion) {
        return 1;
      }
    } else if (hasRest2 && last2.hasConversion) {
      return -1;
    } // 4) Minimize the number of conversions


    if (conv1 !== conv2) {
      return conv1 - conv2;
    } // 5) Prefer no rest param


    if (hasRest1) {
      if (!hasRest2) {
        return 1;
      }
    } else if (hasRest2) {
      return -1;
    } // 6) Prefer shorter with rest param, longer without


    var lengthCriterion = (pars1.length - pars2.length) * (hasRest1 ? -1 : 1);

    if (lengthCriterion !== 0) {
      return lengthCriterion;
    } // Signatures are identical in each of the above metrics.
    // In particular, they are the same length.
    // We can therefore compare the parameters one by one.
    // First we count which signature has more preferred parameters.


    var comparisons = [];
    var tc = 0;

    for (var i = 0; i < pars1.length; ++i) {
      var thisComparison = compareParams(pars1[i], pars2[i]);
      comparisons.push(thisComparison);
      tc += thisComparison;
    }

    if (tc !== 0) {
      return tc;
    } // They have the same number of preferred parameters, so go by the
    // earliest parameter in which we have a preference.
    // In other words, dispatch is driven somewhat more by earlier
    // parameters than later ones.


    var c;

    for (var _i2 = 0, _comparisons = comparisons; _i2 < _comparisons.length; _i2++) {
      c = _comparisons[_i2];

      if (c !== 0) {
        return c;
      }
    } // It's a tossup:


    return 0;
  }
  /**
   * Produce a list of all conversions from distinct types to one of
   * the given types.
   *
   * @param {string[]} typeNames
   * @return {ConversionDef[]} Returns the conversions that are available
   *                        resulting in any given type (if any)
   */


  function availableConversions(typeNames) {
    if (typeNames.length === 0) {
      return [];
    }

    var types = typeNames.map(findType);

    if (typeNames.length > 1) {
      types.sort(function (t1, t2) {
        return t1.index - t2.index;
      });
    }

    var matches = types[0].conversionsTo;

    if (typeNames.length === 1) {
      return matches;
    }

    matches = matches.concat([]); // shallow copy the matches
    // Since the types are now in index order, we just want the first
    // occurrence of any from type:

    var knownTypes = new Set(typeNames);

    for (var i = 1; i < types.length; ++i) {
      var newMatch = void 0;

      var _iterator8 = _createForOfIteratorHelper(types[i].conversionsTo),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          newMatch = _step8.value;

          if (!knownTypes.has(newMatch.from)) {
            matches.push(newMatch);
            knownTypes.add(newMatch.from);
          }
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }

    return matches;
  }
  /**
   * Preprocess arguments before calling the original function:
   * - if needed convert the parameters
   * - in case of rest parameters, move the rest parameters into an Array
   * @param {Param[]} params
   * @param {function} fn
   * @return {function} Returns a wrapped function
   */


  function compileArgsPreprocessing(params, fn) {
    var fnConvert = fn; // TODO: can we make this wrapper function smarter/simpler?

    if (params.some(function (p) {
      return p.hasConversion;
    })) {
      var restParam = hasRestParam(params);
      var compiledConversions = params.map(compileArgConversion);

      fnConvert = function convertArgs() {
        var args = [];
        var last = restParam ? arguments.length - 1 : arguments.length;

        for (var i = 0; i < last; i++) {
          args[i] = compiledConversions[i](arguments[i]);
        }

        if (restParam) {
          args[last] = arguments[last].map(compiledConversions[last]);
        }

        return fn.apply(this, args);
      };
    }

    var fnPreprocess = fnConvert;

    if (hasRestParam(params)) {
      var offset = params.length - 1;

      fnPreprocess = function preprocessRestParams() {
        return fnConvert.apply(this, slice(arguments, 0, offset).concat([slice(arguments, offset)]));
      };
    }

    return fnPreprocess;
  }
  /**
   * Compile conversion for a parameter to the right type
   * @param {Param} param
   * @return {function} Returns the wrapped function that will convert arguments
   *
   */


  function compileArgConversion(param) {
    var test0, test1, conversion0, conversion1;
    var tests = [];
    var conversions = [];
    param.types.forEach(function (type) {
      if (type.conversion) {
        tests.push(findType(type.conversion.from).test);
        conversions.push(type.conversion.convert);
      }
    }); // create optimized conversion functions depending on the number of conversions

    switch (conversions.length) {
      case 0:
        return function convertArg(arg) {
          return arg;
        };

      case 1:
        test0 = tests[0];
        conversion0 = conversions[0];
        return function convertArg(arg) {
          if (test0(arg)) {
            return conversion0(arg);
          }

          return arg;
        };

      case 2:
        test0 = tests[0];
        test1 = tests[1];
        conversion0 = conversions[0];
        conversion1 = conversions[1];
        return function convertArg(arg) {
          if (test0(arg)) {
            return conversion0(arg);
          }

          if (test1(arg)) {
            return conversion1(arg);
          }

          return arg;
        };

      default:
        return function convertArg(arg) {
          for (var i = 0; i < conversions.length; i++) {
            if (tests[i](arg)) {
              return conversions[i](arg);
            }
          }

          return arg;
        };
    }
  }
  /**
   * Split params with union types in to separate params.
   *
   * For example:
   *
   *     splitParams([['Array', 'Object'], ['string', 'RegExp'])
   *     // returns:
   *     // [
   *     //   ['Array', 'string'],
   *     //   ['Array', 'RegExp'],
   *     //   ['Object', 'string'],
   *     //   ['Object', 'RegExp']
   *     // ]
   *
   * @param {Param[]} params
   * @return {Param[]}
   */


  function splitParams(params) {
    function _splitParams(params, index, paramsSoFar) {
      if (index < params.length) {
        var param = params[index];
        var resultingParams = [];

        if (param.restParam) {
          // split the types of a rest parameter in two:
          // one with only exact types, and one with exact types and conversions
          var exactTypes = param.types.filter(isExactType);

          if (exactTypes.length < param.types.length) {
            resultingParams.push({
              types: exactTypes,
              name: '...' + exactTypes.map(function (t) {
                return t.name;
              }).join('|'),
              hasAny: exactTypes.some(function (t) {
                return t.isAny;
              }),
              hasConversion: false,
              restParam: true
            });
          }

          resultingParams.push(param);
        } else {
          // split all the types of a regular parameter into one type per param
          resultingParams = param.types.map(function (type) {
            return {
              types: [type],
              name: type.name,
              hasAny: type.isAny,
              hasConversion: type.conversion,
              restParam: false
            };
          });
        } // recurse over the groups with types


        return flatMap(resultingParams, function (nextParam) {
          return _splitParams(params, index + 1, paramsSoFar.concat([nextParam]));
        });
      } else {
        // we've reached the end of the parameters.
        return [paramsSoFar];
      }
    }

    return _splitParams(params, 0, []);
  }
  /**
   * Test whether two param lists represent conflicting signatures
   * @param {Param[]} params1
   * @param {Param[]} params2
   * @return {boolean} Returns true when the signatures conflict, false otherwise.
   */


  function conflicting(params1, params2) {
    var ii = Math.max(params1.length, params2.length);

    for (var i = 0; i < ii; i++) {
      var typeSet1 = getTypeSetAtIndex(params1, i);
      var typeSet2 = getTypeSetAtIndex(params2, i);
      var overlap = false;
      var name = void 0;

      var _iterator9 = _createForOfIteratorHelper(typeSet2),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          name = _step9.value;

          if (typeSet1.has(name)) {
            overlap = true;
            break;
          }
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      if (!overlap) {
        return false;
      }
    }

    var len1 = params1.length;
    var len2 = params2.length;
    var restParam1 = hasRestParam(params1);
    var restParam2 = hasRestParam(params2);
    return restParam1 ? restParam2 ? len1 === len2 : len2 >= len1 : restParam2 ? len1 >= len2 : len1 === len2;
  }
  /**
   * Helper function for `resolveReferences` that returns a copy of
   * functionList wihe any prior resolutions cleared out, in case we are
   * recycling signatures from a prior typed function construction.
   *
   * @param {Array.<function|typed-reference>} functionList
   * @return {Array.<function|typed-reference>}
   */


  function clearResolutions(functionList) {
    return functionList.map(function (fn) {
      if (isReferToSelf(fn)) {
        return referToSelf(fn.referToSelf.callback);
      }

      if (isReferTo(fn)) {
        return makeReferTo(fn.referTo.references, fn.referTo.callback);
      }

      return fn;
    });
  }
  /**
   * Take a list of references, a list of functions functionList, and a
   * signatureMap indexing signatures into functionList, and return
   * the list of resolutions, or a false-y value if they don't all
   * resolve in a valid way (yet).
   *
   * @param {string[]} references
   * @param {Array<function|typed-reference} functionList
   * @param {Object.<string, integer>} signatureMap
   * @return {function[] | false} resolutions
   */


  function collectResolutions(references, functionList, signatureMap) {
    var resolvedReferences = [];
    var reference;

    var _iterator10 = _createForOfIteratorHelper(references),
        _step10;

    try {
      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
        reference = _step10.value;
        var resolution = signatureMap[reference];

        if (typeof resolution !== 'number') {
          throw new TypeError('No definition for referenced signature "' + reference + '"');
        }

        resolution = functionList[resolution];

        if (typeof resolution !== 'function') {
          return false;
        }

        resolvedReferences.push(resolution);
      }
    } catch (err) {
      _iterator10.e(err);
    } finally {
      _iterator10.f();
    }

    return resolvedReferences;
  }
  /**
   * Resolve any references in the functionList for the typed function
   * itself. The signatureMap tells which index in the functionList a
   * given signature should be mapped to (for use in resolving typed.referTo)
   * and self provides the destions of a typed.referToSelf.
   *
   * @param {Array<function | typed-reference-object>} functionList
   * @param {Object.<string, function>} signatureMap
   * @param {function} self  The typed-function itself
   * @return {Array<function>} The list of resolved functions
   */


  function resolveReferences(functionList, signatureMap, self) {
    var resolvedFunctions = clearResolutions(functionList);
    var isResolved = new Array(resolvedFunctions.length).fill(false);
    var leftUnresolved = true;

    while (leftUnresolved) {
      leftUnresolved = false;
      var nothingResolved = true;

      for (var i = 0; i < resolvedFunctions.length; ++i) {
        if (isResolved[i]) continue;
        var fn = resolvedFunctions[i];

        if (isReferToSelf(fn)) {
          resolvedFunctions[i] = fn.referToSelf.callback(self); // Preserve reference in case signature is reused someday:

          resolvedFunctions[i].referToSelf = fn.referToSelf;
          isResolved[i] = true;
          nothingResolved = false;
        } else if (isReferTo(fn)) {
          var resolvedReferences = collectResolutions(fn.referTo.references, resolvedFunctions, signatureMap);

          if (resolvedReferences) {
            resolvedFunctions[i] = fn.referTo.callback.apply(this, resolvedReferences); // Preserve reference in case signature is reused someday:

            resolvedFunctions[i].referTo = fn.referTo;
            isResolved[i] = true;
            nothingResolved = false;
          } else {
            leftUnresolved = true;
          }
        }
      }

      if (nothingResolved && leftUnresolved) {
        throw new SyntaxError('Circular reference detected in resolving typed.referTo');
      }
    }

    return resolvedFunctions;
  }
  /**
   * Validate whether any of the function bodies contains a self-reference
   * usage like `this(...)` or `this.signatures`. This self-referencing is
   * deprecated since typed-function v3. It has been replaced with
   * the functions typed.referTo and typed.referToSelf.
   * @param {Object.<string, function>} signaturesMap
   */


  function validateDeprecatedThis(signaturesMap) {
    // TODO: remove this deprecation warning logic some day (it's introduced in v3)
    // match occurrences like 'this(' and 'this.signatures'
    var deprecatedThisRegex = /\bthis(\(|\.signatures\b)/;
    Object.keys(signaturesMap).forEach(function (signature) {
      var fn = signaturesMap[signature];

      if (deprecatedThisRegex.test(fn.toString())) {
        throw new SyntaxError('Using `this` to self-reference a function ' + 'is deprecated since typed-function@3. ' + 'Use typed.referTo and typed.referToSelf instead.');
      }
    });
  }
  /**
   * Create a typed function
   * @param {String} name               The name for the typed function
   * @param {Object.<string, function>} rawSignaturesMap
   *                                    An object with one or
   *                                    multiple signatures as key, and the
   *                                    function corresponding to the
   *                                    signature as value.
   * @return {function}  Returns the created typed function.
   */


  function createTypedFunction(name, rawSignaturesMap) {
    typed.createCount++;

    if (Object.keys(rawSignaturesMap).length === 0) {
      throw new SyntaxError('No signatures provided');
    }

    if (typed.warnAgainstDeprecatedThis) {
      validateDeprecatedThis(rawSignaturesMap);
    } // Main processing loop for signatures


    var parsedParams = [];
    var originalFunctions = [];
    var signaturesMap = {};
    var preliminarySignatures = []; // may have duplicates from conversions

    var signature;

    var _loop2 = function _loop2() {
      // A) Protect against polluted Object prototype:
      if (!Object.prototype.hasOwnProperty.call(rawSignaturesMap, signature)) {
        return "continue";
      } // B) Parse the signature


      var params = parseSignature(signature);
      if (!params) return "continue"; // C) Check for conflicts

      parsedParams.forEach(function (pp) {
        if (conflicting(pp, params)) {
          throw new TypeError('Conflicting signatures "' + stringifyParams(pp) + '" and "' + stringifyParams(params) + '".');
        }
      });
      parsedParams.push(params); // D) Store the provided function and add conversions

      var functionIndex = originalFunctions.length;
      originalFunctions.push(rawSignaturesMap[signature]);
      var conversionParams = params.map(expandParam); // E) Split the signatures and collect them up

      var sp = void 0;

      var _iterator11 = _createForOfIteratorHelper(splitParams(conversionParams)),
          _step11;

      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          sp = _step11.value;
          var spName = stringifyParams(sp);
          preliminarySignatures.push({
            params: sp,
            name: spName,
            fn: functionIndex
          });

          if (sp.every(function (p) {
            return !p.hasConversion;
          })) {
            signaturesMap[spName] = functionIndex;
          }
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }
    };

    for (signature in rawSignaturesMap) {
      var _ret3 = _loop2();

      if (_ret3 === "continue") continue;
    }

    preliminarySignatures.sort(compareSignatures); // Note the forward reference to theTypedFn

    var resolvedFunctions = resolveReferences(originalFunctions, signaturesMap, theTypedFn); // Fill in the proper function for each signature

    var s;

    for (s in signaturesMap) {
      if (Object.prototype.hasOwnProperty.call(signaturesMap, s)) {
        signaturesMap[s] = resolvedFunctions[signaturesMap[s]];
      }
    }

    var signatures = [];
    var internalSignatureMap = new Map(); // benchmarks faster than object

    for (var _i3 = 0, _preliminarySignature = preliminarySignatures; _i3 < _preliminarySignature.length; _i3++) {
      s = _preliminarySignature[_i3];

      // Note it's only safe to eliminate duplicates like this
      // _after_ the signature sorting step above; otherwise we might
      // remove the wrong one.
      if (!internalSignatureMap.has(s.name)) {
        s.fn = resolvedFunctions[s.fn];
        signatures.push(s);
        internalSignatureMap.set(s.name, s);
      }
    } // we create a highly optimized checks for the first couple of signatures with max 2 arguments


    var ok0 = signatures[0] && signatures[0].params.length <= 2 && !hasRestParam(signatures[0].params);
    var ok1 = signatures[1] && signatures[1].params.length <= 2 && !hasRestParam(signatures[1].params);
    var ok2 = signatures[2] && signatures[2].params.length <= 2 && !hasRestParam(signatures[2].params);
    var ok3 = signatures[3] && signatures[3].params.length <= 2 && !hasRestParam(signatures[3].params);
    var ok4 = signatures[4] && signatures[4].params.length <= 2 && !hasRestParam(signatures[4].params);
    var ok5 = signatures[5] && signatures[5].params.length <= 2 && !hasRestParam(signatures[5].params);
    var allOk = ok0 && ok1 && ok2 && ok3 && ok4 && ok5; // compile the tests

    for (var i = 0; i < signatures.length; ++i) {
      signatures[i].test = compileTests(signatures[i].params);
    }

    var test00 = ok0 ? compileTest(signatures[0].params[0]) : notOk;
    var test10 = ok1 ? compileTest(signatures[1].params[0]) : notOk;
    var test20 = ok2 ? compileTest(signatures[2].params[0]) : notOk;
    var test30 = ok3 ? compileTest(signatures[3].params[0]) : notOk;
    var test40 = ok4 ? compileTest(signatures[4].params[0]) : notOk;
    var test50 = ok5 ? compileTest(signatures[5].params[0]) : notOk;
    var test01 = ok0 ? compileTest(signatures[0].params[1]) : notOk;
    var test11 = ok1 ? compileTest(signatures[1].params[1]) : notOk;
    var test21 = ok2 ? compileTest(signatures[2].params[1]) : notOk;
    var test31 = ok3 ? compileTest(signatures[3].params[1]) : notOk;
    var test41 = ok4 ? compileTest(signatures[4].params[1]) : notOk;
    var test51 = ok5 ? compileTest(signatures[5].params[1]) : notOk; // compile the functions

    for (var _i4 = 0; _i4 < signatures.length; ++_i4) {
      signatures[_i4].implementation = compileArgsPreprocessing(signatures[_i4].params, signatures[_i4].fn);
    }

    var fn0 = ok0 ? signatures[0].implementation : undef;
    var fn1 = ok1 ? signatures[1].implementation : undef;
    var fn2 = ok2 ? signatures[2].implementation : undef;
    var fn3 = ok3 ? signatures[3].implementation : undef;
    var fn4 = ok4 ? signatures[4].implementation : undef;
    var fn5 = ok5 ? signatures[5].implementation : undef;
    var len0 = ok0 ? signatures[0].params.length : -1;
    var len1 = ok1 ? signatures[1].params.length : -1;
    var len2 = ok2 ? signatures[2].params.length : -1;
    var len3 = ok3 ? signatures[3].params.length : -1;
    var len4 = ok4 ? signatures[4].params.length : -1;
    var len5 = ok5 ? signatures[5].params.length : -1; // simple and generic, but also slow

    var iStart = allOk ? 6 : 0;
    var iEnd = signatures.length; // de-reference ahead for execution speed:

    var tests = signatures.map(function (s) {
      return s.test;
    });
    var fns = signatures.map(function (s) {
      return s.implementation;
    });

    var generic = function generic() {
      'use strict';

      for (var _i5 = iStart; _i5 < iEnd; _i5++) {
        if (tests[_i5](arguments)) {
          return fns[_i5].apply(this, arguments);
        }
      }

      return typed.onMismatch(name, arguments, signatures);
    }; // create the typed function
    // fast, specialized version. Falls back to the slower, generic one if needed


    function theTypedFn(arg0, arg1) {
      'use strict';

      if (arguments.length === len0 && test00(arg0) && test01(arg1)) {
        return fn0.apply(this, arguments);
      }

      if (arguments.length === len1 && test10(arg0) && test11(arg1)) {
        return fn1.apply(this, arguments);
      }

      if (arguments.length === len2 && test20(arg0) && test21(arg1)) {
        return fn2.apply(this, arguments);
      }

      if (arguments.length === len3 && test30(arg0) && test31(arg1)) {
        return fn3.apply(this, arguments);
      }

      if (arguments.length === len4 && test40(arg0) && test41(arg1)) {
        return fn4.apply(this, arguments);
      }

      if (arguments.length === len5 && test50(arg0) && test51(arg1)) {
        return fn5.apply(this, arguments);
      }

      return generic.apply(this, arguments);
    } // attach name the typed function


    try {
      Object.defineProperty(theTypedFn, 'name', {
        value: name
      });
    } catch (err) {// old browsers do not support Object.defineProperty and some don't support setting the name property
      // the function name is not essential for the functioning, it's mostly useful for debugging,
      // so it's fine to have unnamed functions.
    } // attach signatures to the function.
    // This property is close to the original collection of signatures
    // used to create the typed-function, just with unions split:


    theTypedFn.signatures = signaturesMap; // Store internal data for functions like resolve, find, etc.
    // Also serves as the flag that this is a typed-function

    theTypedFn._typedFunctionData = {
      signatures: signatures,
      signatureMap: internalSignatureMap
    };
    return theTypedFn;
  }
  /**
   * Action to take on mismatch
   * @param {string} name      Name of function that was attempted to be called
   * @param {Array} args       Actual arguments to the call
   * @param {Array} signatures Known signatures of the named typed-function
   */


  function _onMismatch(name, args, signatures) {
    throw createError(name, args, signatures);
  }
  /**
   * Return all but the last items of an array or function Arguments
   * @param {Array | Arguments} arr
   * @return {Array}
   */


  function initial(arr) {
    return slice(arr, 0, arr.length - 1);
  }
  /**
   * return the last item of an array or function Arguments
   * @param {Array | Arguments} arr
   * @return {*}
   */


  function last(arr) {
    return arr[arr.length - 1];
  }
  /**
   * Slice an array or function Arguments
   * @param {Array | Arguments | IArguments} arr
   * @param {number} start
   * @param {number} [end]
   * @return {Array}
   */


  function slice(arr, start, end) {
    return Array.prototype.slice.call(arr, start, end);
  }
  /**
   * Return the first item from an array for which test(arr[i]) returns true
   * @param {Array} arr
   * @param {function} test
   * @return {* | undefined} Returns the first matching item
   *                         or undefined when there is no match
   */


  function findInArray(arr, test) {
    for (var i = 0; i < arr.length; i++) {
      if (test(arr[i])) {
        return arr[i];
      }
    }

    return undefined;
  }
  /**
   * Flat map the result invoking a callback for every item in an array.
   * https://gist.github.com/samgiles/762ee337dff48623e729
   * @param {Array} arr
   * @param {function} callback
   * @return {Array}
   */


  function flatMap(arr, callback) {
    return Array.prototype.concat.apply([], arr.map(callback));
  }
  /**
   * Create a reference callback to one or multiple signatures
   *
   * Syntax:
   *
   *     typed.referTo(signature1, signature2, ..., function callback(fn1, fn2, ...) {
   *       // ...
   *     })
   *
   * @returns {{referTo: {references: string[], callback}}}
   */


  function referTo() {
    var references = initial(arguments).map(function (s) {
      return stringifyParams(parseSignature(s));
    });
    var callback = last(arguments);

    if (typeof callback !== 'function') {
      throw new TypeError('Callback function expected as last argument');
    }

    return makeReferTo(references, callback);
  }

  function makeReferTo(references, callback) {
    return {
      referTo: {
        references: references,
        callback: callback
      }
    };
  }
  /**
   * Create a reference callback to the typed-function itself
   *
   * @param {(self: function) => function} callback
   * @returns {{referToSelf: { callback: function }}}
   */


  function referToSelf(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('Callback function expected as first argument');
    }

    return {
      referToSelf: {
        callback: callback
      }
    };
  }
  /**
   * Test whether something is a referTo object, holding a list with reference
   * signatures and a callback.
   *
   * @param {Object | function} objectOrFn
   * @returns {boolean}
   */


  function isReferTo(objectOrFn) {
    return objectOrFn && _typeof(objectOrFn.referTo) === 'object' && Array.isArray(objectOrFn.referTo.references) && typeof objectOrFn.referTo.callback === 'function';
  }
  /**
   * Test whether something is a referToSelf object, holding a callback where
   * to pass `self`.
   *
   * @param {Object | function} objectOrFn
   * @returns {boolean}
   */


  function isReferToSelf(objectOrFn) {
    return objectOrFn && _typeof(objectOrFn.referToSelf) === 'object' && typeof objectOrFn.referToSelf.callback === 'function';
  }
  /**
   * Check if name is (A) new, (B) a match, or (C) a mismatch; and throw
   * an error in case (C).
   *
   * @param { string | undefined } nameSoFar
   * @param { string | undefined } newName
   * @returns { string } updated name
   */


  function checkName(nameSoFar, newName) {
    if (!nameSoFar) {
      return newName;
    }

    if (newName && newName !== nameSoFar) {
      var err = new Error('Function names do not match (expected: ' + nameSoFar + ', actual: ' + newName + ')');
      err.data = {
        actual: newName,
        expected: nameSoFar
      };
      throw err;
    }

    return nameSoFar;
  }
  /**
   * Retrieve the implied name from an object with signature keys
   * and function values, checking whether all value names match
   *
   * @param { {string: function} } obj
   */


  function getObjectName(obj) {
    var name;

    for (var key in obj) {
      // Only pay attention to own properties, and only if their values
      // are typed functions or functions with a signature property
      if (Object.prototype.hasOwnProperty.call(obj, key) && (isTypedFunction(obj[key]) || typeof obj[key].signature === 'string')) {
        name = checkName(name, obj[key].name);
      }
    }

    return name;
  }
  /**
   * Copy all of the signatures from the second argument into the first,
   * which is modified by side effect, checking for conflicts
   *
   * @param {Object.<string, function|typed-reference>} dest
   * @param {Object.<string, function|typed-reference>} source
   */


  function mergeSignatures(dest, source) {
    var key;

    for (key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (key in dest) {
          if (source[key] !== dest[key]) {
            var err = new Error('Signature "' + key + '" is defined twice');
            err.data = {
              signature: key,
              sourceFunction: source[key],
              destFunction: dest[key]
            };
            throw err;
          } // else: both signatures point to the same function, that's fine

        }

        dest[key] = source[key];
      }
    }
  }

  var saveTyped = typed;
  /**
   * Originally the main function was a typed function itself, but then
   * it might not be able to generate error messages if the client
   * replaced the type system with different names.
   *
   * Main entry: typed([name], functions/objects with signatures...)
   *
   * Assembles and returns a new typed-function from the given items
   * that provide signatures and implementations, each of which may be
   * * a plain object mapping (string) signatures to implementing functions,
   * * a previously constructed typed function, or
   * * any other single function with a string-valued property `signature`.
    * The name of the resulting typed-function will be given by the
   * string-valued name argument if present, or if not, by the name
   * of any of the arguments that have one, as long as any that do are
   * consistent with each other. If no name is specified, the name will be
   * an empty string.
   *
   * @param {string} maybeName [optional]
   * @param {(function|object)[]} signature providers
   * @returns {typed-function}
   */

  typed = function typed(maybeName) {
    var named = typeof maybeName === 'string';
    var start = named ? 1 : 0;
    var name = named ? maybeName : '';
    var allSignatures = {};

    for (var i = start; i < arguments.length; ++i) {
      var item = arguments[i];
      var theseSignatures = {};
      var thisName = void 0;

      if (typeof item === 'function') {
        thisName = item.name;

        if (typeof item.signature === 'string') {
          // Case 1: Ordinary function with a string 'signature' property
          theseSignatures[item.signature] = item;
        } else if (isTypedFunction(item)) {
          // Case 2: Existing typed function
          theseSignatures = item.signatures;
        }
      } else if (isPlainObject(item)) {
        // Case 3: Plain object, assume keys = signatures, values = functions
        theseSignatures = item;

        if (!named) {
          thisName = getObjectName(item);
        }
      }

      if (Object.keys(theseSignatures).length === 0) {
        var err = new TypeError('Argument to \'typed\' at index ' + i + ' is not a (typed) function, ' + 'nor an object with signatures as keys and functions as values.');
        err.data = {
          index: i,
          argument: item
        };
        throw err;
      }

      if (!named) {
        name = checkName(name, thisName);
      }

      mergeSignatures(allSignatures, theseSignatures);
    }

    return createTypedFunction(name || '', allSignatures);
  };

  typed.create = create;
  typed.createCount = saveTyped.createCount;
  typed.onMismatch = _onMismatch;
  typed.throwMismatchError = _onMismatch;
  typed.createError = createError;
  typed.clear = clear;
  typed.clearConversions = clearConversions;
  typed.addTypes = addTypes;
  typed._findType = findType; // For unit testing only

  typed.referTo = referTo;
  typed.referToSelf = referToSelf;
  typed.convert = convert;
  typed.findSignature = findSignature;
  typed.find = find;
  typed.isTypedFunction = isTypedFunction;
  typed.warnAgainstDeprecatedThis = true;
  /**
   * add a type (convenience wrapper for typed.addTypes)
   * @param {{name: string, test: function}} type
   * @param {boolean} [beforeObjectTest=true]
   *                          If true, the new test will be inserted before
   *                          the test with name 'Object' (if any), since
   *                          tests for Object match Array and classes too.
   */

  typed.addType = function (type, beforeObjectTest) {
    var before = 'any';

    if (beforeObjectTest !== false && typeMap.has('Object')) {
      before = 'Object';
    }

    typed.addTypes([type], before);
  };
  /**
   * Verify that the ConversionDef conversion has a valid format.
   *
   * @param {conversionDef} conversion
   * @return {void}
   * @throws {TypeError|SyntaxError}
   */


  function _validateConversion(conversion) {
    if (!conversion || typeof conversion.from !== 'string' || typeof conversion.to !== 'string' || typeof conversion.convert !== 'function') {
      throw new TypeError('Object with properties {from: string, to: string, convert: function} expected');
    }

    if (conversion.to === conversion.from) {
      throw new SyntaxError('Illegal to define conversion from "' + conversion.from + '" to itself.');
    }
  }
  /**
   * Add a conversion
   *
   * @param {ConversionDef} conversion
   * @returns {void}
   * @throws {TypeError}
   */


  typed.addConversion = function (conversion) {
    _validateConversion(conversion);

    var to = findType(conversion.to);

    if (to.conversionsTo.every(function (other) {
      return other.from !== conversion.from;
    })) {
      to.conversionsTo.push({
        from: conversion.from,
        convert: conversion.convert,
        index: nConversions++
      });
    } else {
      throw new Error('There is already a conversion from "' + conversion.from + '" to "' + to.name + '"');
    }
  };
  /**
   * Convenience wrapper to call addConversion on each conversion in a list.
   *
   @param {ConversionDef[]} conversions
   @returns {void}
   @throws {TypeError}
   */


  typed.addConversions = function (conversions) {
    conversions.forEach(typed.addConversion);
  };
  /**
   * Remove the specified conversion. The format is the same as for
   * addConversion, and the convert function must match or an error
   * is thrown.
   *
   * @param {{from: string, to: string, convert: function}} conversion
   * @returns {void}
   * @throws {TypeError|SyntaxError|Error}
   */


  typed.removeConversion = function (conversion) {
    _validateConversion(conversion);

    var to = findType(conversion.to);
    var existingConversion = findInArray(to.conversionsTo, function (c) {
      return c.from === conversion.from;
    });

    if (!existingConversion) {
      throw new Error('Attempt to remove nonexistent conversion from ' + conversion.from + ' to ' + conversion.to);
    }

    if (existingConversion.convert !== conversion.convert) {
      throw new Error('Conversion to remove does not match existing conversion');
    }

    var index = to.conversionsTo.indexOf(existingConversion);
    to.conversionsTo.splice(index, 1);
  };
  /**
   * Produce the specific signature that a typed function
   * will execute on the given arguments. Here, a "signature" is an
   * object with properties 'params', 'test', 'fn', and 'implementation'.
   * This last property is a function that converts params as necessary
   * and then calls 'fn'. Returns null if there is no matching signature.
   * @param {typed-function} tf
   * @param {any[]} argList
   * @returns {{params: string, test: function, fn: function, implementation: function}}
   */


  typed.resolve = function (tf, argList) {
    if (!isTypedFunction(tf)) {
      throw new TypeError(NOT_TYPED_FUNCTION);
    }

    var sigs = tf._typedFunctionData.signatures;

    for (var i = 0; i < sigs.length; ++i) {
      if (sigs[i].test(argList)) {
        return sigs[i];
      }
    }

    return null;
  };

  return typed;
}

export default create();
//# sourceMappingURL=typed-function.mjs.map