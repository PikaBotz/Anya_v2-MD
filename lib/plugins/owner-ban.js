module.exports = {
  cmdName: () => ({
    name: ['ban', 'unban'],
    alias: [],
    need: 'user',
    react: '🚫',
    category: 'owner',
    desc: 'Ban or unban users to bot.'
  }),
getCommand: async (userOwner, userSudo, pika, text, command, anyaV2) => {
  const Config = require('../../config');
  if (!userSudo && !userOwner) return pika.reply(Config.message.owner);
  const user = pika.quoted ? pika.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  if (!user) return pika.reply('_Tag a user to ban!_');
  const { db } = require('../database/mongoDB');
  const botnumber = await anyaV2.decodeJid(anyaV2.user.id);
  db.banUser(user, command, botnumber)
  .then((response) => {
  const { status } = response;
  if (status === 403) return pika.reply(`✨ Can't ban *@${pika.sender.split('@')[0]}*, user is a mod!`, { mentions: [pika.sender] });
  if (status === 409) return pika.reply('_Already banned_');
  if (status === 500) return pika.reply('An internal error occurred.');
  if (status === 404) return pika.reply('This user isn\'t banned 😗');
  if (status === 200) return pika.reply(Config.message.success);
    })
  }
}
