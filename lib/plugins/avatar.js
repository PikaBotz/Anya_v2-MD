const { anya } = require('../lib');

anya({
  name: [
    "avatar"
  ],
  alias: [],
  category: "search",
  desc: "Get High quality anime themed pp (profile picture).",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (pickRandom, anyaV2, pika) => {
require('../../config');
  const axios = require('axios');
   pika.reply(message.wait);
  try {
  const select = pickRandom([true,false]);
  const avatar = await axios.get(select
               ? "https://nekos.life/api/v2/img/avatar"
               : "https://kyoko.rei.my.id/api/sfw.php?result=40");
  await pika.react("✨");
  anyaV2.sendMessage(pika.chat, {
        image: { url: select ? avatar.data.url : pickRandom(avatar.data.apiResult.url) },
        caption: "🌌 Reply with *1* for next.\n_ID: QA04_",
        headerType: 4 },
     { quoted: pika });
     } catch {
     return pika.reply('Server Problem, try again.');
       };
     });
