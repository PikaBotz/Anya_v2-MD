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
    name: ['setbotpp'],
    alias: ['setppbot','botpp'],
    category: "owner",
    desc: "Set bot number's profile picture."
  };
}

exports.getCommand = async (userOwner, userSudo,anyaV2, pika, prefix, command) => {
    require('../../config');
          const Config = require('../../config');
  if (!userOwner && !userSudo) return pika.reply(Config.owner);
    const { unlinkSync } = require('fs');
    const quoted = pika.quoted ? pika.quoted : pika;
    const mime = quoted.msg ? quoted.msg : quoted.mimetype ? quoted.mimetype : quoted.mediaType || '';
    if (/image/g.test(mime) && !/webp/g.test(mime)) {
        try {
            const media = await quoted.download();
            const botnumber = await anyaV2.decodeJid(anyaV2.user.id);
            await anyaV2.updateProfilePicture(botnumber, media)
            .catch((err) => {
//                console.error(err);
                return pika.reply(message.error);
            }); 
            pika.reply(message.success);
//            await unlinkSync(media);
        } catch {
            pika.reply('An error occurred, try again.');
        }
    } else {
        pika.reply(`Send an image with caption *${prefix + command}* or tag an image to set as the bot's profile picture.`);
    }
}
