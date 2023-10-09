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
    name: ['del2'],
    alias: ['delete2'],
    category: "admin",
    desc: "Bot could delete the messages that bot sent."
  };
}

exports.getCommand = async (userSudo, userOwner, userAdmin, botAdmin, prefix, anyaV2, pika) => {
require('../../config');
    if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.owner);
    if (!pika.quoted) return pika.reply('Reply a message to delete.');
    const { chat, fromEveryone, id, isBaileys } = pika.quoted;
    if (!isBaileys) {
    if (!botAdmin) return pika.reply(message.botAdmin);
    }
    await pika.react("✅");
  anyaV2.sendMessage(pika.chat, {
         delete: {
          remoteJid: pika.chat,
          fromMe: (isBaileys) ? true : false,
          id: pika.quoted.id,
          participant: pika.quoted.sender
        }
     }
   )
}



