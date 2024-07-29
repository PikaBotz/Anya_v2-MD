const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    menu: { type: Number, default: 11 },
    alive: { type: Number, default: 10 },
    reply: { type: Number, default: 2 },
    buttons: { type: Boolean, default: true }
});

const UI = mongoose.model("userInterface", Schema);
module.exports = { UI };
