const Config = require('../../config');
const { anya, Group, delay, getBuffer } = require('../lib');

//༺─────────────────────────────────────༻

const broadcast = [
    {
        cmd: "bcaud",
        alias: ['bcaudio'],
        need: "audio",
        ptt: false
    },
    {
        cmd: "bcvn",
        alias: ['bcvoice', 'bcvoicenote'],
        need: "voicenote",
        ptt: true
    }
];
broadcast.forEach(bc => {
    anya({
            name: bc.cmd,
            alias: bc.alias,
            need: bc.need,
            react: "📡",
            category: "owner",
            desc: "Broadcast audio/voicenote",
            cooldown: 15,
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const quoted = pika.quoted || '';
        const mime = (quoted && quoted.mimetype) ? quoted.mimetype : '';
        if (/audio/.test(mime)) {
            const media = await quoted.download();
            const chats = [];
            const store = require('../database/store.json');
            for (const i of store.chats) {
                if (/@s.whatsapp.net|@g.us/.test(i.id)) chats.push(i.id);
            }
            const group = await Group.find({});
            for (const i of group) {
                chats.push(i.id + "@g.us");
            }
            const {key} = await pika.keyMsg(`\`\`\`🚀 Broadcasting...\`\`\``);
            for (const id of new Set(chats)) {
                await anyaV2.sendMessage(id, {
                    audio: media,
                    mimetype: 'audio/mp4',
                    ptt: bc.ptt,
                        contextInfo: {
                            externalAdReply: {
                                title: `⌈ ${pika.pushName}'s Broadcast ⌋`,
                                body: Config.botname,
                                thumbnail: Config.image_1,
                                showAdAttribution: true,
                                mediaType: 2,
                                mediaUrl: 'https://instagram.com/8.08_only_mine',
                                sourceUrl: 'https://instagram.com/8.08_only_mine'
                            }
                        }
                }, { quoted:Config.fakeshop }).catch(err=>{});
                await delay(2000);
            }
            pika.edit(Config.message.success, key);
        } else pika.reply(`Tag or reply a audio/voicenote with caption *${prefix+command}* to broadcast`);
    });
});

//༺─────────────────────────────────────༻

anya({
            name: "bcvid",
            alias: ['bcvideo'],
            need: "video",
            react: "📡",
            category: "owner",
            desc: "Broadcast videos",
            cooldown: 15,
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const quoted = pika.quoted || '';
        const mime = (quoted && quoted.mimetype) ? quoted.mimetype : '';
        if (/video/.test(mime)) {
            const media = await quoted.download();
            const chats = [];
            const store = require('../database/store.json');
            for (const i of store.chats) {
                if (/@s.whatsapp.net|@g.us/.test(i.id)) chats.push(i.id);
            }
            const group = await Group.find({});
            for (const i of group) {
                chats.push(i.id + "@g.us");
            }
            const {key} = await pika.keyMsg(`\`\`\`🚀 Broadcasting Video...\`\`\``);
            for (const id of new Set(chats)) {
                await anyaV2.sendMessage(id, {
                    video: media,
                    caption: `
❝🇧 🇷 🇴 🇦 🇩 🇨 🇦 🇸 🇹❞

*🍁Owner:* @${Config.ownernumber}
*🏮Type:* video/mp4
*🧩Message:* ${pika.quoted ? (pika.quoted.text.split(" ").length > 1 ? pika.quoted.text : (args.length > 0 ? args.join(" ") : 'Empty message')) : (args.length > 0 ? args.join(" ") : 'Empty message')}

${Config.footer}`.trim(),
                    mentions: [Config.ownernumber + "@s.whatsapp.net"]
                }, { quoted:Config.fakeshop }).catch(err=>{});
                await delay(2000);
            }
            pika.edit(Config.message.success, key);
        } else pika.reply(`Tag or reply a video with caption *${prefix+command}* to broadcast`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "bcimg",
            alias: ['bcimage'],
            need: "image",
            react: "📡",
            category: "owner",
            desc: "Broadcast images",
            cooldown: 15,
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const quoted = pika.quoted || '';
        const mime = (quoted && quoted.mimetype) ? quoted.mimetype : '';
        if (/image/.test(mime)) {
            const media = await quoted.download();
            const chats = [];
            const store = require('../database/store.json');
            for (const i of store.chats) {
                if (/@s.whatsapp.net|@g.us/.test(i.id)) chats.push(i.id);
            }
            const group = await Group.find({});
            for (const i of group) {
                chats.push(i.id + "@g.us");
            }
            const {key} = await pika.keyMsg(`\`\`\`🚀 Broadcasting Image...\`\`\``);
            for (const id of new Set(chats)) {
                await anyaV2.sendMessage(id, {
                    image: media,
                    caption: `
❝🇧 🇷 🇴 🇦 🇩 🇨 🇦 🇸 🇹❞

*🍁Owner:* @${Config.ownernumber}
*🏮Type:* picture/jpg
*🧩Message:* ${pika.quoted ? (pika.quoted.text.split(" ").length > 1 ? pika.quoted.text : (args.length > 0 ? args.join(" ") : 'Empty message')) : (args.length > 0 ? args.join(" ") : 'Empty message')}

${Config.footer}`.trim(),
                    mentions: [Config.ownernumber + "@s.whatsapp.net"]
                }, { quoted:Config.fakeshop }).catch(err=>{});
                await delay(2000);
            }
            pika.edit(Config.message.success, key);
        } else pika.reply(`Tag or reply a image with caption *${prefix+command}* to broadcast`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "bctext",
            need: "text",
            react: "📡",
            category: "owner",
            desc: "Broadcast texts",
            cooldown: 15,
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        const message = pika.quoted ? (pika.quoted.text.split(" ").length > 0 ? pika.quoted.text : (args.length > 0 ? args.join(" ") : false)) : (args.length > 0 ? args.join(" ") : false);
        if (!message) return pika.reply(`*${Config.themeemoji} Example:* ${prefix+command} Text To Broadcast`);
        const chats = [];
        const store = require('../database/store.json');
        for (const i of store.chats) {
            if (/@s.whatsapp.net|@g.us/.test(i.id)) chats.push(i.id);
        }
        const group = await Group.find({});
        for (const i of group) {
            chats.push(i.id + "@g.us");
        }
        const {key} = await pika.keyMsg(`\`\`\`🚀 Broadcasting Text...\`\`\``);
        for (const id of new Set(chats)) {
            await anyaV2.sendMessage(id, {
                    text: `
❝🇧 🇷 🇴 🇦 🇩 🇨 🇦 🇸 🇹❞

*🍁Owner:* @${Config.ownernumber}
*🏮Type:* text
*🧩Message:* ${message}

${Config.footer}`.trim(),
                    mentions: [Config.ownernumber + "@s.whatsapp.net"]
                }, { quoted:Config.fakeshop }).catch(err=>{});
                await delay(2000);
            }
        pika.edit(Config.message.success, key);
     }
)