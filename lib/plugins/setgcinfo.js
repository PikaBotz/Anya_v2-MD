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
    name: ['setdesc','setgcpp','setgcname'],
    alias: ['setdescription','setgrouppp','setsubject'],
    category: "admin",
    desc: "Change group chat's informations."
  };
}

exports.getCommand = async (command, botAdmin, userSudo, userOwner, userAdmin, mime, prefix, text, anyaV2, pika) => {
  require('../../config');
  const fs = require('fs');
  if (!pika.isGroup) return pika.reply(message.group);
  if (!botAdmin) return pika.reply(message.botAdmin);
  if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);
    switch (command) {
     case 'setdesc': case 'setdescription':
     if (!text) return pika.reply("Please enter a description to set as this group chat's description");
     await anyaV2.groupUpdateDescription(pika.chat, text)
        .catch((err) => {
          pika.reply(message.error);
         });
     pika.reply(message.success);
     break;
     case 'setgrouppp': case 'setgcpp':
     if (!/image/.test(mime) || /webp/.test(mime)) return pika.reply(`Please reply with an image and include a caption *${prefix + command}*`);
     const profilePic= await anyaV2.downloadAndSaveMediaMessage(pika.quoted);
     await anyaV2.updateProfilePicture(pika.chat, { url: profilePic }).then((err) => { fs.unlinkSync(profilePic)
    });
//    fs.unlinkSync(profilePic);
    pika.reply(message.success);
    break;
    case 'setgcname': case 'setsubject':
     if (!text) return pika.reply("Please enter a text to set as this group chat's name");
     await anyaV2.groupUpdateSubject(pika.chat, text);
     pika.reply(message.success);
    break;
    }
}

   