exports.cmdName = () => ({
  name: ['yta2'],
  alias: ['yta2','ytaudio2'],
  category: "download",
  desc: "Download high quality YouTube music/audio using video url."
  });

exports.getCommand = async (args, text, anyaV2, pika) => {
require('../../config');
 const { readFileSync, unlinkSync } = require('fs');
 const { fancy10 } = require('../lib/stylish-font');
 const { isUrl, sleep, fetchBuffer } = require('../lib/myfunc');
 if (!text.includes("https://youtube.com/") && !text.includes("https://youtu.be/")) return pika.reply(`Please enter a valid YouTube video url.`);
 await pika.react("🎵");
 pika.reply(message.wait);
try {
 const YT = require('../lib/ytdlcore');
 const get = await YT.mp3(text);
 await anyaV2.sendMessage(pika.chat, {
     audio: readFileSync(get.path),
     mimetype: 'audio/mp4',
     ptt: false,
       contextInfo:{
         externalAdReply:{
            title: "© " + fancy10(botname + " Music Engine!"),
            body: themeemoji + "\t" + get.meta.title + ".mp3" + " || Duration :* " + get.meta.seconds + " seconds",
            thumbnail: await fetchBuffer(get.meta.image),
            showAdAttribution: true,
            mediaType: 2,
            mediaUrl: 'https://youtu.be/nQRy96da2jw',
            sourceUrl: 'https://youtu.be/nQRy96da2jw'
                  }
                },
              },
           { quoted: pika });
         await sleep(1000);
       unlinkSync(get.path);
      } catch {
      return pika.reply(message.error);
    }
}
