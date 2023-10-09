exports.cmdName = () => {
  return {
    name: ['song'],
    alias: ['yta','audio','ytmp3','ytaudio'],
    category: "download",
    desc: "Search for high quality audios of YouTube by search term."
  };
}

exports.getCommand = async (pickRandom, text, prefix, command, anyaV2, pika) => {
require('../../config');
  if (!text) return pika.reply(`Example : ${prefix + command} <your text query>`);
  if (text.includes("https://youtube.com/") || text.includes("https://youtu.be/")) return pika.reply(`For links query please use *${prefix}yta2 <url>* command.`);
   await pika.react("🎵");
   pika.reply(message.wait);
 try {
  const YT = require('../lib/ytdlcore');
  const { unlinkSync, readFileSync } = require("fs");
  const { tiny, fancy10 } = require('../lib/stylish-font');
  const { sleep, getBuffer, fetchBuffer } = require('../lib/myfunc');
  const yts = require("@queenanya/ytsearch");
  const get = await yts(text);
  function getRandomNumber() {
  return Math.floor(Math.random() * 11);
 }
  const search = get.all[getRandomNumber()];
  const getVideo = await YT.mp3(search.url);
    await anyaV2.sendMessage(pika.chat, {
     audio: readFileSync(getVideo.path),
     mimetype: 'audio/mp4',
     ptt: false,
       contextInfo:{
         externalAdReply:{
            title: "© " + fancy10(botname + " Music Engine!"),
            body: themeemoji + "\t" + getVideo.meta.title + ".mp3" + " || Duration :* " + getVideo.meta.seconds + " seconds",
            thumbnail: await fetchBuffer(getVideo.meta.image),
            showAdAttribution: true,
            mediaType: 2,
            mediaUrl: search.url,
            sourceUrl: search.url
                  }
                },
              },
           { quoted: pika });
         await sleep(1000);
       unlinkSync(getVideo.path);
    } catch {
     return pika.reply(message.error);
   }
 }
