const { anya } = require('../lib');

anya({
  name: [
    "addmod",
    "delmod"
  ],
  alias: [],
  react: "👤",
  need: "user",
  category: "owner",
  desc: "Add or remove a mod from the modlist",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userOwner, userSudo, Bot, text, botNumber, command, pika) => {
    const Config = require('../../config');
    if (!userOwner && !userSudo) return pika.reply(Config.message.owner);
    if (!text && !pika.quoted) return pika.reply('❌ Please mention a @user');
    const user = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
    const list = await Bot.get();
    if (/add/.test(command)) {
      for (let i of user) {
      const { status } = await Bot.push('modlist', i, 'add');
      if ([botNumber, ownernumber + '@s.whatsapp.net'].includes(i)){ 
        pika.reply(`✨ Can't add my owner @${i.split('@')[0]} as co-owner`, { mentions: [i]});
       } else if (list.modlist.includes(i)) {
        pika.reply(`_🎀 @${i.split('@')[0]} is already a mod_`, { mentions: [i]});
      } else if (status === 200) {
        pika.reply(`✅ Successfully added @${i.split('@')[0]} to the modlist.`, { mentions: [i] });
        }
       }
      } else if (/del/.test(command)) {
      for (let i of user) {
      const { status } = await Bot.push('modlist', i, 'del');
      if (!list.modlist.includes(i)) {
        pika.reply(`_🙅🏻 @${i.split('@')[0]} is not a mod_`, { mentions: [i]});
      } else if (status === 200) return pika.reply(`✅ Successfully removed @${i.split('@')[0]} from the modlist.`, { mentions: [i] });
       }
      }
    });
