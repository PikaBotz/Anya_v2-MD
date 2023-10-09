/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Management: (@teamolduser)

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
    name: ['lyrics'],
    alias: ['lyric'],
    category: "search",
    desc: "Get official lyrics of a song just by texts."
  };
}

exports.getCommand = async (text, anyaV2, pika) => {
require('../../config');
// try {
  const axios = require('axios');
  if (!text) return pika.reply('Needed a song name!');
  pika.reply(message.wait);
  const getLyc = await axios.get("https://lyrist.vercel.app/api/" + text);
  const lyrics = getLyc.data;
  if (!lyrics.title) return pika.reply(message.error);
  await pika.react("🎶");
  anyaV2.sendMessage(pika.chat, {
           image: { url: lyrics.image },
           caption: `🎏 *Title :* ${lyrics.title}\n` +
                    `👤 *Artist :* ${lyrics.artist}\n` +
                    `📌 *Lyrics :*\n\n${lyrics.lyrics}`,
           headerType: 4 },
         { quoted: pika });
//     } catch { return pika.reply('Connection Error | Not found!');
    }