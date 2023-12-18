const { anya } = require('../lib');

anya({
  name: [
    "anime"
  ],
  alias: [
    "searchanime",
    "animesearch"
  ],
  category: "myanimelist",
  desc: "Search anime by their names directly from myanimelist.net",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, prefix, anyaV2, pika) => {
  require('../../config');
  if (!text) return pika.reply("Give me an anime name!");
  await pika.react("✨");
  const { Anime } = require("@shineiichijo/marika");
  const result = await new Anime().searchAnime(text);
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
    `*🌈 ID : ${anime.mal_id}*\n\n`
  )).join('');
  const response = `${header}${animeDetails}_ID: QA24_\n${footer}`;
  pika.reply(response);
});
