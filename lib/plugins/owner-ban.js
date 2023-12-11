module.exports = {
  cmdName: () => ({
    name: ['ban', 'unban'],
    alias: [],
    category: 'owner',
    react: '🚫',
    need: 'user',
    desc: 'Ban or unban user.'
  }),
  getCommand: async (text, pika, User, bot, command, botNumber, userOwner, userSudo) => {
    const Config = require('../../config');
    if (!userSudo && !userOwner) return pika.reply(Config.message.owner);
    if (!text && !pika.quoted) return pika.reply(`Tag user or reply message to ${command}`);
    const user = pika.quoted ? pika.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' || false;
    if ([botNumber, Config.ownerNumber + '@s.whatsapp.net', ...bot.modlist].includes(user)) return pika.reply(` ✨ Can't ban owner or mods`);
    if (!/un/.test(command)) {
      User.set(user, 'ban', true)
        .then((res) => {
          if (res.status === 208) return pika.reply(`_@${user.split('@')[0]} is already banned_`, { mentions: [user] });
          if (res.status === 200) return pika.reply(`_✅ Successfully banned @${user.split('@')[0]}_\n\n*Type ${prefix}unban @usre to unban*`, { mentions: [user] });
          if (res.status === 500) return pika.reply(Config.message.error);
        });
    } else if (/un/.test(command)) {
      User.set(user, 'ban', false)
        .then((res) => {
          if (res.status === 208) return pika.reply(`_@${user.split('@')[0]} is not banned_`, { mentions: [user] });
          if (res.status === 200) return pika.reply(`_✅ Successfully unbanned @${user.split('@')[0]}_`, { mentions: [user] });
          if (res.status === 500) return pika.reply(Config.message.error);
        });
    }
  }
}