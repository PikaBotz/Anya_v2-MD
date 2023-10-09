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
    name: ['take'],
    alias: ['st','steal','stealsticker'],
    category: "convert",
    desc: "Steal convert image or video media into stickers."
  };
}

exports.getCommand = async (mime, text, anyaV2, pika) => {
require('../../config');
await pika.react("🔮");
  const author_New = text
                   ? (text.includes("|") ? text.split("|")[1] : '')
                   : global.author;
  const packname_New = text
                   ? (text.includes("|") ? text.split("|")[0] : text)
                   : global.packname;                   
   const { unlinkSync } = require('fs');
   if (/image/.test(mime)) {
   const image = await anyaV2.downloadAndSaveMediaMessage(pika.quoted ? pika.quoted : pika);
   const stickerImg = await anyaV2.sendImageAsSticker(pika.chat, image, pika, {
         packname: packname_New,
         author: author_New
        })
      .catch((err) => {
              return pika.reply('Package ffmpeg not found.');
            });
    fs.unlinkSync(image);
   } else if (/video/.test(mime)) {
    if ((quoted.msg || quoted).seconds > 11) return reply("Video duration should be only 10 seconds.");
    const video = await anyaV2.downloadAndSaveMediaMessage(pika.quoted ? pika.quoted : pika);
    const stickerVid = await anyaV2.sendVideoAsSticker(pika.chat, video, pika, {
              packname: packname_New,
              author: author_New,
            }).catch((err) => {
              return pika.reply('Package ffmpeg not found.');
            });
        fs.unlinkSync(video);
       } else if (/webp/.test(mime)) {
   const image = await anyaV2.downloadAndSaveMediaMessage(pika.quoted ? pika.quoted : pika);
   const stickerImg = await anyaV2.sendImageAsSticker(pika.chat, image, pika, {
         packname: packname_New,
         author: author_New
        })
      .catch((err) => {
              return pika.reply('Package ffmpeg not found.');
            });
    fs.unlinkSync(image);
     } else {
       return pika.reply('Please tag or send a image/video/sticker media with this command to steal.');
      }
     }
      
      
      
