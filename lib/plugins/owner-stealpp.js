module.exports = {
  cmdName: () => ({
    name: ['stealpp'],
    alias: ['stealpp'],
    category: 'ownner',
    react: '🔥',
    need: 'user',
    desc: 'Steal profile picture from a user'
  }),
  getCommand: async (userOwner, userSudo, botNumber, text, prefix, command, pika, anyaV2) => {
    const Config = require('../../config');
    if (!pika.isGroup) return pika.reply(Config.message.group);
    if (!userOwner && !userSudo) return pika.reply(Config.owner);
    if (!text && !pika.quoted) return pika.reply(`*EXAMPLE:* ${prefix + command} @user`);
    const user = pika.quoted ? pika.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    if (user === botNumber) return pika.reply('_🙅🏻 I can\'t steal my own profile picture_');
    const { key } = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
    let picture;
    try {
    picture = await anyaV2.profilePictureUrl(user, 'image');
    } catch (err) {
    return pika.edit(`_❌ @${user.split('@')[0]} doesn't have a profile picture, or it's hidden_`, key, { mentions: [user] });
    };
    const { myfunc } = require('../lib');
    anyaV2.updateProfilePicture(botNumber, await myfunc.getBuffer(picture))
    .then(() => pika.edit('✅ 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐏𝐢𝐜𝐭𝐮𝐫𝐞 𝐒𝐭𝐞𝐚𝐥𝐞𝐝', key))
    .catch((error) => {
      console.error(error);
      pika.edit('Error! try again later', key);
    });
  }
}
