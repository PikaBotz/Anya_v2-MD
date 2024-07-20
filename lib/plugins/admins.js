const Config = require('../../config');
const { delay, anya, getBuffer, fancy13, UI, Group, announce, numberToDate } = require('../lib');

//༺─────────────────────────────────────༻

anya({
        name: "add",
        react: "👤",
        need: "user",
        category: "admins",
        desc: "Add users to the group",
        rule: 3,
        cooldown: 8,
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to add!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const { key } = await pika.keyMsg(Config.message.wait);
        const caption = [];
        const metadata = await anyaV2.groupMetadata(pika.chat);
        for (const i of users) {
            const onwa = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (onwa.length < 1) {
                caption.push(`🪀 Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
            const action = await anyaV2.groupParticipantsUpdate(pika.chat, [i], 'add');
            const status = {
                200: `✅ Added *@${i.split('@')[0]}*`,
                408: `❌ *@${i.split('@')[0]}* previously left the chat, couldn't add`,
                409: `⭕ *@${i.split('@')[0]}* already a member`,
                401: `❌ *@${i.split('@')[0]}* has banned my number`
            }
            if (status[action[0].status]) {
                caption.push(status[action[0].status]);
            } else {
                caption.push(`❌ Can't add *@${i.split('@')[0]}* send invitation!`);
                const gclink = await anyaV2.groupInviteCode(pika.chat);
                let ppgc;
                try {
                    ppgc = await anyaV2.profilePictureUrl(pika.chat, 'image');
                } catch {
                    ppgc = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
                }
                await anyaV2.sendMessage(i, {
                    text: `_You're invited by @${pika.sender.split('@')[0]}_`,
                    mentions: [pika.sender],
                    contextInfo:{
                        mentionedJid:[pika.sender],
                        externalAdReply: {
                            renderLargerThumbnail: true,
                            title: metadata.subject,
                            mediaType: 1,
                            thumbnail: await getBuffer(ppgc),
                            mediaUrl: "https://chat.whatsapp.com/" + gclink,
                            sourceUrl: "https://chat.whatsapp.com/" + gclink
                        }
                    } 
                }).catch((err) => console.error(err));
            }
        }
    }
     pika.edit(caption.join('\n\n'), key, { mentions: users });
    }
)

//༺─────────────────────────────────────༻

anya({
        name: "kick",
        alias: ['remove'],
        react: "🪂",
        need: "user",
        category: "admins",
        desc: "Kick users from the group",
        rule: 3,
        filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to kick!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const { key } = await pika.keyMsg(Config.message.wait);
        const caption = [];
        for (const i of users) {
            const onwa = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (onwa.length < 1) {
                caption.push(`🪀 Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
               const action = await anyaV2.groupParticipantsUpdate(pika.chat, [i], 'remove');
               const status = {
                404: `❌ *@${i.split('@')[0]}* not found in this group`,
                200: `✅ Removed *@${i.split('@')[0]}*`
               }
               if (status[action[0].status]) {
                caption.push(status[action[0].status]);
               } else {
                caption.push(`❌ An unexpected error code "${action[0].status}"`);
               }
            }
        }
        pika.edit(caption.join('\n\n'), key, { mentions: users });
    }
)

//༺─────────────────────────────────────༻

anya({
        name: "invite",
   	    react: "💐",
   	    need: "user",
   	    category: "admins",
    	desc: "Invite ussrs to the group",
    	rule: 3,
    	filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to add!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const { key } = await pika.keyMsg(Config.message.wait);
        const caption = [];
        const gclink = await anyaV2.groupInviteCode(pika.chat);
        let ppgc;
        try {
            ppgc = await anyaV2.profilePictureUrl(pika.chat, 'image');
        } catch {
            ppgc = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
        }
        const thumbnail = await getBuffer(ppgc);
        const metadata = await anyaV2.groupMetadata(pika.chat);
        const mems = metadata.participants.map(v => v.id);
        for (const i of users) {
            const onwa = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (onwa.length < 1) {
                caption.push(`🪀 Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
                if (mems.includes(i)) {
                    caption.push(`⭕ *@${i.split('@')[0]}* already a member`);
                } else {
                    await anyaV2.sendMessage(i, {
                        text: `_You're invited by @${pika.sender.split('@')[0]}_`,
                        mentions: [pika.sender],
                        contextInfo:{
                            mentionedJid:[pika.sender],
                            externalAdReply: {
                                renderLargerThumbnail: true,
                                title: metadata.subject,
                                mediaType: 1,
                                thumbnail: thumbnail,
                                mediaUrl: "https://chat.whatsapp.com/" + gclink,
                                sourceUrl: "https://chat.whatsapp.com/" + gclink
                            }
                        } 
                    })
                    .then(() => caption.push(`✅ Invited *@${i.split('@')[0]}*`))
                    .catch((err) => console.error(err));
                }
            }
        }
        pika.edit(caption.join('\n\n'), key, { mentions: users });
    } 
)

//༺─────────────────────────────────────༻

anya({ name: "gcrequest", alias: ['grouprequest', 'joinrequest', 'joinrequests'], react: "👥", category: "admins", desc: "See all group joining requests.", rule: 3, cooldown: 8, filename: __filename
    }, async (anyaV2, pika, { prefix }) => {
        const data = await anyaV2.groupRequestParticipantsList(pika.chat);
        if (data.length < 1) return pika.reply(`❌ No Requests Pending.`);
        const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());
        if (ui.buttons) {
            const metadata = await anyaV2.groupMetadata(pika.chat);
            const caption = "`👤 Group Joining Requests!`\n\n*👥 Group:* " + metadata.subject + "\n*🎄 Total Members:* " + metadata.participants.length + "\n*🍁 Requests:* " + data.length + " pending";          
            const requests = data.map(r => r.jid).join(" ");
            const requestlist = data.map(async r => `{\"title\":\"${Config.themeemoji} ${await anyaV2.getName(r.jid)}\",\"rows\":[{\"header\":\"✅ Accept\",\"title\":\"\",\"description\":\"Accept the user's request\",\"id\":\"${prefix}accepteverygrouprequest ${r.jid}\"},{\"header\":\"❌ Decline\",\"title\":\"\",\"description\":\"Decline the user's request\",\"id\":\"${prefix}declineeverygrouprequest ${r.jid}\"}]}`).join(",");
            return await anyaV2.sendButtonText(pika.chat, {
                text: caption,
                footer: Config.footer,
                buttons: [{
                    "name": "single_select",
                    "buttonParamsJson": `{\"title\":\"Pending Requests 🧾\",\"sections\":[{\"title\":\"⚡ 𝗥𝗲𝗾𝘂𝗲𝘀𝘁 𝗟𝗶𝘀𝘁 ⚡\",\"highlight_label\":\"${Config.botname}\",\"rows\":[{\"header\":\"🍇 Accept All Requests 🍇\",\"title\":\"\",\"description\":\"Click here to accept all requests\",\"id\":\"${prefix}accepteverygrouprequest ${requests}\"}]},{\"title\":\"⚡ 𝗥𝗲𝗾𝘂𝗲𝘀𝘁 𝗟𝗶𝘀𝘁 ⚡\",\"highlight_label\":\"${Config.botname}\",\"rows\":[{\"header\":\"❎ Decline All Requests ❎\",\"title\":\"\",\"description\":\"Click here to decline all requests\",\"id\":\"${prefix}declineeverygrouprequest ${requests}\"}]},${requestlist}]}`
                },
                {
                    "name": "quick_reply",
                    "buttonParamsJson": `{\"display_text\":\"More admin commands 👤\",\"id\":\"${prefix}list admins\"}`
                }]
            }, { quoted: pika });
        } else {
            const mentions = data.map(i => i.jid);
            const reply = data.reduce((acc, i, index) => {
                const timestamp = numberToDate(i.request_time);
                return `${acc}*${index + 1}.* @${i.jid.split("@")[0]}
> *📆 Date:* ${timestamp.date}
> *🕜 Time:* ${timestamp.time}\n\n`;
            }, `\`👤 Group Joining Requests!\`\n\n*Reply Number:*\n- _Reply 0 to decline every request_\n- _Reply 00 to accept every request_\n- _Reply a specific number to accept_\n═══════════════════════\n\n`);

            return pika.reply(`${reply}_ID: QA31_`, { mentions });
        }
    }
);


//༺─────────────────────────────────────༻

anya({ name: "accepteverygrouprequest", react: "🪀", notCmd: true, rule: 3, filename: __filename
}, async (anyaV2, pika, { args }) => {
    if (!args[0]) return pika.reply(`⚠️ Don't use this command!`);
    const metadata = await anyaV2.groupMetadata(pika.chat);
    const mems = metadata.participants.map(v => v.id);
    const replyArray = [];
    let approved = 0;
    const response = await anyaV2.groupRequestParticipantsList(pika.chat);
    for (const i of args) {
        const userId = i.split("@")[0];
        if (!response.map(v => v.jid).includes(i)) {
        console.log(i)
            replyArray.push(`❌ *@${userId}* don't exist in the request list!`);
        } else if (mems.includes(i)) {
            replyArray.push(`☑️ *@${userId}* already added in the gc!`);
        } else {
            await anyaV2.groupRequestParticipantsUpdate(pika.chat, [i], "approve");
            approved++;
        }
    }
    const reply = `${replyArray.join("\n\n")}\n\n${approved < 1 ? "" : `✅ Accepted \`${approved}\` pending requests..!`}`;
    return pika.reply(reply.trim(), { mentions: args });
});

//༺─────────────────────────────────────༻

anya({ name: "declineeverygrouprequest", react: "🪀", notCmd: true, rule: 3, filename: __filename
}, async (anyaV2, pika, { args }) => {
    if (!args[0]) return pika.reply(`⚠️ Don't use this command!`);
    const metadata = await anyaV2.groupMetadata(pika.chat);
    const mems = metadata.participants.map(v => v.id);
    const replyArray = [];
    let rejected = 0;
    const response = await anyaV2.groupRequestParticipantsList(pika.chat);
    for (const i of args) {
        const userId = i.split("@")[0];
        if (!response.map(v => v.jid).includes(i)) {
            replyArray.push(`❌ *@${userId}* don't exist in the request list!`);
        } else if (mems.includes(i)) {
            replyArray.push(`☑️ *@${userId}* already added in the gc!`);
        } else {
            await anyaV2.groupRequestParticipantsUpdate(pika.chat, [i], "reject");
            rejected++;
        }
    }
    const reply = `${replyArray.join("\n\n")}\n\n${rejected < 1 ? "" : `🗑️ Rejected \`${rejected}\` pending requests..!`}`;
    return pika.reply(reply.trim(), { mentions: args });
});

//༺─────────────────────────────────────༻

anya({
        name: "promote",
        react: "👑",
        need: "user",
        category: "admins",
        desc: "Promote users to admins",
        rule: 3,
        cooldown: 8,
        filename: __filename
}, async (anyaV2, pika, { args, prefix, command  }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to add!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const {key} = await pika.keyMsg(Config.message.wait);
        const caption = [];
        const metadata = await anyaV2.groupMetadata(pika.chat);
        const admins = metadata.participants.filter(v => v.admin !== null).map(v => v.id);
        for (const i of users) {
            const onwa = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (onwa.length < 1) {
                caption.push(`🪀 Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
                if (admins.includes(i)) {
                    caption.push(`👑 *@${i.split('@')[0]}* is already an admin`);
                } else {
                    await anyaV2.groupParticipantsUpdate(pika.chat, [i], 'promote')
                    .then(() => caption.push(`✅ Promoted *@${i.split('@')[0]}*`))
                    .catch((err) => console.error(err));
                }
            }
        }
        pika.edit(caption.join('\n\n'), key, { mentions: users });
    } 
)

//༺─────────────────────────────────────༻

anya({
        name: "demote",
        react: "👤",
        need: "user",
        category: "admins",
        desc: "Demote users to members",
        rule: 3,
        cooldown: 8,
        filename: __filename
}, async (anyaV2, pika, { args, prefix, command  }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to add!*`);
        const text = args.join(" ");
        const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
        const {key} = await pika.keyMsg(Config.message.wait);
        const caption = [];
        const metadata = await anyaV2.groupMetadata(pika.chat);
        const admins = metadata.participants.filter(v => v.admin !== null).map(v => v.id);
        for (const i of users) {
            const onwa = await anyaV2.onWhatsApp(i.split('@')[0]);
            if (onwa.length < 1) {
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
                if (!admins.includes(i)) {
                    caption.push(`👤 *@${i.split('@')[0]}* is already a member`);
                } else {
                    await anyaV2.groupParticipantsUpdate(pika.chat, [i], 'demote')
                    .then(() => caption.push(`✅ Demoted *@${i.split('@')[0]}*`))
                    .catch((err) => console.error(err));
                }
            }
        }
        pika.edit(caption.join('\n\n'), key, { mentions: users });
    } 
)

//༺─────────────────────────────────────༻

anya({
        name: "tagall",
        alias: ['tall'],
        react: "🎊",
        category: "admins",
        need: "text",
        desc: "Tag everyone in the group",
        rule: 3,
        filename: __filename
}, async (anyaV2, pika, { args }) => {
        const tagm = [];
        const text = args.join(" ");
        const metadata = await anyaV2.groupMetadata(pika.chat);
        tagm.push(`
═══════════════════════
        ░▒▓ \`\`\`GROUP TAGALL\`\`\` ▓▒░
═══════════════════════
*⛩️ Message :* \`${pika.quoted ? (pika.quoted.text.length > 1 ? pika.quoted.text : 'Empty message') : (args.length > 0 ? text : 'Empty message')}\`

*🎏 Announcer :* @${pika.sender.split('@')[0]}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
╭─⌈ 𝘼𝙙𝙢𝙞𝙣𝙨 ⌋`.trim());
        for (const admins of metadata.participants) {
            if (admins.admin !== null) {
                tagm.push(`👑 @${admins.id.split('@')[0]}`);
            }
        }
        tagm.push("╭─⌈ 𝙈𝙚𝙢𝙗𝙚𝙧𝙨 ⌋");
        for (const mem of metadata.participants) {
            if (mem.admin === null) {
                tagm.push(`👤 @${mem.id.split('@')[0]}`);
            }
        }
        const quoted = pika.quoted ? pika.quoted : '';
        const mime = (quoted && quoted.mimetype) ? quoted.mimetype : '';
        if (/image/.test(mime)) {
            const media = await quoted.download();
            return await anyaV2.sendMessage(pika.chat,
                {
                    image: media,
                    caption: tagm.join('\n'),
                    mentions: metadata.participants.map(v => v.id)
                })
        } else if (/video/.test(mime)) {
            const media = await quoted.download();
            return await anyaV2.sendMessage(pika.chat,
                {
                    video: media,
                    caption: tagm.join('\n'),
                    gifPlayback: ((quoted.msg || quoted).seconds > 11) ? true : false,
                    mentions: metadata.participants.map(v => v.id)
                })
        } else pika.reply(tagm.join('\n'), { mentions: metadata.participants.map(v => v.id) });
    }
)

//༺─────────────────────────────────────༻

anya({
            name: "hidetag",
            alias: ['htag', 'tag'],
            react: "🎀",
            category: "admins",
            need: "text",
            desc: "Tag everyone without texts",
            rule: 3,
            filename: __filename
     }, async (anyaV2, pika, { args }) => {
        const metadata = await anyaV2.groupMetadata(pika.chat);
        return pika.reply(pika.quoted ? (pika.quoted.text.split(" ").length > 0 ? pika.quoted.text : (args.length > 0 ? args.join(" ") : "")) : (args.length > 0 ? args.join(" ") : ""), { mentions: metadata.participants.map(v => v.id) });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "enable",
            alias: ['act', 'activate', 'active'],
            react: "🔗",
            category: "admins",
            need: "options",
            desc: "Enable group options",
            rule: 3,
            filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    const cmd = prefix + command;
    const empty = `
*⚙️ GROUP SWITCH DASHBOARD*

🌀 𝘙𝘦𝘱𝘭𝘺 𝘢 𝘯𝘶𝘮𝘣𝘦𝘳 𝘵𝘰 𝘦𝘯𝘢𝘣𝘭𝘦

𝟭. ${cmd} antilink 🔗
𝟮. ${cmd} antibad 🗣️
𝟯. ${cmd} antipicture 🖼️
𝟰. ${cmd} antivideo 🍜
𝟱. ${cmd} antisticker 👻
𝟲. ${cmd} antinsfw 🔞 (unavailable)
𝟳. ${cmd} antispam 🎀 (unavailable)
𝟴. ${cmd} gcchatbot 🗨️
𝟵. ${cmd} nsfw 🐤
𝟭𝟬. ${cmd} autoaccept ✨ (unavailable)
𝟭𝟭. ${cmd} antivirus 🧩 (unavailable)
𝟭𝟮. ${cmd} antibot 🤖

_ID: QA20_
`;
    if (args.length < 1) return pika.reply(empty.trim());
    const text = args.join(" ").toLowerCase();
    const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
    if (/antilink/.test(text)) {
        if (group.antilink) return pika.reply("_⭕ Already Enabled Antilink_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { antilink: true } }, { new: true });
            await announce(anyaV2, pika, { message: "_Users are not allowed to send any links 🔗 in this group_" });
            return pika.reply("✅ Antilink Turned On!");
        }
    } else if (/antiword|antitoxic|antibad/.test(text)) {
        if (group.antitoxic) return pika.reply("_⭕ Already Enabled Antiword_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { antitoxic: true } }, { new: true });
            await announce(anyaV2, pika, { message: "_Users are not allowed to say 🗣️ any bad word in this group_" });
            return pika.reply("✅ Antiword Turned On!");
        }
    } else if (/antipic|antiphoto/.test(text)) {
        if (group.antipicture) return pika.reply("_⭕ Already Enabled Antipicture_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { antipicture: true } }, { new: true });
            await announce(anyaV2, pika, { message: "_Users are not allowed to send any picture 🖼️ in this group_" });
            return pika.reply("✅ Antipicture Turned On!");
        }
    } else if (/antivid/.test(text)) {
        if (group.antivideo) return pika.reply("_⭕ Already Enabled Antivideo_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { antivideo: true } }, { new: true });
            await announce(anyaV2, pika, { message: "_Users are not allowed to send any video 🎥 in this group_" });
            return pika.reply("✅ Antivideo Turned On!");
        }
    } else if (/antistick/.test(text)) {
        if (group.antisticker) return pika.reply("_⭕ Already Enabled Antisticker_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { antisticker: true } }, { new: true });
            await announce(anyaV2, pika, { message: "_Users are not allowed to send any sticker 👻 in this group_" });
            return pika.reply("✅ Antisticker Turned On!");
        }
    } else if (/nsfw/.test(text)) {
        if (group.nsfw) return pika.reply("_⭕ Already Enabled NSFW_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { nsfw: true } }, { new: true });
            return pika.reply("✅ NSFW Turned On!");
        }
    } else if (/chatbot/.test(text)) {
        if (group.chatbot) return pika.reply("_⭕ Already Enabled Group Chatbot_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { chatbot: true } }, { new: true });
            return pika.reply("✅ Group Chatbot Turned On!");
        }
    } else if (/antibot/.test(text)) {
        if (group.antibot) return pika.reply("_Already Enabled Antibot 👾_");
        else {
            Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { antibot: true } }, { new: true });
            return pika.reply("🤖 Group Antibot Turned On!");
        }
    } else pika.reply(`❌ No Matching Command Found!*\n\n${empty.trim()}`);
})

//༺─────────────────────────────────────༻

anya({
            name: "disable",
            alias: ['deact', 'deactivate', 'deactive'],
            react: "🔗",
            category: "admins",
            need: "options",
            desc: "Disable group options",
            rule: 3,
            filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    const cmd = prefix + command;
    const empty = `
*⚙️ GROUP SWITCH DASHBOARD*

🌀 𝘙𝘦𝘱𝘭𝘺 𝘢 𝘯𝘶𝘮𝘣𝘦𝘳 𝘵𝘰 𝘥𝘪𝘴𝘢𝘣𝘭𝘦

𝟭. ${cmd} antilink 🔗
𝟮. ${cmd} antibad 🗣️
𝟯. ${cmd} antipicture 🖼️
𝟰. ${cmd} antivideo 🍜
𝟱. ${cmd} antisticker 👻
𝟲. ${cmd} antinsfw 🔞 (unavailable)
𝟳. ${cmd} antispam 🎀 (unavailable)
𝟴. ${cmd} gcchatbot 🗨️
𝟵. ${cmd} nsfw 🐤
𝟭𝟬. ${cmd} autoaccept ✨ (unavailable)
𝟭𝟭. ${cmd} antivirus 🧩 (unavailable)
𝟭𝟮. ${cmd} antibot 🤖

_ID: QA21_
`;
    if (args.length < 1) return pika.reply(empty.trim());
    const text = args.join(" ").toLowerCase();
    const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
    if (/antilink/.test(text)) {
        if (!group.antilink) return pika.reply("_⭕ Already Disabled Antilink_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { antilink: false } }, { new: true });
            return pika.reply("✅ Antilink Turned Off!");
        }
    } else if (/antiword|antitoxic|antibad/.test(text)) {
        if (!group.antitoxic) return pika.reply("_⭕ Already Disabled Antiword_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { antitoxic: false } }, { new: true });
            return pika.reply("✅ Antiword Turned Off!");
        }
    } else if (/antipic|antiphoto/.test(text)) {
        if (!group.antipicture) return pika.reply("_⭕ Already Disabled Antipicture_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { antipicture: false } }, { new: true });
            return pika.reply("✅ Antipicture Turned Off!");
        }
    } else if (/antivid/.test(text)) {
        if (!group.antivideo) return pika.reply("_⭕ Already Disabled Antivideo_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { antivideo: false } }, { new: true });
            return pika.reply("✅ Antivideo Turned Off!");
        }
    } else if (/antistick/.test(text)) {
        if (!group.antisticker) return pika.reply("_⭕ Already Disabled Antisticker_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { antisticker: false } }, { new: true });
            return pika.reply("✅ Antisticker Turned Off!");
        }
    } else if (/nsfw/.test(text)) {
        if (!group.nsfw) return pika.reply("_⭕ Already Disabled NSFW_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { nsfw: false } }, { new: true });
            return pika.reply("✅ NSFW Turned Off!");
        }
    } else if (/chatbot/.test(text)) {
        if (!group.chatbot) return pika.reply("_⭕ Already Disabled Group Chatbot_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { chatbot: false } }, { new: true });
            return pika.reply("✅ Group Chatbot Turned Off!");
        }
    } else if (/antibot/.test(text)) {
        if (!group.antibot) return pika.reply("_Already Disabled Antibot 👾_");
        else {
            Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { antibot: false } }, { new: true });
            return pika.reply("🤖 Group Antibot Turned Off!");
        }
    } else pika.reply(`❌ No Matching Command Found!*\n\n${empty.trim()}`);
})

//༺─────────────────────────────────────༻

anya({
            name: "delete2",
            alias: ['del2'],
            react: "✅",
            category: "admins",
            desc: "Delete messages sent by bot",
            rule: 3,
            filename: __filename
     }, async (anyaV2, pika) => {
        if (!pika.quoted) return pika.reply("Tag a message to delete as admins");
        anyaV2.sendMessage(pika.chat, {
            delete: {
                remoteJid: pika.chat,
                fromMe: pika.isBaileys ? true : false,
                id: pika.quoted.id,
                participant: pika.quoted.sender
            }
        });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "gclink",
            alias: ['linkgc'],
            react: "🔗",
            category: "admins",
            desc: "Get group's invite link",
            rule: 3,
            filename: __filename
      }, async (anyaV2, pika, { prefix }) => {
          const response = await anyaV2.groupInviteCode(pika.chat);
          try {
            ppgroup = await getBuffer(await anyaV2.profilePictureUrl(pika.chat, 'image'));
          } catch {
            ppgroup = await getBuffer('https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg');
          }
          return anyaV2.sendMessage(pika.chat, {
                image: ppgroup,
                caption: `*👥Group Link:* https://chat.whatsapp.com/${response}\n\n_Hint : Type *${prefix}invite @user1, @user2...* to invite someone_`
          }, {quoted:pika});
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "gcregister",
            alias: ['registor', 'register', 'resistor', 'gcregistor', 'gcregister', 'gcresistor'],
            react: "🏅",
            category: "admins",
            desc: "Users group registration switch",
            rule: 3,
            filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    const text = args.join(" ").toLowerCase();
    const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
    if (/on/.test(text)) {
        if (group.register) return pika.reply("_⭕ Already Enabled Group Registration_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { register: true } }, { new: true });
            await announce(anyaV2, pika, { message: "_For those users who didn't registered 🧾, now registration is mandatory to chat in this gc._" });
            return pika.reply(`✅ Group registration Turned On!\n\n> Type \`${prefix}agerestriction\` to add a group age restriction`);
        }
    } else if (/off/.test(text)) {
        if (!group.register) return pika.reply("_⭕ Already Disabled Group Registration_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { register: false } }, { new: true });
            return pika.reply("✅ Group registration Turned Off!");
        }
    } else return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off\n\n> After turning this setting on everyone have to register to talk.`);
  }
)

//༺─────────────────────────────────────༻

anya({
            name: "agerestriction",
            alias: ['gcagerestriction'],
            react: "📈",
            category: "admins",
            desc: "Users group age restrictions switch",
            rule: 3,
            filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    const text = args.join(" ").toLowerCase();
    const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
    if (!group.register) return pika.reply(`‼️ Please turn on \`${prefix}register on\` before using this command.`);
    if (/on/.test(text)) {
        if (group.restrictedAge) return pika.reply("_⭕ Already Enabled Group Age Restriction_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { restrictedAge: true } }, { new: true });
//            await announce(anyaV2, pika, { message: "_For those users who didn't registered 🧾, now registration is mandatory to chat in this gc._" });
            return pika.reply(`✅ Group Age Restriction Turned On!\n\n> Type \`${prefix}setagelimit\` to change lowest age limit`);
        }
    } else if (/off/.test(text)) {
        if (!group.restrictedAge) return pika.reply("_⭕ Already Disabled Group Registration_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { restrictedAge: false } }, { new: true });
            return pika.reply("✅ Group Age Restriction Turned Off!");
        }
    } else return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off\n\n> Anyone less than selected age limit will get kicked out.`);
  }
)

//༺─────────────────────────────────────༻

anya({
            name: "setagelimit",
            alias: ['setgcagelimit'],
            react: "🦋",
            category: "admins",
            desc: "Set Lowest age limit for the group register",
            rule: 3,
            need: "number",
            filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
//    const text = args.join(" ").toLowerCase();
    const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
    if (!group.register) return pika.reply(`‼️ Please turn on \`${prefix}register on\` before using this command.`);
    if (!group.restrictedAge) return pika.reply(`‼️ Please turn on \`${prefix}agerestriction on\` before using this command.`);
    if (!args[0]) return pika.reply(`*❗ Enter a age number!*\n\n*Example:* ${prefix+command} 17`);
    const userAge = Number(args[0]);
    if (!userAge) return pika.reply(`❌ Invalid age!`);
    if (userAge < 10) return pika.reply(`❌ Age should be more than 10 years`);
    if (userAge > 50) return pika.reply(`❌ Age should be less than 50 years`);
    if (userAge === group.restrictedAgeLimit) return pika.reply(`☑️ Age already registered.`);
    await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { restrictedAgeLimit: userAge } }, { new: true });
    return await announce(anyaV2, pika, { message: `✅ The lowest age allowed in this group chat now is \`${userAge} years\`` });
  }
)
