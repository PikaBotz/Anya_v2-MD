const axios = require('axios');
const Config = require('../../config');
const { anya, Cmd, User, pickRandom } = require('../lib');
//const { proto, areJidsSameUser, generateWAMessage } = require('@queenanya/baileys');

//༺─────────────────────────────────────

/**
 * Auto delete user data updater (in 7 days)
 */
anya({ usage: "body", notCmd: true }, async (anyaV2, pika, {}) => {
    try {
        await User.findOneAndUpdate( { id: pika.sender.split("@")[0] }, { $set: { lastFetched: Date.now() } }, { new: true });
    } catch (error) {
        console.error('Error updating lastFetched:', error);
    }
});

//༺─────────────────────────────────────

/**
 * Chatbot for private chat and group chat
 */
anya({ usage: "text", notCmd: true }, async (anyaV2, pika, { group, system, bot, args, botNumber }) => {
    if (pika.text === '' || !pika.text) return;
    if (bot.worktype === "self") return;
    if (!pika.isGroup) {
        if (!system.chatbot) return;
        const {key} = await pika.keyMsg("*💬...*");
        const query = encodeURIComponent(pika.text);
        let response;
        try {
            const { data } = await axios.get(`https://api.vihangayt.com/ai/gemini?q=${query}`);
//            if (!data.status) return pika.edit("> 🗨️ Api Failed");
            response = data.data;
        } catch (erro) {
            console.log("Chatbot API not working, using backup API..!", erro);
            const { data } = await axios.get(`http://api.brainshop.ai/get?bid=172502&key=ru9fgDbOTtZOwTjc&uid=${pika.sender.split("@")[0]}&msg=${query}`);
            response = data.cnt;
        }
        return pika.edit(`*🚀 AI :* ${response}\n\n> ${Config.footer}`, key);
    } else if (pika.isGroup) {
        if (!group.chatbot) return; // console.log(botNumber)
        if ((pika.quoted !== null && pika.quoted.sender === botNumber) || pika.mentionedJid[0] === botNumber) {
            const {key} = await pika.keyMsg("*💬...*");
            if (args.length < 1) return pika.edit(`*🚀 AI :* Please enter a prompt!\n\n> ${Config.footer}`, key);
            const query = encodeURIComponent(pika.mentionedJid[0] === botNumber ? pika.text.replace(pika.mentionedJid[0].split("@")[0], "") : pika.text);
            let response;
            try {
                const { data } = await axios.get(`https://api.vihangayt.com/ai/gemini?q=${query}`);
//                if (!data.status) return pika.edit("> 🗨️ Api Failed");
                response = data.data;
            } catch (erro) {
                console.log("Chatbot API not working, using backup API..!", erro);
                const { data } = await axios.get(`http://api.brainshop.ai/get?bid=172502&key=ru9fgDbOTtZOwTjc&uid=${pika.sender.split("@")[0]}&msg=${query}`);
                response = data.cnt;
            }
        return pika.edit(`*🚀 AI :* ${response}\n\n> ${Config.footer}`, key);
        }
    } else return;
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
const { areJidsSameUser, generateWAMessage, MessageType, newMessagesDB, prepareMessage } = require('@queenanya/baileys');

anya({ usage: "media", notCmd: true }, async (anyaV2, pika, { chatUpdate }) => {
if (pika.msg.fileSha256) {
    const cmd = await Cmd.findOne({ id: "cmd" }) || await new Cmd({ id: "cmd" }).save();
    if (cmd.setcmd.has(pika.msg.fileSha256.toString('base64'))) {
        const { command, mentions } = cmd.setcmd.get(pika.msg.fileSha256.toString('base64'));
        anyaV2.ev.emit('chat-update', {
            ...chatUpdate,
            messages: newMessagesDB([
                pika.cMod(pika.chat,
                    await prepareMessage(pika.chat, command, MessageType.extendedText, {
                        contextInfo: {
                            mentions
                        },
                        ...(pika.quoted ? { quoted: pika.quoted.fakeObj } : {}),
                        messageId: pika.id,
                    }),
                    command,
                    pika.sender
                )
            ])
        })
    
    
    
    
    
    /*
        const { command } = cmd.setcmd.get(pika.msg.fileSha256.toString('base64'));
        const messages = await generateWAMessage(pika.chat, { text: command, mentions: pika.mentionedJid }, {
            userJid: anyaV2.user.id,
            quoted: pika.quoted && pika.quoted.fakeObj
        });
        messages.key.fromMe = areJidsSameUser(pika.sender, anyaV2.user.id);
        messages.key.id = pika.key.id;
        messages.pushName = pika.pushName;
        if (pika.isGroup) messages.participant = pika.sender
        const msg = {
            ...main,
            messages: [proto.WebMessageInfo.fromObject(messages)],
            type: 'append'
        }
        anyaV2.ev.emit('messages.upsert', msg);
        */
       }
    }
});
