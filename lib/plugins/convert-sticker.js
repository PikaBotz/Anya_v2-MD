module.exports = {
  cmdName: () => ({
    name: ['sticker'],
    alias: ['s'],
    category: 'convert',
    react: '🔮',
    need: 'image/video',
    desc: 'Convert image/video media into stickers.'
  }),
  getCommand: async (pika, anyaV2) => {
    const dev = require('../.dev');
    const Config = require('../../config');
    const axios = require('axios');
    const quoted = pika.quoted ? pika.quoted : pika;
    const mime = (quoted.msg || quoted).mimetype || '';
    const packname = Config.packname;
    const author = Config.author;
    if (/image/.test(mime) && !/webp/.test(mime)) {
      const image = await quoted.download();
      axios.post(dev.api.apiHubRaw + `api/sticker.js?key=${dev.api.apiHubKey}&packname=${encodeURIComponent(packname)}&author=${encodeURIComponent(author)}`, {
        media: image.toString('base64')
      }, {
        headers: {
          'content-type': 'application/json'
        }
      })
        .then((res) => res.data)
        .then(async (res) => await anyaV2.sendMessage(pika.chat, { sticker: Buffer.from(res.results.sticker, 'base64') }, { quoted: pika }))
        .catch((err) => {
          console.error(err);
          pika.reply('uff, an error occurred.');
        });
    } else if (/video/.test(mime) && !/webp/.test(mime)) {
      if ((quoted.msg || quoted).seconds > 11) return pika.reply("_Video duration should be under 10 seconds._");
      const video = await quoted.download();
      const { createVidSticker } = require('../lib/converter')
      const buffer = await createVidSticker(video, { packname: packname, author: author });
      await anyaV2.sendMessage(pika.chat, { sticker: buffer }, { quoted: pika });
    } else if (/webp/.test(mime)) {
      pika.reply('_Already a sticker_');
   } else {
      pika.reply('_Please tag or send an image/video media._');
    }
  }
};
