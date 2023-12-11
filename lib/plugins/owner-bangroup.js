module.exports = {
  cmdName: () => ({
    name: ['bangc', 'unbangc'],
    alias: ['banchat', 'unbanchat'],
    category: 'owner',
    react: '🚫',
    desc: 'Ban or unban whole group chat.'
  }),
getCommand: async (text, pika, command, userOwner, userSudo) => {
  const Config = require('../../config');
  if (!userSudo && !userOwner) return pika.reply(Config.message.owner);
  const chat = (text ? (text.includes('.us') ? text.split(".us")[0] + '@g.us' : pika.chat) : pika.chat);
  if (!pika.isGroup && !chat) return pika.reply(Config.message.group); 
  const { db } = require('../database/mongoDB');
  db.banChat(chat, command)
  .then((res) => {
  const { status } = res;
  if (status === 409) return pika.reply('_Already banned the group_');
  if (status === 500) return pika.reply('An internal error occurred.');
  if (status === 404) return pika.reply('This group isn\'t banned 👥');
  if (status === 200) return pika.reply(Config.message.success);
    });
  }
}
