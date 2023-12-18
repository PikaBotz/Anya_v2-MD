const { anya } = require('../lib');

anya({
  name: [
    "couple"
  ],
  alias: [
    "couples"
  ],
  category: "group",
  desc: "Find couples randomly in a group chat.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (groupMetadata, pickRandom, anyaV2, pika) => {
require('../../config');
    if (!pika.isGroup) return pika.reply(message.group);
    await pika.react("❤️");
    const coupleFinds = groupMetadata.participants;
    const soul_1 = pickRandom(coupleFinds.map(u => u.id));
    const soul_2 = pickRandom(coupleFinds.filter(v => v.id !== soul_1).map(a => a.id));
      await anyaV2.sendMessage(pika.chat, {
               text: `*Ehh, something's SUS~~👀❤️*\n\n*@${soul_1.split('@')[0]}*\n*- - - 👩🏼‍❤️‍👨🏼 - - -*\n*@${soul_2.split('@')[0]}*`,
               mentions: [soul_1, soul_2]
               }, { quoted: pika });
             });
