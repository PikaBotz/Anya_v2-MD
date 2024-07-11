const axios = require('axios');
const Config = require('../../config');
const { anya, Cmd, pickRandom } = require('../lib');
const { proto, areJidsSameUser, generateWAMessage } = require('@queenanya/baileys');

//༺─────────────────────────────────────༻

/**
 * Autoreply these matching words in groups
 */
anya({ usage: "text", notCmd: true }, async (anyaV2, pika, { system, bot }) => {
   if (!pika.isGroup || bot.worktype === "self" || !system.autoReply) return;
   const words = [
    "foolish",
    "smart",
    "idiot",
    "gay",
    "lesbi",
    "bastard",
    "stubble",
    "dog",
    "fuck",
    "ape",
    "noob",
    "great",
    "horny",
    "wibu",
    "asshole",
    "handsome",
    "beautiful",
    "cute",
    "kind",
    "ugly",
    "pretty",
    "lesbian",
    "randi",
    "gandu",
    "madarchod",
    "kala",
    "gora",
    "chutiya",
    "nibba",
    "nibbi",
    "bhosdiwala",
    "chutmarika",
    "bokachoda",
    "suarerbaccha",
    "bolochoda",
    "muthal",
    "muthbaaz",
    "randibaaz",
    "topibaaz",
    "cunt",
    "nerd",
    "behenchod",
    "behnchoda",
    "bhosdika",
    "nerd",
    "mc",
    "bsdk",
    "bhosdk",
    "nigger",
    "loda",
    "laund",
    "nigga",
    "noobra",
    "tharki",
    "nibba",
    "nibbi",
    "mumu",
    "rascal",
    "scumbag",
    "nuts",
    "comrade",
    "fagot",
    "scoundrel",
    "ditch",
    "dope",
    "gucci",
    "lit",
    "dumbass",
    "sexy",
    "crackhead",
    "mf",
    "motherfucker",
    "dogla",
    "bewda",
    "boka",
    "khanki",
    "bal",
    "sucker",
    "fuckboy",
    "playboy",
    "fuckgirl",
    "playgirl",
    "hot"
];
    const lowerText = pika.text.toLowerCase();
    const wordPattern = new RegExp(`\\b(${words.join('|')})\\b`, 'i');
    const match = lowerText.match(wordPattern);
    if (match) {
        const metadata = await anyaV2.groupMetadata(pika.chat);
        const participants = metadata.participants.map(v => v.id);
        const member = participants[Math.floor(Math.random() * participants.length)];
        const detectedWord = match[0];
        return pika.reply(`The Most *${detectedWord.charAt(0).toUpperCase() + detectedWord.slice(1)}* Here Is @${member.split("@")[0]}`, { mentions: [member] });
    }
});

//༺─────────────────────────────────────༻

/**
 * Chatbot for private chat and group chat
 */
anya({ usage: "text", notCmd: true }, async (anyaV2, pika, { group, system, bot, args, botNumber }) => {
    if (pika.text === '' || !pika.text) return;
    if (bot.worktype === "self") return;
    if (!pika.isGroup) {
        if (!system.chatbot) return;
        const { key } = await pika.keyMsg("*💬...*");
        const query = encodeURIComponent(pika.text);
        try {
            const { data } = await axios.get(`https://api.vihangayt.com/ai/gemini?q=${query}`);
            return pika.edit(`*🚀 AI :* ${data.data}\n\n> ${Config.footer}`, key);
        } catch (error) {
            const backupAPI = await axios.get(`http://api.brainshop.ai/get?bid=172502&key=ru9fgDbOTtZOwTjc&uid=${pika.sender.split("@")[0]}&msg=${query}`);
            return pika.edit(`*🚀 AI :* ${backupAPI.data.cnt}\n\n> ${Config.footer}`, key);
        }
    } else if (pika.isGroup) {
        if (!group.chatbot) return;
        if ((pika.quoted !== null && pika.quoted.sender === botNumber) || pika.mentionedJid[0] === botNumber) {
            const { key } = await pika.keyMsg("*💬...*");
            if (args.length < 1) return pika.edit(`*🚀 AI :* Please enter a prompt!\n\n> ${Config.footer}`, key);
            const query = encodeURIComponent(pika.mentionedJid[0] === botNumber ? pika.text.replace(pika.mentionedJid[0].split("@")[0], "") : pika.text);
            try {
                const { data } = await axios.get(`https://api.vihangayt.com/ai/gemini?q=${query}`);
                return pika.edit(`*🚀 AI :* ${data.data}\n\n> ${Config.footer}`, key);
            } catch (error) {
                const backupAPI = await axios.get(`http://api.brainshop.ai/get?bid=172502&key=ru9fgDbOTtZOwTjc&uid=${pika.sender.split("@")[0]}&msg=${query}`);
                return pika.edit(`*🚀 AI :* ${backupAPI.data.cnt}\n\n> ${Config.footer}`, key);
            }
        }
    }
});

//༺─────────────────────────────────────༻

anya({ usage: "media", notCmd: true }, async (anyaV2, pika, { system }) => {
    if (!/sticker/.test(pika.mtype) && system.stickerSaver) return;
        const buffer = await anyaV2.downloadMediaMessage(pika.msg);
        await anyaV2.sendMessage(Config.ownernumber + "@s.whatsapp.net", { sticker: buffer }, { quoted: pika });
    }
);

//༺─────────────────────────────────────༻

/**
 * Auto reply on owner mention
 */
anya({ usage: "text", notCmd: true }, async (anyaV2, pika, { system }) => {
    if (system.mentionReply && pika.mentionedJid.includes(Config.ownernumber + "@s.whatsapp.net")) return await anyaV2.sendMessage(pika.chat, {
        audio: Config.ownerMentionMp3,
        mimetype: 'audio/mp4',
        ptt: true,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
                title: Config.ownername,
                body: Config.botname,
                thumbnailUrl: Config.imageMentionUrl,
                showAdAttribution: true,
                mediaType: 1,
                renderLargerThumbnail: true,
//                mediaUrl: Config.socialLink,
                sourceUrl: Config.socialLink
            }
        }
    }, { quoted: pika });
});

//༺─────────────────────────────────────༻

anya({ usage: "media", notCmd: true }, async (anyaV2, pika, { system, userOwner }) => {
    if (/viewOnceMessageV2/.test(pika.mtype)) { 
        if (!system.antionce) return;
        if (userOwner) return pika.reply(`\`\`\`⏳ Anti Once Detected!\`\`\`\n_but @${pika.sender.split("@")[0]} is a mod_`, { mentions: [pika.sender] });
        const {key} = await pika.copyNForward(pika.chat, true, { readViewOnce: true, quoted: pika, caption: `\`\`\`🏮 Antionce Detected\`\`\`\n⌬═══════════════════⌬\n\n*👤 Sender :* @${pika.sender.split("@")[0]}@captionHereIfAvailable\n\n${Config.footer}`, mentions: [pika.sender] });    
    }
})

//༺─────────────────────────────────────༻

/**
 * Cmd command function
 */
anya({ usage: "media", notCmd: true }, async (anyaV2, pika, { main }) => {
if (pika.msg.fileSha256) {
    const cmd = await Cmd.findOne({ id: "cmd" }) || await new Cmd({ id: "cmd" }).save();
    if (cmd.setcmd.has(pika.msg.fileSha256.toString('base64'))) {
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
       }
    }
});
