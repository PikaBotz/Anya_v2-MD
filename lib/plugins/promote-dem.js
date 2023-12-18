const { anya } = require('../lib');

anya({
  name: [
    "promote",
    "demote"
  ],
  alias: [
    "prom",
    "dem"
  ],
  category: "admin",
  desc: "Group promotion or demotion actions.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (args, botAdmin, userAdmin, userOwner, userSudo, text, groupMetadata, command, anyaV2, pika) => {
require('../../config');
 if (!botAdmin) return pika.reply(message.botAdmin);
  await pika.react("👥");
  if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);
  if (!text && !pika.quoted) return pika.reply("Provide me a number.");
  const user = (args[0] === 'numBut')
            ? args[1] + '@s.whatsapp.net'
            : pika.quoted
            ? pika.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    const participant = await groupMetadata.participants;
    const participants = groupMetadata.participants
                  .filter(item => item.admin === 'admin')
                  .map(item => item.id);
 switch (command) {
 case 'promote':
 case 'prom':
    if (participants.includes(user)) return pika.reply("Already a admin!");
    if (!participant.map((a) => a.id).includes(user)) return pika.reply("Doesn't exist in this group.");
    await anyaV2.groupParticipantsUpdate(pika.chat, [user], 'promote')
       .catch((err) => {
       return pika.reply(`Failed to promote this user in this group! ⚠️`);
      });
    pika.reply(message.success);
 break;
 case 'demote':
 case 'dem':
    if (!participants.includes(user)) return pika.reply("Already a member!");
    if (!participant.map((a) => a.id).includes(user)) return pika.reply("Doesn't exist in this group.");
    await anyaV2.groupParticipantsUpdate(pika.chat, [user], 'demote')
       .catch((err) => {
       return pika.reply(`Failed to demote this user in this group! ⚠️`);
      });
    pika.reply(message.success);
 break
 
     }
    });
