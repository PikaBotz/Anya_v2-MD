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

function cmdName() {
  return {
    name: ['tagall'],
    alias: [],
    category: "admin",
    desc: "Tag everyone in the group."
  };
}

async function getCommand(react, mime, isSudo, isCreator, isAdmins, isBotAdmins, text, groupMetadata, AnyaPika) {
require('../../config');
  const fs = require('fs');
  if (!m.isGroup) return m.reply(mess.group);
  if (!isBotAdmins) return m.reply(mess.botAdmin);
  if (!isAdmins && !isCreator && !isSudo) return m.reply(mess.admin);
  const initial = m.quoted ? m.quoted.text : text;
  const tagm = [];
    tagm.push(`*⛩️ Message :* ${initial ? initial : 'Empty message️'}\n\n*🎏 Announcer :* @${m.sender.split('@')[0]}\n\n╭─⌈ 𝘼𝙙𝙢𝙞𝙣𝙨 ⌋`);
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
  AnyaPika.sendMessage(m.chat, {
      ...tagSendText,
      contextInfo:{
      mentionedJid: groupMetadata.participants.map(a => a.id),
        "externalAdReply": {
        "showAdAttribution": true,
        "title": `Tagged ${groupMetadata.participants.length} Participants ✅`, 
        "mediaType": 1, 
        "thumbnail": global.nullImage,
        "mediaUrl": global.announcementGcLink, // ⚠️ Don't change this url!
        "sourceUrl": global.announcementGcLink// ⚠️ Don't change this url or the dev will take strict actions.
           }
        }
     },
   { quoted: m }
  );
}
  // Image n Video message 
  const sendTagMedia = async () => {
  const tagMedia =  await AnyaPika.downloadAndSaveMediaMessage(m.quoted ? m.quoted : m);
  const mime = m.quoted ? m.quoted.mtype : null;
  if (/image/.test(mime)) {
  var tagSendIamge = {
    image: { url: tagMedia },
    caption: tagm.join('\n'),
    headerType: 4,
    mentions: groupMetadata.participants.map(a => a.id)
   };
  } else {
  var tagSendIamge = {
    video: { url: tagMedia },
    caption: tagm.join('\n'),
    headerType: 4,
    mentions: groupMetadata.participants.map(a => a.id)
    };
  }
  AnyaPika.sendMessage(m.chat, {
            ...tagSendIamge
            },
          { quoted: m });
  fs.unlinkSync(tagMedia);
   }
  await react("👥");
  (/image/.test(mime) || /video/.test(mime))
  ? await sendTagMedia()
  : await sendTagText();
 }
module.exports = { cmdName, getCommand }
