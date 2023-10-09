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
    name: ['banchat', 'unbanchat'],
    category: "owner",
    alias: ['bangroup','bangc','unbangroup','bangc','funcbanchat'],
    desc: "To ban or unban whole group from using this bot."
  };
}

exports.getCommand = async (userOwner, userSudo, text, command, args, prefix, isCmd, anyaV2, pika) => {
  require('../../config');
  if (command === 'funcbanchat') return await funcBanChat(isCmd, prefix);
  if (!pika.isGroup && (!(text ? text.includes('.us') : null))) return pika.reply(message.group);
  if (!userOwner && !userSudo) return pika.reply(message.owner);
  await pika.react("🚫");
  const { banChat } = require('../lib/mongoDB');
  const chatID = (text ? (text.includes('.us') ? args[0].split(".us")[0] + '@g.us' : pika.chat) : pika.chat);
  const cmd = (['banchat','bangc','bangroup'].includes(command))
  ? 'banchat'
  : 'unbanchat';
  await banChat(chatID, cmd);
    }


async function funcBanChat(isCmd, prefix) {
  require('../../config');
  const { getWORKTYPE, getPREFIX } = require('../lib/mongoDB');
  if (!isCmd) return;
  if ((await getWORKTYPE()).self) return;
  if ((await getPREFIX()).all) return pika.reply(`\`\`\`⚠️ Warning!!\`\`\`\n\nThe owner banned this group, so please change the prefix system except *${prefix}prefix all*!`);
  pika.reply(message.banChat);
};



