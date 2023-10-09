exports.cmdName = () => {
  return {
    name: ['attp'],
    alias: ['attps'],
    category: "tools",
    desc: `Make text to rainbow stickers.`
  }; 
}

exports.getCommand = async (args, text, anyaV2, pika) => {
require('../../config');
  if (!text) return pika.reply("Enter a text to make a sticker");
  await pika.react("🌈");
  const { getBuffer } = require("../lib/myfunc");
  await getBuffer(`https://vihangayt.me/maker/text2gif?q=${text}`)
    .then((response, error) => {
  if (error) return pika.reply(message.error);
  anyaV2.sendVideoAsSticker(pika.chat, response, pika, {
              packname: global.packname,
              author: global.author,
             })
           .catch((err) => {
           console.log(err);
            return pika.reply('Package ffmpeg not found.');
           });
     });
}
