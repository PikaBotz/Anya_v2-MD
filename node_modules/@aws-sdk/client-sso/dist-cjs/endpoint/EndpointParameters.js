"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveClientEndpointParameters = void 0;
const resolveClientEndpointParameters = (options) => {
    var _a, _b;
    return {
        ...options,
        useDualstackEndpoint: (_a = options.useDualstackEndpoint) !== null && _a !== void 0 ? _a : false,
        useFipsEndpoint: (_b = options.useFipsEndpoint) !== null && _b !== void 0 ? _b : false,
        defaultSigningName: "awsssoportal",
    };
};
exports.resolveClientEndpointParameters = resolveClientEndpointParameters;
