/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Team: Tᴇᴄʜ Nɪɴᴊᴀ Cʏʙᴇʀ Sϙᴜᴀᴅꜱ (𝚻.𝚴.𝐂.𝐒) 🚀📌 (under @P.B.inc)

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
    name: ['song'],
    alias: ['yta','audio','ytmp3','ytaudio'],
    category: "download",
    desc: "Search for high quality audios of YouTube by search term."
  };
}

exports.getCommand = async (pickRandom, text, prefix, command, anyaV2, pika) => {
require('../../config');
  if (!text) return pika.reply(`Example : ${prefix + command} < your query >`);
  pika.reply(message.wait);
 try {
  const YT = require('../lib/ytdlcore');
  const { tiny, fancy10 } = require('../lib/stylish-font');
  const { sleep, getBuffer, fetchBuffer } = require('../lib/myfunc');
  const yts = require("@queenanya/ytsearch");
  const get = await yts(text);
  function getRandomNumber() {
  return Math.floor(Math.random() * 11); // Generates a random integer between 0 and 10 (inclusive)
 }
  const search = get.all[getRandomNumber()];
  const getVideo = await YT.mp3(search.url);
   await pika.react("♨️");
    await anyaV2.sendMessage(pika.chat, {
     audio: fs.readFileSync(getVideo.path),
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
       fs.unlinkSync(getVideo.path);
    } catch {
     return pika.reply(message.error);
   }
 }
 
 
 
 
 
 