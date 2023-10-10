exports.cmdName = () => {
  return {
    name: ['ytv2','ytstatus'],
    alias: ['ytvideo2','ytvid2'],
    category: "download",
    desc: "Download high quality YouTube video/status using video url."
  };
}

exports.getCommand = async (text, anyaV2, pika) => {
require('../../config');
  const { tiny } = require('../lib/stylish-font');
  const { isUrl, sleep } = require('../lib/myfunc');
  if (!text.includes("https://youtube.com/") || !text.includes("https://youtu.be/")) return pika.reply("Enter a valid YouTube video url to download.");
    pika.react("🎦");
    pika.reply(message.wait);
  try {
  const YT = require('../lib/ytdlcore');
  const get = await YT.mp4(text);
  function secondsToMinutes(seconds) {
     return (seconds / 60).toFixed(2);
    }
  await anyaV2.sendMessage(pika.chat,{
                    video: { url: get.videoUrl },
                    caption: "*" + themeemoji + ` ${tiny("Title")}:* ` + get.title + "\n"
                           + "*" + themeemoji + ` ${tiny("Uploaded")}:* ` + get.date + "\n"
                           + "*" + themeemoji + ` ${tiny("Duration")}:* ` + secondsToMinutes(get.duration) + " minute\n"
                           + "*" + themeemoji + ` ${tiny("Quality")}:* 720p\n\n` // 720 is a variable quality for videos 
                           + "*" + themeemoji + ` ${tiny("Description")}:* ` + (get.description !== null) ? get.description : "no description available",
                    headerType: 4
                   },
                  { quoted: pika }
                ); 
   } catch {
    pika.reply(message.error);
   }
  }
