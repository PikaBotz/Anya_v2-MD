const Config = require('../../config');
const { anya, delay, Bot, System, Cmd, UI } = require('../lib');

//༺─────────────────────────────────────༻

anya({
            name: "restart",
            react: "♻️",
            category: "core",
            desc: "Use to restart the bot",
            rule: 1,
            filename: __filename
     }, async (anyaV2, pika) => {
        const { exec } = require("child_process");
        pika.reply("*Restarting...*");
        await delay(1500);
        exec('pm2 restart all');
     }
)

//༺─────────────────────────────────────༻

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
        if (!args[0]) return pika.reply(`*Hey! @${pika.sender.split("@")[0]}*\n
\`Reply A Number To Choose Text Reply Type!\`
\`\`\`
${await generateMessageList()}\`\`\`
_ID: QA29_
`.trim(), { mentions: [pika.sender], forwarded: false });
        const optionNum = Number(args[0]);
        if (!optionNum) return pika.reply(`❌ Invalid option type.`);
        if (optionNum === ui.reply) return pika.reply(`☑️ Text reply message already set as  *${types[optionNum]}*.`);
        await UI.updateOne({ id: "userInterface" }, { $set: { reply: optionNum } }, { new: true });
        return pika.reply(`✅ Enabled \`${types[optionNum]}\` as *text reply* type.`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "setmenu",
            react: "⚙️",
            category: "core",
            desc: "Set menu message type",
            rule: 1,
            need: "number",
            filename: __filename
     }, async (anyaV2, pika, { args }) => {
//        const text = args.join(" ").toLowerCase();
        const types = {
            1: "Text Message",
            2: "Image Message",
            3: "Image Ad Reply",
            4: "Video Message",
            5: "GIF message",
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
        if (!args[0]) return pika.reply(`*Hey! @${pika.sender.split("@")[0]}*\n
\`Reply A Number To Choose That Option!\`
\`\`\`
${await generateMessageList()}\`\`\`
_ID: QA18_
`.trim(), { mentions: [pika.sender], forwarded: false });
        const optionNum = Number(args[0]);
        if (!optionNum) return pika.reply(`❌ Invalid option type.`);
        if (optionNum === ui.menu) return pika.reply(`☑️ Menu message already set as  *${types[optionNum]}*.`);
        await UI.updateOne({ id: "userInterface" }, { $set: { menu: optionNum } }, { new: true });
        return pika.reply(`✅ Enabled \`${types[optionNum]}\` as *menu type*.`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "setalive",
            react: "⚙️",
            category: "core",
            desc: "Set alive message type",
            rule: 1,
            need: "number",
            filename: __filename
     }, async (anyaV2, pika, { args }) => {
//        const text = args.join(" ").toLowerCase();
        const types = {
            1: "Text Message",
            2: "Image Message",
            3: "Image Ad Reply",
            4: "Video Message",
            5: "GIF message",
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
        if (!args[0]) return pika.reply(`*Heya!! @${pika.sender.split("@")[0]}*\n
\`Reply A Number To Set Alive Message Type!\`
\`\`\`
${await generateMessageList()}\`\`\`
_ID: QA28_
`.trim(), { mentions: [pika.sender], forwarded: false });
        const optionNum = Number(args[0]);
        if (!optionNum) return pika.reply(`❌ Invalid option type.`);
        if (optionNum === ui.alive) return pika.reply(`☑️ Alive message already set as  *${types[optionNum]}*.`);
        await UI.updateOne({ id: "userInterface" }, { $set: { alive: optionNum } }, { new: true });
        return pika.reply(`✅ Enabled \`${types[optionNum]}\` as *alive message* type.`);
     }
)

//༺─────────────────────────────────────༻

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
          if (/single/.test(text)) {
              if (bot.prefix === "single") return pika.reply("_⭕ Already Enabled Single Prefix_");
              else {
                await Bot.updateOne({ id: "anyabot" }, { prefix: "single" });
                return pika.reply("✅ Enabled Single Prefix");
              }
          } else if (/multi|multiple/.test(text)) {
              if (bot.prefix === "multi") return pika.reply("_⭕ Already Enabled Multi Prefix Support_");
              else {
                await Bot.updateOne({ id: "anyabot" }, { prefix: "multi" });
                return pika.reply("✅ Enabled Multi Prefix");
              }
          } else pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} single/multi\n\n• Single : bot will obey the commands that only starts with *" ${Config.prefa} "*\n• Multi : bot will obey every command with every prefix except *no prefix*`);
      }
)

//༺─────────────────────────────────────༻

anya({
        name: "mode",
        react: "🍭",
        category: "core",
        desc: "Set bot work type ",
        rule: 1,
        filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    const text = args.join(" ").toLowerCase();
    const bot = await Bot.findOne({ id: "anyabot" });
    const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
    const reply = [];
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
    } else return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} public/self`);
    pika.reply(reply.join("\n"));
});

//༺─────────────────────────────────────༻

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

//༺─────────────────────────────────────༻

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

//༺─────────────────────────────────────༻

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

//༺─────────────────────────────────────༻

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

//༺─────────────────────────────────────༻

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

//༺─────────────────────────────────────༻

anya({
            name: "listcmd",
            react: "🏵️",
            category: "core",
            desc: "See all media bash64 code with detail list",
            rule: 1,
            filename: __filename
      }, async (anyaV2, pika, { args }) => {
         const cmd = await Cmd.findOne({ id: "cmd" }) || await new Cmd({ id: "cmd" }).save();
         if (cmd.setcmd.size < 1) return pika.reply(`❌No cmd exist!`);
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
         const cmdlist = results.map((item, index) => `*${Config.themeemoji}Hash (${index + 1}):* ${item.locked ? `\`${item.bash64}\`` : item.bash64}
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

_ID: QA30_`, { mentions: mentions });
      }
)
