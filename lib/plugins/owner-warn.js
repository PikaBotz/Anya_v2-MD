const { anya } = require('../lib');

anya({
  name: [
    "addwarn",
    "unwarn",
    "delwarn"
  ],
  alias: [
    "warn"
  ],
  react: "♋",
  need: "user",
  category: "owner",
  desc: "Warn a user",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userOwner, userSudo, botAdmin, User, bot, text, botNumber, prefix, command, pika, anyaV2) => {
    const Config = require('../../config');
    if (!userOwner && !userSudo) return pika.reply(Config.message.owner);
    if (!text && !pika.quoted) return pika.reply('Mention a user to warn or unwarn them');
    const user = pika.quoted ? pika.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    if ([botNumber, Config.ownernumber + '@s.whatsapp.net', ...bot.modlist].includes(user)) return pika.reply('Cannot warn owner or mods ✨');
    if (!/del/.test(command) && !/un/.test(command)) {
      User.other(user, 'warn', 'add')
      .then(async (res) => {
        console.log(res)
        if (res.status === 403) return pika.reply(`_🌊 @${user.split('@')[0]} already exceeded his warn limits_`, { mentions: [user] });
        if (res.status === 200) return warn(res.warns);
        if (res.status === 429) {
          pika.reply(`\`\`\`WARN LIMIT EXCEEDED ⚠️\`\`\`\n_${botAdmin ? 'Blocking, banning and kicking' : 'Blocking and banning'} @${user.split('@')[0]}_`, { mentions: [user] })
          .then(() => anyaV2.updateBlockStatus(user, 'block'))
          .then(() => User.set(user, 'ban', true))
          .then(async () => botAdmin ? await anyaV2.groupParticipantsUpdate(pika.chat, [user], 'remove') : null);
        }
      });
    } else if (/un/.test(command)) {
      User.set(user, 'warn', 'del')
      .then((res) => {
        if (res.status === 404) return pika.reply(`_@${user.split('@')[0]} has 0 warns!_`, { mentions: [user] });
        if (res.status === 204) return pika.reply(`_@${user.split('@')[0]}'s warns has been reset to 0_`, { mentions: [user] });
        if (res.status === 200) return pika.reply(`_✅ successfully unwarned @${user.split('@')[0]}_\n\n*Warns Left : ${res.warns}*`, { mentions: [user] });
      });
    } else if (/del/.test(command)) {
      User.other(user, 'warn', 'clear')
      .then((res) => {
        if (res.status === 404) return pika.reply(`_❌ @${user.split('@')[0]} has no warns_`, { mentions: [user]});
        if (res.status === 200) return pika.reply(`_✅ Cleared @${user.split('@')[0]}'s all warns to 0!_`, { mentions: [user] });
      })
    }
    
    function warn(warn) {
      pika.reply(`◢◤◇◥◣◥◤◢◤ 𝐖𝐀𝐑𝐍 ◥◣◥◤◢◤◇◥◣\n
╭────────┈✧
│👤 𝙐𝙨𝙚𝙧 : @${user.split('@')[0]}
│🌊 𝙒𝙖𝙧𝙣𝙨 : _${warn}/${Config.warns} left_
│🎀 𝙍𝙚𝙖𝙨𝙤𝙣 : ${text ? text : 'no reasons'}
╰───────────┈┈⟡\n
_Type *${prefix}unwarn @user* to reduce one warn_
_Type *${prefix}delwarn @user* to delete all warns_`, { mentions: [user] });
    }
  });
