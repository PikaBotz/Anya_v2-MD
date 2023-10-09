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
    name: ['tts'],
    alias: ['texttospeech','say','speak'],
    category: "general",
    desc: `It'll convert text to google™ assistant voice speach.`
  }; 
}

exports.getCommand = async (command, text, anyaV2, pika) => {
  const assistantVoice = require("google-tts-api");
  const { fancy10 } = require('../lib/stylish-font');
  const { fetchBuffer } = require('../lib/myfunc');
  if (!text) return pika.reply("Please give me a text so that I can speak it!");
  const scriptText = text ? text
        : pika.quoted && pika.quoted.text
        ? pika.quoted.text
        : pika.text;
    const texttospeechurl = assistantVoice.getAudioUrl(scriptText, {
        lang: "en", // Choose your language here
        slow: false, // True for soft voice ••• False for deep voice 
        host: "https://translate.google.com",
      });
 await anyaV2.sendMessage(pika.chat, {
     audio: { url: texttospeechurl },
     mimetype: 'audio/mp4',
     ptt: false,
       contextInfo:{
         externalAdReply:{
            title: "® " + fancy10("G-Assistant Voice Engine!"),
            body: themeemoji + "\tText: " + text + ".mp3",
            thumbnail: await fetchBuffer("https://i.ibb.co/BK1YDWg/82cbd9a46be8fa3b.jpg"),
            showAdAttribution: true,
            mediaType: 2,
            mediaUrl: `https://instagram.com/${global.instagramId}`,
            sourceUrl: `https://instagram.com/${global.instagramId}`
                  }
                },
              },
      { quoted: pika });      
    }
 

