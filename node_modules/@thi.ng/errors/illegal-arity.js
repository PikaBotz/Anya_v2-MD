import { defError } from "./deferror.js";
export const IllegalArityError = defError(() => "illegal arity");
export const illegalArity = (n) => {
    throw new IllegalArityError(n);
};
