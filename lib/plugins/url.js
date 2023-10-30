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
    name: ['url'],
    alias: ['tourl', 'send', 'sent', 'give', 'giv', 'snd', 'convert'],
    category: "utilites",
    desc: "Image And Video Link 🔗 Generator"
  };
}

exports.getCommand = async (userOwner, userSudo, anyaV2, pika, prefix, command) => {
 // if (!userOwner && !userSudo) return pika.reply(message.owner);
let { TelegraPh } = require("../lib/uploader2");
const { upload } = require('../lib/mega');
const fs = require("fs");
const util = require("util");
const { unlinkSync } = require('fs');
require('../../config');
const { sleep } = require('../lib/myfunc.js');
// const { sleepy } = require('../lib/myfunc.js');
const filename = 'Video Uploaded By ' + pika.sender + ' On ' + '.mp4'
await pika.react("⚡");
await sleep(1000);

    const quoted = pika.quoted ? pika.quoted : pika;
    const mime = quoted.msg ? quoted.msg : quoted.mimetype ? quoted.mimetype : quoted.mediaType || '';
        try {
            const media2 = await quoted.download();
            const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
            let media = await anyaV2.downloadAndSaveMediaMessage(quoted);
            
    if (/image/.test(mime)) {
      let anu = await TelegraPh(media);
      pika.reply(`*Generated Image URL:* \n\n${util.format(anu)}\n`);
    } else if (/video/.test(mime)) {
    const stream = fs.createReadStream(media);
const videourl = await upload(stream, filename);
pika.reply(videourl);
   } else {
      await sleep(2000);
    await pika.react("😑");
        pika.reply(`Send an image or video with caption *${prefix + command}* or tag an image or video to generate a link 🔗 `);
    }
    
    await unlinkSync(media);
            
} catch (err) {
            console.error(err);
            await sleep(2000);
            await pika.react("☹️");
            pika.reply(err);
    } 
}