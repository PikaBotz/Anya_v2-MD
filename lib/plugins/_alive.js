module.exports = {
  cmdName: () => ({
    name: ['alive'],
    alias: [],
    react: '👋🏻',
    category: 'main',
    desc: 'Bot shows it\'s alive'
  }),
  getCommand: async (anyaV2, pika, prefix, startPing, totalAnyaUsers) => {
    const Config = require('../../config');
    const { tiny, fancy31 } = require('../lib/stylish-font');
    const { plugin, formatRuntime, getMemoryInfo, ping, dayToday } = require('../lib');
    const Ping = startPing - performance.now();
    const caption = `\`\`\`
❖ ── ✦ ──『✙ Alive ✙』── ✦ ── ❖

📅 ${tiny('Date Today')} : ${dayToday().date}
⌚ ${tiny('Time Now')} : ${dayToday().time}

✦» 𝚄𝚜𝚎𝚛 : ${pika.pushName}
✦» 𝙱𝚘𝚝 : ${Config.botname}
✦» 𝙿𝚛𝚎𝚏𝚒𝚡 : ${(prefix === '') ? 'no prefix' : `"${prefix}"`}
✦» 𝙾𝚠𝚗𝚎𝚛 : ${Config.ownername}
✦» 𝙼𝚘𝚍𝚎 : ${await mode()}
✦» 𝙿𝚕𝚞𝚐𝚒𝚗𝚜 : ${plugin.pluginSize().size}
✦» 𝚄𝚜𝚎𝚛𝚜 : ${totalAnyaUsers}
✦» 𝚂𝚙𝚎𝚎𝚍 : ${Ping.toFixed(2).replace('-', '')}ms
✦» 𝚄𝚙𝚝𝚒𝚖𝚎 : ${formatRuntime(process.uptime())}
✦» 𝙼𝚎𝚖 : ${getMemoryInfo().usedMemory}/${getMemoryInfo().totalMemory}\`\`\`

☎️ *Cᴏɴᴛᴀᴄᴛ :* https://wa.me/${ownernumber}?text=${encodeURIComponent('Owner of ' + Config.botname + ' 🥵🎀🎐')}
💻 *Sᴏᴜʀᴄᴇ Cᴏᴅᴇ :* https://github.com/PikaBotz/Anya_v2-MD
🎀 *YᴏᴜTᴜʙᴇ :* https://youtube.com/@Pika_Kunn
🔮 *Public Group :* https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX

*R𝚎𝚙𝚕𝚢 A N𝚞𝚖𝚋𝚎𝚛 T𝚘 G𝚎𝚝:*
   𝟭 𝗔𝗹𝗹𝗺𝗲𝗻𝘂
   𝟮 𝗟𝗶𝘀𝘁𝗺𝗲𝗻𝘂
_ID: QA01_
`;

  const ownerq = { key: { participant: '0@s.whatsapp.net', ...(pika.chat ? { remoteJid: 'status@broadcast' } : {}), }, message: { contactMessage: { displayName: Config.ownername, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${fancy31(Config.ownername)},;;;\nFN:${fancy31(Config.ownername)}\nitem1.TEL;waid=${Config.ownernumber}:${Config.ownernumber}\nitem1.X-ABLabel:Mobile\nEND:VCARD`, jpegThumbnail: Config.image_3, thumbnail: Config.image_3, sendEphemeral: true, }, }, };
    await anyaV2.sendMessage(pika.chat, {
      video: Config.aliveMedia,
      caption: caption,
      gifPlayback: true,
      contextInfo: {
        externalAdReply: {
          title: Config.botname,
          body: 'I\'m still alive darling',
          thumbnail: Config.image_2,
          showAdAttribution: true
        }
      }
    }, {quoted:ownerq});
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
