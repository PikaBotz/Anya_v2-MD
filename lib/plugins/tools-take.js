const { anya } = require('../lib');

anya({
  name: [
    "stealstick"
  ],
  alias: [
    "ssticker",
    "take"
  ],
  category: "tools",
  react: "📸",
  need: "image/video/sticker",
  desc: "Steal sticker from other people",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (anyaV2, pika, prefix, text, command) => {
      const Config = require('../../config');
      const dev = require('../.dev');
      const axios = require('axios');
      const packname = text ? text.split('|').map(item => item.trim())[0] : Config.packname;
      const author = text ? text.split('|').map(item => item.trim()).slice(1).join('|') || '@pikanull' : Config.author;
      const quoted = pika.quoted ? pika.quoted : '';
      const mime = (quoted && quoted.mimetype) ? quoted.mimetype : '';
      const path = `./.temp/${pika.sender.split('@')[0] + Math.random().toString(36).substr(2, 5)}`;
      const { writeExifInVid , createVidSticker } = require('../lib/converter');
      if (/webp/.test(mime)) {
        const fs = require('fs');
        const media = await quoted.download();
        fs.writeFileSync(path + '.webp', media);
        await writeExifInVid(path + '.webp', { packname: packname, author: (author === '@pikanull') ? null : author })
          .then(async (res) => {
            await anyaV2.sendMessage(pika.chat, { sticker: fs.readFileSync(res) }, { quoted: pika });
            fs.unlinkSync(res);
          }).catch((err) => {
            console.log(err);
            pika.reply(Config.message.error + '\n\n' + err);
          });
        } else if (/video/.test(mime)) {
          const video = await quoted.download();
          const buffer = createVidSticker(video, { packname: packname, author: (author === '@pikanull') ? null : author });
          await anyaV2.sendMessage(pika.chat, { sticker: buffer }, { quoted: pika });
        } else if (/image/.test(mime)) {
          const image = await quoted.download();
          axios.post(dev.api.apiHubRaw + `/api/sticker.js?key=${dev.api.apiHubKey}&packname=${encodeURIComponent(packname)}&author=${encodeURIComponent(author)}`, { media: image.toString('base64') }, {
            headers: {
              'content-type': 'application/json'
            }})
            .then((res) => res.data)
            .then(async (res) => {
              await anyaV2.sendMessage(pika.chat, { sticker: Buffer.from(res.results.sticker, 'base64') }, { quoted: pika })
            }).catch((err) => {
              console.error(err);
              pika.reply('uff, an error occurred.');
            });
        } else {
          pika.reply(`Reply to a sticker or media!\n\n*Example :* ${prefix + command} author | packname`);
        }
      });
