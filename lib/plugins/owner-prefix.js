module.exports = {
  cmdName: () => ({
    name: ['prefix'],
    alias: [],
    react: '📌',
    category: 'owner',
    desc: 'Change the prefix of the bot'
  }),
  getCommand: async (userOwner, userSudo, command, prefix, pika, args, Bot) => {
    const Config = require('../../config');
    if (!userOwner && !userSudo) return pika.reply(Config.message.owner);
    if (args[0] === 'all') {
      Bot.set('prefix', 'all')
       .then((res) => {
        if (res.status === 200) return pika.reply(Config.message.success + '\n\n*✅ Automatically turned off command suggestions, wrong command message and chatbot due to all prefix mode.*');
        if (res.status === 208) return pika.reply(`_Already on all prefix ♾️ mode_`);
        if (res.status === 500) return pika.reply(Config.message.error);
      });
    } else if (args[0] === 'multi') {
      Bot.set('prefix', 'multi')
      .then((res) => {
        if (res.status === 200) return pika.reply(Config.message.success);
        if (res.status === 208) return pika.reply('_Already on multiple prefix ℹ️ mode_');
        if (res.status === 500) return pika.reply(Config.message.error);
      })
    } else if (args[0] === 'single') {
      Bot.set('prefix', 'single')
      .then((res) => {
        if (res.status === 200) return pika.reply(Config.message.success);
        if (res.status === 208) return pika.reply('_Already on single prefix 1️⃣ mode_');
        if (res.status === 500) return pika.reply(Config.message.error);
      })
    } else {
      pika.reply(`
*1️⃣ Type ${prefix + command} all*
_- Bot will use every prefix including 'no prefix' (Ex: ., !, /, -, etc...)_
      
*2️⃣ Type ${prefix + command} multi*
_- Bot will use every prefix except 'no prefix' (Ex: ., !, /, -, etc...)_
      
*3️⃣ Type ${prefix + command} single*
_- Bot will use only one prefix as owner configured (Ex: "${Config.prefa}")_
`);
    }
  }
}