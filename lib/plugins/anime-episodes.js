const { anya } = require('../lib');

anya({
  name: [
    "animeep"
  ],
  alias: [
    "animeepisodes",
    "animeepisode"
  ],
  category: "owner",
  desc: "Get episodes info from the given anime ID.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, args, anyaV2, pika) => {
require('../../config');
  const { Anime } = require("@shineiichijo/marika");
   if (!text) return pika.reply(`Please enter a anime ID, type *${prefix}searchAnime* to get anime ID.`);
  try {
   const process = await anyaV2.sendMessage(pika.chat, {
         text: message.wait
        }, { quoted: pika });
    const result = await new Anime().getAnimeEpisodes(args[0]);
     let cap = `This anime has *${result.data.length}* episodes!\n\n`;
     let count = 1;
        for (let i of result.data) {
              cap += "•----------------------------------------------•♪♪\n\n";
              cap += "*" + count++ + ". Title EN :* " + i.title + "\n";
              cap += "*🎀 Tittle JPN : " + i.title_japanese + "*\n";
              cap += "*🔮 Released at :* " + i.aired.split(":")[0] + "\n";
              cap += "*🌈 Url : _" + i.url + "_*\n\n";
            }
            cap += `\n_ID: QA25_\n${footer}`;
     await anyaV2.sendMessage(pika.chat, {
         text: (result.data.length === 0)
              ? 'There are no episodes in this anime title.'
              : cap,
         edit: process.key
        });
      } catch {
        pika.reply("```Check your anime ID```");
          } 
        });
