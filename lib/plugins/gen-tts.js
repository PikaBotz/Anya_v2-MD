const { anya } = require('../lib');

anya({
  name: [
    "tts"
  ],
  react: "🗣️",
  need: "query",
  alias: [
    "texttospeech",
    "say",
    "speak"
  ],
  category: "general",
  desc: "It'll convert text to google™ assistant voice speach.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, anyaV2, pika) => {
  const Config = require("../../config");
  const { fancy10 } = require('../lib/stylish-font');
  const { getBuffer } = require('../lib/myfunc');
  if (!text) return pika.reply("Please give me a text so that I can speak it!");
  try {
  await anyaV2.sendMessage(pika.chat, {
     audio: await getBuffer(`https://translate.google.com/translate_tts?ie=UTF-8&q=${text}&tl=en&total=1&idx=0&textlen=2&client=tw-ob&prev=input&ttsspeed=1`),
     mimetype: 'audio/mp4',
     ptt: false,
       contextInfo:{
         externalAdReply:{
            title: "® " + fancy10("G-Assistant Voice Engine!"),
            body: Config.themeemoji + " Text: " + text + ".mp3",
            thumbnail: Config.image_3,
            showAdAttribution: true,
            mediaType: 2,
            mediaUrl: `https://instagram.com/${Config.instagramId}`,
            sourceUrl: `https://instagram.com/${Config.instagramId}`
                  }
                },
              },
      { quoted: pika });      
   } catch (error) {
       console.log(error);
       pika.reply("🤐 An Error occurred while speaking... please contact owner.");
    }
  });
