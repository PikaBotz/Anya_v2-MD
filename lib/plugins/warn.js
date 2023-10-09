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
require('../../config');
  return {
    name: ['warn','delwarn','warnoff'],
    alias: ['addwarn'],
    category: "owner",
    desc: `Bot will warn ${global.warns} times to a user then it'll take a action (exmaple: ban, block, remove)`
  };
}

exports.getCommand = async (userSudo, userOwner, botAdmin, command, args, text, botNumber, anyaV2, pika) => {
  require('../../config');
  if (!userOwner && !userSudo) return pika.reply(message.owner);
  if (!text && !pika.quoted) return pika.reply(`Tag a user to ${command}`);
  await pika.react("⚠️");
  const { warnUser } = require('../lib/mongoDB');
  const isNumBut = args[0] === 'numBut';
  const userID = isNumBut ? args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : pika.quoted ? pika.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
//  if (!userID.includes(Number())) return pika.reply('abc')
  const reason = (text)
                  ? isNumBut
                  ? text.replace(`${args[0]} `, '').replace(`${args[1]} `, '')
                  : text//.replace(`${args[0]} `, '')
                  : 'Not Provided';
  const actionType = (
  ['warn', 'addwarn'].includes(command) ? 'add' :
  ['delwarn'].includes(command) ? 'delete' :
  ['warnoff'].includes(command) ? 'remove' :
  null
);
await warnUser(userID, actionType, reason, anyaV2, botAdmin, botNumber);
};

 
 
 
 
