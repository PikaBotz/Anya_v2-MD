const { getBinaryNodeChild, getBinaryNodeChildren, generateWAMessageFromContent, proto } = require("@queenanya/baileys");
const { SendGroupInviteMessageToUser } = require("@queenanya/invite");
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
                caption.push(`❌ Can't find *@${i.split('@')[0]}* on WhatsApp`);
            } else {
            const action = await anyaV2.groupParticipantsUpdate(pika.chat, [i], 'add');
            const status = {
                200: `✅ Added *@${i.split('@')[0]}*`,
                408: `> ❌ *@${i.split('@')[0]}* previously left the chat, couldn't add`,
               403: `> _Couldn\'t add. Invite sent! to *@${i.split('@')[0]}*_`,
                409: `> ⭕ *@${i.split('@')[0]}* already a member`,
                401: `> ❌ *@${i.split('@')[0]}* has banned my number`,
                503: `> _Invited *@${i.split('@')[0]}*_`,
                501: `> Due To Privacy Of The User That He Added So  We can't Add Him Sending Invite`,
                502: `> Inviting *@${i.split('@')[0]}*`
            }
            if (status[action[0].status]) {
                caption.push(status[action[0].status]);
            // } else {
                await delay(2000);
                if (action[0].status == 403) {
                await pika.edit(status[501], key);
                await pika.edit(status[502], key, { mentions: users });
			    await delay(2000);
	            await SendGroupInviteMessageToUser(i, anyaV2, pika.chat);
	           await delay(1000);
                } else if (action[0].status == 408) {
                await pika.edit(status[408], key, { mentions: users });
                await caption.push(`❌ Couldn't add *@${i.split('@')[0]}* Sent Link!`);
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
    }
     await pika.edit(caption.join('\n\n'), key, { mentions: users });
    }
)

//༺─────────────────────────────────────༻

anya({
    name: "remove",
    react: "🪂",
    need: "user",
    category: "admins",
    desc: "Kick users from the group",
    rule: 3,
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3, etc...\n\n*Tag one or more users separated by commas to kick!*`);
    const users = pika.quoted ? [pika.quoted.sender] : args.join(" ").split(',').map(user => user.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
    const caption = [];
    for (const user of users) {
        try {
            const [onwa] = await anyaV2.onWhatsApp(user.split('@')[0]);
            if (!onwa) {
                caption.push(`🪀 Can't find *@${user.split('@')[0]}* on WhatsApp`);
                continue;
            }
            const [action] = await anyaV2.groupParticipantsUpdate(pika.chat, [user], 'remove');
            const status = action.status; console.log(action);
            if (status === 200) {
                caption.push(`✅ Removed *@${user.split('@')[0]}*`);
            } else if (status === 404) {
                caption.push(`> ❌ *@${user.split('@')[0]}* not found in this group`);
            } else {
                caption.push(`❌ Unexpected error: Code "${status}" for *@${user.split('@')[0]}*`);
            }
        } catch (err) {
            caption.push(`❌ Error removing *@${user.split('@')[0]}*: ${err.message}`);
        }
    }
    pika.reply(caption.join('\n\n'), { mentions: users });
});

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
    }, async (anyaV2, pika, { db, prefix }) => {
        const data = await anyaV2.groupRequestParticipantsList(pika.chat);
        if (data.length < 1) return pika.reply(`❌ No Requests Pending.`);
        const ui = db.UI?.[0] || new UI({ id: "userInterface" }).save();
        if (ui.buttons) {
            const metadata = await anyaV2.groupMetadata(pika.chat);
            const caption = "`👤 Group Joining Requests!`\n\n*👥 Group:* " + metadata.subject + "\n*🎄 Total Members:* " + metadata.participants.length + "\n*🍁 Requests:* " + data.length + " pending";          
            const requests = data.map(r => r.jid).join(" ");
            
            //༺─────────────────────────────────────
            /**
             * function to extract user request's jid and timestamp to buttons Array
             */
            async function generateLists(data) {
                const createListItem = async (r, action) => {
                    const name = await anyaV2.getName(r.jid);
                    const timestamp = numberToDate(r.request_time);
                    const emoji = action === 'accept' ? '👤' : '🌈';
                    const actionText = action === 'accept' ? 'accept this user' : 'reject this user';
                    const id = action === 'accept' ? `${prefix}acceptall ${r.jid}` : `${prefix}rejectall ${r.jid}`;
                    return `{"header":"${emoji} ${name}","title":"${timestamp.date} at ${timestamp.time}","description":"click here to ${actionText}","id":"${id}"}`;
                };
                const [acceptlist, rejectlist] = await Promise.all([
                    Promise.all(data.map(r => createListItem(r, 'accept'))).then(results => results.join(",")),
                    Promise.all(data.map(r => createListItem(r, 'reject'))).then(results => results.join(","))
                ]);
                return { acceptlist, rejectlist };
            }
            //༺─────────────────────────────────────
            
        const { acceptlist, rejectlist } = await generateLists(data);
        //console.log(acceptlist);
        // console.log(rejectlist);
        return await anyaV2.sendButtonText(pika.chat, {
                text: caption,
                footer: Config.footer,
                buttons: [{
                    "name": "single_select",
                    "buttonParamsJson": `{"title":"Pending Requests 🧾","sections":[{"title":"⚡ 𝗥𝗲𝗾𝘂𝗲𝘀𝘁 𝗟𝗶𝘀𝘁 ⚡","highlight_label":"${Config.botname}","rows":[{"header":"🍇 Accept All Requests 🍇","title":"","description":"Click here to accept all requests","id":"${prefix}acceptall ${requests}"}]},{"title":"⚡ 𝗥𝗲𝗾𝘂𝗲𝘀𝘁 𝗟𝗶𝘀𝘁 ⚡","highlight_label":"${Config.botname}","rows":[{"header":"🍁 Reject All Requests 🍁","title":"","description":"Click here to reject all requests","id":"${prefix}rejectall ${requests}"}]},{"title":"✅ 𝗖𝗵𝗼𝗼𝘀𝗲 𝘁𝗼 𝗮𝗰𝗰𝗲𝗽𝘁 ✅","highlight_label":"${Config.botname}","rows":[${acceptlist}]},{"title":"❌ 𝗖𝗵𝗼𝗼𝘀𝗲 𝘁𝗼 𝗿𝗲𝗷𝗲𝗰𝘁 ❌","highlight_label":"${Config.botname}","rows":[${rejectlist}]}]}`
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

anya({
    name: "acceptall",
    react: "💐",
    category: "admins",
    desc: "Accept all users group joining requests",
    rule: 3,
    filename: __filename
}, async (anyaV2, pika, { args }) => {
    const metadata = await anyaV2.groupMetadata(pika.chat);
    const mems = metadata.participants.map(v => v.id);
    let replyArray = [];
    let approved = 0;
    let users = [];
    const requestList = await anyaV2.groupRequestParticipantsList(pika.chat);
    if (args.length > 0) {
        users = args.map(i => i.trim());
    } else {
        if (requestList.length < 1) return pika.reply("_No pending requests._");
        users = requestList.map(r => r.jid);
    }
    for (const i of users) {
        const userId = i.split("@")[0];
        if (!requestList.map(v => v.jid).includes(i)) {
            replyArray.push(`❌ *@${userId}* is not in the request list!`);
        } else if (mems.includes(i)) {
            replyArray.push(`☑️ *@${userId}* is already a member of the group!`);
        } else {
            try {
                await anyaV2.groupRequestParticipantsUpdate(pika.chat, [i], "approve");
                approved++;
                await delay(1000);
            } catch (error) {
                replyArray.push(`❌ Error approving *@${userId}*: ${error.message}`);
            }
        }
    }
    const reply = `${replyArray.join("\n\n")}\n\n${approved < 1 ? "" : `✅ Accepted \`${approved}\` pending requests..!`}`;
    pika.reply(reply.trim(), { mentions: users });
});


//༺─────────────────────────────────────༻

anya({
    name: "rejectall",
    alias: ['declineall'],
    react: "💐",
    category: "admins",
    desc: "Reject all users group joining requests",
    rule: 3,
    filename: __filename
}, async (anyaV2, pika, { args }) => {
    const metadata = await anyaV2.groupMetadata(pika.chat);
    const mems = metadata.participants.map(v => v.id);
    let replyArray = [];
    let rejected = 0;
    let users = [];
    const requestList = await anyaV2.groupRequestParticipantsList(pika.chat);
    if (args.length > 0) {
        users = args.map(i => i.trim());
    } else {
        if (requestList.length < 1) return pika.reply("_No pending requests to decline._");
        users = requestList.map(r => r.jid); 
    }
    for (const i of users) {
        const userId = i.split("@")[0];
        if (!requestList.map(v => v.jid).includes(i)) {
            replyArray.push(`❌ *@${userId}* is not in the request list!`);
        } else if (mems.includes(i)) {
            replyArray.push(`☑️ *@${userId}* is already a member of the group!`);
        } else {
            try {
                await anyaV2.groupRequestParticipantsUpdate(pika.chat, [i], "reject");
                rejected++;
                await delay(1000);  
            } catch (error) {
                replyArray.push(`❌ Error rejecting *@${userId}*: _${error.message}_`);
            }
        }
    }
    const reply = `${replyArray.join("\n\n")}\n\n${rejected < 1 ? "" : `🗑️ Rejected \`${rejected}\` pending requests..!`}`;
    pika.reply(reply.trim(), { mentions: users });
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
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n> Tag one or more users with "," between them to promote!`);
    const text = args.join(" ");
    const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
    const caption = [];
    const metadata = await anyaV2.groupMetadata(pika.chat);
    const adminsSet = new Set(metadata.participants.filter(v => v.admin !== null).map(v => v.id));
    for (const i of users) {
        const userId = i.split('@')[0];
        try {
            const onwa = await anyaV2.onWhatsApp(userId);
            if (onwa.length < 1) {
                caption.push(`🪀 Can't find *@${userId}* on WhatsApp`);
            } else if (adminsSet.has(i)) {
                caption.push(`👑 *@${userId}* is already an admin`);
            } else {
                await anyaV2.groupParticipantsUpdate(pika.chat, [i], 'promote');
                caption.push(`✅ Promoted *@${userId}*`);
                // await delay(500); // Adding a small delay to prevent rate limiting
            }
        } catch (err) {
            caption.push(`❌ Failed to promote *@${userId}* due to an error: ${err.message}`);
            console.error(err);
        }
    }
    pika.reply(caption.join('\n\n'), { mentions: users });
});

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
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (!pika.quoted && args.length < 1) return pika.reply(`Eg: ${prefix + command} @user1, @user2, @user3 etc...\n\n*Tag one or more users with "," between them to demote!*`);
    const text = args.join(" ");
    const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
    //const { key } = await pika.keyMsg(Config.message.wait);
    const caption = [];
    const metadata = await anyaV2.groupMetadata(pika.chat);
    const adminsSet = new Set(metadata.participants.filter(v => v.admin !== null).map(v => v.id));
    for (const i of users) {
        const userId = i.split('@')[0];
        try {
            const onwa = await anyaV2.onWhatsApp(userId);
            if (onwa.length < 1) {
                caption.push(`❌ Can't find *@${userId}* on WhatsApp`);
            } else if (!adminsSet.has(i)) {
                caption.push(`👤 *@${userId}* is already a member`);
            } else {
                await anyaV2.groupParticipantsUpdate(pika.chat, [i], 'demote');
                caption.push(`✅ Demoted *@${userId}*`);
                //await delay(500);
            }
        } catch (err) {
            caption.push(`❌ Failed to demote *@${userId}* due to an error: ${err.message}`);
            console.error(err);
        }
    }
    pika.reply(caption.join('\n\n'), { mentions: users });
});

//༺─────────────────────────────────────༻

anya({ name: "tagall", alias: ['tall'], react: "🎊", category: "admins", need: "text", desc: "Tag everyone in the group", rule: 3, filename: __filename }, async (anyaV2, pika, { db, args, prefix }) => {
        const tagm = [];
        const text = args.join(" ");
        const metadata = await anyaV2.groupMetadata(pika.chat);
        const tagText = pika.quoted ? pika.quoted.text ? pika.quoted.text : args[0] ? text : "Empty Message" : args[0] ? text : "Empty Message";
        tagm.push(`*⛩️ Message :* \`${tagText}\`\n\n*🎏 Announcer :* @${pika.sender.split('@')[0]}\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n╭─⌈ 𝘼𝙙𝙢𝙞𝙣𝙨 ⌋`.trim());
        tagm.push(metadata.participants.filter(admins => admins.admin !== null).map(admins => `👑 @${admins.id.split('@')[0]}`).join("\n"));
        tagm.push("\n╭─⌈ 𝙈𝙚𝙢𝙗𝙚𝙧𝙨 ⌋");
        const participants = metadata.participants.filter(mem => mem.admin === null);
        tagm.push((participants.length > 0)
            ? participants.map(mem => `👤 @${mem.id.split('@')[0]}`).join("\n")
            : "_❌ No members in this gc!_");
        const quoted = pika.quoted ? pika.quoted : pika;
        const mime = (quoted && quoted.mimetype) ? quoted.mimetype : pika.mtype;
        const buttons = [
            { "name": "cta_url", "buttonParamsJson": `{\"display_text\":\"Website ⚡\",\"url\":\"${Config.socialLink}\",\"merchant_url\":\"${Config.socialLink}\"}` },
            { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Bot Script 🌀\",\"id\":\"${prefix}sc\"}` }
        ];
        const ui = db.UI?.[0] || new UI({ id: "userInterface" }).save();
        if (/image/.test(mime)) {
            const media = await quoted.download();
            if (ui.buttons) return await anyaV2.sendButtonImage(pika.chat, {
                    image: media,
                    caption: tagm.join('\n'),
                    footer: Config.footer,
                    buttons: buttons,
                    contextInfo: {
                        mentionedJid: metadata.participants.map(v => v.id)
                    }
                }, { quoted: pika });
            else return await anyaV2.sendMessage(pika.chat, {
                    image: media,
                    caption: tagm.join('\n'),
                    mentions: metadata.participants.map(v => v.id)
                }, { quoted: pika })
        } else if (/video/.test(mime)) {
            const media = await quoted.download();
            if (ui.buttons) return await anyaV2.sendButtonVideo(pika.chat, {
                    video: media,
                    caption: tagm.join('\n'),
                    footer: Config.footer,
                    buttons: buttons,
                    contextInfo: {
                        mentionedJid: metadata.participants.map(v => v.id)
                    }
                }, { quoted: pika });
            else return await anyaV2.sendMessage(pika.chat, {
                    video: media,
                    caption: tagm.join('\n'),
                    gifPlayback: ((quoted.msg || quoted).seconds > 11) ? true : false,
                    mentions: metadata.participants.map(v => v.id)
                }, { quoted: pika })
        } else {
            if (ui.buttons) return await anyaV2.sendButtonText(pika.chat, {
                    text: tagm.join('\n'),
                    footer: Config.footer,
                    buttons: buttons,
                    contextInfo: {
                        mentionedJid: metadata.participants.map(v => v.id)
                    }
                }, { quoted: pika });
            else return pika.reply(tagm.join('\n'), { mentions: metadata.participants.map(v => v.id) });
        }
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
                caption: `*👥Group Link:* https://chat.whatsapp.com/${response}\n\n> _Hint : Type *${prefix}invite @user1, @user2...* to invite someone_`
          }, {quoted:pika});
      }
)

//༺─────────────────────────────────────

anya(
        {
                name: "group",
                react: "👥",
                category: "admins",
                desc: "Open or close group",
                rule: 3,
                filename: __filename
        },
        async (anyaV2, pika, { db, args, prefix, command }) => {
                if (args[0] === "open") {
                        await anyaV2.groupSettingUpdate(pika.chat, "announcement")
                        .then(() => pika.reply("✅ Group Muted!"))
                        .catch((err) => {
                                console.error(err);
                                return pika.reply(Config.message.error);
                        });
                } else if (args[0] === "close") {
                        await anyaV2.groupSettingUpdate(pika.chat, "not_announcement")
                        .then(() => pika.reply("✅ Group Unmuted!"))
                        .catch((err) => {
                                console.error(err);
                                return pika.reply(Config.message.error);
                        });
                } else {
                        const ui = db.UI?.[0] || new UI({ id: "userInterface" }).save();
                        if (ui.buttons) return await anyaV2.sendButtonText(pika.chat, {
                                text: "Choose a option below to turn `group open/close`",
                                footer: Config.footer,
                                buttons: [
                                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Open Group 🗣️\",\"id\":\"${prefix + command} open\"}` },
                                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Close Group 🔇\",\"id\":\"${prefix + command} close\"}` },
                                ]
                        }, { quoted: pika });
                        else return pika.reply(`Example: \`${prefix + command} open/close\`\n\n> Info: Opening group will allow everyone to chat, but closing don't.`);
                }
        }
)

//༺─────────────────────────────────────

anya(
        {
                name: "gcpp",
                alias: ['gcpic', 'gcdp', 'gcpfp', 'grouppp', 'grouppic', 'groupdp'],
                react: "💖",
                category: "admins",
                desc: "Change group profile picture",
                rule: 3,
                filename: __filename
        },
        async (anyaV2, pika) => {
                if (!pika.quoted) return pika.reply("_Where's the image❓_");
                const quoted = pika.quoted ? pika.quoted : pika;
                const mime = (quoted && quoted.mimetype) ? quoted.mimetype : pika.mtype;
                if (!/image/.test(mime) || /webp/.test(mime)) return pika.reply("_❗ It's not an image_");
                const buffer = await quoted.download();
                await anyaV2.updateProfilePicture(pika.chat, buffer);
                return pika.reply(Config.message.success);
        }
)

//༺─────────────────────────────────────

anya({ name: "gcregister", alias: ['gcregistor', 'gcregister', 'gcresistor'], react: "📝", category: "admins", desc: "Users group registration switch else they can't chat", rule: 3, filename: __filename },
    async (anyaV2, pika, { db, args, prefix, command }) => {
    const group = db.Group.find(v => v.id === pika.chat.split("@")[0]) || await new Group({ id: pika.chat.split("@")[0] }).save();
    if (/on/.test(args[0])) {
        if (group.register) return pika.reply("_Already Enabled Group Registration! 📝_");
        else {
            const ui = db.UI?.[0] || new UI({ id: "userInterface" }).save();
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { register: true } }, { new: true });
            await announce(anyaV2, pika, { message: "_For those users who didn't registered 📝, now registration is mandatory to chat in this gc._" });
            const success = "✅ Group registration Turned `On!`";
            if (ui.buttons) return await anyaV2.sendButtonText(pika.chat, {
                text: success,
                footer: Config.footer,
                buttons: [{ "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Set age restriction 🕊️\",\"id\":\"${prefix}agerestriction\"}` }]
                }, { quoted: pika });
            else pika.reply(success + "\n\n> Type \`" + prefix + "agerestriction\` to add a group age restriction");
        }
    } else if (/off/.test(args[0])) {
        if (!group.register) return pika.reply("_Already Disabled Group Registration! 📝_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { register: false } }, { new: true });
            return pika.reply("✅ Group registration Turned `Off!`");
        }
    } else {
        const ui = db.UI?.[0] || new UI({ id: "userInterface" }).save();
        if (ui.buttons) return await anyaV2.sendButtonText(pika.chat, {
                    text: "Choose a option below for group registration 📝\n\n_Info: After turning this setting on everyone have to register to send messages in this gc_",
                    footer: Config.footer,
                    buttons: [
                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Turn On ✅\",\"id\":\"${prefix + command} on\"}` },
                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Turn Off ❌\",\"id\":\"${prefix + command} off\"}` },
                    ]
            }, { quoted: pika });
        else return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off\n\n> After turning this setting on everyone have to register to talk.`);
    }
  }
)

//༺─────────────────────────────────────༻

anya(
        {
            name: "agerestriction",
            alias: ['gcagerestriction'],
            react: "📈",
            category: "admins",
            desc: "Users group age restrictions switch",
            rule: 3,
            filename: __filename
        },
async (anyaV2, pika, { db, args, prefix, command }) => {
    const group = db.Group.find(v => v.id === pika.chat.split("@")[0]) || await new Group({ id: pika.chat.split("@")[0] }).save();
    if (!group.register) return pika.reply(`‼️ Please turn on \`${prefix}gcregister on\` before using this command.`);
    if (/on/.test(args[0])) {
        if (group.restrictedAge) return pika.reply("_⭕ Already Enabled Group Age Restriction_");
        else {
            const ui = db.UI?.[0] || new UI({ id: "userInterface" }).save();
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { restrictedAge: true } }, { new: true });
            const success = "✅ Group Age Restriction Turned On!";
            if (ui.buttons) return await anyaV2.sendButtonText(pika.chat, {
                text: success,
                footer: Config.footer,
                buttons: [{ "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Set age limit 🍼\",\"id\":\"${prefix}setagelimit\"}` }]
                }, { quoted: pika });
            else return pika.reply(success + "\n\n> Type \`" + prefix + "setagelimit\` to change lowest age limit");
        }
    } else if (/off/.test(args[0])) {
        if (!group.restrictedAge) return pika.reply("_⭕ Already Disabled Group Registration_");
        else {
            await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { restrictedAge: false } }, { new: true });
            return pika.reply("✅ Group Age Restriction Turned Off!");
        }
    } else {
        const ui = db.UI?.[0] || new UI({ id: "userInterface" }).save();
        if (ui.buttons) return await anyaV2.sendButtonText(pika.chat, {
                text: "Choose a option below for group age restriction 📈\n\n_Info: Anyone less than selected age limit will get kicked out_",
                footer: Config.footer,
                buttons: [
                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Turn On ✅\",\"id\":\"${prefix + command} on\"}` },
                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Turn Off ❌\",\"id\":\"${prefix + command} off\"}` },
                    ]
                }, { quoted: pika });
      else return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} on/off\n\n> Anyone less than selected age limit will get kicked out.`);
    }
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
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const group = db.Group.find(v => v.id === pika.chat.split("@")[0]) || await new Group({ id: pika.chat.split("@")[0] }).save();
    const ui = db.UI?.[0] || new UI({ id: "userInterface" }).save();
    if (!group.register) return pika.reply(`‼️ Please turn on \`${prefix}gcregister on\` before using this command.`);
    if (!group.restrictedAge) return pika.reply(`‼️ Please turn on \`${prefix}agerestriction on\` before using this command.`);
    if (!args[0]) {
      if (ui.buttons) {
        const emojis = {
            '5-15': '🍼',
            '16-25': '🎉',
            '26-35': '🌟',
            '36-45': '🔥',
            '46-50': '⭐',
            '51+': '⚰️'
        };
        const ageArray = [];
        for (let age = 5; age <= 100; age++) {
            let emoji;
            if (age >= 5 && age <= 15) {
                emoji = emojis['5-15'];
            } else if (age >= 16 && age <= 25) {
                emoji = emojis['16-25'];
            } else if (age >= 26 && age <= 35) {
                emoji = emojis['26-35'];
            } else if (age >= 36 && age <= 45) {
                emoji = emojis['36-45'];
            } else if (age >= 46 && age <= 50) {
                emoji = emojis['46-50'];
            } else emoji = emojis['51+'];
            ageArray.push(`{\"header\":\"${emoji} ${age} years ${(age === 16) ? "(recommended)" : ''}\",\"title\":\"\",\"description\":\"I am ${age} years old\",\"id\":\"${prefix}setagelimit ${age}\"}`);
        }
        const list = ageArray.join(",");
        const metadata = await anyaV2.groupMetadata(pika.chat);
        const caption = "`🍼 Group Age Restriction!`\n\n*👥 Group:* " + metadata.subject + "\n*🍁 Total Members:* " + metadata.participants.length + "\n*🐤 Current Limit:* " + group.restrictedAgeLimit + " years";
        return await anyaV2.sendButtonText(pika.chat, {
                text: caption.trim(),
                footer: Config.footer,
                buttons:  [{ "name": "single_select", "buttonParamsJson": `{\"title\":\"Choose age 🐣\",\"sections\":[{\"title\":\"🍼 𝗖𝗵𝗼𝗼𝘀𝗲 𝗔𝗴𝗲 𝗟𝗶𝗺𝗶𝘁 🌟\",\"highlight_label\":\"${Config.botname}\",\"rows\":[${list}]}]}` }]
                }, { quoted: pika });
      } else return pika.reply(`*❗ Enter a age number!*\n\n*Example:* ${prefix+command} 17`);
    }
    const userAge = Number(args[0]);
    if (!userAge) return pika.reply(`❌ Invalid age!`);
    if (userAge < 5) return pika.reply(`❌ Age should be more than 5 years`);
    if (userAge > 100) return pika.reply(`❌ Age should be less than 100 years`);
    if (userAge === group.restrictedAgeLimit) return pika.reply(`☑️ Age already registered.`);
    await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { restrictedAgeLimit: userAge } }, { new: true });
    return await announce(anyaV2, pika, { message: `✅ The lowest age allowed in this group chat now is \`${userAge} years\`` });
  }
)
