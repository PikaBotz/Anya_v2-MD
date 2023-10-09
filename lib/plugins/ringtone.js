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
    name: ['ringtone'],
    alias: ['ring','ringdl'],
    category: "download",
    desc: `Download high quality trending ringtones.`
  };
}

exports.getCommand = async (text, command, args, anyaV2, pika) => {
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
  }



