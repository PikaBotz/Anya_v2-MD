const Config = require('../../config');
const {
    anya,
    delay,
    User,
    Bot,
    UI,
    System,
    getAdmin,
    addWarn,
    delWarn,
    clearWarn,
    reactions
} = require('../lib');
const PhoneNumber = require('awesome-phonenumber');

//༺─────────────────────────────────────༻

anya({
    name: "block",
    react: "🚧",
    need: "user",
    category: "owner",
    desc: "Block users from bot number",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to block!*`);    
    const text = args.join(" ");
    const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
    const { key } = await pika.keyMsg(Config.message.wait);
    const bot = db.Bot?.[0];
    const [blocklist, botNumber, userOwner] = await Promise.all([
        anyaV2.fetchBlocklist(),
        anyaV2.decodeJid(anyaV2.user.id),
        Promise.resolve([...bot.modlist, Config.ownernumber, anyaV2.user.id].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net"))
    ]);
    const caption = await Promise.all(users.map(async i => {
        const userId = i.split('@')[0];
        const exist = await anyaV2.onWhatsApp(userId);
        if (exist.length < 1) {
            return `❌ Can't find *@${userId}* on WhatsApp`;
        } else if (userOwner.includes(i)) {
            return `🌟 Can't block my owner *@${userId}*`;
        } else if (blocklist.includes(i)) {
            return `☑️ *@${userId}* is already blocked`;
        } else {
            await anyaV2.updateBlockStatus(i, 'block');
            return `✅ Blocked *@${userId}*`;
        }
    }));
    pika.edit(caption.join('\n\n'), key, { mentions: users });
});

//༺─────────────────────────────────────

anya({
    name: "unblock",
    react: "🚧",
    need: "user",
    category: "owner",
    desc: "Unblock users from bot number",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to unblock!*`);
    const text = args.join(" ");
    const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
    const { key } = await pika.keyMsg(Config.message.wait);   
    const blocklist = await anyaV2.fetchBlocklist();
    const caption = await Promise.all(users.map(async i => {
        const userId = i.split('@')[0];
        const exist = await anyaV2.onWhatsApp(userId);
        if (exist.length < 1) {
            return `❌ Can't find *@${userId}* on WhatsApp`;
        } else if (!blocklist.includes(i)) {
            return `⭕ *@${userId}* is already unblocked`;
        } else {
            await anyaV2.updateBlockStatus(i, 'unblock');
            return `✅ Unblocked *@${userId}*`;
        }
    }));    
    pika.edit(caption.join('\n\n'), key, { mentions: users });
});

//༺─────────────────────────────────────

anya({
    name: "setpp",
    alias: ['setbotpp'],
    react: "🧿",
    need: "image",
    category: "owner",
    desc: "Set bot profile picture",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { prefix, command }) => {
    const quoted = pika.quoted ? pika.quoted : pika;
    const mime = quoted.mimetype || quoted.mediaType || pika.mtype;  
    if (/image/.test(mime)) {
        const { key } = await pika.keyMsg(Config.message.wait);
        try {
            const media = await quoted.download();
            const botnumber = await anyaV2.decodeJid(anyaV2.user.id);
            await anyaV2.updateProfilePicture(botnumber, media);
            pika.edit(Config.message.success, key);
        } catch (err) {
            console.error(err);
            pika.edit(Config.message.error, key);
        }
    } else {
        pika.reply(`_❗Tag or reply to an image with the caption *${prefix + command}*_`);
    }
});

//༺─────────────────────────────────────

anya({
    name: "ban",
    react: "🚫",
    category: "owner",
    need: "user",
    desc: "Ban user from using commands",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    if (!pika.quoted && args.length < 1) return pika.reply(`*Eg:* ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to ban!*`);
    
    const text = args.join(" ");
    const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
    //const { key } = await pika.keyMsg(Config.message.wait);
    
    const bot = db.Bot?.[0];
    const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
    const userOwner = new Set([...bot.modlist, Config.ownernumber, botNumber.split("@")[0]].map(v => v.replace(/[^0-9]/g) + "@s.whatsapp.net"));
    const caption = [];
    
    for (const user of users) {
        const userId = user.split('@')[0];
        const exist = await anyaV2.onWhatsApp(userId);
        
        if (exist.length < 1) {
            caption.push(`❌ Can't find *@${userId}* on WhatsApp`);
        } else if (userOwner.has(user)) {
            caption.push(`🌟 Can't ban my owner *@${userId}*`);
        } else {
            const userData = db.User.find(v => v.id === userId) || await new User({ id: userId }).save();
            if (userData.ban) {
                caption.push(`☑️ *@${userId}* is already banned`);
            } else {
                caption.push(`✅ Banned *@${userId}*`);
                await User.findOneAndUpdate({ id: userId }, { $set: { ban: true } }, { new: true });
            }
        }
    }
    
    return pika.reply(caption.join('\n\n'), { mentions: users });
});

//༺─────────────────────────────────────

anya({
    name: "unban",
    react: "🥁",
    category: "owner",
    need: "user",
    desc: "Unban user from using commands",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    if (!pika.quoted && args.length < 1) return pika.reply(`*Eg:* ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to unban!*`);    
    const text = args.join(" ");
    const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
    //const { key } = await pika.keyMsg(Config.message.wait);
    const caption = [];    
    for (const user of users) {
        const userId = user.split('@')[0];
        const exist = await anyaV2.onWhatsApp(userId);        
        if (exist.length < 1) {
            caption.push(`❌ Can't find *@${userId}* on WhatsApp`);
        } else {
            const userData = db.User.find(v => v.id === userId) || await new User({ id: userId }).save();
            if (!userData.ban) {
                caption.push(`⭕ *@${userId}* is already unbanned`);
            } else {
                caption.push(`✅ Unbanned *@${userId}*`);
                await User.findOneAndUpdate({ id: userId }, { $set: { ban: false } }, { new: true });
            }
        }
    }
    return pika.reply(caption.join('\n\n'), { mentions: users });
});

//༺─────────────────────────────────────

anya({
    name: "addmod",
    react: "🌟",
    category: "owner",
    need: "user",
    desc: "Add users as bot owner",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    if (!pika.quoted && args.length < 1) return pika.reply(`*Eg:* ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to add to modlist!*`);    
    const text = args.join(" ");
    const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
    const { key } = await pika.keyMsg(Config.message.wait);
    const bot = await Bot.findOne({ id: 'anyabot' });
    const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
    const userOwnerSet = new Set([...bot.modlist, Config.ownernumber, botNumber.split("@")[0]].map(v => v.replace(/[^0-9]/g) + "@s.whatsapp.net"));
    const caption = [];
    for (const user of users) {
        const userId = user.split('@')[0];
        const exist = await anyaV2.onWhatsApp(userId);        
        if (exist.length < 1) {
            caption.push(`❌ Can't find *@${userId}* on WhatsApp`);
        } else {
            if (userOwnerSet.has(user)) {
                caption.push(`☑️ *@${userId}* is already a mod`);
            } else {
                bot.modlist.push(userId);
                await bot.save();
                caption.push(`✅ Added *@${userId}* as mod`);
            }
        }
    }    
    return pika.edit(caption.join('\n\n'), key, { mentions: users });
});

//༺─────────────────────────────────────

anya({
    name: "delmod",
    react: "🎋",
    category: "owner",
    need: "user",
    desc: "Remove users from the bot owner's modlist",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { /*db,*/ args, prefix, command }) => {
    if (!pika.quoted && args.length < 1) return pika.reply(`*Eg:* ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to remove from modlist!*`);
    const text = args.join(" ");
    const users = pika.quoted ? (text.includes("selectedButtonMsg") ? text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net') : [pika.quoted.sender]) : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
    const { key } = await pika.keyMsg(Config.message.wait);
    const bot = await Bot.findOne({ id: 'anyabot' });
    const caption = [];
    for (const user of users) {
        const userId = user.split('@')[0];
        const exist = await anyaV2.onWhatsApp(userId);
        if (exist.length < 1) {
            caption.push(`❌ Can't find *@${userId}* on WhatsApp`);
        } else {
            const userIndex = bot.modlist.indexOf(userId);
            if (userIndex === -1) {
                caption.push(`⭕ *@${userId}* is not a mod`);
            } else {
                bot.modlist.splice(userIndex, 1);
                await bot.save();
                caption.push(`✅ Removed *@${userId}* from modlist`);
            }
        }
    }
    return pika.edit(caption.join('\n\n'), key, { mentions: users });
});

//༺─────────────────────────────────────

anya({
            name: "leavegc",
            alias: ['leavegroup'],
            react: "🌱",
            category: "owner",
            desc: "Leave group by bot Number",
            rule: 6,
            filename: __filename
     }, async (anyaV2, pika, { db }) => {
        pika.reply("```🌠 Leaving Group...```");
        await delay(1000);
        await anyaV2.groupLeave(pika.chat);
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        const bot = db.Bot?.[0];
        const owners = [...bot.modlist, Config.ownernumber, botNumber.split("@")[0]].map(v => v.replace(/[^0-9]/g) + "@s.whatsapp.net");
        const media = reactions.get("smug");
        for (const i of owners) {
            await anyaV2.sendReactionMedia(i, {
                buffer: media.buffer,
                extension: media.extension,
                caption: `🌇 Leaved A Group By \`@${pika.sender.split("@")[0]}\``,
                mentions: [pika.sender]
            }, { quoted:pika }).catch(()=>{});
            await delay(1000);
        }
     }
);

//༺─────────────────────────────────────༻

anya(
    {
        name: "join",
        react: "💗",
        category: "owner",
        need: "url",
        desc: "Join WhatsApp Group using invitation url",
        rule: 1,
        filename: __filename
    },
    async (anyaV2, pika, { args }) => {
        if (!args[0] && !pika?.quoted) return pika.reply("_❗Enter a valid WhatsApp group invitation url!_");
        const content = pika.quoted ? pika.quoted.text ? pika.quoted.text : args[0] ? args.join(" ") : false : args[0] ? args.join(" ") : false;
        if (!content || !/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{22}$/.test(content)) return pika.reply("_⚠️ Invalid Url!_");
        const code = content.match(/(https?:\/\/[^\s]+)/g)[0]?.split("https://chat.whatsapp.com/")[1];
        const gcinfo = await anyaV2.groupGetInviteInfo(code)
            .catch(err=> console.log("ERR IN GC INVITE INFO :", err));
        if (!gcinfo) return pika.reply("_⚠️ Unable to fetch group information._");
        const metadata = await anyaV2.groupMetadata(gcinfo.id)
            .catch(err=> {});
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        if (metadata && metadata?.participants?.map(v => v.id).includes(botNumber)) return pika.reply("_☑️ Bot is already in this group!_");
        await anyaV2.groupAcceptInvite(code)
            .catch(err=> console.log("ERR IN GC JOIN :", err));
        pika.reply(Config.message.success);
    }
)

//༺─────────────────────────────────────

anya({
    name: "edit",
    alias: ['e'],
    need: "text",
    react: "✅",
    category: "owner",
    desc: "Edit messages sent by this number",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { args }) => {
    if (!pika.quoted) return pika.reply("❕ Tag a message to edit");
    if (args.length < 1) return pika.reply("❕ Write a message also, to replace the current message");
    const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
    if (pika.quoted.sender !== botNumber) return pika.reply("This message isn't sent by me!");
    return await pika.edit(args.join(" "), pika.quoted.fakeObj.key);
});

//༺─────────────────────────────────────

anya({
    name: "delete",
    alias: ['del'],
    react: "✅",
    category: "owner",
    desc: "Delete messages sent by this number",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { prefix, command }) => {
    if (!pika.quoted) return pika.reply("Tag a message to delete");
    const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
    if (pika.quoted.sender !== botNumber) {
        return pika.reply(
            !pika.isGroup
                ? "Tag a message sent by this number"
                : `Use *${prefix + command}2* to delete other's messages as admin`
        );
    }
    anyaV2.sendMessage(pika.chat, { delete: pika.quoted.fakeObj.key });
});

//༺─────────────────────────────────────

anya({
    name: "setbio",
    alias: ['setstatus'],
    react: "💫",
    need: "text",
    category: "owner",
    desc: "Set bot number status",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix }) => {
    if (!pika.quoted && args.length < 1) return pika.reply("Enter some texts to update status");
    const bot = db.Bot?.[0];
    const statusText = pika.quoted ? pika.quoted.text : args.join(" ");
    try {
        await anyaV2.updateProfileStatus(statusText);
        const hint = bot.autoBio
            ? `_❕ Your status will automatically get changed because *${prefix}autobio* is enabled._`
            : `> *Hint:* Use ${prefix}autobio to set random anime quotes in bio automatically.`;
        pika.reply(`${Config.message.success}\n\n${hint}`);
    } catch (err) {
        console.error(err);
        pika.reply(Config.message.error);
    }
});

//༺─────────────────────────────────────

const ownerSwitches = [
    {
        name: "anticall",
        name2: "Anti Call",
        alias: false,
        emoji: "☎️",
        desc: "Reject and block unwanted callers",
        id: "anticall",
        turnOff: []
    },
    {
        name: "autoreply",
        name2: "Auto Reply",
        alias: false,
        emoji: "🍄",
        desc: "Bot will automatically reply if specific parameters are matched",
        id: "autoReply",
        turnOff: []
    },
    {
        name: "chatbot",
        name2: "Chatbot",
        alias: false,
        emoji: "🤖",
        desc: "Chatbot for private chats",
        id: "chatbot",
        turnOff: []
    },
    {
        name: "cooldown",
        name2: "Cooldown",
        alias: false,
        emoji: "❄️",
        desc: "Commands cooldown after every command input",
        id: "cooldown",
        turnOff: [
            { id: " ", message: " " }
        ]
    },
    {
        name: "autobio",
        name2: "Autobio",
        alias: false,
        emoji: "💖",
        desc: "Automatically change bot account status after every restart",
        id: "autoBio",
        turnOff: []
    },
    {
        name: "autoblock",
        name2: "Autoblock",
        alias: false,
        emoji: "🚏",
        desc: "Automatically block if someone messages in private",
        id: "autoBlock",
        turnOff: [
            { id: "antipm", message: "> ☑️ Automatically Turned Off Antipm" },
            { id: "onlypm", message: "> ☑️ Automatically Turned Off Onlypm" }
        ]
    },
    {
        name: "onlypm",
        name2: "Onlypm",
        alias: ["onlypc"],
        emoji: "🐾",
        desc: "Bot will run only in private chat",
        id: "onlypm",
        turnOff: [
            { id: "antipm", message: "> ☑️ Automatically Turned Off Antipm" },
            { id: "autoBlock", message: "> ☑️ Automatically Turned Off Autoblock" }
        ]
    },
    {
        name: "antipm",
        name2: "Antipm",
        alias: ['onlygc', 'antipc'],
        emoji: "🌀",
        desc: `Bot will warn ${Config.warns} times then block if someone chats in private.`,
        id: "antipm",
        turnOff: [
            { id: "onlypm", message: "> ☑️ Automatically Turned Off Onlypm" },
            { id: "autoBlock", message: "> ☑️ Automatically Turned Off Autoblock" }
        ]
    },
{
    name: "autoread",
    name2: "Auto Message Read",
    alias: ['automsgread'],
    emoji: "📑",
    desc: "Automatically read upcoming messages",
    id: "autoMsgRead",
    turnOff: []
},
{
    name: "autotyping",
    name2: "Auto Typing",
    alias: ['autotype'],
    emoji: "✍🏻",
    desc: "Auto typing seen switch",
    id: "autoTyping",
    turnOff: []
},
{
    name: "welcome",
    name2: "Welcome Message",
    alias: false,
    emoji: "💐",
    desc: "Welcome message when someone enters the group chat",
    id: "welcome",
    turnOff: []
},
{
    name: "goodbye",
    name2: "Goodbye Message",
    alias: false,
    emoji: "👋🏻",
    desc: "Goodbye message when someone left the group chat",
    id: "goodbye",
    turnOff: []
},
{
    name: "pdm",
    name2: "Promote/Demote Message",
    alias: false,
    emoji: "🧩",
    desc: "Promote • Demote message when someone gets promoted to member or admin",
    id: "pdm",
    turnOff: []
},
{
    name: "gcm",
    name2: "Group Changes Messages",
    alias: false,
    emoji: "🎀",
    desc: "Group changes messages",
    id: "gcm",
    turnOff: []
},
{
    name: "antionce",
    name2: "Anti Once View",
    alias: ['antionceview'],
    emoji: "🕜",
    desc: "No one will be able to once view media in this group chat",
    id: "antionce",
    turnOff: []
}
];

ownerSwitches.forEach(switchObj => {
    anya({
        name: switchObj.name,
        alias: switchObj.alias,
        react: switchObj.emoji,
        category: "owner",
        desc: switchObj.desc,
        rule: 1,
        filename: __filename
    },
    async (anyaV2, pika, { db, args, prefix, command }) => {
        const name = switchObj.name2;
        const system = db.System?.[0] || await new System({ id: "system" }).save();
        const reply = [];
        if (/on/.test(args[0])) {
            if (system[switchObj.id]) {
                reply.push(`_${switchObj.emoji} Already \`Enabled\` ${name} Darling 💕_`);
            } else {
                await System.updateOne({ id: "system" }, { $set: { [switchObj.id]: true } }, { new: true });
                reply.push(`✅ ${name} Turned \`On\`!`);
                
                for (const { id, message } of switchObj.turnOff) {
                    await System.updateOne({ id: "system" }, { $set: { [id]: false } }, { new: true });
                    if (system[id]) reply.push(`\n${message}`);
                }
            }
        } else if (/off/.test(args[0])) {
            if (!system[switchObj.id]) {
                reply.push(`_${switchObj.emoji} Already \`Disabled\` ${name} Baby~ 💖_`);
            } else {
                await System.updateOne({ id: "system" }, { $set: { [switchObj.id]: false } }, { new: true });
                reply.push(`✅ ${name} Turned \`Off\`!`);
            }
        } else {
            const ui = db.UI?.[0] || (await new UI({ id: "userInterface" }).save());
            if (ui.buttons) return await anyaV2.sendButtonText(pika.chat, {
                text: "Choose a option below to turn `on/off, " + name + "`",
                footer: Config.footer,
                buttons: [
                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Turn On ✅\",\"id\":\"${prefix + command} on\"}` },
                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Turn Off ❌\",\"id\":\"${prefix + command} off\"}` },
                    ]
                }, { quoted: pika });
            else return pika.reply(`Example: \`${prefix + command} on/off\`\n\n> Info: ${switchObj.desc}`);
        }
        pika.reply(reply.join("\n"));
    });
});

//༺─────────────────────────────────────

anya({
    name: "reactcmd",
    alias: ['autoreact', 'autoreactcmd', 'autoreaction'],
    react: "💝",
    category: "owner",
    desc: "Commands reaction switch",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const state = args.join(" ").toLowerCase();
    const bot = db.Bot?.[0];
    const system = db.System?.[0] || await new System({ id: "system" }).save();
    const ui = db.UI?.[0] || (await new UI({ id: "userInterface" }).save());
    let reply = [];
    if (state === "on") {
        if (bot.react) {
            reply.push("_⭕ Command Reaction Already Enabled_");
        } else {
            await Bot.updateOne({ id: "anyabot" }, { react: true });
            reply.push("✅ Command Reaction Turned On!");
            if (system.autoReactMsg) {
                await System.updateOne({ id: "system" }, { autoReactMsg: false });
                reply.push("> ☑️ Automatically Turned Off Auto React All Messages");
            }
        }
    } else if (state === "off") {
        if (!bot.react) {
            reply.push("_⭕ Command Reaction Already Disabled_");
        } else {
            await Bot.updateOne({ id: "anyabot" }, { react: false });
            reply.push("✅ Command Reaction Turned Off!");
        }
    } else {
        if (ui.buttons) {
            return await anyaV2.sendButtonText(pika.chat, {
                text: "Choose an option below to turn `on/off` Command Reaction:",
                footer: Config.footer,
                buttons: [
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Turn On ✅\",\"id\":\"${prefix + command} on\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Turn Off ❌\",\"id\":\"${prefix + command} off\"}` }
                ]
            }, { quoted: pika });
        } else {
            return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off\n\n> Bot will react to command messages.`);
        }
    }
    pika.reply(reply.join("\n"));
});

//༺─────────────────────────────────────

anya({
    name: "reactmsg",
    alias: ['reactionmsg'],
    react: "💗",
    category: "owner",
    desc: "Auto React All Messages switch",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const state = args.join(" ").toLowerCase();
    const system = db.System?.[0] || await new System({ id: "system" }).save();
    const bot = db.Bot?.[0];
    const ui = db.UI?.[0] || (await new UI({ id: "userInterface" }).save());
    let reply = [];
    if (state === "on") {
        if (system.autoReactMsg) {
            reply.push("_⭕ Auto React All Messages Already Enabled_");
        } else {
            await System.updateOne({ id: "system" }, { autoReactMsg: true });
            reply.push("✅ Auto React All Messages Turned On!");
            if (bot.react) {
                await Bot.updateOne({ id: "anyabot" }, { react: false });
                reply.push("> ☑️ Automatically Turned Off Command Reaction");
            }
        }
    } else if (state === "off") {
        if (!system.autoReactMsg) {
            reply.push("_⭕ Auto React All Messages Already Disabled_");
        } else {
            await System.updateOne({ id: "system" }, { autoReactMsg: false });
            reply.push("✅ Auto React All Messages Turned Off!");
        }
    } else {
        if (ui.buttons) {
            return await anyaV2.sendButtonText(pika.chat, {
                text: "Choose an option below to turn `on/off` Auto React All Messages:",
                footer: Config.footer,
                buttons: [
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Turn On ✅\",\"id\":\"${prefix + command} on\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Turn Off ❌\",\"id\":\"${prefix + command} off\"}` }
                ]
            }, { quoted: pika });
        } else {
            return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off\n\n> Bot will react to every message.`);
        }
    }
    pika.reply(reply.join("\n"));
});

//༺─────────────────────────────────────

anya({
    name: "autostatus",
    react: "👀",
    category: "owner",
    desc: "Automatically mark contacts' statuses as seen",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const state = args.join(" ").toLowerCase();
    const bot = db.Bot?.[0];
    const ui = db.UI?.[0] || (await new UI({ id: "userInterface" }).save());
    if (state === "on") {
        if (bot.autoStatusRead) {
            return pika.reply("_⭕ Already Enabled Auto Status View_");
        } else {
            await Bot.updateOne({ id: "anyabot" }, { autoStatusRead: true });
            return pika.reply("✅ Enabled Auto Status View");
        }
    } else if (state === "off") {
        if (!bot.autoStatusRead) {
            return pika.reply("_⭕ Already Disabled Auto Status View_");
        } else {
            await Bot.updateOne({ id: "anyabot" }, { autoStatusRead: false });
            return pika.reply("✅ Disabled Auto Status View");
        }
    } else {
        if (ui.buttons) {
            return await anyaV2.sendButtonText(pika.chat, {
                text: "Choose an option below to turn `on/off` Auto Status Seen:",
                footer: Config.footer,
                buttons: [
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Turn On ✅\",\"id\":\"${prefix + command} on\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Turn Off ❌\",\"id\":\"${prefix + command} off\"}` }
                ]
            }, { quoted: pika });
        } else {
            return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off\n\n> Bot will see contact list WhatsApp statuses.`);
        }
    }
});

//༺─────────────────────────────────────

anya({
    name: "addwarn",
    alias: ['warn'],
    react: "📈",
    need: "user",
    category: "owner",
    desc: "Warn users",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to warn!*`);
    const text = args.join(" ");
    const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
    const reason = users.length > 1 ? "can't specify" : (args.length > 0 ? text : "not provided");
    const keyMsg = await pika.keyMsg(Config.message.wait);
    const bot = db.Bot?.[0];
    const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
    const userOwner = [...bot.modlist, Config.ownernumber, botNumber.split("@")[0]].map(v => v.replace(/[^0-9]/g) + "@s.whatsapp.net");
    const caption = [];
    const exceeded = [];
    const userPromises = users.map(async i => {
        const userId = i.split('@')[0];
        const exist = await anyaV2.onWhatsApp(userId);        
        if (exist.length < 1) {
            caption.push(`❌ Can't find *@${userId}* on WhatsApp`);
        } else if (userOwner.includes(i)) {
            caption.push(`🌟 Can't warn my owner *@${userId}*`);
        } else {
            const res = await addWarn(userId, { chat: pika.isGroup ? 1 : 2, reason });
            if (res.status === 201 || res.status === 200) {
                caption.push(`✅ Warned *@${userId}*\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : ${reason}_`);
            } else if (res.status === 429) {
                caption.push(`⭕ *@${userId}* already exceeded warns limit\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : ${reason}_`);
                if (/after/.test(res.message)) {
                    exceeded.push(i);
                }
            }
        }
    });
    await Promise.all(userPromises);
    pika.edit(caption.join(caption.length > 2 ? '\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n' : '\n\n'), keyMsg.key, { mentions: users });
    if (exceeded.length > 0) {
        const array = exceeded.length > 1
            ? `${exceeded.slice(0, -1).map(v => "@" + v.split("@")[0]).join(", ")} and @${exceeded[exceeded.length - 1].split("@")[0]}`
            : `@${exceeded[0].split("@")[0]}`;
        const groupAdmins = await getAdmin(anyaV2, pika);
        const isBotAdmin = pika.isGroup ? groupAdmins.includes(botNumber) : false;
        await anyaV2.sendMessage(pika.chat, {
            text: `💫 *${array}* exceeded their warn limits so I'm ${!isBotAdmin ? 'banning and blocking' : 'banning, blocking and kicking'} them!`,
            mentions: exceeded
        }, { quoted: pika });
        await Promise.all(exceeded.map(async i => {
            const userId = i.split("@")[0];
            await anyaV2.updateBlockStatus(i, 'block');
            await User.findOneAndUpdate({ id: userId }, { $set: { ban: true } }, { new: true });
            if (isBotAdmin) {
                await anyaV2.groupParticipantsUpdate(pika.chat, [i], 'remove');
            }
        }));
    }
});

//༺─────────────────────────────────────

anya({
    name: "delwarn",
    react: "📉",
    category: "owner",
    need: "user",
    desc: "Decrease user's warns",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to decrease their warn!*`);
    const text = args.join(" ");
    const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
    const reason = users.length > 1 ? "can't specify" : (args.length > 0 ? text : "not provided");
    const keyMsg = await pika.keyMsg(Config.message.wait);
    const caption = [];
    const userPromises = users.map(async i => {
        const userId = i.split('@')[0];
        const exist = await anyaV2.onWhatsApp(userId);
        if (exist.length < 1) {
            caption.push(`❌ Can't find *@${userId}* on WhatsApp`);
        } else {
            const res = await delWarn(userId, { chat: pika.isGroup ? 1 : 2, reason });
            if (res.status === 404 || (res.status === 200 && /already/.test(res.message))) {
                caption.push(`❌ *@${userId}* has 0 warns\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : ${reason}_`);
            } else if (res.status === 200 && /became/.test(res.message)) {
                caption.push(`✅ Reseted *@${userId}'s* warns to 0\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : ${reason}_`);
            } else if (res.status === 200 && /decreased/.test(res.message)) {
                caption.push(`✅ Unwarned *@${userId}*\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : ${reason}_`);
            }
        }
    });
    await Promise.all(userPromises);
    pika.edit(caption.join(caption.length > 2 ? '\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n' : '\n\n'), keyMsg.key, { mentions: users });
});

//༺─────────────────────────────────────

anya({
    name: "resetwarn",
    alias: ['clearwarn', 'resetwarns', 'clearwarns'],
    react: "📊",
    category: "owner",
    need: "user",
    desc: "Reset user's all warns",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to reset their warn!*`);
    const text = args.join(" ");
    const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
    const keyMsg = await pika.keyMsg(Config.message.wait);
    const captions = await Promise.all(users.map(async (i) => {
        const userId = i.split('@')[0];
        const exist = await anyaV2.onWhatsApp(userId);
        if (exist.length < 1) return `❌ Can't find *@${userId}* on WhatsApp`;
        const res = await clearWarn(userId);
        if (res.status === 404) {
            return `❌ *@${userId}* has 0 warns\n└ _current warns : 0_`;
        } else if (res.status === 200) {
            return `✅ Reseted *@${userId}'s* warns to 0\n└ _current warns : 0_`;
        }
    }));
    const filteredCaptions = captions.filter(Boolean);
    pika.edit(
        filteredCaptions.join(filteredCaptions.length > 1 ? '\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n' : '\n\n'),
        keyMsg.key,
        { mentions: users }
    );
});

//༺─────────────────────────────────────

anya({
    name: "antiwords",
    alias: ['antiword', 'antitoxic', 'antibad'],
    react: "🎀",
    category: "owner",
    need: "words",
    desc: "Add words to the antibad list",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const text = args.join(" ").toLowerCase();
    if (/^on|off$/.test(args[0].toLowerCase())) return pika.reply(`Use \`${prefix}act <on|off>\` to turn on or off this function`);
    if (!pika.quoted && args.length < 1) return pika.reply(`*Eg:* ${prefix + command} word1, word2, word3 etc...\n\n*Use ${prefix}enable antiword to enable antiwords*`);
    const words = pika.quoted 
        ? pika.quoted.text.split(',').map(v => v.trim().toLowerCase())
        : text.split(',').map(v => v.trim().toLowerCase());
    const system = db.System?.[0] || await new System({ id: "system" }).save();
    const existings = system.badWords.filter(existing => words.some(newWord => existing.includes(newWord)));  
    const newWords = new Set([...system.badWords, ...words]);
    if (existings.length === words.length) return pika.reply("❎ All words already exist");
    system.badWords = Array.from(newWords);
    await system.save();
    const reply = [`✅ Added words to antiword: *${words.join("*, *")}*`];
    if (existings.length > 0) reply.push(`⭕ Already existing antiwords: *${existings.join("*, *")}*`);
    reply.push(`_Hint : Use ${prefix}delword to delete words_`);
    return pika.reply(reply.join("\n\n"));
});

//༺─────────────────────────────────────

anya({
    name: "delword",
    alias: ['deleteword', 'removeword'],
    react: "🗑️",
    category: "owner",
    need: "words",
    desc: "Remove words from the antibad list",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*Eg:* ${prefix + command} word1, word2, word3 etc...`);
    const wordsToRemove = args.join(" ").split(',').map(v => v.trim().toLowerCase());
    const system = db.System?.[0] || await new System({ id: "system" }).save();
    // if (!system) return pika.reply("System not found.");
    const existingWords = system.badWords.map(word => word.toLowerCase());
    const wordsNotFound = wordsToRemove.filter(word => !existingWords.includes(word));
    const wordsToRemoveFromList = wordsToRemove.filter(word => existingWords.includes(word));
    if (wordsToRemoveFromList.length === 0) return pika.reply(`❎ Words not found in the antibad list: *${wordsNotFound.join("*, *")}*`);
    system.badWords = existingWords.filter(word => !wordsToRemove.includes(word));
    await system.save();
    const responseMessages = [];
    if (wordsToRemoveFromList.length > 0) {
        responseMessages.push(`✅ Removed words from antiword: *${wordsToRemoveFromList.join("*, *")}*`);
    }
    if (wordsNotFound.length > 0) {
        responseMessages.push(`⭕ Words not found in antiword: *${wordsNotFound.join("*, *")}*`);
    }
    return pika.reply(responseMessages.join("\n\n"));
});

//༺─────────────────────────────────────

anya({
    name: "listword",
    alias: ['showwords', 'viewwords'],
    react: "📜",
    category: "owner",
    need: "words",
    desc: "List all words in the antibad list",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, prefix, command }) => {
    const system = db.System?.[0] || await new System({ id: "system" }).save();
    if (!system || !system.badWords || system.badWords.length === 0) return pika.reply(`*🤖 Bot Name:* ${Config.botname}\n*📃 Total Anti Words:* _0 words_\n\nNo antiwords found.`);
    const antiWordsList = system.badWords.map((word, index) => `${index + 1}. ${word}`).join('\n');
    const totalWords = system.badWords.length;
    const reply = `*🤖 Bot Name:* ${Config.botname}\n*📃 Total Anti Words:* _${totalWords} words_\n\n🍄 List Of Anti Words:\n${antiWordsList}\n\n> ${Config.footer}`;
    return pika.reply(reply);
});

//༺─────────────────────────────────────

anya({
    name: "antifake",
    react: "🤥",
    category: "owner",
    desc: "Remove fake numbers from the group",
    rule: 2,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const text = args.join(" ").toLowerCase();
    const system = db.System?.[0] || await new System({ id: "system" }).save();
    if (/on/.test(text)) {
        if (system.fakelist.length < 1) return pika.reply(`❕Please add country codes to the fake list using *${prefix}addantifake* before turning it on.`);
        if (system.antifake) return pika.reply("_⭕ Already Enabled Antifake_");
        if (!pika.isGroup) return;
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        const groupAdmins = await getAdmin(anyaV2, pika);
        const metadata = await anyaV2.groupMetadata(pika.chat);
        await System.updateOne({ id: "system" }, { $set: { antifake: true } }, { new: true });
        pika.reply("✅ Antifake Turned On!");
        const fakelist = new Set(system.fakelist);
        for (const mem of metadata.participants) {
            const code = PhoneNumber('+' + mem.id.split('@')[0]).getCountryCode();
            if (fakelist.has(Number(code))) {
                try {
                    await anyaV2.groupParticipantsUpdate(pika.chat, [mem.id], 'remove');
                } catch (e) {
                    console.error("☎️ Antifake Error:", e);
                }
            }
        }
    } else if (/off/.test(text)) {
        if (!system.antifake) {
            return pika.reply("_⭕ Already Disabled Antifake_");
        }
        await System.updateOne({ id: "system" }, { $set: { antifake: false } }, { new: true });
        return pika.reply("✅ Antifake Turned Off!");
    } else {
        pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off\n\n> Bot will remove group members by detecting entered country codes.`);
    }
});

//༺─────────────────────────────────────

anya({
    name: "addantifake",
    react: "📈",
    category: "owner",
    need: "numbers",
    desc: "Add fake numbers country codes",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    if (!pika.quoted && args.length < 1) return pika.reply(`*Eg:* ${prefix + command} +1, +44, +92 etc...`);
    const text = args.join(" ");
    const numbers = pika.quoted 
        ? pika.quoted.text.split(',').map(v => v.trim().replace(/[^0-9]/g, ''))
        : text.split(',').map(v => v.trim().replace(/[^0-9]/g, ''));
    if (numbers.length === 0) return pika.reply(`*Eg:* ${prefix + command} +1, +44, +92 etc...`);
    const system = db.System?.[0] || await new System({ id: "system" }).save();
    const existingCodes = new Set(system.fakelist.map(num => num.replace(/[^0-9]/g, '')));
    const newNumbers = new Set(numbers);
    const alreadyExists = Array.from(newNumbers).filter(num => existingCodes.has(num));
    const toAdd = Array.from(newNumbers).filter(num => !existingCodes.has(num));
    if (toAdd.length === 0) return pika.reply("❎ All country codes already exist");
    system.fakelist = Array.from(new Set([...existingCodes, ...toAdd]));
    await system.save();
    const reply = [
        `✅ Added country codes to antifake: *+${toAdd.join("*, *+")}*`,
        alreadyExists.length > 0 ? `⭕ Already existing country codes: *+${alreadyExists.join("*, *+")}*` : '',
        `_Hint : Use ${prefix}delantifake to delete country codes_`
    ].filter(Boolean).join("\n\n");
    return pika.reply(reply);
});

//༺─────────────────────────────────────

anya({
    name: "delantifake",
    react: "🗑️",
    category: "owner",
    need: "numbers",
    desc: "Delete fake numbers country codes",
    rule: 1,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*Eg:* ${prefix + command} +1, +44, +92 etc...`);
    const text = args.join(" ");
    const numbers = text.split(',').map(v => v.trim().replace(/[^0-9]/g, ''));    
    if (numbers.length === 0) return pika.reply(`*Eg:* ${prefix + command} +1, +44, +92 etc...`);
    const system = db.System?.[0] || await new System({ id: "system" }).save();
    const existingCodes = new Set(system.fakelist.map(num => num.replace(/[^0-9]/g, '')));
    const toRemove = numbers.filter(num => existingCodes.has(num));
    const notFound = numbers.filter(num => !existingCodes.has(num));
    if (toRemove.length === 0) return pika.reply(`❎ Country codes not found in the antifake list: *+${notFound.join("*, *+")}*`);
    system.fakelist = Array.from(existingCodes).filter(num => !numbers.includes(num));
    await system.save();
    const reply = [
        `✅ Removed country codes from antifake list: *+${toRemove.join("*, *+")}*`,
        notFound.length > 0 ? `⭕ Country codes not found in antifake list: *+${notFound.join("*, *+")}*` : ''
    ].filter(Boolean).join("\n\n");
    return pika.reply(reply);
});
