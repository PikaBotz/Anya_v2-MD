import { defError } from "./deferror.js";
export const IllegalArgumentError = defError(() => "illegal argument(s)");
export const illegalArgs = (msg) => {
    throw new IllegalArgumentError(msg);
};
