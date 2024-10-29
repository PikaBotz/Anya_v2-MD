const Config = require('../../config');
const axios = require('axios');
const {
    anya,
    delay,
    UI,
    Bot,
    System,
    Cmd,
    reactions,
    fancy13,
    greetTime,
    getBuffer,
	formatRuntime
} = require('../lib');

//༺------------------------------------------------------------------------------------------------

anya(
	{
		name: "sqr",
		alias: ['qr'],
		react: "📸",
		category: "core",
		desc: "Get Queen Anya Session Id using Qr code",
		filename: __filename
	},
	async (anyaV2, pika, { args, prefix, command }) => {
		const repoFetch = await axios.get('https://api.github.com/repos/PikaBotz/Anya_v2-MD');
	        const qr_code = repoFetch.data.homepage + 'qr-code';
	        const qr_message = await anyaV2.sendMessage(pika.chat, {
			image: { url: qr_code },
			caption: "*Only valid for 15 seconds..!*"
		}, { quoted: pika });
	        await delay(15000);
	        await pika.deleteMsg(qr_message.key);
	        pika.reply(`*‼️ Time's Up!*\n_Not scanned yet? Type *${prefix + command}* to get Qr again!_`);
	}
);

//༺─────────────────────────────────────

anya(
    {
        name: "support",
        react: "🤝🏻",
        category: "core",
        desc: "Get official support gc link!",
        filename: __filename
    },
    async (anyaV2, pika, {}, { boxKey }) => {
        // ⚠️ Don't change this url! you'll mislead them!
        await anyaV2.sendMessage(pika.chat, {
            text: `\`SUPPORT LINK..! 🌙\`\n_🔗 ${boxKey.support} ;_\n\n> ${Config.footer}`,
            contextInfo: {
                externalAdReply: {
                    renderLargerThumbnail: true,
                    thumbnailUrl: "https://iili.io/dlNWfs4.jpg",
                    title: "𝐏𝐢𝐤𝐚𝐁𝐨𝐭𝐳 𝐒𝐮𝐩𝐩𝐨𝐫𝐭 𝐆𝐫𝐨𝐮𝐩 🗣️🌙",
                    mediaType: 1,
                    mediaUrl: boxKey.support,
                    sourceUrl: boxKey.support
                }
            }
        }, { quoted:pika });
    }
)

//༺─────────────────────────────────────

anya(
    {
        name: "request",
        react: "🛐",
        category: "core",
        desc: "Request to main developer",
        filename: __filename
    },
    async (anyaV2, pika, { args }, { boxKey }) => {
        if (args.length < 1) return pika.reply("_*❗Enter a request!*_\ne.g. \"Please make an insta downloader command!\"");
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        const requestMessage = args.join(" ");
        const requester = pika.sender.split("@")[0];
        const caption = [
            "`</> | ＲＥＱＵＥＳＴ | </>`\n\n",
            `*| 🗣️ Request:* ${requestMessage}`,
            `*| 🤖 Bot:* _@${botNumber.split("@")[0]}_`,
            `*| 👤 Requested By:* _@${requester}_`
        ].join("\n");
        await pika.reply("*✅ Good Job, Requested!*");
        //const buffer = await getBuffer("https://iili.io/dlkcLgt.jpg");
        const mentions = [pika.sender, botNumber];
        await anyaV2.sendMessage(pika.chat, {
            image: { url: "https://i.ibb.co/HT9rYtx/dlkcLgt.jpg" },
            caption,
            mentions
        }, { quoted: pika });
        const botConName = await anyaV2.getName(anyaV2.user.id);
        const botConQuote = {
            key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
            message: {
                contactMessage: {
                    displayName: botConName,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${botConName};;;\nFN:${botConName}\nitem1.TEL;waid=${botNumber.split("@")[0]}:${botNumber.split("@")[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
                    jpegThumbnail: Config.image_1,
                    thumbnailUrl: Config.imageUrl,
                    sendEphemeral: true
                }
            }
        };
        const inviteCode = boxKey.box.split("https://chat.whatsapp.com/")[1];
        const joinedGroup = await anyaV2.groupAcceptInvite(inviteCode);
	await delay(1000);
        await anyaV2.sendMessage(joinedGroup, { text: caption, mentions: mentions }, { quoted: botConQuote });
        await delay(1000);
        await anyaV2.groupLeave(joinedGroup);
    }
);

//༺─────────────────────────────────────

anya(
    {
        name: "report",
        alias: ['bug'],
        react: "🐝",
        category: "core",
        desc: "Report bugs to main developer",
        filename: __filename
    },
    async (anyaV2, pika, { args }, { boxKey }) => {
        if (args.length < 1) return pika.reply("_What's the bug❓_");
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        const statement = args.join(" ");
        const reporter = pika.sender.split("@")[0];
	const mentions = [pika.sender, botNumber];
        const caption = [
            "`<⚠️> | BＵG！！ | <⚠️>`\n\n",
            `*| 🗣️ Bug Statement:* ${statement}`,
            `*| 🤖 Bot:* _@${botNumber.split("@")[0]}_`,
            `*| 👤 Reported By:* _@${reporter}_`
        ].join("\n");
        pika.reply("*💖 Thanks for reporting a bug!*");
	await anyaV2.sendReactionMedia(pika.chat, {
                reaction: "happy",
                caption: caption,
                mentions: mentions
            }, { quoted:pika });    
        const botConName = await anyaV2.getName(anyaV2.user.id);
        const botConQuote = {
            key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
            message: {
                contactMessage: {
                    displayName: botConName,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${botConName};;;\nFN:${botConName}\nitem1.TEL;waid=${botNumber.split("@")[0]}:${botNumber.split("@")[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
                    jpegThumbnail: Config.image_1,
                    thumbnailUrl: Config.imageUrl,
                    sendEphemeral: true
                }
            }
        };
        const inviteCode = boxKey.box.split("https://chat.whatsapp.com/")[1];
        const joinedGroup = await anyaV2.groupAcceptInvite(inviteCode);
	await delay(1000);
        await anyaV2.sendMessage(joinedGroup, { text: caption, mentions: mentions }, { quoted: botConQuote });
        await delay(1000);
        await anyaV2.groupLeave(joinedGroup);
    }
);

//༺─────────────────────────────────────

anya(
	{
		name: "uptime",
		alias: ['runtime'],
		react: "⏱️",
		category: "core",
		desc: "Get bot running time",
		filename: __filename
	},
	async (anyaV2, pika) => {
		return pika.reply("My Uptime : _" + formatRuntime(process.uptime()).trim() + "_");
	}
)

//༺─────────────────────────────────────

anya({
    name: "buttons",
    alias: ['button'],
    react: "🤍",
    category: "core",
    desc: "Enable or disable buttons",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const ui = db.UI[0] || await new UI({ id: "userInterface" }).save();
    if (!args[0] || (args[0].toLowerCase() !== "on" && args[0].toLowerCase() !== "off")) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off\n\n> Turn off buttons if WhatsApp patched the buttons.`);
    const isOn = args[0].toLowerCase() === "on";
    if (isOn && ui.buttons) return pika.reply("_Already Enabled Buttons..!_");
    if (!isOn && !ui.buttons) return pika.reply("_Already Disabled Buttons..!_");
    await UI.updateOne({ id: "userInterface" }, { $set: { buttons: isOn } }, { new: true })
    return pika.reply(isOn ? "✅ Buttons Turned On!" : "✅ Buttons Turned Off!");
});

//༺─────────────────────────────────────

anya({
    name: "restart",
    react: "♻️",
    category: "core",
    desc: "Use to restart the bot",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika) => {
    try {
        pika.reply("༄ᵇᵒᵗ᭄🔥⃝яєѕταяτιиg🖤⭔⭔➣");
        await delay(1500);
        const { exec } = require("child_process");
        exec('pm2 restart all', (error, stdout, stderr) => {
            if (error) return pika.reply("‼️Failed to restart the bot: " + error.message);
            if (stderr) return pika.reply("‼️PM2 stderr: " + stderr);
            pika.reply("_🦋Bot restarted successfully!_");
        });
    } catch (error) {
        const media = reactions.get("sad");
        return await anyaV2.sendReactionMedia(pika.chat, {
            buffer: media.buffer,
            extension: media.extension,
            caption: "_*⚠️ I'm not able to get restarted!*_\n\n`Reason:` " + error.message
        }, { quoted: pika });
    }
});

//༺─────────────────────────────────────

anya({
    name: "setreply",
    react: "⚙️",
    category: "core",
    desc: "Set text message reply type",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const types = {
        1: "Text Message",
        2: "Forwarded Text Message",
        3: "Group Invitation Message",
        4: "Channel Invitation Message",
        5: "Money Request Message"
    };
    const ui = db.UI[0] || await new UI({ id: "userInterface" }).save();
    const generateMessageList = () => {
        let messageList = '';
        for (const [key, value] of Object.entries(types)) {
            messageList += `${key}. ${value + (ui.reply === Number(key) ? " ✅" : "")}\n`;
        }
        return messageList;
    };
    if (!args[0]) {
        if (ui.buttons) {
            const butArray = [];
            const generateButtonList = () => {
                for (const [key, value] of Object.entries(types)) {
                    butArray.push(`{"header":"💬 ${value}","title":"${ui.reply === Number(key) ? fancy13("(✅ already selected)") : ""}","description":"𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘵𝘰 𝘴𝘦𝘭𝘦𝘤𝘵 𝘵𝘩𝘪𝘴 𝘰𝘱𝘵𝘪𝘰𝘯","id":"${prefix + command} ${key}"}`);
                }
                return butArray;
            };
            generateButtonList();
            return await anyaV2.sendButtonText(pika.chat, {
                text: `*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]} 👋🏻*\n\n> *Current Setting:* _${types[ui.reply]}_`,
                footer: Config.footer,
                buttons: [{ "name": "single_select", "buttonParamsJson": `{"title":"Select Here!","sections":[{"title":"Reply Message Format Types.","highlight_label":"${Config.botname}","rows":[${butArray.join(",")}]}]}` }],
                contextInfo: {
                    mentionedJid: [pika.sender]
                }
            }, { quoted: pika });
        } else {
            return pika.reply(`*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]}* ✨\n
\`Reply A Number To Choose Senpai!\`
\`\`\`
${await generateMessageList()}\`\`\`
> _ID: QA29_
`.trim(), { mentions: [pika.sender], forwarded: false });
        }
    }
    const optionNum = Number(args[0]);
    if (!optionNum || !types[optionNum]) return pika.reply(`_Invalid Option_`);
    if (optionNum === ui.reply) return pika.reply(`☑️ Already set as *${types[optionNum]}*`);
    pika.reply(Config.message.success);
    return await UI.updateOne({ id: "userInterface" }, { $set: { reply: optionNum } }, { new: true });
});

//༺─────────────────────────────────────

anya({
    name: "setmenu",
    react: "⚙️",
    category: "core",
    desc: "Set menu message type",
    rule: 1,
    need: "number",
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const types = {
        1: "Text Message",
        2: "Image Message",
        3: "Image Ad Reply",
        4: "Video Message",
        5: "GIF Message",
        6: "Money Request Msg",
        7: "Document Ad Reply",
        8: "Image Ad Reply 2",
        9: "GIF Ad Reply",
        10: "GIF Channel Ad Forward",
        11: "Image Button Message",
        12: "Video Button Message"
    };
    const ui = db.UI[0] || await new UI({ id: "userInterface" }).save();
    const generateMessageList = () => {
        let messageList = '';
        for (const [key, value] of Object.entries(types)) {
            messageList += `${key}. ${value + (ui.menu === Number(key) ? " ✅" : "")}\n`;
        }
        return messageList;
    };    
    if (!args[0]) {
        if (ui.buttons) {
            const butArray = [];
            const generateButtonList = () => {
                for (const [key, value] of Object.entries(types)) {
                    butArray.push(`{"header":"📃 ${value}","title":"${ui.menu === Number(key) ? fancy13("(✅ selected)") : ""}","description":"𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘵𝘰 𝘴𝘦𝘭𝘦𝘤𝘵 𝘵𝘩𝘪𝘴 𝘰𝘱𝘵𝘪𝘰𝘯","id":"${prefix + command} ${key}"}`);
                }
                return butArray;
            };
            generateButtonList();            
            return await anyaV2.sendButtonText(pika.chat, {
                text: `*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]} 👋🏻*\n\n> *Current Setting:* _${types[ui.menu]}_`,
                footer: Config.footer,
                buttons: [{ "name": "single_select", "buttonParamsJson": `{"title":"Select Here❗","sections":[{"title":"Menu Message Format Types.","highlight_label":"${Config.botname}","rows":[${butArray.join(",")}]}]}` }],
                contextInfo: {
                    mentionedJid: [pika.sender]
                }
            }, { quoted: pika });
            
        } else {
            return pika.reply(`*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]}* ✨\n
\`Reply A Number To Choose That Option!\`
\`\`\`
${await generateMessageList()}\`\`\`
> _ID: QA18_
`.trim(), { mentions: [pika.sender], forwarded: false });
        }
    }
    const optionNum = Number(args[0]);
    if (!optionNum || !types[optionNum]) return pika.reply(`_Invalid Option_`);
    if (optionNum === ui.menu) return pika.reply(`☑️ Menu message already set as *${types[optionNum]}*.`);
    pika.reply(Config.message.success);
    return await UI.updateOne({ id: "userInterface" }, { $set: { menu: optionNum } }, { new: true });
});


//༺─────────────────────────────────────

anya({
    name: "setlist",
    alias: ['setlistmenu'],
    react: "⚙️",
    category: "core",
    desc: "Set listmenu message type",
    rule: 1,
    need: "number",
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const types = {
        1: "Text Message",
        2: "Image Message",
        3: "Text Ad Reply",
        4: "Video Message",
        5: "GIF Message",
        6: "Document Ad Reply",
        7: "Image Button Message",
        8: "Video Button Message",
        9: "Image Button Message 2",
        10: "Video Button Message 2",
        11: "Text Button Message"
    };
    const ui = db.UI[0] || await new UI({ id: "userInterface" }).save();
    const generateMessageList = () => {
        let messageList = '';
        for (const [key, value] of Object.entries(types)) {
            messageList += `${key}. ${value + (ui.listmenu === Number(key) ? " ✅" : "")}\n`;
        }
        return messageList;
    };    
    if (!args[0]) {
        if (ui.buttons) {
            const butArray = [];
            const generateButtonList = () => {
                for (const [key, value] of Object.entries(types)) {
                    butArray.push(`{"header":"🔰 ${value}","title":"${ui.listmenu === Number(key) ? fancy13("(✅ selected)") : ""}","description":"𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘵𝘰 𝘴𝘦𝘭𝘦𝘤𝘵 𝘵𝘩𝘪𝘴 𝘰𝘱𝘵𝘪𝘰𝘯","id":"${prefix + command} ${key}"}`);
                }
                return butArray;
            };
            generateButtonList();
            return await anyaV2.sendButtonText(pika.chat, {
                text: `*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]} 👋🏻*\n\n> *Current Setting:* _${types[ui.listmenu]}_`,
                footer: Config.footer,
                buttons: [{ "name": "single_select", "buttonParamsJson": `{"title":"Choose Here🔰","sections":[{"title":"List Menu Message Format Types","highlight_label":"${Config.botname}","rows":[${butArray.join(",")}]}]}` }],
                contextInfo: {
                    mentionedJid: [pika.sender]
                }
            }, { quoted: pika });
        } else {
            return pika.reply(`*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]}* ✨\n
\`Reply A Number To Choose That Option!\`
\`\`\`
${await generateMessageList()}\`\`\`
> _ID: QA44_
`.trim(), { mentions: [pika.sender], forwarded: false });
        }
    }
    const optionNum = Number(args[0]);
    if (!optionNum || !types[optionNum]) return pika.reply(`_Invalid Option_`);
    if (optionNum === ui.listmenu) return pika.reply(`☑️ Listmenu message already set as *${types[optionNum]}*.`);
    pika.reply(Config.message.success);
    return await UI.updateOne({ id: "userInterface" }, { $set: { listmenu: optionNum } }, { new: true });
});

//༺─────────────────────────────────────

anya({
    name: "setalive",
    react: "⚙️",
    category: "core",
    desc: "Set alive message type",
    rule: 1,
    need: "number",
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => { // Added 'db' to the parameters
    const types = {
        1: "Text Message",
        2: "Image Message",
        3: "Image Ad Reply",
        4: "Video Message",
        5: "GIF Message",
        6: "Money Request Msg",
        7: "Document Ad Reply",
        8: "Image Ad Reply 2",
        9: "GIF Ad Reply",
        10: "GIF Channel Ad Forward",
        11: "Image Button Message",
        12: "Video Button Message"
    };
    const ui = db.UI[0] || await new UI({ id: "userInterface" }).save();
    const generateMessageList = () => {
        let messageList = '';
        for (const [key, value] of Object.entries(types)) {
            messageList += `${key}. ${value + (ui.alive === Number(key) ? " ✅" : "")}\n`;
        }
        return messageList;
    };
    if (!args[0]) {
        if (ui.buttons) {
            const butArray = [];
            const generateButtonList = () => {
                for (const [key, value] of Object.entries(types)) {
                    butArray.push(`{"header":"🍉 ${value}","title":"${ui.alive === key ? fancy13("(✅ selected)") : ""}","description":"𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘵𝘰 𝘴𝘦𝘭𝘦𝘤𝘵 𝘵𝘩𝘪𝘴 𝘰𝘱𝘵𝘪𝘰𝘯","id":"${prefix + command} ${key}"}`);
                }
                return butArray;
            };
            generateButtonList();
            return await anyaV2.sendButtonText(pika.chat, {
                text: `*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]} 👋🏻*\n\n> *Current Setting:* _${types[ui.alive]}_`,
                footer: Config.footer,
                buttons: [{ "name": "single_select", "buttonParamsJson": `{"title":"Choose Here❗","sections":[{"title":"Alive Message Format Types","highlight_label":"${Config.botname}","rows":[${butArray.join(",")}]}]}` }],
                contextInfo: {
                    mentionedJid: [pika.sender]
                }
            }, { quoted: pika });
        } else {
            return pika.reply(`*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]}* ✨\n
\`Reply A Number To Set Alive Message Type!\`
\`\`\`
${await generateMessageList()}\`\`\`
> _ID: QA28_
`.trim(), { mentions: [pika.sender], forwarded: false });
        }
    }
    const optionNum = Number(args[0]);
    if (!optionNum || !types[optionNum]) return pika.reply(`_Invalid Option_`);
    if (optionNum === ui.alive) return pika.reply(`☑️ Alive message already set as *${types[optionNum]}*.`);
    pika.reply(Config.message.success);
    return await UI.updateOne({ id: "userInterface" }, { $set: { alive: optionNum } }, { new: true });
});

//༺─────────────────────────────────────

anya({
    name: "setgreetings",
    alias: ["setgreeting"],
    react: "⚙️",
    category: "core",
    desc: "Set welcome/left message type",
    rule: 1,
    need: "number",
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => { // Added 'db' to the parameters
    const types = {
        1: "Text Message",
        2: "Image Message",
        3: "Image Message 2",
        4: "Image Message 3",
        5: "Text Ad Message",
        6: "Text Ad Message 2",
        7: "GIF Message",
        8: "GIF Message 2",
        9: "GIF Message 3",
        10: "Button Image Message",
        11: "Button Image Message 2"
    };
    const ui = db.UI[0] || await new UI({ id: "userInterface" }).save();
    const generateMessageList = () => {
        let messageList = '';
        for (const [key, value] of Object.entries(types)) {
            messageList += `${key}. ${value + (ui.alive === Number(key) ? " ✅" : "")}\n`;
        }
        return messageList;
    };
    if (!args[0]) {
        if (ui.buttons) {
            const butArray = [];
            const generateButtonList = () => {
                for (const [key, value] of Object.entries(types)) {
                    butArray.push(`{"header":"💕 ${value}","title":"${ui.greetings === key ? fancy13("(✅ selected)") : ""}","description":"𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘵𝘰 𝘴𝘦𝘭𝘦𝘤𝘵 𝘵𝘩𝘪𝘴 𝘰𝘱𝘵𝘪𝘰𝘯","id":"${prefix + command} ${key}"}`);
                }
                return butArray;
            };
            generateButtonList();
            return await anyaV2.sendButtonText(pika.chat, {
                text: `*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]} 👋🏻*\n\n> *Current Setting:* _${types[ui.greetings]}_`,
                footer: Config.footer,
                buttons: [{ "name": "single_select", "buttonParamsJson": `{"title":"Choose Here❗","sections":[{"title":"Welcome/Left Message Format Types","highlight_label":"${Config.botname}","rows":[${butArray.join(",")}]}]}` }],
                contextInfo: {
                    mentionedJid: [pika.sender]
                }
            }, { quoted: pika });
        } else {
            return pika.reply(`*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]}* ✨\n
\`Reply A Number To Set Alive Message Type!\`
\`\`\`
${await generateMessageList()}\`\`\`
> _ID: QA39_
`.trim(), { mentions: [pika.sender], forwarded: false });
        }
    }
    const optionNum = Number(args[0]);
    if (!optionNum || !types[optionNum]) return pika.reply(`_Invalid Option_`);
    if (optionNum === ui.greetings) return pika.reply(`☑️ Greetings message already set as *${types[optionNum]}*.`);
    pika.reply(Config.message.success);
    return await UI.updateOne({ id: "userInterface" }, { $set: { greetings: optionNum } }, { new: true });
});

//༺------------------------------------------------------------------------------------------------

anya({
    name: "setytsmsg",
    react: "⚙️",
    category: "core",
    desc: "Set YouTube search message reply type",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const types = {
        1: "Text List",
        2: "Image List Message",
        3: "Cards Image Message"
    };
    const ui = db.UI[0] || await new UI({ id: "userInterface" }).save();
    const generateMessageList = () => {
        let messageList = '';
        for (const [key, value] of Object.entries(types)) {
            messageList += `${key}. ${value + (ui.ytsmsg === Number(key) ? " ✅" : "")}\n`;
        }
        return messageList;
    };
    if (!args[0]) {
        if (ui.buttons) {
            const butArray = [];
            const generateButtonList = () => {
                for (const [key, value] of Object.entries(types)) {
                    butArray.push(`{"header":"❤️ ${value}","title":"${ui.ytsmsg === Number(key) ? fancy13("(✅ already selected)") : ""}","description":"𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘵𝘰 𝘴𝘦𝘭𝘦𝘤𝘵 𝘵𝘩𝘪𝘴 𝘰𝘱𝘵𝘪𝘰𝘯","id":"${prefix + command} ${key}"}`);
                }
                return butArray;
            };
            generateButtonList();
            return await anyaV2.sendButtonText(pika.chat, {
                text: `*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]} 👋🏻*\n\n> *Current Setting:* _${types[ui.ytsmsg]}_`,
                footer: Config.footer,
                buttons: [{ "name": "single_select", "buttonParamsJson": `{"title":"Select Here!","sections":[{"title":"YouTube search Message Format Types.","highlight_label":"${Config.botname}","rows":[${butArray.join(",")}]}]}` }],
                contextInfo: {
                    mentionedJid: [pika.sender]
                }
            }, { quoted: pika });
        } else {
            return pika.reply(`*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]}* ✨\n
\`Reply A Number To Choose Senpai!\`
\`\`\`
${await generateMessageList()}\`\`\`
> _ID: QA47_
`.trim(), { mentions: [pika.sender], forwarded: false });
        }
    }
    const optionNum = Number(args[0]);
    if (!optionNum || !types[optionNum]) return pika.reply(`_Invalid Option_`);
    if (optionNum === ui.ytsmsg) return pika.reply(`☑️ Already set as *${types[optionNum]}*`);
    pika.reply(Config.message.success + "\n\n> ⚠️ Not effective if `buttons` are `off`");
    return await UI.updateOne({ id: "userInterface" }, { $set: { ytsmsg: optionNum } }, { new: true });
});

//༺─────────────────────────────────────

anya({
    name: "prefix",
    react: "🎀",
    category: "core",
    desc: "Change prefix to single or multiple",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const bot = db.Bot?.[0];
    const ui = db.UI?.[0] || await new UI({ id: "userInterface" }).save();    
    const greeting = `*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]} 👋🏻*`;
    const currentPrefix = `> *Current Prefix Mode:* _${bot?.prefix || "unknown"}_`;
    const prefixInfo = `
\`1️⃣ Single :\` The bot will respond only to a single specific prefix, set to "${Config.prefa}".
\`2️⃣ Multi :\` The bot will respond to any of a set of common prefixes.
\`3️⃣ All/No :\` This feature is coming soon and will allow the bot to listen with any prefix or none at all.`.trim();
    const message = `${greeting}\n\n${prefixInfo}\n\n${currentPrefix}`;
    if (!args[0]) {
        if (ui.buttons) {
            return await anyaV2.sendButtonText(pika.chat, {
                text: message,
                footer: Config.footer,
                buttons: [
                    {
                        name: "quick_reply",
                        buttonParamsJson: `{"display_text":"🌀 Single Prefix ${bot?.prefix === "single" ? "• (selected)" : ""}","id":"${prefix}prefix single"}`
                    },
                    {
                        name: "quick_reply",
                        buttonParamsJson: `{"display_text":"🌀 Multi Prefix ${bot?.prefix === "multi" ? "• (selected)" : ""}","id":"${prefix}prefix multi"}`
                    }
                ],
                contextInfo: { mentionedJid: [pika.sender] }
            }, { quoted: pika });
        }
        return pika.reply(`${message}\n\nReply with a number to select:
- 1. single ${bot?.prefix === "single" ? "_(✅selected)_" : ""}
- 2. multi ${bot?.prefix === "multi" ? "_(✅selected)_" : ""}
- 3. all ${bot?.prefix === "all" ? "_(✅selected)_" : ""}

> _ID: QA38_`, { mentions: [pika.sender], forwarded: false });
    }
    const newPrefix = args[0].toLowerCase();
    switch (newPrefix) {
        case "single":
            if (bot?.prefix === "single") {
                return pika.reply("_Already Enabled *Single Prefix*_");
            } else {
                await Bot.updateOne({ id: "anyabot" }, { prefix: "single" });
                return pika.reply(Config.message.success);
            }
        case "multi":
            if (bot?.prefix === "multi") {
                return pika.reply("_Already Enabled Multi Prefix Support_");
            } else {
                await Bot.updateOne({ id: "anyabot" }, { prefix: "multi" });
                return pika.reply(Config.message.success);
            }
        default:
            return pika.reply(`
*Example:* ${prefix + command} single/multi/all

${prefixInfo}
`.trim());
    }
});

//༺─────────────────────────────────────

anya({
    name: "mode",
    react: "🍭",
    category: "core",
    desc: "Set bot work type",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const bot = db.Bot?.[0];
    const ui = db.UI?.[0] || await new UI({ id: "userInterface" }).save();
    const system = db.System?.[0] || await new System({ id: "system" }).save();
    let reply = "";
    const greeting = `*${greetTime(2).greetingWithEmoji} @${pika.sender.split("@")[0]} 👋🏻*`;
    const currentMode = `> *Current Work Type:* _${bot?.worktype || "unknown"}_`;
    if (!args[0]) {
        if (ui.buttons) {
            return await anyaV2.sendButtonText(pika.chat, {
                text: `${greeting}\n\n${currentMode}`,
                footer: Config.footer,
                buttons: [
                    { name: "quick_reply", buttonParamsJson: `{"display_text":"Public 👥 ${bot?.worktype === "public" ? "(selected)" : ""}","id":"${prefix}mode public"}` },
                    { name: "quick_reply", buttonParamsJson: `{"display_text":"Self 👤 ${bot?.worktype === "self" ? "(selected)" : ""}","id":"${prefix}mode self"}` }
                ],
                contextInfo: { mentionedJid: [pika.sender] }
            }, { quoted: pika });
        }
        return pika.reply(`${greeting}\n
\`Reply a number to select:\`

- 1. public ${bot?.worktype === "public" ? "_(✅selected)_" : ""}
- 2. self ${bot?.worktype === "self" ? "_(✅selected)_" : ""}
- 3. onlyAdmins ${bot?.worktype === "onlyAdmins" ? "_(✅selected)_" : ""}

> _ID: QA37_`, { mentions: [pika.sender], forwarded: false });
    }
    const mode = args[0].toLowerCase();
    switch (mode) {
        case "public":
            if (bot?.worktype === "public") {
                reply = "_Already Enabled Public Mode_";
            } else {
                await Bot.updateOne({ id: "anyabot" }, { worktype: "public" });
                reply = Config.message.success;
            }
            break;
        case "self":
        case "private":
            if (bot?.worktype === "self") {
                reply = "_Already Enabled Self Mode_";
            } else {
                await Bot.updateOne({ id: "anyabot" }, { worktype: "self" });
                reply = Config.message.success;            
                if (system.chatbot) {
                    await System.updateOne({ id: "system" }, { chatbot: false });
                    reply += "\n> ☑️ Chatbot turned off, as it can't be used in self mode.";
                }
            }
            break;
        case "onlyadmin":
            return pika.reply("_❗This mode is coming soon..._");
        default:
            return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} public/self/onlyadmin`);
    }
    return pika.reply(reply);
});


//༺─────────────────────────────────────

anya({
            name: "setcmd",
            alias: ['addcmd'],
            react: "🌟",
            category: "core",
            desc: "Add media as command",
            rule: 1,
            need: "media",
            filename: __filename
      }, async (anyaV2, pika, { db, args, prefix, command }) => {
         const text = args.join(" ");
         if (!pika.quoted) return pika.reply(`Reply an *image/sticker/video* media message..! 🤍`);
         if (!/image|video|sticker|audio|viewOnceMessage/.test(pika.quoted.mtype)) return pika.reply(`Baka! it's not a media message..! 😑`);
         if (/video/.test(pika.quoted.mtype)) {
            if ((pika.quoted.msg || pika.quoted).seconds > 30) return pika.reply(`‼️ Video media should be *less* than \`30\` seconds.`);
         }
         if (!pika.quoted.fileSha256) return pika.reply(`‼️ Can't use this media, SHA256 hash is missing..!`);
         if (!args[0]) return pika.reply(`💬 Enter a command name also to exicute *like:*\n\n\`${prefix + command} ${prefix}menu\``);
         const hash = pika.quoted.fileSha256.toString('base64');
         const cmd = await Cmd.findOne({ id: "cmd" }) || await new Cmd({ id: "cmd" }).save();
         if (cmd.setcmd.has(hash) && cmd.setcmd.get(hash).locked) return pika.reply(`❌ This media is locked for command \`${cmd.setcmd.get(hash).command}\`.`);
         if (cmd.setcmd.has(hash) && cmd.setcmd.get(hash).command === text.toLowerCase()) return pika.reply(`☑️ This media is *already registered* for this command..!`);
         const structureData = {
            locked: false,
            command: text.toLowerCase(),
            type: pika.quoted.mtype.split("Message")[0],
            creator: pika.sender.split("@")[0],
            mentions: pika.mentionedJid
         };
         pika.reply(`✅ Media *added* as \`${text}\` command`, { mentions: pika.mentionedJid });
         return cmd.set(`setcmd.${hash}`, structureData).save();
      }
)

//༺─────────────────────────────────────

anya({
            name: "delcmd",
            react: "🗑️",
            category: "core",
            desc: "Delete media for cmd list",
            rule: 1,
            need: "media",
            filename: __filename
      }, async (anyaV2, pika, { args }) => {
         const text = args.join(" ");
         if (!pika.quoted) return pika.reply(`Reply an *image/sticker/video* media message to delete cmd..! 💜`);
         if (!/image|video|sticker|audio|viewOnceMessage/.test(pika.quoted.mtype)) return pika.reply(`Baka! it's not a media message again..! 😑`);
         if (!pika.quoted.fileSha256) return pika.reply(`‼️ Can't find this media, SHA256 hash is missing..!`);
         const hash = pika.quoted.fileSha256.toString('base64');
         const cmd = await Cmd.findOne({ id: "cmd" }) || await new Cmd({ id: "cmd" }).save();
         if (!cmd.setcmd.has(hash)) return pika.reply(`❌ This media *isn't registered* for any cmd..!`);
         cmd.setcmd.delete(hash);
         await cmd.save();
         return pika.reply(`🗑️ Media *deleted* successfully..!`);
      }
)

//༺─────────────────────────────────────

anya({
        name: "delcmdhash",
        react: "🗑️",
        rule: 1,
        notCmd: true,
        filename: __filename
}, async (anyaV2, pika, { args }) => {
    if (!args[0]) return pika.reply(`‼️ Please enter the existing media hash..!`);
    const cmd = await Cmd.findOne({ id: "cmd" }) || await new Cmd({ id: "cmd" }).save();
    let c = 0;
    let failed = 0;
    for (let i of args) {
        if (!cmd.setcmd.has(i)) {
            failed++;
            continue;
        }
        cmd.setcmd.delete(i);
        c++;
    }
    await cmd.save();
    const reply = `${failed < 1 ? "" : `❌ \`${failed}\` Media(s) *doesn't exist*..!\n\n`}${c < 1 ? "" : `🗑️ \`${c}\` Media(s) *deleted* successfully..!`}`;
    return pika.reply(reply.trim());
});

//༺─────────────────────────────────────

anya({
            name: "lockcmd",
            react: "🔒",
            category: "core",
            desc: "You can't change the command name of the cmd",
            rule: 1,
            need: "media",
            filename: __filename
      }, async (anyaV2, pika, { args }) => {
         const text = args.join(" ");
         if (!pika.quoted) return pika.reply(`Reply an *image/sticker/video* media message to lock cmd..! 💚`);
         if (!/image|video|sticker|viewOnceMessage/.test(pika.quoted.mtype)) return pika.reply(`Baka! it's not a media message again..! 😑`);
         if (!pika.quoted.fileSha256) return pika.reply(`‼️ Can't find this media, SHA256 hash is missing..!`);
         const hash = pika.quoted.fileSha256.toString('base64');
         const cmd = await Cmd.findOne({ id: "cmd" }) || await new Cmd({ id: "cmd" }).save();
         if (!cmd.setcmd.has(hash)) return pika.reply(`❌ This media *isn't registered* for any cmd..!`);
         if (cmd.setcmd.has(hash) && cmd.setcmd.get(hash).locked) return pika.reply(`☑️ This media is *already* locked for \`${cmd.setcmd.get(hash).command}\` command.`);
         cmd.setcmd.get(hash).locked = true;
         await cmd.save();
         return pika.reply(`🔒 Locked this media for \`${cmd.setcmd.get(hash).command}\` command successfully..!`, { mentions: pika.mentionedJid });
      }
)

//༺─────────────────────────────────────

anya({
            name: "unlockcmd",
            react: "🔓",
            category: "core",
            desc: "You can now change the command name of the cmd",
            rule: 1,
            filename: __filename
      }, async (anyaV2, pika, { args }) => {
         const text = args.join(" ");
         if (!pika.quoted) return pika.reply(`Reply an *image/sticker/video* media message to unlock cmd..! 💛`);
         if (!/image|video|sticker|viewOnceMessage/.test(pika.quoted.mtype)) return pika.reply(`Baka! it's not a media message again..! 😑`);
         if (!pika.quoted.fileSha256) return pika.reply(`‼️ Can't find this media, SHA256 hash is missing..!`);
         const hash = pika.quoted.fileSha256.toString('base64');
         const cmd = await Cmd.findOne({ id: "cmd" }) || await new Cmd({ id: "cmd" }).save();
         if (!cmd.setcmd.has(hash)) return pika.reply(`❌ This media *isn't registered* for any cmd..!`);
         if (cmd.setcmd.has(hash) && !cmd.setcmd.get(hash).locked) return pika.reply(`☑️ This media isn't locked.`);
         cmd.setcmd.get(hash).locked = false;
         await cmd.save();
         return pika.reply(`🔓 Unlocked this media successfully..!`);
      }
)

//༺─────────────────────────────────────

anya({
    name: "listcmd",
    react: "🏵️",
    category: "core",
    desc: "See all media bash64 code with detail list",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const cmd = await Cmd.findOne({ id: "cmd" }) || await new Cmd({ id: "cmd" }).save();
    if (cmd.setcmd.size < 1) return pika.reply(`❌ No commands found!`);
    let results = [];
    let mentions = [];
    for (let [bash64, details] of cmd.setcmd.entries()) {
        mentions.push(details.creator + "@s.whatsapp.net");
        results.push({
            bash64: bash64,
            creator: details.creator,
            command: details.command,
            type: details.type,
            locked: details.locked
        });
    }
    const ui = db.UI?.[0] || (await new UI({ id: "userInterface" }).save());
    if (ui.buttons) {
        const butArray = [];
        for (let i = 0; i < results.length; i++) {
            butArray.push(`{"header":"${results[i].locked ? "🔒" : ""} ${results[i].command}","title":"${fancy13("Type: " + results[i].type)}","description":"${results[i].bash64}","id":"${prefix}delcmdhash ${results[i].bash64}"}`);
        }
        const hashlist = [];
        for (let i = 0; i < results.length; i++) {
            hashlist.push(results[i].bash64);
        }
        return await anyaV2.sendButtonText(pika.chat, {
            text: `
*${greetTime(2).greetingWithEmoji}, @${pika.sender.split("@")[0]}! 👋🏻*

*🍎 User:* _@${pika.sender.split("@")[0]}_
*🦋 Bot:* _${Config.botname}_
*👤 Owner:* _${Config.ownername}_
*📃 Total Hashes:* _${cmd.setcmd.length} cmds_
`.trim(),
            footer: Config.footer,
            buttons: [{ "name": "single_select", "buttonParamsJson": `{"title":"Select Command Hash 🍎","sections":[{"title":"🌟 𝗧𝗮𝗽 𝗛𝗲𝗿𝗲 𝗧𝗼 𝗗𝗲𝗹𝗲𝘁𝗲 𝗘𝘃𝗲𝗿𝘆 𝗛𝗮𝘀𝗵 🌟","highlight_label":"${Config.botname}","rows":[{"header":"💖 Delete Every Hash 💖","title":"","description":"𝘤𝘭𝘪𝘤𝘬 𝘩𝘦𝘳𝘦 𝘵𝘰 𝘥𝘦𝘭𝘦𝘵𝘦 𝘦𝘷𝘦𝘳𝘺 𝘩𝘢𝘴𝘩","id":"${prefix}delcmdhash ${hashlist.join(" ")}"}]},{"title":"𝗦𝗲𝗹𝗲𝗰𝘁 𝘁𝗼 𝗱𝗲𝗹𝗲𝘁𝗲 𝗗𝗮𝗿𝗹𝗶𝗻𝗴 💓📃","highlight_label":"${Config.botname}","rows":[${butArray.join(",")}]}]}` }],
            contextInfo: {
                mentionedJid: [pika.sender]
            }
        }, { quoted: pika });
    } else {
        const cmdlist = results.map((item, index) => 
        `*${Config.themeemoji}Hash (${index + 1}):* ${item.locked ? `\`${item.bash64}\`` : item.bash64}
> _👤 Creator: @${item.creator}_
> _📡 Type: ${item.type}_
> _🔒 Locked: ${item.locked ? "Yes" : "No"}_
> _🌟 Command: ${item.command}_`).join('\n\n');
        return pika.reply(`═══════════════════════
        *🌉 Cmd Hash List..! 🌉*
═══════════════════════
_Info: \`highlighted\` hash is locked._

*\`Reply Number:\`*
- _Reply 0 to delete all hashes_
- _Reply a specific number to delete that hash_
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

${cmdlist}

> _ID: QA30_
`.trim(), { mentions: mentions });
    }
});
