const { anya } = require('../lib');

anya({
  name: [
    "liston"
  ],
  alias: [
    "listonline"
  ],
  category: "online",
  desc: "To see is someone is online or not in several groups.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (args, botNumber, anyaV2, pika, storage) => {
  try {
    if (!pika.isGroup) return pika.reply(message.group);
    const id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : pika.chat;
   const online = [...Object.keys(storage.presences[id]), botNumber];
    let count = 1;
    anyaV2.sendMessage(pika.chat, {
        text: `There are *${online.length}* users are online.\n\n`
           + online.filter(v => v !== botNumber).map((v) => `${count++} . @`
           + v.replace(/@.+/, "")).join`\n`
           + '\n_⚠️ Due to WhatsApp\'s new policy this bot can\'t see the online presence of unknown numbers._',
        mentions: online 
        }, {quoted:pika});
  } catch (err) {
    pika.reply(message.error);
  }
});
