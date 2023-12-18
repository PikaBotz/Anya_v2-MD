const { anya } = require('../lib');

anya({
  name: [
    "setbotbio"
  ],
  alias: [
    "setbio",
    "botbio"
  ],
  category: "owner",
  desc: "Set bot number's profile picture.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (anyaV2, pika, text) => {
require('../../config');
  if (!text && !pika.quoted) return pika.reply('Please enter a text to set as bot number\'s bio.');
  await pika.react("🧬");
  await anyaV2.setStatus(pika.quoted ? pika.quoted.text : text);
  pika.reply(message.success);
  });
