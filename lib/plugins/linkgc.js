const { anya } = require('../lib');

anya({
  name: [
    "gclink"
  ],
  alias: [
    "grouplink",
    "linkgc",
    "linkgroup"
  ],
  category: "admin",
  desc: "Get active invitation link of the group chat.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async function getCommand(userAdmin, botAdmin, groupMetadata, anyaV2, pika){
require('../../config');
  const moment = require('moment-timezone');
  const { tiny } = require('../lib/stylish-font');
  const { getBuffer } = require('../lib/myfunc');
  if (!pika.isGroup) return pika.reply(message.group);
  if (!userAdmin) return pika.reply(message.admin);
  if (!botAdmin) return pika.reply(message.botAdmin);
  const getLink = await anyaV2.groupInviteCode(pika.chat);
  try {
  var groupp = await anyaV2.profilePictureUrl(pika.chat, 'image');
  } catch (e) {
  var groupp = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
  }
  await pika.react("🔗");
  anyaV2.sendMessage(pika.chat, {
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
        externalAdReply: {
        showAdAttribution: true,
        renderLargerThumbnail: true,
        title: groupMetadata.subject, 
        containsAutoReply: true,
        mediaType: 1, 
        thumbnail: await getBuffer(groupp),
        mediaUrl: `https://chat.whatsapp.com/${getLink}`,
        sourceUrl: `https://chat.whatsapp.com/${getLink}`
        }
     }
   },
  { quoted: pika }
 );
});
