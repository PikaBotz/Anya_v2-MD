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
    const { tiny } = require('../lib/stylish-font');
    const { pluginSize, formatRuntime, getMemoryInfo, ping, dayToday } = require('../lib');
    const Ping = performance.now() - startPing;
    const caption = `\`\`\`
❖ ── ✦ ──『✙ Alive ✙』── ✦ ── ❖

📅 ${tiny('Date Today')} : ${dayToday().date}
⌚ ${tiny('Time Now')} : ${dayToday().time}

✦» User : ${pika.pushName}
✦» Bot : ${Config.botname}
✦» Prefix : ${(prefix === '') ? 'no prefix' : `"${prefix}"`}
✦» Owner : ${Config.ownername}
✦» Plugins : ${pluginSize().size}
✦» Users : ${totalAnyaUsers}
✦» Speed : ${Ping.toFixed(2)}ms
✦» Uptime : ${formatRuntime(process.uptime())}
✦» Mem : ${getMemoryInfo().usedMemory}/${getMemoryInfo().totalMemory}\`\`\`

*${tiny('github')} :* https://github.com/PikaBotz/Anya_v2-MD
*${tiny('youtube')} :* https://youtube.com/@Pika_Kunn

*R𝚎𝚙𝚕𝚢 A N𝚞𝚖𝚋𝚎𝚛 T𝚘 G𝚎𝚝:*
   𝟭 𝗔𝗹𝗹𝗺𝗲𝗻𝘂
   𝟮 𝗟𝗶𝘀𝘁𝗺𝗲𝗻𝘂
_ID: QA01_
`;
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
    }, {quoted:pika});
  }
}
