const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    menu: { type: Number, default: 1 },
    alive: { type: Number, default: 1 },
    reply: { type: Number, default: 1 },
    listmenu: { type: Number, default: 1 },
    greetings: { type: Number, default: 4 },
    ytsmsg: { type: Number, default: 1 },
    buttons: { type: Boolean, default: false }
});

const UI = mongoose.model("userInterface", Schema);
module.exports = { UI };
