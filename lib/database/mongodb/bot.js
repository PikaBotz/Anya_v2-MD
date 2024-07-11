const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: true },
    react: { type: Boolean, default: false },
    worktype: { type: String, default: 'public' },
    prefix: { type: String, default: 'multi' },
    modlist: [{ type: String }]
})

const Bot = mongoose.model('anyabot', Schema);
module.exports = { Bot };
