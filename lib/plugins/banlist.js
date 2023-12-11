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
    name: ['banlist'],
    alias: ['bannedlist'],
    category: "owner",
    desc: "See the list of banned users."
  };
}

exports.getCommand = async (userOwner, userSudo, anyaV2, pika) => {
require('../../config');
  if (!userOwner && !userSudo) return pika.reply(message.owner);
  const { checkBanUser } = require('../lib/mongoDB');
  const banned = await checkBanUser();
await pika.react("〽️");
 let users = '```⌈ Banned Users List ⌋```\n\n';
 let count = 1;
 if (banned.length <= 0) return pika.reply('No one is banned yet.');
  for (let user of banned) {
  users += `*${count++}*⪧ @${user.split("@")[0]}\n`;
  }
  users += `\n*Reply a number to Unban that user.*\n\n_ID: QA18_`;

  anyaV2.sendMessage(pika.chat, {
            text: users,
            mentions: banned.map(v => v)
          }, { quoted: pika });
}




