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
  return ['gclink',
         'grouplink',
         'linkgc',
         'linkgroup'];
}

async function getCommand(isAdmins, isBotAdmins, groupMetadata, AnyaPika){
require('../../config');
  const moment = require('moment-timezone');
  const { tiny } = require('../lib/stylish-font');
  const { getBuffer } = require('../lib/myfunc');
  if (!m.isGroup) return m.reply(mess.group);
  if (!isAdmins) return m.reply(mess.admin);
  if (!isBotAdmins) return m.reply(mess.botAdmin);
  const getLink = await AnyaPika.groupInviteCode(m.chat);
  try {
  var groupp = await AnyaPika.profilePictureUrl(m.chat, 'image');
  } catch (e) {
  var groupp = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
  }
  AnyaPika.sendMessage(m.chat, {
      text: `https://chat.whatsapp.com/${getLink}\n\n` +
           `_*${tiny("Gc Name")} :*_ ${groupMetadata.subject}\n` +
           `_*${tiny("Gc Creator")} :*_ @${groupMetadata.subjectOwner.split("@")[0]}\n` +
           `_*${tiny("Members")} :*_ ${groupMetadata.participants.length} memebers\n` +
           `_*${tiny("Created On")} :*_ ${groupMetadata.creation ? moment(groupMetadata.creation * 1000).tz(global.timezone).format('DD/MM/YYYY HH:mm:ss') : "not provided."}\n\n` +
           `------------------------------>\n` +
           `\`\`\`Participants:\`\`\`\n` +
           groupMetadata.participants.map((participant) => {
           return participant.admin !== null
           ? `👑 @${participant.id.split("@")[0]}`
           : `👤 @${participant.id.split("@")[0]}`;
           }).join('\n') +
           `\n------------------------------>` +
           `\n\n\`\`\`Description:\`\`\`\n` +
           groupMetadata.desc,
      mentions: groupMetadata.participants.map(a => a.id),
      contextInfo:{
      mentionedJid: groupMetadata.participants.map(a => a.id),
        "externalAdReply": {
        "showAdAttribution": true,
        "renderLargerThumbnail": true,
        "title": groupMetadata.subject, 
        "containsAutoReply": true,
        "mediaType": 1, 
        "thumbnail": await getBuffer(groupp),
        "mediaUrl": `https://chat.whatsapp.com/${getLink}`,
        "sourceUrl": `https://chat.whatsapp.com/${getLink}`
        }
     }
   },
  { quoted: m }
 );
}
module.exports = { cmdName, getCommand }
