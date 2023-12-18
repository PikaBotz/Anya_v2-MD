const { anya } = require('../lib');

anya({
  name: [
    "wallpaper2"
  ],
  alias: [
    "wall2"
  ],
  category: "search",
  desc: "Browse high quality 3 wallpapers.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (anyaV2, pika, text) => {
require('../../config');
if (!text) return pika.reply("Please enter a search term for a wallpaper.");
await pika.react("🌠");
const { sleep } = require("../lib/myfunc");
const wait = await anyaV2.sendMessage(pika.chat, { text: "Sending 3 results related to your wallpaper query..." }, { quoted: pika });
try {
  const { get } = require('axios');
  const { load } = require('cheerio');
  async function wallpaperSearch(query) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await get(`https://www.wallpaperflare.com/search?wallpaper=${query}`);
        const $ = load(response.data);
        const results = [];
        $("#gallery > li > figure > a").each(function (i, item) {
          const img = $(item).find("img").attr('data-src');
          results.push(img);
        });
        const shuffledResults = mix(results);
        resolve(shuffledResults.slice(0, 3));
      } catch (error) {
        reject(error);
      }
    });
  }
  function mix(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  let count = 1;
  const result = await wallpaperSearch(text);  
  const sendImage = result.map(async (url) => {
    await anyaV2.sendMessage(pika.chat, {
      image: { url: url },
      caption: `_Number ${count++}\uFE0F\u20E3 wallpaper_`
     });        
    await sleep(100);
  });
  await Promise.all(sendImage);
} catch (error) {
  pika.reply(mess.error);
  }
});
