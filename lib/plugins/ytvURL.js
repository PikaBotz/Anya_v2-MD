exports.cmdName = () => {
  return {
    name: ['ytv2','ytstatus'],
    alias: ['ytvideo2','ytvid2'],
    category: "download",
    desc: "Download high quality YouTube video/status using video url."
  };
}

exports.getCommand = async (args, text, anyaV2, pika) => {
require('../../config');
  const { tiny } = require('../lib/stylish-font');
  const { isUrl, sleep } = require('../lib/myfunc');
  if (args.length < 1 || !isUrl(text)) return pika.reply("Enter a valid YouTube url.");
    pika.reply(message.wait)
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
                           + "*" + themeemoji + ` ${tiny("Quality")}:* 720p\n\n`
                           + "*" + themeemoji + ` ${tiny("Description")}:* ` + get.description,
                    headerType: 4
                   },
                  { quoted: pika }
                ); 
   } catch {
    pika.reply(message.error);
   }
  }
    
                    


