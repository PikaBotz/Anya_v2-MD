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
    name: ['wallpaper2'],
    alias: ['wall2'],
    category: "search",
    desc: "Browse high quality 3 wallpapers."
  };
}

exports.getCommand = async (anyaV2, pika, text) => {
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
}
