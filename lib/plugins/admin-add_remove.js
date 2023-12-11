const Config = require('../../config');

exports.cmdName = () => ({
  name: ['invite', 'add', 'remove'],
  alias: [],
  category: "admin",
  desc: "This plugins adds, removes and invites a(n) user(s) in a group chat."
});

exports.getCommand = async (args, botAdmin, userAdmin, userOwner, userSudo, text, prefix, command, anyaV2, pika) => {
  if (!pika.isGroup) return pika.reply(Config.message.group);
  if (!botAdmin) return pika.reply(Config.message.botAdmin);
  if (!userAdmin && !userOwner && !userSudo) return pika.reply(Config.message.admin);
  if (!text && !pika.quoted) return pika.reply(`Provide me a number to ${command} or send me more numbers with commas to ${command} all at one time.\n\n*Example:* ${prefix + command} <user1> , <user2> , <user3> , ...or more...`);
  await pika.react("👥");
  const proceed = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
  const groupMetadata = pika.isGroup ? await anyaV2.groupMetadata(pika.chat) : pika.edit(Config.message.error, proceed.key);

  let user = [];
  if (args[0] !== 'numBut') {
  if (pika.quoted) {
    user.push(pika.quoted.sender);
  } else {
    let cleanText = text.replace(/[^0-9,]/g, '');
    let users = cleanText.split(',');
    user = user.concat(users.map(u => u + "@s.whatsapp.net"));
    }
  } else {
    user.push(args[1] + '@s.whatsapp.net');
  };

  switch (command) {
    case 'invite':
      await invite(anyaV2, user, pika, groupMetadata, proceed);
      break;
    case 'add':
      await add(groupMetadata, user, proceed, anyaV2, pika);
      break;
    case 'remove':
      await remove(anyaV2, pika, user, proceed);
      break;
   }
};

async function getBuffer(url, options) {
const axios = require("axios");
  try {
    options = options || {};
    const res = await axios({
      method: "get",
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1
      },
      ...options,
      responseType: 'arraybuffer'
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

async function add(groupMetadata, users, proceed, anyaV2, pika) {
  try {
  const isMulti = (users.length === 1) ? false : true;
    for (const user of users) {
      const exist = await anyaV2.onWhatsApp(user.split("@")[0]);
      if (exist.length === 0) {
      const unavailable = `❌ Can't find *@${user.split("@")[0]}*, maybe this number is not available on WhatsApp.`;
        isMulti ? pika.reply(unavailable, { mentions: [user] })
        : pika.edit(unavailable, proceed.key);
        continue;
      };
      const action = await anyaV2.groupParticipantsUpdate(pika.chat, [user], 'add');
      const status = {
        "200": `Added *@${user.split("@")[0]}* by *@${pika.sender.split("@")[0]}*`,
        "408": `❌ Couldn't add *@${user.split("@")[0]}* because they previously left the group, Try again later.`,
        "409": `*🌊 @${user.split("@")[0]}*, is already added in this group.`,
        "401": `*❌ @${user.split("@")[0]}* has banned the bot number, so I can't add them.`,
      };
      if (status[action[0].status]) {
        isMulti ? pika.reply(status[action[0].status], { mentions: [user, pika.sender] })
        : pika.edit(status[action[0].status], proceed.key, { mentions: [user, pika.sender] });
      } else if (action[0].status === "403") {
      const invited = `✨ Couldn't add *@${user.split("@")[0]}, send invitation!*`;
        isMulti ? pika.reply(invited, { mentions: [user] })
        : pika.edit(invited, proceed.key, { mentions: [user] });
        await inviteV2(anyaV2, user, pika, groupMetadata, proceed);
      }
    }
  } catch (err) {
    console.error(err);
    pika.edit("❌ An error occurred while adding the user.", proceed.key);
  }
}

async function remove(anyaV2, pika, users, proceed) {
  const isMulti = (users.length === 1) ? false : true;
  try {
    for (const user of users) {
    const status = {
      "404": `*❌ @${user.split("@")[0]}*, not found in this group chat.`,
      "200": `Removed *@${user.split("@")[0]}* by *@${pika.sender.split("@")[0]}*`,
    };
      const exist = await anyaV2.onWhatsApp(user.split("@")[0]);
      if (exist.length === 0) {
      const notFound = `*❌ @${user.split("@")[0]}*, not found on WhatsApp.`;
      isMulti ? pika.reply(notFound, { mentions: [user] })
      : pika.edit(notFound, proceed.key, { mentions: [user] });
      } else {
        const action = await anyaV2.groupParticipantsUpdate(pika.chat, [user], 'remove');
        const response = status[action[0].status];
        isMulti ? pika.reply(response, { mentions: [user, pika.sender] })
        : pika.edit(response, proceed.key, { mentions: [user, pika.sender] });
      }
    }
  } catch (err) {
    console.error(err);
    pika.edit("❌ An error occurred while removing the user.", proceed.key);
  }
}

async function invite(anyaV2, users, pika, groupMetadata, proceed) {
  const isMulti = (users.length === 1) ? false : true;
    for (let user of users) {
    if (groupMetadata.participants.map((a) => a.id).includes(user)) {
    const already = `*🌊 @${user.split("@")[0]}*, is already added in this group.`;
      isMulti ? pika.reply(already, { mentions: [user] })
      : pika.edit(already, proceed.key, { mentions: [user] });
    } else {
      try {
        const exist = await anyaV2.onWhatsApp(user.split("@")[0]);
        if (exist.length === 0) {
        const unavailable = `❌ Can't find *@${user.split("@")[0]}*, maybe this number is not available on WhatsApp.`;
          isMulti ? pika.reply(unavailable, { mentions: [user] })
          : pika.edit(unavailable, proceed.key);
        } else {
          const getLink = await anyaV2.groupInviteCode(pika.chat);
          let groupp = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
          try {
            groupp = await anyaV2.profilePictureUrl(pika.chat, 'image');
          } catch (e) {
            groupp = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
          }
          await anyaV2.sendMessage(user, {
            text: `\`\`\`🎉🎊 Group Invitation\`\`\`\n   *- By @${pika.sender.split("@")[0]}*`,
            mentions: [pika.sender],
            contextInfo: {
              mentionedJid: [pika.sender],
              externalAdReply: {
                showAdAttribution: false,
                title: groupMetadata.subject,
                containsAutoReply: false,
                mediaType: 2,
                thumbnail: await getBuffer(groupp),
                mediaUrl: `https://chat.whatsapp.com/${getLink}`,
                sourceUrl: `https://chat.whatsapp.com/${getLink}`
              }
            }
          }, { quoted: pika });
          isMulti ? pika.reply(`✅ Sent invitation to *@${user.split("@")[0]}*`, { mentions: [user] })
          : pika.edit(`✅ Sent invitation to *@${user.split("@")[0]}*`, proceed.key, { mentions: [user] });
        }
      } catch (err) {
        console.error(err);
        pika.reply("❌ An error occurred while sending an invitation.", proceed.key);
      }
    }
  }
}

async function inviteV2(anyaV2, user, pika, groupMetadata, proceed) {
  try {
    const getLink = await anyaV2.groupInviteCode(pika.chat);
    let groupp = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
    try {
      groupp = await anyaV2.profilePictureUrl(pika.chat, 'image');
    } catch (e) {
      groupp = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
    }
    await anyaV2.sendMessage(user, {
      text: `Invitation to join my WhatsApp group.`,
      contextInfo: {
        externalAdReply: {
          title: groupMetadata.subject,
          mediaType: 2,
          thumbnail: await getBuffer(groupp),
          mediaUrl: `https://chat.whatsapp.com/${getLink}`,
          sourceUrl: `https://chat.whatsapp.com/${getLink}`
        }
      }
    });
  } catch (err) {
    console.error(err);
    pika.edit(Config.message.error, proceed.key);
    //~ Handle the error if needed
  }
};
