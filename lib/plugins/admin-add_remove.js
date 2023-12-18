const { anya } = require('../lib');

anya({
  name: [
    "invite",
    "add",
    "remove"
  ],
  alias: [],
  category: "admin",
  desc: "This plugins adds, removes and invites a(n) user(s) in a group chat.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (args, botAdmin, userAdmin, userOwner, userSudo, text, prefix, command, anyaV2, pika) => {
  if (!pika.isGroup) return pika.reply(Config.message.group);
  if (!botAdmin) return pika.reply(Config.message.botAdmin);
  if (!userAdmin && !userOwner && !userSudo) return pika.reply(Config.message.admin);
  if (!text && !pika.quoted) return pika.reply(`Provide me a number to ${command} or send me more numbers with commas to ${command} all at one time.\n\n*Example:* ${prefix + command} <user1> , <user2> , <user3> , ...or more...`);
  await pika.react("👥");
  const proceed = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
  const groupMetadata = pika.isGroup ? await anyaV2.groupMetadata(pika.chat) : pika.edit(Config.message.error, proceed.key);

  let user = [];
  if (args[0] !== 'numBut') {
  if (pika.quoted) {
    user.push(pika.quoted.sender);
  } else {
    let cleanText = text.replace(/[^0-9,]/g, '');
    let users = cleanText.split(',');
    user = user.concat(users.map(u => u + "@s.whatsapp.net"));
    }
  } else {
    user.push(args[1] + '@s.whatsapp.net');
  };

  switch (command) {
    case 'invite':
      await invite(anyaV2, user, pika, groupMetadata, proceed);
      break;
    case 'add':
      await add(groupMetadata, user, proceed, anyaV2, pika);
      break;
    case 'remove':
      await remove(anyaV2, pika, user, proceed);
      break;
   }
});
