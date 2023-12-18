const { anya } = require('../lib');

anya({
  name: [
    "hidetag"
  ],
  alias: [
    "htag"
  ],
  category: "admin",
  desc: "Tag everyone in the group with/without text.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userSudo, userOwner, userAdmin, botAdmin, text, groupMetadata, anyaV2, pika) => {
 await pika.react("👥");
  if (!pika.isGroup) return pika.reply(message.group); 
  if (!botAdmin) return pika.reply(message.botAdmin);
  if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);  
  anyaV2.sendMessage(pika.chat, {
            text: `${pika.quoted ? (pika.quoted.text.length > 1 ? pika.quoted.text : '‎') : (text ? text : '‎')}`,
            mentions: groupMetadata.participants.map(a => a.id)
            },{
          quoted:pika
     });
 });
