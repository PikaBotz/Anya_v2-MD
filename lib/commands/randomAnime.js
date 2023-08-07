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

function cmdName() {
  return ['randomanime'];
}

async function getCommand(AnyaPika, react){
require('../../config');
  const doReact = false;
  const { Anime } = require('@shineiichijo/marika');
  const { fancy13 } = require('../lib/stylish-font');
  const get = await new Anime().getRandomAnime();
  const result = get.data;
  doReact ? react("🧧") : null;
  AnyaPika.sendMessage(m.chat, {
    image: { url: result.images.jpg.large_image_url },
    caption: `*🌈 ID : ${result.mal_id}*\n\n` +
             `*🎀 Title EN :* ${result.title_english}\n` +
             `*🦋 Title JPN :* ${result.title_japanese}\n\n` +
             `❲${themeemoji}❳ *Type :* ${result.type}\n` +
             `❲${themeemoji}❳ *Episodes :* ${result.episodes}\n` +
             `❲${themeemoji}❳ *Season :* ${result.season}\n` +
             `❲${themeemoji}❳ *Status :* ${result.status}\n` +
             `❲${themeemoji}❳ *Duration :* ${result.duration}\n` +
             `❲${themeemoji}❳ *Rating :* ${result.rating}\n` +
             `❲${themeemoji}❳ *Score :* ${result.score}\n` +
             `❲${themeemoji}❳ *Rank :* ${result.rank}\n` +
             `❲${themeemoji}❳ *Popularity :* ${result.popularity}\n` +
             `❲${themeemoji}❳ *Url : ${result.url}*\n` +
             `❲${themeemoji}❳ *Background :* ${result.background}\n\n` +
             `❲${themeemoji}❳ *Desc :* ${fancy13(result.synopsis)}`,
    headerType: 4
  }, { quoted: m });
}
module.exports = { cmdName, getCommand }
