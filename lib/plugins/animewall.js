const { anya } = require('../lib');

anya({
  name: [
    "animewall"
  ],
  alias: [
    "wallanime",
    "animewallpaper",
    "wallpaperanime"
  ],
  category: "search",
  desc: "Get High quality anime themed wallpapers randomly.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (anyaV2, pika) => {
require('../../config');
  const axios = require('axios');
   pika.reply(message.wait);
  const pic = await axios.get("https://nekos.life/api/v2/img/wallpaper");
  await pika.react("🌌");
    anyaV2.sendMessage(pika.chat, {
        image: { url: pic.data.url },
        caption: "🎏 Reply with *1* for next.\n_ID: QA05_",
        headerType: 4 },
     { quoted: pika })
     .catch(err => {
     return pika.reply(message.error);
       })
     });
