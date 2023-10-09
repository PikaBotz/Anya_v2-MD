exports.cmdName = () => {
  return {
    name: ['yta2'],
    alias: ['yta2','ytaudio2'],
    category: "download",
    desc: "Download high quality YouTube music/audio using video url."
  };
}

exports.getCommand = async (args, text, anyaV2, pika) => {
require('../../config');
 const fs = require('fs');
 const { fancy10 } = require('../lib/stylish-font');
 const { isUrl, sleep, fetchBuffer } = require('../lib/myfunc');
 if (args.length < 1 || !isUrl(text)) return pika.reply(`Please enter a valid YouTube video url.`);
 pika.reply(message.wait);
try {
 const YT = require('../lib/ytdlcore');
 const get = await YT.mp3(text);
 await pika.react("🎐");
 await anyaV2.sendMessage(pika.chat, {
     audio: fs.readFileSync(get.path),
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
       fs.unlinkSync(get.path);
      } catch {
      return pika.reply(message.error);
    }
  }
    
                    


