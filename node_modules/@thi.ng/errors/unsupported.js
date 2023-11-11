import { defError } from "./deferror.js";
export const UnsupportedOperationError = defError(() => "unsupported operation");
export const unsupported = (msg) => {
    throw new UnsupportedOperationError(msg);
};
