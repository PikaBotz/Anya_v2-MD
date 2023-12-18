const { anya } = require('../lib');

anya({
  name: [
    "ringtone"
  ],
  alias: [
    "ring",
    "ringdl"
  ],
  category: "download",
  desc: "Download high quality trending ringtones.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, command, args, anyaV2, pika) => {
require('../../config');
 if (!text) return pika.reply('Enter a ringtone name to search.');
 await pika.react("🔔");
  const { getBuffer } = require('../lib/myfunc');
  const { fancy10 } = require('../lib/stylish-font');
  if (command === 'ringdl') {
  pika.reply(message.wait);
  return await anyaV2.sendMessage(pika.chat, {
     audio: { url: args[0] },
     mimetype: 'audio/mp4',
     ptt: false,
       contextInfo:{
         externalAdReply:{
            title: "© " + fancy10(botname + " Ringtone Engine!"),
            body: themeemoji + "\t" + global.botname + " Ringtone.mp3",
            thumbnail: await getBuffer("https://i.ibb.co/GxvFynV/pngwing-com.png"),
            showAdAttribution: true,
            mediaType: 2,
            mediaUrl: args[0],
            sourceUrl: args[0]
                  }
                },
              },
           { quoted: pika }); };
   const process = await anyaV2.sendMessage(pika.chat, {
      text: message.wait
    }, {quoted:pika});
   const { ringtone } = require('../lib/scraper');
   const result = await ringtone(text);
   let count = 1;
   let caption = `Total *${result.length}* results found.\n\n`;
     caption += `\`\`\`Reply a number to download:\`\`\`\n\n`;
   for (let audio of result) {
    caption += `•----------------------------------------•••\n\n*${count++}. 🍂 Title:* ${audio.title}\n`;
    caption += `*🔗 Link:* ${audio.audio}\n\n`;
   }
    caption += `_ID: QA27_\n${footer}`;
   await anyaV2.sendMessage(pika.chat, {
      text: caption,
      edit: process.key, });
  });
