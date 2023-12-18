const { anya } = require('../lib');

anya({
  name: [
    "animechara2"
  ],
  alias: [
    "animecharacter2"
  ],
  category: "myanimelist",
  desc: "Get a picture randomly of the characters of the given anime ID.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, prefix, args, anyaV2, pika) => {
require('../../config');
  const { Anime } = require("@shineiichijo/marika");
  if (!text) return pika.reply("Please enter an anime ID. Type `" + prefix + "searchAnime` to get the anime ID.");
  try {
    pika.reply(message.wait);
    const result = await new Anime().getAnimeCharacters(args[0]);
    const pic = result.data[Math.floor(Math.random() * result.data.length)];
    const message = {
            image: { url: pic.character.images.jpg.image_url },
            caption: "*👤 Name :* " + pic.character.name + "\n"
                   + "*🦋 Role :* " + pic.role + "\n"
                   + "*🎐 Favourites :* " + pic.favorites,
              headerType: 4,
            };
            anyaV2.sendMessage(pika.sender, message, { quoted: pika });
          } catch {
    pika.reply("```Error, please check the ID again!```");
   }
 });
