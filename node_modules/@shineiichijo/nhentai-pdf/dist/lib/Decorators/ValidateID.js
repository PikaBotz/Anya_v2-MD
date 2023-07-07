"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidateID = () => {
    return (target, key) => {
        let value = target[key];
        const get = () => value;
        const set = (id) => {
            value = id.trim().replace(/(https?:\/\/nhentai\.net\/g\/)(\d+)\/?/, '$2');
        };
        Object.defineProperty(target, key, {
            get,
            set,
            enumerable: true,
            configurable: true
        });
    };
};
exports.default = ValidateID;
