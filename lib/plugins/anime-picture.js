const { anya } = require('../lib');

anya({
  name: [
    "animepic"
  ],
  alias: [
    "animepicture",
    "animeimage",
    "animeimg"
  ],
  category: "myanimelist",
  desc: "Search anime pictures by their myanimelist.net ID.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, args, prefix, anyaV2, pika) => {
require('../../config');
  const { Anime } = require("@shineiichijo/marika");
   if (!text) return pika.reply(`Please enter an anime ID. Type *${prefix}anime* to get an anime ID.`);
    try {
   await pika.react("✨");
  const result = await new Anime().getAnimePictures(args[0]);
  pika.reply(`Sending *${result.data.length}* picture(s) related to your search ID.`);
  const maxImages = 5;
  let count = 0;
  let count2 = 1;
  for (let i of result.data) {
  if (count >= maxImages) break;
  await anyaV2.sendMessage(pika.chat, {
             caption: `_${count2++}\uFE0F\u20E3 From myanimelist.net_`,
             image: { url: i.jpg.large_image_url },
             headerType: 4
           });
        count++;
      }} catch {
       pika.reply("Error occurred. Please check the anime ID again.");
      }
    });
