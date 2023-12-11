import { assert } from "./assert.js";
/**
 * Higher-order function to define ensurance assertions. Takes a `pred`icate
 * function and an `expected` (type) name, returns a new function which accepts
 * 2 args (an arbitrary value `x` and optional error `msg`). When called, checks
 * `x` for non-null and if so applies given `pred`icate. If result is false (or
 * `x` is nullish) and iff {@link assert} is enabled, throws a
 * {@link AssertionError} with given `msg` (or a constructed default msg).
 * Otherwise function is a no-op.
 *
 * @param pred
 * @param expected
 */
export const defEnsure = (pred, expected) => (x, msg) => {
    x != null
        ? assert(() => pred(x), msg || `expected ${expected}, got ${typeof x}`)
        : assert(false, `expected ${expected}, got ${x}`);
    return x;
};
/**
 * Only enabled if {@link assert} is enabled (otherwise no-op). Checks if `x` is
 * a JS array and if not throws {@link AssertionError}, optionally with given
 * `msg`.
 *
 * @remarks
 * See {@link defEnsure} for details.
 *
 * @param x
 * @param msg
 */
export const ensureArray = defEnsure((x) => Array.isArray(x), `array`);
/**
 * Only enabled if {@link assert} is enabled (otherwise no-op). Checks if `x` is
 * a bigint and if not throws {@link AssertionError}, optionally with given
 * `msg`.
 *
 * @remarks
 * See {@link defEnsure} for details.
 *
 * @param x
 * @param msg
 */
export const ensureBigInt = defEnsure((x) => typeof x === "bigint", "bigint");
/**
 * Only enabled if {@link assert} is enabled (otherwise no-op). Checks if `x` is
 * a boolean and if not throws {@link AssertionError}, optionally with given
 * `msg`.
 *
 * @remarks
 * See {@link defEnsure} for details.
 *
 * @param x
 * @param msg
 */
export const ensureBoolean = defEnsure((x) => typeof x === "boolean", "boolean");
/**
 * Only enabled if {@link assert} is enabled (otherwise no-op). Checks if `x` is
 * a function and if not throws {@link AssertionError}, optionally with given
 * `msg`.
 *
 * @remarks
 * See {@link defEnsure} for details.
 *
 * @param x
 * @param msg
 */
export const ensureFunction = defEnsure((x) => typeof x === "function", "function");
/**
 * Only enabled if {@link assert} is enabled (otherwise no-op). Checks if `x` is
 * an ES6 iterable and if not throws {@link AssertionError}, optionally with
 * given `msg`.
 *
 * @remarks
 * See {@link defEnsure} for details.
 *
 * @param x
 * @param msg
 */
export const ensureIterable = defEnsure((x) => typeof x[Symbol.iterator] === "function", "iterable");
/**
 * Only enabled if {@link assert} is enabled (otherwise no-op). Checks if `x` is
 * a number and if not throws {@link AssertionError}, optionally with given
 * `msg`.
 *
 * @remarks
 * See {@link defEnsure} for details.
 *
 * @param x
 * @param msg
 */
export const ensureNumber = defEnsure((x) => typeof x === "number", "number");
/**
 * Only enabled if {@link assert} is enabled (otherwise no-op). Checks if `x` is
 * a string and if not throws {@link AssertionError}, optionally with given
 * `msg`.
 *
 * @remarks
 * See {@link defEnsure} for details.
 *
 * @param x
 * @param msg
 */
export const ensureString = defEnsure((x) => typeof x === "string", "string");
/**
 * Only enabled if {@link assert} is enabled (otherwise no-op). Checks if `x` is
 * a symbol and if not throws {@link AssertionError}, optionally with given
 * `msg`.
 *
 * @remarks
 * See {@link defEnsure} for details.
 *
 * @param x
 * @param msg
 */
export const ensureSymbol = defEnsure((x) => typeof x === "symbol", "symbol");
