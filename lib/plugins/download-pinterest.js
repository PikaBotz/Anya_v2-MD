module.exports = {
  cmdName: () => ({
    name: ['image'],
    alias: ['img', 'pin', 'pinterest'],
    react: '📸',
    need: 'query',
    category: 'download',
    desc: 'This command will give you high-quality images directly from Pinterest by search terms.'
  }),
  getCommand: async (text, pika, anyaV2) => {
    if (!text) return pika.reply('Enter a search term to search from Pinterest.com 📸');
    const { api } = require('../.dev');
    const limit = 5;
    const { getBuffer } = require('../lib/myfunc');
    const { key } = await anyaV2.sendMessage(pika.chat, { text: `🌄 Searching at least *${limit}* images...` }, {quoted:pika});
    const Config = require('../../config');
    api.apiHub('api', 'pinterest', `q=${encodeURIComponent(text)}`)
      .then(async (response) => {
        const { results } = response;
        let min = 0;
        const max = (limit > results.size) ? results.size : limit;
        pika.edit(`👀 Found! Sent *${max}* images.`, key);
        for (let pins of results.images) {
          min++;
          if (min === (max + 1)) break;
          await anyaV2.sendMessage(pika.chat, { image: await getBuffer(pins), caption: `_© Searched by ${Config.botname}_`, quoted: pika });
        }
      })
      .catch((error) => {
        console.error(error);
        pika.edit('Uff, an error occurred while sending this image, please try again later 😐', key);
      });
  }
};
