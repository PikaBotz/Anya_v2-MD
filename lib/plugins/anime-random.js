const { anya } = require('../lib');

anya({
  name: [
    "randomanime"
  ],
  alias: [],
  category: "myanimelist",
  desc: "Randomly get top anime's details.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async function getCommand(react, anyaV2, pika){
require('../../config');
  const { Anime } = require('@shineiichijo/marika');
  const { fancy13 } = require('../lib/stylish-font');
  const get = await new Anime().getRandomAnime();
  const result = get.data;
  await pika.react("🧧");
  anyaV2.sendMessage(pika.chat, {
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
  }, { quoted: pika });
});
