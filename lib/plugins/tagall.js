const { anya } = require('../lib');

anya({
  name: [
    "tagall"
  ],
  alias: [
    "tall",
    "tag"
  ],
  category: "admin",
  desc: "Tag everyone in the group.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (mime, userSudo, userOwner, userAdmin, botAdmin, text, groupMetadata, anyaV2, pika) => {
  const fs = require('fs');
  if (!pika.isGroup) return pika.reply(message.group); 
  if (!botAdmin) return pika.reply(message.botAdmin);
  if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);  
  const tagm = [];
  tagm.push(`*⛩️ Message :* ${pika.quoted ? (pika.quoted.text.length > 1 ? pika.quoted.text : 'Empty message') : (text ? text : 'Empty message')}\n\n*🎏 Announcer :* @${pika.sender.split('@')[0]}\n\n╭─⌈ 𝘼𝙙𝙢𝙞𝙣𝙨 ⌋`);
  for (let admins of groupMetadata.participants) {
    if (admins.admin !== null) {
      tagm.push(`👑 @${admins.id.split('@')[0]}`);
    }
  }

  tagm.push("\n╭─⌈ 𝙈𝙚𝙢𝙗𝙚𝙧𝙨 ⌋");
  for (let mem of groupMetadata.participants) {
    if (mem.admin == null) {
      tagm.push(`👤 @${mem.id.split('@')[0]}`);
    }
  }

  // Text message.
  const sendTagText = async () => {
    const tagSendText = {
      text: tagm.join('\n'),
      mentions: groupMetadata.participants.map(a => a.id)
    };

    const contextInfo = {
      mentionedJid: groupMetadata.participants.map(a => a.id),
      externalAdReply: {
        showAdAttribution: true,
        title: `Tagged ${groupMetadata.participants.length} Participants ✅`,
        mediaType: 1,
        thumbnail: global.image_2,
        mediaUrl: global.announcementGcLink,
        sourceUrl: global.announcementGcLink
      }
    };

    anyaV2.sendMessage(pika.chat, { ...tagSendText, contextInfo }, { quoted: pika });
  };

  // Image n Video message
  const sendTagMedia = async () => {
    const tagSendIamge = {
      caption: tagm.join('\n'),
      headerType: 4,
      mentions: groupMetadata.participants.map(a => a.id)
    };

    if (/image/.test(mime)) {
      tagSendIamge.image = { url: await anyaV2.downloadAndSaveMediaMessage(pika.quoted ? pika.quoted : pika) };
    } else {
      tagSendIamge.video = { url: await anyaV2.downloadAndSaveMediaMessage(pika.quoted ? pika.quoted : pika) };
    }

    anyaV2.sendMessage(pika.chat, tagSendIamge, { quoted: pika });
    try {
      fs.unlinkSync(mediaToBroad);
    } catch (error) {
      console.error("Error deleting media file.");
    }
  };

  await pika.react("👥");

  if (/image/.test(mime) || /video/.test(mime)) {
    await sendTagMedia();
  } else {
    await sendTagText();
  }
});
