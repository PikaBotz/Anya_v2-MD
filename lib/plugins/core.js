const Config = require('../../config');
const {
    anya,
    delay,
    UI,
    Bot,
    System,
    Cmd,
    reactions,
    fancy13
} = require('../lib');

//༺─────────────────────────────────────

anya({
    name: "buttons",
    react: "🤍",
    category: "core",
    desc: "Enable buttons",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    const ui = await UI.findOne({ id: "userInterface" }) || await new UI({ id: "userInterface" }).save();
    if (/on/.test(args[0])) {
        if (ui.buttons) return pika.reply("_Already Enabled Buttons..!_");
        await UI.updateOne({ id: "userInterface" }, { $set: { buttons: true } }, { new: true });
        return pika.reply("✅ Buttons Turned On!");
    } else if (/off/.test(args[0])) {
        if (!ui.buttons) return pika.reply("_Already Disabled Buttons..!_");
        await UI.updateOne({ id: "userInterface" }, { $set: { buttons: false } }, { new: true });
        return pika.reply("✅ Buttons Turned Off!");
    } else {
        pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off\n\n> Turn off buttons if WhatsApp patched the buttons.`);
    }
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
            caption: "_*⚠️ I'm not able to get restarted!*_\n\n_`Reason:` " + error.message
        }, { quoted: pika });
    }
});

//༺─────────────────────────────────────

anya({
    name: "setreply",
    react: "⚙️",
    category: "core",
    desc: "Set text message reply message type",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { args }) => {
    const types = {
        1: "Text Message",
        2: "Forwarded Text Message",
        3: "Group Invitation Message",
        4: "Channel Invitation Message",
        5: "Money Request Message"
    };
    const ui = await UI.findOne({ id: "userInterface" }) || await new UI({ id: "userInterface" }).save();
    const generateMessageList = () => {
        let messageList = '';
        for (const [key, value] of Object.entries(types)) {
            messageList += `${key}. ${value}\n`;
        }
        return messageList;
    };
    if (!args[0]) {
        if (ui.buttons) {
            const butArray = [];
            const generateButtonList = () => {
                for (const [key, value] of Object.entries(types)) {
                    butArray.push(`{\"header\":\"${value}\",\"title\":\"${ui.reply === Number(key) ? fancy13("(selected)") : ""}\",\"description\":\"𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘁𝗼 𝘀𝗲𝗹𝗲𝗰𝘁\",\"id\":\"${prefix + command} ${key}\"}`);
                }
                return butArray;
            };
            generateButtonList();
            return await anyaV2.sendButtonText(pika.chat, {
                text: `
*Heya! @${pika.sender.split("@")[0]} 👋🏻*

*🍎 User:* _@${pika.sender.split("@")[0]}_
*🦋 Bot:* _${Config.botname}_
*👤 Owner:* _${Config.ownername}_
*🌟 Current Reply Type:* _type ${ui.reply}_

_Choose the option below to select reply message type._
`.trim(),
                footer: Config.footer,
                buttons: [{ "name": "single_select", "buttonParamsJson": `{\"title\":\"Choose Reply Message Type 💬\",\"sections\":[{\"title\":\"𝗖𝗵𝗼𝗼𝘀𝗲 𝗥𝗲𝗽𝗹𝘆 𝗧𝘆𝗽𝗲 𝗕𝗮𝗸𝗮 ✍🏻\",\"highlight_label\":\"${Config.botname}\",\"rows\":[${butArray.join(",")}]}]}` }],
                contextInfo: {
                    mentionedJid: [pika.sender]
                }
            }, { quoted: pika });
        } else {
            return pika.reply(`*Hey! @${pika.sender.split("@")[0]}* ✨\n
\`Reply A Number To Choose Senpai!\`
\`\`\`
${await generateMessageList()}\`\`\`
> _ID: QA29_
`.trim(), { mentions: [pika.sender], forwarded: false });
        }
    }
    const optionNum = Number(args[0]);
    if (!optionNum || !types[optionNum]) return pika.reply(`❌ Oh no! That option is not valid, Senpai! Please pick a valid number!`);
    if (optionNum === ui.reply) return pika.reply(`☑️ Already set as *${types[optionNum]}* for text reply, Senpai.`);
    await UI.updateOne({ id: "userInterface" }, { $set: { reply: optionNum } }, { new: true });
    return pika.reply(`✅ Successfully enabled \`${types[optionNum]}\` as *text reply* type! 🎉`);
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
}, async (anyaV2, pika, { args }) => {
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
    const ui = await UI.findOne({ id: "userInterface" }) || await new UI({ id: "userInterface" }).save();
    const generateMessageList = () => {
        let messageList = '';
        for (const [key, value] of Object.entries(types)) {
            messageList += `${key}. ${value}\n`;
        }
        return messageList;
    };
    if (!args[0]) {
        if (ui.buttons) {
            const butArray = [];
            const generateButtonList = () => {
                for (const [key, value] of Object.entries(types)) {
                    butArray.push(`{\"header\":\"${value}\",\"title\":\"${ui.menu === Number(key) ? fancy13("(selected)") : ""}\",\"description\":\"𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘁𝗼 𝘀𝗲𝗹𝗲𝗰𝘁\",\"id\":\"${prefix + command} ${key}\"}`);
                }
                return butArray;
            };
            generateButtonList();
            return await anyaV2.sendButtonText(pika.chat, {
                text: `
*Heya! @${pika.sender.split("@")[0]} 👋🏻*

*🍎 User:* _@${pika.sender.split("@")[0]}_
*🦋 Bot:* _${Config.botname}_
*👤 Owner:* _${Config.ownername}_
*🌟 Current Menu Type:* _type ${ui.menu}_

_Choose the option below to select menu message type._
`.trim(),
                footer: Config.footer,
                buttons: [{ "name": "single_select", "buttonParamsJson": `{\"title\":\"Choose Menu Message Type 📝\",\"sections\":[{\"title\":\"𝗖𝗵𝗼𝗼𝘀𝗲 𝗠𝗲𝗻𝘂 𝗧𝘆𝗽𝗲 𝗕𝗮𝗸𝗮 ✍🏻\",\"highlight_label\":\"${Config.botname}\",\"rows\":[${butArray.join(",")}]}]}` }],
                contextInfo: {
                    mentionedJid: [pika.sender]
                }
            }, { quoted: pika });
        } else {
            return pika.reply(`*Hey! @${pika.sender.split("@")[0]}* ✨\n
\`Reply A Number To Choose That Option!\`
\`\`\`
${await generateMessageList()}\`\`\`
> _ID: QA18_
`.trim(), { mentions: [pika.sender], forwarded: false });
        }
    }
    const optionNum = Number(args[0]);
    if (!optionNum || !types[optionNum]) return pika.reply(`❌ Oopsie! Invalid option type, Senpai. Choose a valid number!`);
    if (optionNum === ui.menu) return pika.reply(`☑️ Menu message already set as *${types[optionNum]}*.`);
    await UI.updateOne({ id: "userInterface" }, { $set: { menu: optionNum } }, { new: true });
    return pika.reply(`✅ Successfully enabled \`${types[optionNum]}\` as *menu type*! 🎉`);
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
}, async (anyaV2, pika, { args }) => {
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
    const ui = await UI.findOne({ id: "userInterface" }) || await new UI({ id: "userInterface" }).save();
    const generateMessageList = () => {
        let messageList = '';
        for (const [key, value] of Object.entries(types)) {
            messageList += `${key}. ${value}\n`;
        }
        return messageList;
    };
    if (!args[0]) {
        if (ui.buttons) {
            const butArray = [];
            const generateButtonList = () => {
                for (const [key, value] of Object.entries(types)) {
                    butArray.push(`{\"header\":\"${value}\",\"title\":\"${ui.alive === key ? fancy13("(selected)") : ""}\",\"description\":\"𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘁𝗼 𝘀𝗲𝗹𝗲𝗰𝘁\",\"id\":\"${prefix + command} ${key}\"}`);
                }
                return butArray;
            };
            generateButtonList();
            return await anyaV2.sendButtonText(pika.chat, {
                text: `
*Heya, @${pika.sender.split("@")[0]}! 👋🏻*

*🍎 User:* _@${pika.sender.split("@")[0]}_
*🦋 Bot:* _${Config.botname}_
*👤 Owner:* _${Config.ownername}_
*🌟 Current Alive Type:* _type ${ui.alive}_

_Choose the option below to set the alive message type._
`.trim(),
                footer: Config.footer,
                buttons: [{ "name": "single_select", "buttonParamsJson": `{\"title\":\"Choose Alive Message Type 📝\",\"sections\":[{\"title\":\"𝗖𝗵𝗼𝗼𝘀𝗲 𝗔𝗹𝗶𝘃𝗲 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗧𝘆𝗽𝗲 𝗕𝗮𝗸𝗮 ✍🏻\",\"highlight_label\":\"${Config.botname}\",\"rows\":[${butArray.join(",")}]}]}` }],
                contextInfo: {
                    mentionedJid: [pika.sender]
                }
            }, { quoted: pika });
        } else {
            return pika.reply(`*Heya!! @${pika.sender.split("@")[0]}* ✨\n
\`Reply A Number To Set Alive Message Type!\`
\`\`\`
${await generateMessageList()}\`\`\`
> _ID: QA28_
`.trim(), { mentions: [pika.sender], forwarded: false });
        }
    }
    const optionNum = Number(args[0]);
    if (!optionNum || !types[optionNum]) return pika.reply(`❌ Oopsie! That option is not valid, Senpai! Pick a valid number!`);
    if (optionNum === ui.alive) return pika.reply(`☑️ Alive message already set as *${types[optionNum]}*.`);
    await UI.updateOne({ id: "userInterface" }, { $set: { alive: optionNum } }, { new: true });
    return pika.reply(`✅ Successfully enabled \`${types[optionNum]}\` as *alive message* type! 🎉`);
});

//༺─────────────────────────────────────

anya({
    name: "prefix",
    react: "🎀",
    category: "core",
    desc: "Change prefix to single or multiple",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    const text = args.join(" ").toLowerCase();
    const bot = await Bot.findOne({ id: "anyabot" });
    const ui = await UI.findOne({ id: "userInterface" }) || await new UI({ id: "userInterface" }).save();
    if (!args[0]) {
        if (ui.buttons) {
            return await anyaV2.sendButtonText(pika.chat, {
                text: `
*Heya! @${pika.sender.split("@")[0]} 👋🏻*

*🍎 User:* _@${pika.sender.split("@")[0]}_
*🦋 Bot:* _${Config.botname}_
*👤 Owner:* _${Config.ownername}_

*🌟 Current Prefix Mode:* _${bot.prefix}_

_Choose an option below to change the prefix mode._
`.trim(),
                footer: Config.footer,
                buttons: [
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Single Prefix 🎀 ${bot.prefix === "single" ? "(selected)" : ""}\",\"id\":\"${Config.prefa}prefix single\"}`
                    },
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Multi Prefix 🎀 ${bot.prefix === "multi" ? "(selected)" : ""}\",\"id\":\"${Config.prefa}prefix multi\"}`
                    }
                ],
                contextInfo: {
                    mentionedJid: [pika.sender]
                }
            }, { quoted: pika });
        } else {
            return pika.reply(`*Heya!! @${pika.sender.split("@")[0]}*\n
\`Reply a number to select:\`

- 1. single
- 2. multi

> _ID: QA38_
`.trim(), { mentions: [pika.sender], forwarded: false });
        }
    }
    if (/single/.test(text)) {
        if (bot.prefix === "single") {
            return pika.reply("_⭕ Already Enabled Single Prefix_");
        } else {
            await Bot.updateOne({ id: "anyabot" }, { prefix: "single" });
            return pika.reply("✅ Enabled Single Prefix");
        }
    } else if (/multi|multiple/.test(text)) {
        if (bot.prefix === "multi") {
            return pika.reply("_⭕ Already Enabled Multi Prefix Support_");
        } else {
            await Bot.updateOne({ id: "anyabot" }, { prefix: "multi" });
            return pika.reply("✅ Enabled Multi Prefix");
        }
    } else {
        return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} single/multi\n\n• Single: bot will obey the commands that only start with *"${Config.prefa}"*\n• Multi: bot will obey every command with every prefix except *no prefix*`);
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
}, async (anyaV2, pika, { args, prefix, command }) => {
    const text = args.join(" ").toLowerCase();
    const bot = await Bot.findOne({ id: "anyabot" });
    const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
    const reply = [];
    const ui = await UI.findOne({ id: "userInterface" }) || await new UI({ id: "userInterface" }).save();
    if (!args[0]) {
        if (ui.buttons) {
            return await anyaV2.sendButtonText(pika.chat, {
                text: `
*Heya! @${pika.sender.split("@")[0]} 👋🏻*

*🍎 User:* _@${pika.sender.split("@")[0]}_
*🦋 Bot:* _${Config.botname}_
*👤 Owner:* _${Config.ownername}_

*🌟 Current Work Type:* _${bot.worktype}_

_Choose an option below to change the bot work type._
`.trim(),
                footer: Config.footer,
                buttons: [
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Public 👥 ${bot.worktype === "public" ? "(selected)" : ""}\",\"id\":\"${Config.prefa}mode public\"}`
                    },
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Self 👤 ${bot.worktype === "self" ? "(selected)" : ""}\",\"id\":\"${Config.prefa}mode self\"}`
                    }
                ],
                contextInfo: {
                    mentionedJid: [pika.sender]
                }
            }, { quoted: pika });
        } else {
            return pika.reply(`*Heya!! @${pika.sender.split("@")[0]}*\n
\`Reply a number to select:\`

- 1. public
- 2. self

> _ID: QA37_
`.trim(), { mentions: [pika.sender], forwarded: false });
        }
    }
    if (/public/.test(text)) {
        if (bot.worktype === "public") {
            reply.push("_🍫 Already Enabled Public Mode_");
        } else {
            await Bot.updateOne({ id: "anyabot" }, { worktype: "public" });
            reply.push("✅ Enabled Public Mode");
        }
    } else if (/self|private/.test(text)) {
        if (bot.worktype === "self") {
            reply.push("_🥷🏻 Already Enabled Self Mode_");
        } else {
            await Bot.updateOne({ id: "anyabot" }, { worktype: "self" });
            await System.updateOne({ id: "system" }, { $set: { chatbot: false } }, { new: true });
            reply.push("✅ Enabled Self Mode");
            if (system.chatbot) {
                reply.push("\n> ☑️ You can't use chatbot on self mode..! Automatically Turned Off Chatbot");
            }
        }
    } else {
        return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} public/self`);
    }
    return pika.reply(reply.join("\n"));
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
      }, async (anyaV2, pika, { args, prefix, command }) => {
         const text = args.join(" ");
         if (!pika.quoted) return pika.reply(`Reply an *image/sticker/video* media message..! 🤍`);
         if (!/image|video|sticker|viewOnceMessage/.test(pika.quoted.mtype)) return pika.reply(`Baka! it's not a media message..! 😑`);
         if (/video/.test(pika.quoted.mtype)) {
            if ((pika.quoted.msg || pika.quoted).seconds > 30) return pika.reply(`‼️ Video media should be *less* than \`30\` seconds.`);
         }
         if (!pika.quoted.fileSha256) return pika.reply(`‼️ Can't use this media, SHA256 hash is missing..!`);
         if (!args[0]) return pika.reply(`💬 Enter a command name also to exicute *like:*\n\n\`${prefix + command} ${prefix}menu\``);
         const hash = pika.quoted.fileSha256.toString('base64');
         const cmd = await Cmd.findOne({ id: "cmd" }) || await new Cmd({ id: "cmd" }).save();
         if (cmd.setcmd.has(hash) && cmd.setcmd.get(hash).locked) return pika.reply(`❌ This media is locked for command \`${cmd.setcmd.get(hash).command}\`.`);
         if (cmd.setcmd.has(hash) && cmd.setcmd.get(hash).command === text.toLowerCase()) return pika.reply(`☑️ This media is *already registered* for this command..!`);
         const { key } = await pika.keyMsg(Config.message.wait);
         const structureData = {
            locked: false,
            command: text.toLowerCase(),
            type: pika.quoted.mtype.split("Message")[0],
            creator: pika.sender.split("@")[0],
            mentions: pika.mentionedJid
         };
         cmd.set(`setcmd.${hash}`, structureData);
         await cmd.save();
         return pika.edit(`✅ Media *added* as \`${text}\` command`, key, { mentions: pika.mentionedJid });
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
         if (!/image|video|sticker|viewOnceMessage/.test(pika.quoted.mtype)) return pika.reply(`Baka! it's not a media message again..! 😑`);
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
        category: "core",
        desc: "Delete media hash for cmd list",
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
}, async (anyaV2, pika, { args }) => {
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
    const ui = await UI.findOne({ id: "userInterface" }) || await new UI({ id: "userInterface" }).save();
    if (ui.buttons) {
        const butArray = [];
        for (let i = 0; i < results.length; i++) {
            butArray.push(`{\"header\":\"Command ${i + 1}\",\"title\":\"${results[i].locked ? fancy13("(Locked)") : ""}\",\"description\":\"Tap here to select\",\"id\":\"${prefix + command} ${results[i].bash64}\"}`);
        }
        return await anyaV2.sendButtonText(pika.chat, {
            text: `
*Heya, @${pika.sender.split("@")[0]}! 👋🏻*

*🍎 User:* _@${pika.sender.split("@")[0]}_
*🦋 Bot:* _${Config.botname}_
*👤 Owner:* _${Config.ownername}_
`.trim(),
            footer: Config.footer,
            buttons: [{ "name": "single_select", "buttonParamsJson": `{\"title\":\"Select Command Hash 📝\",\"sections\":[{\"title\":\"𝗖𝗵𝗼𝗼𝘀𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗛𝗮𝘀𝗵 𝗕𝗮𝗸𝗮 ✍🏻\",\"highlight_label\":\"${Config.botname}\",\"rows\":[${butArray.join(",")}]}]}` }],
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
