module.exports = {
  cmdName: () => ({
    name: ['menu'],
    alias: ['allmenu','commands','dashboard','h','help'],
    category: 'core',
    react: '🥵',
    desc: 'Command list of the bot.'
  }),
  getCommand: async (command, prefix, args, pika, anyaV2, startPing, totalAnyaUsers) => {
  const Config = require('../../config');
  const { dayToday, getMemoryInfo, plugin } = require('../lib');
  const { fancy32, fancy31 } = require('../lib/stylish-font');
  const Ping = startPing - performance.now();

  const caption = `
*Hello, ${pika.pushName}*
_I'm ${Config.botname} >> 🖤🥀_

🇼 🇭 🇦 🇹 🇸 🇦 🇵 🇵 - 🇧 🇴 🇹 

📅 Date Today : ${dayToday().date}
⌚ Time Now : ${dayToday().time}

《⟡━━━━━⟪ ${fancy32(Config.ownername)} ⟫━━━━━⟡》
║╭───────────┈⟡
║│✗»𝚄𝚜𝚎𝚛 : ${pika.pushName}
║│✗»𝙱𝚘𝚝 : ${Config.botname}
║│✗»𝙿𝚛𝚎𝚏𝚒𝚡 : ${(prefix === '') ? 'no prefix' : `"${prefix}"`}
║│✗»𝙼𝚘𝚍𝚎 : ${await mode()}
║│✗»𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : ${require('../../package.json').version}
║│✗»𝙾𝚠𝚗𝚎𝚛 : ${Config.ownername}
║│✗»𝙿𝚕𝚞𝚐𝚒𝚗𝚜 : ${plugin.pluginSize().size}
║│✗»𝚄𝚜𝚎𝚛𝚜 : ${totalAnyaUsers}
║│✗»𝚂𝚙𝚎𝚎𝚍 : ${Ping.toFixed(2).replace('-', '')}ms
║│✗»𝙼𝚎𝚖 : ${getMemoryInfo().usedMemory}/${getMemoryInfo().totalMemory}
║╰─────────────┈⟡
⟪⟡───────⟐⌬⟐───────⟡⟫

*💠 Fᴏʟʟᴏᴡ ᴍᴇ ᴏɴ :* https://instagram.com/${Config.instagramId}
*💻 Sᴏᴜʀᴄᴇ Cᴏᴅᴇ :* https://github.com/PikaBotz/Anya_v2-MD
*🍜 YᴏᴜTᴜʙᴇ :* https://YouTube.com/@pika_kunn
*👥 Pᴜʙʟɪᴄ Gʀᴏᴜᴘ :* https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX

*🧑🏻‍💻 :* _Type .information for my system status._

${plugin.makeAllmenu(prefix)}

🎀 _Type ${prefix}listmenu for my command list._

🔖 _Type ${prefix}help <command_name> for plugin information._`

  const ownerq = { key: { participant: '0@s.whatsapp.net', ...(pika.chat ? { remoteJid: 'status@broadcast' } : {}), }, message: { contactMessage: { displayName: Config.ownername, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${fancy31(Config.ownername)},;;;\nFN:${fancy31(Config.ownername)}\nitem1.TEL;waid=${Config.ownernumber}:${Config.ownernumber}\nitem1.X-ABLabel:Mobile\nEND:VCARD`, jpegThumbnail: Config.image_3, thumbnail: Config.image_3, sendEphemeral: true, }, }, };

  if (args[0] && (command === 'help')) {
  plugin.getPluginInfo(args[0])
   .then((res) => {
     if (!res) return pika.reply('This command\'s information doesn\'t exists 😮‍💨, please check the command name again.');
     pika.reply(`_Hey, is this the information about this plugin you're looking for 😙 ?_\n\n💠 Name : ${res.name}${res.alias ? '\n🍜 Alias : ' + res.alias : ''}${res.react ? '\n🌟 React : ' + res.react : ''}${res.need ? '\n📃 Need : ' + res.need : ''}\n💭 Category : ${res.category}\n🎀 Description : ${res.desc}`);
      }).catch((error) => {
      console.log(error)
      pika.reply('Oopsie! an error!');
      });
  } else {
  await anyaV2.sendMessage(pika.chat, {
      video: Config.menuMedia,
      caption: caption,
      gifPlayback: true,
      contextInfo: {
        externalAdReply: {
          title: Config.botname,
          body: 'Here\'s the full list of my commands darling',
          thumbnail: Config.image_2,
          showAdAttribution: true
          }
        }
      }, {quoted:ownerq});
    }
  }
}

async function mode () {
  const { getWORKTYPE } = require('../lib/mongoDB');
  const worktype = await getWORKTYPE();
  if (worktype.self === true && worktype.public === false && worktype.onlyadmins === false) {
    return 'self';
  } else if (worktype.self === false && worktype.public === true && worktype.onlyadmins === false) {
    return 'public';
  } else if (worktype.self === false && worktype.public === false && worktype.onlyadmins === true) {
    return 'onlyadmins';
  }
}
