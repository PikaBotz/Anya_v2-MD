const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    anticall: { type: Boolean, default: true },
    antifake: { type: Boolean, default: false },
    antilinkall: { type: Boolean, default: false },
    antipm: { type: Boolean, default: false },
    autoMsgRead: { type: Boolean, default: false },
    autoReactMsg: { type: Boolean, default: false },
    autoTyping: { type: Boolean, default: false },
    autoReply: { type: Boolean, default: true },
    autoBlock: { type: Boolean, default: false },
    autoBio: { type: Boolean, default: true },
    autoStatusRead: { type: Boolean, default: true },
    chatbot: { type: Boolean, default: false },
    cooldown: { type: Boolean, default: false },
    onlypm: { type: Boolean, default: false },
    stickerSaver: { type: Boolean, default: false },
    mentionReply: { type: Boolean, default: false },
    welcome: { type: Boolean, default: false },
    goodbye: { type: Boolean, default: false },
    /* PDM : Promote Demote Messages */
    pdm: { type: Boolean, default: false },
    /* gcm : Group Changes Messages */
    gcm: { type: Boolean, default: false },
    antionce: { type: Boolean, default: false },
    // antidelete: { type: Boolean, default: true },
    badWords: [{ type: String }],
    fakelist: [{ type: String }]
});

const System = mongoose.model("system", Schema);
module.exports = { System };
