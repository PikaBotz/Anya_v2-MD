const { anya } = require('../lib');

anya({
  name: [
    "flirt"
  ],
  alias: [],
  category: "fun",
  desc: "Get some awesome flirting texts.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (pika) => {
require('../../config');
 const { get } = require('axios');
 function pickRandom(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
 await pika.react("😳");
    await get("https://raw.githubusercontent.com/PikaBotz/important-API/main/text-Api/flirting.json")
      .then((response) => {
       pika.reply("*Flirty~📩:* " + pickRandom(response.data).replace("@user", pika.pushName));
      });
     });
