/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Management: (@teamolduser)

📜 GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

📌 Permission & Copyright:
If you're using any of these codes, please ask for permission or mention https://github.com/PikaBotz/Anya_v2-MD in your repository.

⚠️ Warning:
- This bot is not an officially certified WhatsApp bot.
- Report any bugs or glitches to the developer.
- Seek permission from the developer to use any of these codes.
- This bot does not store user's personal data.
- Certain files in this project are private and not publicly available for edit/read (encrypted).
- The repository does not contain any misleading content.
- The developer has not copied code from repositories they don't own. If you find matching code, please contact the developer.

Contact: alammdarif07@gmail.com (for reporting bugs & permission)
          https://wa.me/918811074852 (to contact on WhatsApp)

🚀 Thank you for using Queen Anya MD v2! 🚀
**/

exports.cmdName = () => {
  return {
    name: ['admins'],
    alias: ['admin'],
    category: "group",
    desc: "Tag every admin with a reason in the group."
  };
}

exports.getCommand = async (mime, userSudo, userOwner, userAdmin, botAdmin, text, groupMetadata, anyaV2, pika) => {
  const { unlinkSync } = require('fs');
  await pika.react("👑");
  if (!pika.isGroup) return pika.reply(message.group); 
//  if (!botAdmin) return pika.reply(message.botAdmin);
  if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);  
  if (!text) return pika.reply('You can\'t tag Admins without any reason, please enter a reason.');
  const tagm = [];
  tagm.push(`*⛩️ Message :* ${pika.quoted ? (pika.quoted.text.length > 1 ? pika.quoted.text : 'Empty message') : (text ? text : 'Empty message')}\n\n*🎏 Announcer :* @${pika.sender.split('@')[0]}\n\n╭─⌈ 𝘼𝙙𝙢𝙞𝙣𝙨 ⌋`);
  for (let admins of groupMetadata.participants) {
    if (admins.admin !== null) {
      tagm.push(`👑 @${admins.id.split('@')[0]}`);
    }
  }

  // Text message.
  const sendTagText = async () => {
    const tagSendText = {
      text: tagm.join('\n'),
      mentions: groupMetadata.participants.filter(a => a.admin !== null).map(a => a.id)
    };

    const contextInfo = {
      mentionedJid: groupMetadata.participants.filter(a => a.admin !== null).map(a => a.id),
      "externalAdReply": {
        "showAdAttribution": true,
        "title": `Tagged ${groupMetadata.participants.length} Participants ✅`,
        "mediaType": 1,
        "thumbnail": global.image_2,
        "mediaUrl": global.announcementGcLink,
        "sourceUrl": global.announcementGcLink
      }
    };

    anyaV2.sendMessage(pika.chat, { ...tagSendText, contextInfo }, { quoted: pika });
  };

  // Image n Video message
  const sendTagMedia = async () => {
    const tagSendIamge = {
      caption: tagm.join('\n'),
      headerType: 4,
      mentions: groupMetadata.participants.filter(a => a.admin !== null).map(a => a.id)
    };

    if (/image/.test(mime)) {
      tagSendIamge.image = { url: await anyaV2.downloadAndSaveMediaMessage(pika.quoted ? pika.quoted : pika) };
    } else {
      tagSendIamge.video = { url: await anyaV2.downloadAndSaveMediaMessage(pika.quoted ? pika.quoted : pika) };
    }

    anyaV2.sendMessage(pika.chat, tagSendIamge, { quoted: pika });
    try {
      unlinkSync(mediaToBroad);
    } catch (error) {
      console.error("Error deleting media file.");
    }
  };

  if (/image/.test(mime) || /video/.test(mime)) {
    await sendTagMedia();
  } else {
    await sendTagText();
  }
}


