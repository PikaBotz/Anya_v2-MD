const Config = require('../../config');
const PhoneNumber = require('awesome-phonenumber');
const { System, Group, User } = require(__dirname + '/../database/mongodb');
const { dayToday, getBuffer, delay, getAdmin} = require(__dirname + '/myfunc');
const { proto, prepareWAMessageMedia, generateWAMessageFromContent } = require('@queenanya/baileys');

//༺─────────────────────────────────────༻

const groupEventListener = async (event, anyaV2) => {
    const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
    const user = event.participants[0]; 
    const isBusiness = await anyaV2.getBusinessProfile(user);
    let ppuser;
    try {
        ppuser = await getBuffer(await anyaV2.profilePictureUrl(user, 'image'));
    } catch {
        ppuser = await getBuffer('https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg');
    }
    let bio;
        try {
            bio = await anyaV2.fetchStatus(user) || false;
        } catch {
            bio = false;
        }
    const username = await anyaV2.getName(user);
    const metadata = await anyaV2.groupMetadata(event.id);
    const usercon = { key: { participant: '0@s.whatsapp.net', ...({ remoteJid: 'status@broadcast' }), }, message: { contactMessage: { displayName: username, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${username},;;;\nFN:${username}\nitem1.TEL;waid=${user.split("@")[0]}:${user.split("@")[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`, jpegThumbnail: Config.image_2, thumbnail: Config.image_2, sendEphemeral: true } } };

//༺─────────────────────────────────────༻

    if (event.action === "add") {

        if (system.antifake) {
            const array = system.fakelist;
            for (let i = 0; i < array.length; i++) {
                const code = PhoneNumber('+' + user.split('@')[0]).getCountryCode();
                if (code === Number(array[i])) {
                    try {
                        anyaV2.sendMessage(event.id, {
                            text: `\`\`\`☎️ Antifake Detected!!\`\`\`\n_*@${user.split("@")[0]}* is not allowed in this group!_`,
                            mentions: [user]
                        }, { quoted: usercon });
                        await delay(2000);
                        return await anyaV2.groupParticipantsUpdate(event.id, [user], 'remove');
                    } catch {
                        return console.log("☎️ Antifake Tanana");
                    }
                }
            }
        }

//༺─────────────────────────────────────༻

    const group = await Group.findOne({ id: event.id.split("@")[0] }) || (await new Group({ id: event.id.split("@")[0] }).save());
    if (group.register) {
//        const groupAdmins = await getAdmin(anyaV2, pika);
//        const isBotAdmin = pika.isGroup ? groupAdmins.includes(botNumber) : false;
//        if (isBotAdmin) {
        const userdata = await User.findOne({ id: user.split("@")[0] }) || await new User({ id: user.split("@")[0] }).save();
        if (!userdata.groups.includes(event.id.split("@")[0])) {
const msgs = generateWAMessageFromContent(event.id, {
    viewOnceMessage: {
        message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `*\`Heya! @${user.split("@")[0]} 🎉\`*\n
*🧟‍♀️ To chat in this group chat you have to \`register\` here else you'll be get \`kicked\` out.*\n
> You have ${userdata.retryChances - 1} chances left`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: Config.footer
          }),
          header: proto.Message.InteractiveMessage.Header.create({
          hasMediaAttachment: false,
          ...await prepareWAMessageMedia({ image: await getBuffer("https://i.ibb.co/Y7mXpD9/Picsart-24-06-30-22-38-33-562.jpg") }, { upload: anyaV2.waUploadToServer })
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Register 💗\",\"id\":\"${Config.prefa}newgcres\"}` },
                { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Remove Me ✔️\",\"id\":\"${Config.prefa}removeme\"}` }
            ],
          }),
          contextInfo: {
                  mentionedJid: [user], 
                  forwardingScore: 999,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363222395675670@newsletter',
                  newsletterName: Config.botname,
                  serverMessageId: 143
                }
                }
       })
    }
  }
}, {})
anyaV2.relayMessage(event.id, msgs.message, {});
await User.findOneAndUpdate({ id: user.split("@")[0] }, { $set: { resTimer: new Date().toISOString(), retryChances: user.retryChances - 1 } }, { new: true });
        }
//    }
}

//༺─────────────────────────────────────༻

                    if (system.welcome) {
                        const number = getNumInfo(user);
                        return await anyaV2.sendMessage(event.id, {
                            image: ppuser,
                            caption: `
┌┄⌈ 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 💐 ⌋
└┬────┈⟮⟮ *@${user.split("@")[0]}* ⟯⟯-❖
   │⟮▢⟯ 𝙉𝙖𝙢𝙚 :
   │⟮▣⟯ ${username}
   │⟮▢⟯ 𝘾𝙤𝙪𝙣𝙩𝙧𝙮 :
   │⟮▣⟯ ${number.country}
   │⟮▢⟯ 𝙏𝙮𝙥𝙚 :
   │⟮▣⟯ ${isBusiness ? "business profile" : "private profile"}
   │⟮▢⟯ 𝙍𝙖𝙣𝙠 :
   │⟮▣⟯ ${metadata.participants.length}th member
   │⟮▢⟯ 𝘿𝙖𝙩𝙚 | 𝙏𝙞𝙢𝙚 :
   │⟮▣⟯ ${dayToday().date} | ${dayToday().time}
   │⟮▢⟯ 𝙎𝙩𝙖𝙩𝙪𝙨 :
   │⟮▣⟯ ${bio.status ? bio.status : "~not found~"}
   └───────────────┄┈༻

_Type *${Config.prefa}welcome off* to turn off this message_`.trim(),
                            contextInfo: {
                                mentionedJid: [user],
                                externalAdReply: {
                                    showAdAttribution: true,
                                    containsAutoReply: true,
                                    title: metadata.subject,
                                    body: username,
                                    previewType: "PHOTO",
                                    thumbnailUrl: "",
                                    thumbnail: ppuser,
                                    sourceUrl: "https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX",
                                    mediaUrl: "https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX"
                                }
                            }
                        }, { quoted: usercon }); 
                    }
                }

 //༺─────────────────────────────────────༻
 
 else if (event.action === "remove") {
    if (system.goodbye) {
        return await anyaV2.sendMessage(event.id, {
            image: ppuser,
            caption: `
┌┄⌈ 𝗚𝗼𝗼𝗱𝗯𝘆𝗲 👋🏻 ⌋
└┬────┈⟮⟮ *@${user.split("@")[0]}* ⟯⟯-❖
   │⟮▢⟯ 𝙉𝙖𝙢𝙚 :
   │⟮▣⟯ ${username}
   │⟮▢⟯ 𝙋𝙖𝙨𝙩 𝙍𝙖𝙣𝙠 :
   │⟮▣⟯ ${metadata.participants.length}th member
   │⟮▢⟯ 𝘿𝙖𝙩𝙚 | 𝙏𝙞𝙢𝙚 :
   │⟮▣⟯ ${dayToday().date} | ${dayToday().time}
   └───────────────┄┈༻

_Type *${Config.prefa}goobye off* to turn off this message_`.trim(),
            contextInfo: {
                mentionedJid: [user],
                externalAdReply: {
                    showAdAttribution: true,
                    containsAutoReply: true,
                    title: metadata.subject,
                    body: username,
                    previewType: "PHOTO",
                    thumbnailUrl: "",
                    thumbnail: ppuser,
                    sourceUrl: "https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX",
                    mediaUrl: "https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX"
                }
            }
        }, { quoted: usercon }); 
    }
 }
 
 //༺─────────────────────────────────────༻
 
 else if (event.action === "promote") {
    if (system.pdm) {
        return await anyaV2.sendMessage(event.id, {
            image: ppuser,
            caption: `
❝🇵 🇷 🇴 🇲 🇴 🇹 🇪 🇩❞

*🗣️ Name :* @${user.split("@")[0]}
*🍜 Status :* Member ➠ Admin
*📆 Time :* ${dayToday().date} at ${dayToday().time}

_Type *${Config.prefa}pdm off* to turn off this message_
`.trim(),
            mentions: [user]
        }, { quoted: usercon });
    }
 }
 
 //༺─────────────────────────────────────༻
 
 else if (event.action === "demote") {
    if (system.pdm) {
        return await anyaV2.sendMessage(event.id, {
            image: ppuser,
            caption: `
❝🇩 🇪 🇲 🇴 🇹 🇪❞

*🗣️ Name :* @${user.split("@")[0]}
*🏮 Status :* Admin ➠ Member 
*📆 Time :* ${dayToday().date} at ${dayToday().time}

_Type *${Config.prefa}pdm off* to turn off this message_
`.trim(),
            mentions: [user]
        }, { quoted: usercon });
    }
 }
}

//༺─────────────────────────────────────༻

const groupChangesListener = async (event, anyaV2) => {
    const system = await System.findOne({ id: "system" }) || await new System({ id: "system" }).save();
    if (!system.gcm) return;
    await delay(1500);
    const group = event[0];
    let ppgroup;
    try {
        ppgroup = await getBuffer(await anyaV2.profilePictureUrl(groupAction[0].id, 'image'));
    } catch {
        ppgroup = await getBuffer('https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg');
    }
    if (group.announce === true) return await anyaV2.sendMessage(group.id, {
        image: ppgroup,
        caption: `⧉ 𝗧𝗵𝗶𝘀 𝗚𝗿𝗼𝘂𝗽 𝗛𝗮𝘀 𝗕𝗲𝗲𝗻 𝗖𝗹𝗼𝘀𝗲𝗱\n⧉ _No one can send messages to this group except group admins_\n\n_Type *${Config.prefa}gcm off* to turn off this message_`
    });
    else if (group.announce === false) return await anyaV2.sendMessage(group.id, {
        image: ppgroup,
        caption: `⧉ 𝗧𝗵𝗶𝘀 𝗚𝗿𝗼𝘂𝗽 𝗛𝗮𝘀 𝗕𝗲𝗲𝗻 𝗢𝗽𝗲𝗻𝗲𝗱\n⧉ _Anyone can now send messages in this group_\n\n_Type *${Config.prefa}gcm off* to turn off this message_`
    });
    else if (group.restrict === true) return await anyaV2.sendMessage(group.id, {
        image: ppgroup,
        caption: `⧉ 𝗘𝗱𝗶𝘁𝗶𝗻𝗴 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻𝘀 𝗛𝗮𝘀 𝗕𝗲𝗲𝗻 𝗥𝗲𝘀𝘁𝗿𝗶𝗰𝘁𝗲𝗱\n⧉ _No one can edit group info of this group except group admins_\n\n_Type *${Config.prefa}gcm off* to turn off this message_`
    });
    else if (group.restrict === false) return await anyaV2.sendMessage(group.id, {
        image: ppgroup,
        caption: `⧉ 𝗨𝗻𝗿𝗲𝘀𝘁𝗿𝗶𝗰𝘁𝗲𝗱 𝗘𝗱𝗶𝘁𝗶𝗻𝗴 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻𝘀\n⧉ _Anyone can now chnage this group's settings_\n\n_Type *${Config.prefa}gcm off* to turn off this message_`
    });
    else return await anyaV2.sendMessage(group.id, {
        image: ppgroup,
        caption: `⧉ 𝗚𝗿𝗼𝘂𝗽 𝗡𝗮𝗺𝗲 𝗖𝗵𝗮𝗻𝗴𝗲𝗱\n⧉ *New Name :* ${group.subject}\n\n_Type *${Config.prefa}gcm off* to turn off this message_`
    });
}
    
//༺─────────────────────────────────────༻

function getNumInfo(phoneNumber) {
   const number = new PhoneNumber("+" + phoneNumber, 'ZZ');
   return {
//      valid: true,
//      internationalFormat: number.getNumber('international'),
//      nationalFormat: number.getNumber('national'),
      country: number.getRegionCode(),
//      countryCode: number.getCountryCode(),
    }
}

module.exports = { groupEventListener, groupChangesListener };