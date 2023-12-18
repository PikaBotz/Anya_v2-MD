const { anya } = require('../lib');

anya({
  name: [
    "animeinfo"
  ],
  alias: [
    "animeinformation",
    "infoanime"
  ],
  category: "myanimelist",
  desc: "To get anime information from myanimelist.net using anime ID.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, prefix, args, anyaV2, pika) => {
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
});
