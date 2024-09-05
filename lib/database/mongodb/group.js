const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    register: { type: Boolean, default: false },
    restrictedAge: { type: Boolean, default: false },
    restrictedAgeLimit: { type: Number, default: 10 },
    nsfw: { type: Boolean, default: false },
    antibot: { type: Boolean, default: false },
    antilink: { type: Boolean, default: false },
    antitoxic: { type: Boolean, default: false },
    antivirus: { type: Boolean, default: false },
    antipicture: { type: Boolean, default: false },
    antivideo: { type: Boolean, default: false },
    antisticker: { type: Boolean, default: false },
    antispam: { type: Boolean, default: false },
    chatbot: { type: Boolean, default: false }
});

const Group = mongoose.model('groups', Schema);
module.exports = { Group };
