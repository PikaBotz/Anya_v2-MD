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

exports.cmdName = () => ({
   name: ['fullpp'],
   alias: ['botppfull', 'fullbotpp'],
   category: "owner",
   desc: "This command sets the bot's profile picture but as full view pictures."
});

/**
 * ⚠️ Strictly under copyright by @PikaBotz && @teamolduser
 **/
exports.getCommand = async (userOwner, userSudo, anyaV2, pika, prefix, command) => {
  const Config = require('../../config');  
  if (!userOwner && !userSudo) return pika.reply(Config.message.owner);
  await pika.react("⚡");
  const { unlinkSync } = require('fs');
  const quoted = pika.quoted || pika;
  const mime = quoted.msg || quoted.mimetype || quoted.mediaType || '';
  if (/image/g.test(mime) && !/webp/g.test(mime)) {
  const proceed = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
    try {
      const media = await quoted.download();
      const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
      const { preview } = await copyKarneWaleKiMKB(media);      
      await anyaV2.query({
        tag: "iq",
        attrs: {
          to: botNumber,
          type: "set",
          xmlns: "w:profile:picture",
        },
        content: [{
          tag: "picture",
          attrs: { type: "image" },
          content: preview,
        }],
      }).catch((err) => {
        console.error(err);
        return pika.edit(Config.message.error, proceed.key);
      });      
      pika.edit(Config.message.success, proceed.key);
    } catch (err) {
      console.error(err);
      pika.edit('❌ An error occurred, try again.', proceed.key);
    }
  } else {
    pika.reply(`Send an image with caption *${prefix + command}* or tag an image to set as the bot's profile picture.`);
  }
};

async function copyKarneWaleKiMKB(buffer) {
    const Jimp = require("jimp");
    const jimp = await Jimp.read(buffer);
    const min = jimp.getWidth();
    const max = jimp.getHeight();
    const cropped = jimp.crop(0, 0, min, max);
    return {
      img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
      preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
  };
};
