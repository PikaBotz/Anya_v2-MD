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
    name: ['addmod', 'delmod'],
    category: "owner",
    alias: [],
    listMode: true,
    desc: "To make anyone as owner of this bot."
  };
}

exports.getCommand = async (botNumber, userOwner, userSudo, text, command, args, anyaV2, pika) => {
  require('../../config');
  if (!userOwner && !userSudo) return pika.reply(message.owner);
  if (!text && !pika.quoted) return pika.reply(`Tag a user to ${command.split("mod")[0]}`);
  await pika.react("🗿");
  const { modUser } = require('../lib/mongoDB');
  const userID = (args[0] !== 'numBut')
                  ? pika.quoted ? pika.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                  : args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  await modUser(userID, command, botNumber);
    }

