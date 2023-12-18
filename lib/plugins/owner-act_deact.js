const { anya } = require('../lib');

anya({
  name: [
    "active",
    "deactive"
  ],
  alias: [
    "act",
    "deact"
  ],
  react: "👥",
  category: "owner",
  desc: "Enable/disable Bot in groups",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userOwner, userSudo, command, prefix, pika, Group) => {
    const Config = require('../../config');
    if (!userOwner && !userSudo) return pika.reply(Config.message.owner);
    if (!pika.isGroup) return pika.reply(Config.message.group);
    if (/deact/.test(command)) {
      Group.set(pika.chat, 'enabled', false)
      .then((res) => {
        if (res.status === 200) return pika.reply('_Bot has been disabled in this group 👥_');
        if (res.status === 208) return pika.reply('_Bot is already deactivated in this group 🙅🏻_');
        if (res.status === 500) return pika.reply(Config.message.error);
      })
    } else if (/act/.test(command)) {
      Group.set(pika.chat, 'enabled', true)
      .then((res) => {
        if (res.status === 200) return pika.reply('_Bot has been enabled in this group 👥_');
        if (res.status === 208) return pika.reply('_Bot is already activated in this group ✅_');
        if (res.status === 500) return pika.reply(Config.message.error);
    })
  } else return pika.reply(
`*🎀 Type ${prefix}activate*
_- To enable Bot in a group_

*🎀 Type ${prefix}deactivate*
_- To disable Bot in a group_`);
  });
