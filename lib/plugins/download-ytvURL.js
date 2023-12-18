const { anya } = require('../lib');

anya({
  name: [
    "video2"
  ],
  alias: [
    "vid2",
    "ytv2",
    "ytmp42",
    "ytvideo2"
  ],
  category: "download",
  need: "url",
  react: "🍃",
  desc: "Search for high quality videos of YouTube by video url.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (args, text, prefix, command, pika, anyaV2) => {
    if (!text) return pika.reply(`*EXAMPLE:* ${prefix + command} https://youtu.be/nQRy96da2jw?si=rhSE4DZw2P_jgkMu`);
    const YouTube = require('../lib/ytdl-core.js');
    if (!YouTube.isYouTubeUrl(text)) return pika.reply('Enter a valid YouTube URL 🔗');
    const Config = require('../../config');
    const { stylish, myfunc } = require('../lib');
    const vidQ = (args[0] && args[0].includes('@') ? args[0].split('@')[1] : '360') || '360';
    const vidU = (args[1] && args[1].includes('@') ? args[1].split('@')[1] : args[0]) || args[0];
    const data = await YouTube.getVidUrl(text);
    if (args[0] && !args[1] && !args[0].includes('@')) {
    const qualities = [];
    if (data.videoQuality.high) qualities.push('720p', '720p | document');
    if (data.videoQuality.low) qualities.push('360p', '360p | document');
    let i = 0;
    let caption = `
⌈ 🎃 Choose Quality 🎃 ⌋\n
*🌊 Url:* ${vidU}\n
✨ *_REPLY A NUMBER TO CHOOSE:_*\n
*╭─┈⟡*
`;
   for (const quality of qualities) {
     i++;
     caption += `*├❒ ${i}:* ${quality}\n`;
   }
    caption += `*╰─┈⟡*\n\n_ID: QA31_`;
    return anyaV2.sendMessage(pika.chat, {
      text: caption,
      contextInfo: { 
        externalAdReply: {
          title: `© ${stylish.tiny("YT URL VIDEO DOWNLOADER")}`,
          body: data.description,
          thumbnail: Config.image_2
        }
      }
    }, { quoted: pika });
  }
  const { key } = await anyaV2.sendMessage(pika.chat, { text: `_🧐 Getting your ${vidQ.split('|')[0]} ${(vidQ.split('|')[1] === 'document') ? 'document' : 'video'}!_` }, { quoted: pika });
  (vidQ.split('|')[1] === 'document') ? sendDocument() : sendVideo();

  /**
   * Sends a video with the provided caption.
   * @async
   * @function sendVideo
   * @returns {Promise<void>}
   */
  async function sendVideo() {
    const caption = `
✶⊶⊷⊶⊷❍ Y T - U R L ❍⊶⊷⊶⊷✶\n
🎃 *${stylish.tiny("Title")}:* ${data.title}\n
🌊 *${stylish.tiny("Link")}:* ${data.direct_url}\n
│❒ *${stylish.tiny("Channel")}:* ${data.channel}
│❒ *${stylish.tiny("Duration")}:* ${data.duration}
│❒ *${stylish.tiny("Quality")}:* ${data.videoQuality.high ? '720p' : '360p'}
│❒ *${stylish.tiny("Views")}:* ${data.views}
│❒ *${stylish.tiny("Upload")}:* ${data.date}
╰────────────────┈✧
`;
  anyaV2.sendMessage(pika.chat, { video: await myfunc.getBuffer((vidQ.split('|')[0] === '720') ? data.videoQuality.high : data.videoQuality.low), caption: caption }, { quoted: pika })
      .then(() => pika.edit('✅ 𝐕𝐢𝐝𝐞𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐮𝐬𝐢𝐧𝐠 𝐔𝐑𝐋', key))
      .catch((error) => {
        console.error(error);
        pika.edit('😕 Can\'t download the video, encountering errors...', key);
      });
    }
  
  /**
   * Sends a document with the specified caption, file name, mimetype, and context info.
   * @async
   * @function sendDocument
   * @returns {Promise<void>}
   */
  async function sendDocument() {
      const caption = `
✶⊶⊷⊶❍ Y T - U R L ❍⊷⊶⊷✶\n
🌊 *${stylish.tiny("Link")}:* ${data.direct_url}\n
│❒ *${stylish.tiny("Channel")}:* ${data.channel}
│❒ *${stylish.tiny("Duration")}:* ${data.duration}
│❒ *${stylish.tiny("Quality")}:* ${data.videoQuality.high ? '720p' : '360p'}
│❒ *${stylish.tiny("Views")}:* ${data.views}
│❒ *${stylish.tiny("Upload")}:* ${data.date}
╰────────────────┈✧
`;
anyaV2.sendMessage(pika.chat, {
  document: await myfunc.getBuffer((vidQ.split('|')[0] === '720') ? data.videoQuality.high : data.videoQuality.low),
  caption: caption,
  fileName: data.title + '.mp4',
  mimetype: "video/mp4",
  contextInfo: {
    externalAdReply: {
      title: `© ${stylish.tiny("YT URL VIDEO DOWNLOADER")}`,
      body: data.description,
      thumbnail: await myfunc.getBuffer(data.thumb.url),
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
  });}
  });
