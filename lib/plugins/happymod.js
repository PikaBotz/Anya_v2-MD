const { anya } = require('../lib');

anya({
  name: [
    "happymod"
  ],
  category: "search",
  alias: [
    "hapimod",
    "hapymod",
    "happymode"
  ],
  desc: "To search for premium mod apks directly from happymod.com .",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (anyaV2, pika, text, args, command) => {
require('../../config');
  if (!text) return pika.reply("Enter a search term for a mod apk.");
  await pika.react("↘️");
  const wait = await anyaV2.sendMessage(pika.chat, {
       text: mess.wait
      }, {quoted:pika});
 try {
  const { get } = require('axios');
  const { load } = require('cheerio');
  async function happymod(query) {
  return new Promise((resolve, reject) => {
  get(`https://www.happymod.com/search.html?q=${query}`).then(async response => {
  const $ = load(response.data);
  let count = 1;
  ress = []
   $("div.pdt-app-box").each(function(c, d) {
        name = $(d).find("a").text().trim();
        thumbnail = $(d).find("img.lazy").attr('data-original');
        link = $(d).find("a").attr('href');
        link2 = `https://www.happymod.com${link}`
        const Data = {
          count: count++,
          author: "PikaBotz",
          thumbnail: thumbnail,
          name: name,
          link: link2
         }
         ress.push(Data)
           })
         resolve(ress);
       }).catch(reject)
     });
   };
   const response = await happymod(text);
   if (response.length === 0) return await anyaV2.sendMessage(pika.chat, {
       text: "❌ No results found",
       edit: wait.key });
   const result = response[args[1] ? args[1] : 0];
   anyaV2.sendMessage(pika.chat, {
       image: { url: result.thumbnail },
       caption: `*🍂Title: ${result.name.replace("More", "").replace("[Unlocked]", "").replace("[Pro]", "").trim()}*\n\n` +
                `*📍Term:* ${text}\n` +
                `*🔗Link:* ${result.link}\n\n` +
                `\`\`\`Reply a number to:\`\`\`\n` +
         //       `\t\t*1 Download Apk*\n\t\t*2 Next Apk*\n\n` +
                `\t\t*1 Next Apk*\n\n` +
                `_get: ${command}_\n_rank: ${result.count}_\n_ID: QA30_`
             },
        {quoted: pika});
      } catch {
      pika.reply(mess.error);
     }
  });
