const { anya } = require('../lib');

anya({
  name: [
    "couplepp"
  ],
  alias: [
    "cpp",
    "ppcouple"
  ],
  category: "general",
  desc: "Get beutiful couples anime pair DP.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (pickRandom, anyaV2, pika) => {
require('../../config');
  const { get } = require('axios');
  await pika.react("❤️");
  pika.reply(message.wait);
  const fetch = await get("https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json");
  const pictures = await pickRandom(fetch.data);
  await anyaV2.sendMessage(pika.chat, {
            image: { url: pictures.male },
            caption: `For male 🤵🏻`
           }, { quoted: pika });
  await anyaV2.sendMessage(pika.chat, {
            image: { url: pictures.female },
            caption: `For female 👰🏻‍♀️`
           }, { quoted: pika });
        });
