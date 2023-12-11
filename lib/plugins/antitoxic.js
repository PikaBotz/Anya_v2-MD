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
    name: ['antitoxic'],
    category: "admin",
    alias: ['antibad'],
    desc: "Stop participants including admins to say bad words in the group."
  };
}

exports.getCommand = async (userAdmin, args, botNumber, userOwner, botAdmin, groupMetadata, userSudo, command, prefix, anyaV2, pika) => {
  require('../../config');
  if (!pika.isGroup) return pika.reply(message.group);
  if (!userOwner && !userSudo && !userAdmin) return pika.reply(message.owner);
  if (!botAdmin) return pika.reply(message.botAdmin);
  if (!(args[0] === 'on') && !(args[0] === 'off')) return pika.reply(`Type *${prefix + command} on/off*`);
  await pika.react("🤬");
  const { saveCase } = require('../lib/mongoDB');
  const done = await saveCase(pika.chat, args[0], 'antitoxic');
  if (done) {
   await anyaV2.sendMessage(pika.chat, {
      text: `\`\`\`⚠️ Warning!!\`\`\`\n\nAntiBad has been turned on. Please ensure that users do not use bad/toxic words, otherwise they will be kicked out directly.`,
      mentions: groupMetadata.participants.map(a => a.id),
      }, {quoted: pika});
     }
    }