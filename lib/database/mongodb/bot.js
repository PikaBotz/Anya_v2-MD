const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    react: { type: Boolean, default: false },
    worktype: { type: String, default: 'public' },
    prefix: { type: String, default: 'multi' },
    modlist: [{ type: String }],
    GEMINI_API_KEY: { type: String, default: 'false' }
})

const Bot = mongoose.model('anyabot', Schema);
module.exports = { Bot };
