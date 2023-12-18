const { anya } = require('../lib');

anya({
  name: [
    "soulmate"
  ],
  alias: [
    "mysoulmate"
  ],
  category: "group",
  desc: "Find your soulmate in the groups.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (groupMetadata, pickRandom, anyaV2, pika) => {
require('../../config');
    if (!pika.isGroup) return pika.reply(message.group);
    await pika.react("❤️");
    const randomMembers = pickRandom(groupMetadata.participants.filter(v => v.id !== pika.sender).map(u => u.id));
      await anyaV2.sendMessage(pika.chat, {
               text: `*Match found 👀❤️*\n\n*@${pika.sender.split('@')[0]}*\n*- - - ❤️ - - -*\n*@${randomMembers.split('@')[0]}*`,
               mentions: [pika.sender, randomMembers]
               }, { quoted: pika });
             });
