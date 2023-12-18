const { anya } = require('../lib');

anya({
  name: [
    "url"
  ],
  alias: [
    "tourl",
    "send",
    "sent",
    "give",
    "giv",
    "snd",
    "convert"
  ],
  category: "utilites",
  desc: "Image And Video Link 🔗 Generator",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userOwner, userSudo, anyaV2, pika, prefix, command) => {
 // if (!userOwner && !userSudo) return pika.reply(message.owner);
let { TelegraPh } = require("../lib/uploader2");
// const { upload } = require('../lib/mega');
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
      await pika.react("✅");
    } else if (/video/.test(mime)) {
 /*   const stream = fs.createReadStream(media);
const videourl = await upload(stream, filename);
pika.reply(videourl);
await pika.react("✅"); */
await pika.reply('Working On It ⚒️🛠️');
await pika.react("🛠️");
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
});
