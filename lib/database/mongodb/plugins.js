const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    url: { type: String }
});

const Plugins = mongoose.model('plugins', Schema);
module.exports = { Plugins };
