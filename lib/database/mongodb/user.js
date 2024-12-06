const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    ban: { type: Boolean, default: false },
    name: { type: String, default: "unknown" },
    age: { type: Number, default: 0 },
    gender: { type: String, default: "unknown" },
    state: { type: String, default: "unknown" },
    retryChances: { type: Number, default: 4 },
    resTimer: { type: String, default: "0" },
    lastFetched: { type: Date, default: Date.now },
    groups: [{ type: String }],
    info: { type: Object, default: {} },
    others: { type: Object, default: {} }
})

const User = mongoose.model('users', Schema);
module.exports = { User };
