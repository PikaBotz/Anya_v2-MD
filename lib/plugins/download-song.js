const { anya } = require('../lib');

anya({
  name: [
    "song"
  ],
  alias: [
    "yta",
    "ytaudio",
    "ytmp3",
    "audio"
  ],
  react: "🎶",
  need: "query",
  category: "download",
  desc: "Search for high quality audios of YouTube by search term.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, prefix, command, pika, anyaV2) => {
    if (!text) return pika.reply(`*EXAMPLE:* ${prefix + command} Neon Blade Phonk song`);
    const YouTube = require('../lib/ytdl-core');
    if (YouTube.isYouTubeUrl(text)) return pika.reply(`If you want audio/song by link 🔗 then use *${prefix}yta2 <url>*`);
    const Config = require('../../config');
    const { myfunc, stylish } = require('../lib');
    const { key } = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
    const data = await YouTube.getAudQ(text, 8);
    const quoted = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...({ remoteJid: "`${pika.sender.split('@')[0]}-${pika.chat}`" }) }, message: { extendedTextMessage: { text:`${Config.ownername}`, title: `${Config.botname}`, 'jpegThumbnail': Config.image_2 }}};
    await anyaV2.sendMessage(pika.chat, {
      audio: data.audio,
      mimetype: 'audio/mp4',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: stylish.fancy10(data.title) + '.mp3',
          body: data.desc,
          thumbnail: await myfunc.getBuffer(data.thumb.url),
          showAdAttribution: true,
          mediaType: 2,
          mediaUrl: data.direct_url,
          sourceUrl: data.direct_url
        }
      }
    }, {quoted:quoted})
    .then(() => pika.edit('✅ 𝐀𝐮𝐝𝐢𝐨 𝐒𝐞𝐚𝐫𝐜𝐡𝐞𝐝', key))
    .catch((error) => {
      console.error(error);
      pika.edit('Ah, I\'m having trouble while sending your result to you 😔');
    })
  });
