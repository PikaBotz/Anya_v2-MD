exports.cmdName = () => ({
  name: ['ytv2','ytshort'],
  alias: ['ytvideo2', 'ytvid2', 'ytshorts', 'ytstatus'],
  category: "download",
  desc: "Download high quality YouTube video/status using video url."
  });

exports.getCommand = async (text, anyaV2, pika) => {
  const Config = require('../../config');
  const { tiny } = require('../lib/stylish-font');
  const { isUrl, sleep } = require('../lib/myfunc');
  if (!text) return pika.reply("Please enter a YouTube video URL");
  if (!text.includes("https://youtube.com/") && !text.includes("https://youtu.be/")) return pika.reply("Enter a valid YouTube video url to download.");
   await pika.react("🎦");
   const proceed = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
  try {
  const YT = require('../lib/ytdlcore');
  const get = await YT.mp4(text);
  function secondsToMinutes(seconds) {
     return (seconds / 60).toFixed(2);
    }
  const caption = `*${Config.themeemoji} ${tiny("Title")}:* ${get.title}\n\n` +
               `*${Config.themeemoji} ${tiny("Uploaded")}:* ${get.date.split("T")[0]}\n` +
               `*${Config.themeemoji} ${tiny("Duration")}:* ${secondsToMinutes(get.duration)} minute\n` +
               `*${Config.themeemoji} ${tiny("Quality")}:* 720p\n\n` +  // 720 is a variable quality for videos 
               `*${Config.themeemoji} ${tiny("Description")}:* ${get.description !== null ? get.description : "no description available"}`;
  await anyaV2.sendMessage(pika.chat,{
                    video: { url: get.videoUrl },
                    caption: caption
                   }, { quoted: pika });
    pika.delete(proceed.key);
   } catch {
    pika.edit(Config.message.error, proceed.key);
   }
};
