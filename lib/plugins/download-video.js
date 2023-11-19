module.exports = {
  cmdName: () => ({
    name: ['video'],
    alias: ['vid','ytv','ytmp4','ytvideo'],
    category: "download",
    need: "query",
    react: "🍃",
    desc: "Search for high quality videos of YouTube by search term."
  }),
  getCommand: async (text, prefix, command, pika, anyaV2) => {
    if (!text) return pika.reply(`*EXAMPLE:* ${prefix + command} Queen Anya Bot Tutorial`);
    const YouTube = require('../lib/ytdl-core.js');
    if (text.match(/youtu/gi)) return pika.reply(`If you want video by link 🔗 then use *${prefix}ytv2 <url>*`);
    const Config = require('../../config');
    const { tiny, fancy32 } = require('../lib/stylish-font');
    const { getBuffer } = require('../lib/myfunc');
    const { key } = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
    const data = await YouTube.getVidQ(text, 11);
    const qualityUrl = data.videoQuality.high;
    const caption = `
꧁✬◦°˚°◦. 𝐘 𝐎 𝐔 𝐓 𝐔 𝐁 𝐄 .◦°˚°◦✬꧂\n
🎃 *${tiny("Title")}:* ${data.title}\n
🌊 *${tiny("Link")}:* ${data.direct_url}\n
│❒ *${tiny("Channel")}:* ${data.channel}
│❒ *${tiny("Duration")}:* ${data.duration}
│❒ *${tiny("Quality")}:* ${qualityUrl ? '720p' : '360p'} _auto_
│❒ *${tiny("Views")}:* ${data.views}
│❒ *${tiny("Upload")}:* ${data.date}
╰────────────────┈✧
`;
    await anyaV2.sendMessage(pika.chat, { video: await getBuffer(qualityUrl ? data.videoQuality.high : data.videoQuality.low), caption: caption }, { quoted: pika })
     .then(() => pika.edit('✅ 𝐕𝐢𝐝𝐞𝐨 𝐒𝐞𝐚𝐫𝐜𝐡𝐞𝐝', key))
     .catch((error) => {
      console.error(error);
      pika.edit('Having trouble in sending this video media 🙁, try again later.', key);
  });
  }
}
