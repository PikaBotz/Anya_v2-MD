module.exports = {
  cmdName: () => ({
    name: ['yta2'],
    alias: ['ytaudio2'],
    react: '🎸',
    need: 'url',
    category: 'download',
    desc: 'Download high quality YouTube music/audio using video url.'
  }),
  getCommand: async (prefix, command, text, pika, anyaV2) => {
    if (!text) return pika.reply(`*EXAMPLE:* ${prefix + command} https://youtu.be/jEwjrdzrpWE?si=rWxpLadJOBz2ESqJ`);
    if (/youtu/i.test(text)) return pika.reply('You need a valid link 🔗 to use this command.');
    const Config = require('../../config');
    const { getBuffer } = require('../lib/myfunc');
    const { fancy10 } = require('../lib/stylish-font');
    const { key } = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
    const YouTube = require('../lib/ytdl-core');
    const data = await YouTube.getAudQ(text, 8);
    const buffer = await getBuffer(data.url);
    await anyaV2.sendMessage(pika.chat, {
      audio: Buffer.from(buffer, 'binary'),
      mimetype: 'audio/mp4',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: fancy10(data.title) + '.mp3',
          body: data.desc,
          thumbnail: await getBuffer(data.thumb.url),
          showAdAttribution: true,
          mediaType: 2,
          mediaUrl: data.direct_url,
          sourceUrl: data.direct_url
        }
      }
    }, {quoted:pika})
    .then(() => pika.edit('✅ 𝐀𝐮𝐝𝐢𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐮𝐬𝐢𝐧𝐠 𝐔𝐑𝐋', key))
    .catch((error) => {
      console.error(error);
      pika.edit('Ah, I\'m having trouble while sending your result to you 😔');
    })
  }
}
