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
      if (YouTube.isYouTubeUrl(text)) return pika.reply(`If you want video by link 🔗 then use *${prefix}vid2 <url>*`);
      const Config = require('../../config');
      const { stylish, myfunc } = require('../lib');
      const { key } = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
      const data = await YouTube.getVidQ(text, 8);
      const qualityUrl = data.videoQuality.high;
      const caption =` 
꧁✬◦°˚°◦. 𝐘 𝐎 𝐔 𝐓 𝐔 𝐁 𝐄 .◦°˚°◦✬꧂\n
🎃 *${stylish.tiny("Title")}:* ${data.title}\n
🌊 *${stylish.tiny("Link")}:* ${data.direct_url}\n
│❒ *${stylish.tiny("Channel")}:* ${data.channel}
│❒ *${stylish.tiny("Duration")}:* ${data.duration}
│❒ *${stylish.tiny("Quality")}:* ${qualityUrl ? '720p' : '360p'} _auto_
│❒ *${stylish.tiny("Views")}:* ${data.views}
│❒ *${stylish.tiny("Upload")}:* ${data.date}
╰────────────────┈✧
  `;
      await anyaV2.sendMessage(pika.chat, {
        video: await myfunc.getBuffer(qualityUrl ? data.videoQuality.high : data.videoQuality.low), caption: caption }, { quoted: pika })
       .then(() => pika.edit('✅ 𝐕𝐢𝐝𝐞𝐨 𝐒𝐞𝐚𝐫𝐜𝐡𝐞𝐝', key))
       .catch((error) => {
        console.error(error);
        pika.edit('Server overloaded! try again later', key);
    });
    }
}
