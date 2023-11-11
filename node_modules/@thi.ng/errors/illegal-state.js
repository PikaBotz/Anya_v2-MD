import { defError } from "./deferror.js";
export const IllegalStateError = defError(() => "illegal state");
export const illegalState = (msg) => {
    throw new IllegalStateError(msg);
};
