const { anya } = require('../lib');

anya({
  name: [
    "rateme"
  ],
  alias: [
    "rate"
  ],
  category: "group",
  desc: "Rate any given query with random numbers.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, prefix, anyaV2, pika) => {
require('../../config');
 if (!text) return pika.reply(`*Example:* ${prefix}rate my DP`);
 function randomRating() {
  const randomNumber = Math.floor(Math.random() * 101);
  const emojiMatch = randomNumber.toString().padStart(3, '0');
    const emojiMake = emojiMatch
    .split('')
    .map(digit => `${digit}\uFE0F\u20E3`)
    .join('');
  return emojiMake;
    }
  pika.reply(`*Rating "${text}":*\n➥ _${randomRating()} points!_`);
});
