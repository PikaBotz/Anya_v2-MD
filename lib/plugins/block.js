const { anya } = require('../lib');

anya({
  name: [
    "block",
    "unblock"
  ],
  alias: [],
  category: "owner",
  desc: "Block and unblock anybody.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (botNumber, text, args, userSudo, userOwner, command, anyaV2, pika) => {
require('../../config');
  if (!userOwner && !userSudo) return pika.reply(message.owner);
  const users = (args[0] !== 'numBut')
    ? pika.quoted ? pika.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    : args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
 const { modList } = require('../lib/mongoDB');
 const modded = await modList();
 const devs = [botNumber, ownernumber + "@s.whatsapp.net", ...modded];
 if (devs.includes(devs)) return pika.reply("Con't block the bot/owner number.");
  await pika.react("✋🏻");
  switch (command) {
  case 'block':
  await anyaV2.updateBlockStatus(users, "block");
  pika.reply("✅ You blocked this contact");
  break;
  case 'unblock':
  await anyaV2.updateBlockStatus(users, "unblock");
  pika.reply("✅ You unblocked this contact");
  break;
    }
 });
