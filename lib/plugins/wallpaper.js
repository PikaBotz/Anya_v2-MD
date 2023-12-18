const { anya } = require('../lib');

anya({
  name: [
    "wallpaper"
  ],
  alias: [
    "wall"
  ],
  category: "search",
  desc: "Browse high quality wallpapers.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (pickRandom, text, anyaV2, pika) => {
require('../../config');
 if (!text) return pika.reply('Enter a query title.');
 pika.reply(message.wait);
 await pika.react("💟");
 const { wallpaper } = require('../lib/scraper');
 const getWall = pickRandom(await wallpaper(text));
 await anyaV2.sendMessage(pika.chat, {
            image: { url: getWall.image[0] },
            caption: `*${themeemoji} Title:* ${text}\n\n✨ Reply with *1* for next.\n\n_ID: QA16_`,
            headerType: 4
           }, { quoted: pika });
          });
