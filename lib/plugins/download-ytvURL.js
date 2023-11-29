module.exports = {
  cmdName: () => ({
    name: ['ytv2', 'ytshorts'],
    alias: ['ytvideo', 'ytvid2', 'ytshorts', 'ytstatus'],
    react: '🔗',
    need: 'url',
    category: 'download',
    desc: 'Download high-quality YouTube video/status using video URL.'
  }),
  getCommand: async (text, args, prefix, command, pika, anyaV2) => {
    if (!text) return pika.reply(`*EXAMPLE:* ${prefix + command} https://youtu.be/jEwjrdzrpWE?si=rWxpLadJOBz2ESqJ`);
    const YouTube = require('../lib/ytdl-core');
    if (!YouTube.isYouTubeUrl(text)) return pika.reply('You need a valid link 🔗 to use this command.');
    const Config = require('../../config');
    const vidQ = (args[0] && args[0].includes('@') ? args[0].split('@')[1] : '360') || '360';
    const vidU = (args[1] && args[1].includes('@') ? args[1].split('@')[1] : args[0]) || args[0];
    if (args[0] && !args[1] && !args[0].includes('@')) {
      const { key } = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
      const { videoQuality } = await YouTube.getVidUrl(vidU);
      const videoQualities = [];
      if (videoQuality.high) {
        videoQualities.push('720p');
        videoQualities.push('720p | document');
      }
      if (videoQuality.low) {
        videoQualities.push('360p');
        videoQualities.push('360p | document');
      }
      let count = 1;
      let quality = `
⌈ 🎃 Choose Quality 🎃 ⌋\n
*🌊 Url:* ${vidU}\n
✨ *_REPLY A NUMBER TO CHOOSE:_*\n
*╭─┈⟡*
`;
      for (let option of videoQualities) {
        quality += `*├❒ ${count++}:* ${option}\n`
      }
      quality += `*╰──────┈✧*\n\n_ID: QA31_`;
      pika.edit(quality, key);
      return;
    }
    const key = await anyaV2.sendMessage(pika.chat, { text: `🧐 Getting your ${vidQ.split('|')[0]} ${(vidQ.split('|')[1] === 'document') ? 'document' : 'video'}...` }, { quoted: pika });
    (vidQ.split('|')[1] === 'document') ? await module.exports.sendDoc(vidU, vidQ, key.key, pika, anyaV2) : await module.exports.sendVid(vidU, vidQ, key.key, pika, anyaV2);
  },
  sendVid: async (url, vidQ, key, pika, anyaV2) => {
    const { getBuffer } = require('../lib/myfunc');
    const { tiny } = require('../lib/stylish-font');
    const YouTube = require('../lib/ytdl-core');
    const data = await YouTube.getVidUrl(url);
    const caption = `
 ✶⊶⊷⊶⊷❍ Y T - U R L ❍⊶⊷⊶⊷✶\n
🎃 *${tiny("Title")}:* ${data.title}\n
🌊 *${tiny("Link")}:* ${data.direct_url}\n
│❒ *${tiny("Channel")}:* ${data.channel}
│❒ *${tiny("Duration")}:* ${data.duration}
│❒ *${tiny("Quality")}:* ${data.videoQuality.high ? '720p' : '360p'} _auto_
│❒ *${tiny("Views")}:* ${data.views}
│❒ *${tiny("Upload")}:* ${data.date}
╰────────────────┈✧
`;
    anyaV2.sendMessage(pika.chat, { video: await getBuffer((vidQ.split('|')[0] === '720') ? data.videoQuality.high : data.videoQuality.low), caption: caption }, { quoted: pika })
      .then(() => pika.edit('✅ 𝐕𝐢𝐝𝐞𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐮𝐬𝐢𝐧𝐠 𝐔𝐑𝐋', key))
      .catch((error) => {
        console.error(error);
        pika.edit('😕 Can\'t download the video, encountering errors...', key);
      });
  },
  sendDoc: async (url, vidQ, key, pika, anyaV2) => {
    const { getBuffer } = require('../lib/myfunc');
    const { tiny } = require('../lib/stylish-font');
    const YouTube = require('../lib/ytdl-core');
    const data = await YouTube.getVidUrl(url);
    const caption = `
 ✶⊶⊷⊶❍ Y T - U R L ❍⊷⊶⊷✶\n
🌊 *${tiny("Link")}:* ${data.direct_url}\n
│❒ *${tiny("Channel")}:* ${data.channel}
│❒ *${tiny("Duration")}:* ${data.duration}
│❒ *${tiny("Quality")}:* ${data.videoQuality.high ? '720p' : '360p'} _auto_
│❒ *${tiny("Views")}:* ${data.views}
│❒ *${tiny("Upload")}:* ${data.date}
╰────────────────┈✧
`;
    anyaV2.sendMessage(pika.chat, {
      document: await getBuffer((vidQ.split('|')[0] === '720') ? data.videoQuality.high : data.videoQuality.low),
      caption: caption,
      fileName: data.title + '.mp4',
      mimetype: "video/mp4",
      contextInfo: {
        externalAdReply: {
          title: `© ${tiny("YT URL VIDEO DOWNLOADER")}`,
          body: data.desc,
          thumbnail: await getBuffer(data.thumb.url),
          showAdAttribution: false,
          mediaType: 2,
          mediaUrl: data.direct_url,
          sourceUrl: data.direct_url,
        }
      }
    }, { quoted: pika })
      .then(() => pika.edit('✅ 𝐃𝐨𝐜𝐮𝐦𝐞𝐧𝐭 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐮𝐬𝐢𝐧𝐠 𝐔𝐑𝐋', key))
      .catch((error) => {
        console.error(error);
        pika.edit('😕 Can\'t download the document, encountering errors...', key);
      });
  }
}
