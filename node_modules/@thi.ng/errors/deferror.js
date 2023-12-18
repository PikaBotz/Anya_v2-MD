const defError = (prefix, suffix = (msg) => msg !== void 0 ? ": " + msg : "") => class extends Error {
  constructor(msg) {
    super(prefix(msg) + suffix(msg));
  }
};
export {
  defError
};
