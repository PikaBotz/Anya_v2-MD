/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Team: Tᴇᴄʜ Nɪɴᴊᴀ Cʏʙᴇʀ Sϙᴜᴀᴅꜱ (𝚻.𝚴.𝐂.𝐒) 🚀📌 (under @P.B.inc)

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
    name: ['add','add2','remove'],
    alias: [],
    category: "admin",
    desc: "Group promotion actions."
  };
}

exports.getCommand = async (args, botAdmin, userAdmin, userOwner, userSudo, text, groupMetadata, command, anyaV2, pika) => {
require('../../config');
 const { getBuffer } = require('../lib/myfunc');
 if (!botAdmin) return pika.reply(message.botAdmin);
  await pika.react("👥");
  if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);
  if (!text && !pika.quoted) return pika.reply("Provide me a number.");
  const user = (args[0] === 'numBut')
            ? args[1] + '@s.whatsapp.net'
            : pika.quoted
            ? pika.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
 switch (command) {
 case 'add':
  if (groupMetadata.participants.map((a) => a.id).includes(user)) return pika.reply('This user is already been added in this group.');
  const getLink = await anyaV2.groupInviteCode(pika.chat);
  try {
  var groupp = await anyaV2.profilePictureUrl(pika.chat, 'image');
  } catch (e) {
  var groupp = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
  }  
  await anyaV2.sendMessage(user, {
      text: `\`\`\`🎉🎊 Group Invitation\`\`\`\n   *- By @${pika.sender.split("@")[0]}*`,
      mentions: [pika.sender],
      contextInfo:{
      mentionedJid: [pika.sender],
        "externalAdReply": {
        "showAdAttribution": false,
        "title": groupMetadata.subject, 
        "containsAutoReply": false,
        "mediaType": 1, 
        "thumbnail": await getBuffer(groupp),
        "mediaUrl": `https://chat.whatsapp.com/${getLink}`,
        "sourceUrl": `https://chat.whatsapp.com/${getLink}`
        }
     }
   },
  { quoted: pika }
 );
  anyaV2.sendMessage(pika.chat, {
         text: `✅ Sent invitation to *@${user.split("@")[0]}*`,
         mentions: [user] },
         { quoted: pika });
 break;
 case 'add2':
  if (groupMetadata.participants.map((a) => a.id).includes(user)) return pika.reply('This user is already been added in this group.');
  await anyaV2.groupParticipantsUpdate(pika.chat, [user], 'add')           
      .catch((err) => pika.reply(`⚠️ Cannot add this user in this group!`));
   anyaV2.sendMessage(pika.chat, {
         text: `Added *@${user.split("@")[0]}* by *@${pika.sender.split("@")[0]}*`,
         mentions: [user, pika.sender] },
         { quoted: pika });
  break;
  case 'remove':
   if (!groupMetadata.participants.map((a) => a.id).includes(user)) return pika.reply('User not found in this group chat.');
  await anyaV2.groupParticipantsUpdate(pika.chat, [user], 'remove')           
      .catch((err) => pika.reply(`⚠️ Cannot remove this user in this group!`));
   anyaV2.sendMessage(pika.chat, {
         text: `Removed *@${user.split("@")[0]}* by *@${pika.sender.split("@")[0]}*`,
         mentions: [user, pika.sender] },
         { quoted: pika });
  break;
      }
     }
      
      
      
