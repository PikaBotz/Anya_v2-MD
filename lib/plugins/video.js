exports.cmdName = () => {
  return {
    name: ['video'],
    alias: ['ytv','ytmp4','ytvideo'],
    category: "download",
    desc: "Search for high quality videos of YouTube by search term."
  };
}

exports.getCommand = async (pickRandom, text, prefix, command, anyaV2, pika) => {
require('../../config');
  if (!text) return pika.reply(`Example : ${prefix + command} < your query >`);
  pika.reply(message.wait);
 try {
  const YT = require('../lib/ytdlcore');
  const { tiny } = require('../lib/stylish-font');
  const { getBuffer, formatNumber } = require('../lib/myfunc');
  const yts = require("@queenanya/ytsearch");
  const get = await yts(text);
  function getRandomNumber() {
  return Math.floor(Math.random() * 11); // Generates a random integer between 0 and 10 (inclusive)
 }
  const search = get.all[getRandomNumber()];
  const getVideo = await YT.mp4(search.url);
    await anyaV2.sendMessage(pika.chat,{
            video: { url: getVideo.videoUrl },
            caption: 
`*🔖 ${tiny("Title")}:* ${search.title}

*🎐 ${tiny("Duration")}:* ${search.timestamp} minute
*🎏 ${tiny("Views")}:* ${formatNumber(search.views)}
*✨ ${tiny("Uploaded")}:* ${search.ago}
*🔗 ${tiny("Link")}:* ${search.url}

*📍 ${tiny("Desc")}:* ${search.description}`,
         headerType: 4
          },
       { quoted: pika });
    } catch {
     return pika.reply(message.error);
   }
 }



