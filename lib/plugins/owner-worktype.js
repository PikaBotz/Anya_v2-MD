const { anya } = require('../lib');

anya({
  name: [
    "mode"
  ],
  alias: [],
  react: "📌",
  category: "owner",
  desc: "Change the mode of the bot",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userOwner, userSudo, command, prefix, pika, args, Bot) => {
      const Config = require('../../config');
      if (!userOwner && !userSudo) return pika.reply(Config.message.owner);
      if (args[0] === 'self') {
        Bot.set('worktype', 'self')
         .then((res) => {
          if (res.status === 200) return pika.reply(Config.message.success);
          if (res.status === 208) return pika.reply(`_Already running on self 🤫 mode_`);
          if (res.status === 500) return pika.reply(Config.message.error);
         })
      } else if (args[0] === 'public') {
        Bot.set('worktype', 'public')
        .then((res) => {
          if (res.status === 200) return pika.reply(Config.message.success);
          if (res.status === 208) return pika.reply('_Already running on public 👥 mode_');
          if (res.status === 500) return pika.reply(Config.message.error);
        })
      } else if (args[0] === 'admin') {
        Bot.set('worktype', 'onlyadmin')
        .then((res) => {
          if (res.status === 200) return pika.reply(Config.message.success);
          if (res.status === 208) return pika.reply('_Already running on admin 👑 mode_');
          if (res.status === 500) return pika.reply(Config.message.error);
        })
      } else {
        pika.reply(`
  *1️⃣ Type ${prefix + command} public*
  _- Anyone can use this Bot_
  
  *2️⃣ Type ${prefix + command} self*
  _- Only Owner and Bot itself can use this Bot_
  
  *3️⃣ Type ${prefix + command} admin*
  _- Only Owner, Admin and Bot itself can use this Bot_
  `);
      }
    });
