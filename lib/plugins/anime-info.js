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
    name: ['animeinfo'],
    alias: ['animeinformation','infoanime'],
    category: "myanimelist",
    desc: "To get anime information from myanimelist.net using anime ID."
  };
}

exports.getCommand = async (text, prefix, args, anyaV2, pika) => {
require('../../config');
  const { Anime } = require("@shineiichijo/marika");
  const { fancy13 } = require('../lib/stylish-font');
  if (!text) return pika.reply("Please enter an anime ID. Type `" + prefix + "searchAnime` to get the anime ID.");
  try {
    const result = await new Anime().getAnimeFullById(args[0]);
    pika.reply(message.wait);
    const message = {
      image: { url: result.images.jpg.large_image_url },
      caption: `\`\`\`Reply a number:\`\`\`\n
 *1* for pictures.
 *2* for episodes.
 *3* for character info.\n
🌈 ID : ${result.mal_id}
🎀 Title EN : ${result.title_english}
🦋 Title JPN : ${result.title_japanese}\n
❲${themeemoji}❳ Type : ${result.type}
❲${themeemoji}❳ Episodes : ${result.episodes}
❲${themeemoji}❳ Season : ${result.season}
❲${themeemoji}❳ Status : ${result.status}
❲${themeemoji}❳ Duration : ${result.duration}
❲${themeemoji}❳ Rating : ${result.rating}
❲${themeemoji}❳ Score : ${result.score}
❲${themeemoji}❳ Rank : ${result.rank}
❲${themeemoji}❳ Popularity : ${result.popularity}
❲${themeemoji}❳ Url : ${result.url}
❲${themeemoji}❳ Background : ${result.background}
❲${themeemoji}❳ Desc : ${fancy13(result.synopsis.replace('[Written by MAL Rewrite]',''))}
_ID: QA25_`,
      headerType: 4,
    };
    anyaV2.sendMessage(pika.chat, message, { quoted: pika });
  } catch {
    return pika.reply("Error occurred. Please check the anime ID again!");
  }
}




