const { anya } = require('../lib');

anya({
  name: [
    "del2"
  ],
  alias: [
    "delete2"
  ],
  category: "admin",
  desc: "Bot could delete the messages that bot sent.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userSudo, userOwner, userAdmin, botAdmin, prefix, anyaV2, pika) => {
require('../../config');
    if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.owner);
    if (!pika.quoted) return pika.reply('Reply a message to delete.');
    const { chat, fromEveryone, id, isBaileys } = pika.quoted;
    if (!isBaileys) {
    if (!botAdmin) return pika.reply(message.botAdmin);
    }
    await pika.react("✅");
  anyaV2.sendMessage(pika.chat, {
         delete: {
          remoteJid: pika.chat,
          fromMe: (isBaileys) ? true : false,
          id: pika.quoted.id,
          participant: pika.quoted.sender
        }
     }
   )
});
