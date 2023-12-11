import { defError } from "./deferror.js";
export const IOError = defError(() => "IO error");
export const ioerror = (msg) => {
    throw new IOError(msg);
};
export const FileNotFoundError = defError(() => "File not found");
export const fileNotFound = (path) => {
    throw new FileNotFoundError(path);
};
