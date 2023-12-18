const { anya } = require('../lib');

anya({
  name: [
    "del"
  ],
  alias: [
    "delete"
  ],
  category: "owner",
  desc: "Bot could delete the messages that bot sent.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userSudo, userOwner, botAdmin, prefix, anyaV2, pika) => {
require('../../config');
    if (userOwner && userSudo) return pika.reply(message.owner);
    if (!pika.quoted) return pika.reply('Reply a message to delete, that i sent.');
  const { chat, fromEveryone, id, isBaileys } = pika.quoted;
    if (!isBaileys)
     return (pika.isGroup)
       ? (botAdmin)
       ? pika.reply(`Cannot delete message, Not sent by me. Type *${prefix}del2* to delete this message.`)
       : pika.reply(`Cannot delete message, Not sent by me. Make me *admin* if you want me to delete other's messages.`)
       : pika.reply(`I can't delete this message because i didn't sent this message.`);
  await pika.react("✅");
  anyaV2.sendMessage(pika.chat, {
         delete: {
          remoteJid: pika.chat,
          fromMe: true,
          id: pika.quoted.id,
          participant: pika.quoted.sender
        }
     }
   )
});
