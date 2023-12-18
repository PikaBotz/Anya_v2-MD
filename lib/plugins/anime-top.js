const { anya } = require('../lib');

anya({
  name: [
    "topanime"
  ],
  alias: [
    "topani",
    "topanim"
  ],
  category: "myanimelist",
  desc: "Get list of trending animes directly from myanimelist.net",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (prefix, anyaV2, pika) => {
  require('../../config');
  await pika.react("✨");
  const process = await anyaV2.sendMessage(pika.chat, {
      text: message.wait
     }, {quoted:pika});
  const { Anime } = require("@shineiichijo/marika");
  const result = await new Anime().getTopAnime();
  if (result.data.length < 1) return pika.reply('Data not found please check the title again.');
  const header = "```Reply a number:```\n" +
    "*1.<number>* for pictures.\n" +
    "*2.<number>* for episodes.\n" +
    "*3.<number>* for information.\n" +
    "*4.<number>* for character info.\n\n" +
    "👉🏻 Example: 2.4\n\n";
  const animeDetails = result.data.map((anime, index) => (
    `•----------------------------------------------•♪♪\n\n` +
    `*${index + 1}. Title :* ${anime.title}\n` +
    `*🎀 Type :* ${anime.type}\n` +
    `*🔮 Rank :* ${anime.rank}\n` +
    `*🌈 ID : ${anime.mal_id}*\n\n`
  )).join('');
  const response = `${header}${animeDetails}_ID: QA24_\n${footer}`;
  await anyaV2.sendMessage(pika.chat, {
      text: response,
      edit: process.key, });
});
