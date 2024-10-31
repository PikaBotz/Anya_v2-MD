const axios = require('axios');
const Config = require('../../config');
const {
    anya,
    Cmd,
    User,
    Group,
    pickRandom,
    chatGpt4,
    bingChat,
    brainShopAi,
    blackbox
} = require('../lib');
const { proto, areJidsSameUser, generateWAMessage } = require('@queenanya/baileys');

//༺─────────────────────────────────────

/**
 * Auto delete user & group data updater (in 7 days)
 */
anya({ usage: "body", notCmd: true }, async (anyaV2, pika, {}) => {
    try {
        await User.findOneAndUpdate( { id: pika.sender.split("@")[0] }, { $set: { lastFetched: Date.now() } }, { new: true });
        if (pika.isGroup) await Group.findOneAndUpdate( { id: pika.chat.split("@")[0] }, { $set: { lastFetched: Date.now() } }, { new: true });
    } catch (error) {
        console.error('Error updating lastFetched:', error);
    }
});

//༺─────────────────────────────────────

/**
 * Chatbot for private chat
 */
anya({ usage: "text", notCmd: true }, async (anyaV2, pika, { system, bot }) => {
    if (!pika.isPrivate || !pika.text || /* bot.worktype === "self" || */ !system.chatbot) return;
    const userId = pika.sender.split("@")[0];
    //const prompt = encodeURIComponent(pika.text);
    const sendAiResponse = (response) => {
        pika.reply(`*🚀 AI :* ${response}\n\n> ${Config.footer}`);
    }
    const handleAiFallback = async () => {
        //const gptResponse = await chatGpt4(userId, pika.text);
        //if (gptResponse.status) return sendAiResponse(gptResponse.message);
        //const bingResponse = await bingChat(userId, pika.text);
        //if (bingResponse.status) return sendAiResponse(bingResponse.message);
        const blackboxResponse = await blackbox(userId, pika.text);
        if (blackboxResponse.status) return sendAiResponse(blackboxResponse.message);
        const brainResponse = await brainShopAi(userId, pika.text);
        if (brainResponse.status) return sendAiResponse(brainResponse.message);
        pika.reply("*❗AI is unavailable, please contact to support group.*");
    };
    handleAiFallback();
});

//༺------------------------------------------------------------------------------------------------

/**
 * Chatbot for group chat
 */
anya({ usage: "text", notCmd: true }, async (anyaV2, pika, { group, bot, args, botNumber }) => {
    if (!pika.isGroup || !pika.text || /* bot.worktype === "self" || */ !group.chatbot) return;
    if (pika.quoted?.sender === botNumber || pika.mentionedJid.includes(botNumber)) {
    const nullMessage = [
        "Hey thanks for tagging, how can I help you today?",
        "How can I assist you today?",
        "Heya! AI here!",
        "Please enter a prompt to continue.",
        "Say something!"
    ];
    const sendAiResponse = (response) => {
        pika.reply(`*🚀 AI :* ${response}\n\n> ${Config.footer}`);
    }
    const prompt = pika.text.replace("@" + botNumber.split("@")[0], "").trim();
    if (prompt === "") return sendAiResponse(pickRandom(nullMessage));
    const userId = pika.sender.split("@")[0];
    //const prompt = (pika.mentionedJid[0] === botNumber 
    //    ? pika.text.replace("@" + pika.mentionedJid[0].split("@")[0], "").trim() 
    //    : pika.text.trim());
    const handleAiFallback = async () => {
        //const gptResponse = await chatGpt4(userId, prompt);
        //if (gptResponse.status && gptResponse.message) return sendAiResponse(gptResponse.message);
        const blackboxResponse = await blackbox(userId, pika.text);
        if (blackboxResponse.status) return sendAiResponse(blackboxResponse.message);
        //const bingResponse = await bingChat(userId, prompt);
        //if (bingResponse.status && bingResponse.message) return sendAiResponse(bingResponse.message);
        const brainResponse = await brainShopAi(userId, prompt);
        if (brainResponse.status && brainResponse.message) return sendAiResponse(brainResponse.message);
        pika.reply("*❗AI is unavailable, please contact the support group.*");
    };
    handleAiFallback();
    }
});

//༺─────────────────────────────────────

anya({ usage: "media", notCmd: true }, async (anyaV2, pika, { system, userOwner }) => {
    if (/viewOnceMessageV2/.test(pika.mtype)) { 
        if (!system.antionce) return;
        if (userOwner) return pika.reply(`\`\`\`⏳ Anti Once Detected!\`\`\`\n_but @${pika.sender.split("@")[0]} is a mod_`, { mentions: [pika.sender] });
        const {key} = await pika.copyNForward(pika.chat, true, { readViewOnce: true, quoted: pika, caption: `\`\`\`🏮 Antionce Detected\`\`\`\n⌬═══════════════════⌬\n\n*👤 Sender :* @${pika.sender.split("@")[0]}@captionHereIfAvailable\n\n${Config.footer}`, mentions: [pika.sender] });    
    }
})

//༺─────────────────────────────────────

/**
 * Cmd command function
 */
anya({ usage: "media", notCmd: true }, async (anyaV2, pika, { chatUpdate }) => {
if (pika.msg.fileSha256) {
    const cmd = await Cmd.findOne({ id: "cmd" }) || await new Cmd({ id: "cmd" }).save();
    if (cmd.setcmd.has(pika.msg.fileSha256.toString('base64'))) {
        const { command } = cmd.setcmd.get(pika.msg.fileSha256.toString('base64'));
        let messages = await generateWAMessage(pika.chat, { text: command, mentions: pika.mentionedJid }, {
            userJid: anyaV2.user.id,
            quoted: pika.quoted && pika.quoted.fakeObj
        });
        messages.key.fromMe = areJidsSameUser(pika.sender, anyaV2.user.id);
        messages.key.id = pika.key.id;
        messages.pushName = pika.pushName;
        if (pika.isGroup) messages.participant = pika.sender
        let msg = {
            ...chatUpdate,//.messages[0],
            messages: [proto.WebMessageInfo.fromObject(messages)],
            type: 'notify'
        }
        anyaV2.ev.emit('messages.upsert', msg);
       }
    }
});
