module.exports = {
  cmdName: () => ({
    name: ['bangc', 'unbangc'],
    alias: ['bangroup', 'banchat', 'unbangroup', 'unbanchat'],
    react: '🚫',
    category: 'owner',
    desc: 'Ban a group from using the bot'
  }),
  getCommand: async (userOwner, userSudo, command, prefix, pika, Group) => {
    const Config = require('../../config');
    if (!pika.isGroup) return pika.reply(Config.message.group);
    if (!userOwner && !userSudo) return pika.reply(Config.message.owner);
    if (!/un/.test(command)) {
     Group.set(pika.chat, 'ban', true)
      .then((res) => {
        if (res.status === 200) return pika.reply(`_Group has been banned ✅ from using this bot_\n\n*Type ${prefix}unbangc to unban this group*`);
        if (res.status === 208) return pika.reply('_Group is already 🚫 from using this bot _');
        if (res.status === 500) return pika.reply(Config.message.error);
      })
    } else {
      Group.set(pika.chat, 'ban', false)
      .then((res) => {
        if (res.status === 200) return pika.reply(`_Group has been unbanned ✅ from using this bot_`);
        if (res.status === 208) return pika.reply('_Group is not banned 🚫 from using this bot _');
        if (res.status === 500) return pika.reply(Config.message.error);
      })
    }
  }
}