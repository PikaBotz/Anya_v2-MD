module.exports = {
  cmdName: () => ({
    name: ['song'],
    alias: ['yta','ytaudio','ytmp3','audio'],
    react: "🎶",
    need: "query",
    category: "download",
    desc: "Search for high quality audios of YouTube by search term."
  }),
  getCommand: async (text, prefix, command, pika, anyaV2) => {
    if (!text) return pika.reply(`*EXAMPLE:* ${prefix + command} Neon Blade Phonk song`);
    if (text.match(/youtu/gi)) return pika.reply(`If you want audio/song by link 🔗 then use *${prefix}yta2 <url>*`);
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
    .then(() => pika.edit('✅ 𝐀𝐮𝐝𝐢𝐨 𝐒𝐞𝐚𝐫𝐜𝐡𝐞𝐝', key))
    .catch((error) => {
      console.error(error);
      pika.edit('Ah, I\'m having trouble while sending your result to you 😔');
    })
  }
}
