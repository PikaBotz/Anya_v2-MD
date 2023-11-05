exports.cmdName = () => ({
  name: ['ytv2','ytshort'],
  alias: ['ytvideo2', 'ytvid2', 'ytshorts', 'ytstatus'],
  need: "url",
  react: "🌊",
  category: "download",
  desc: "Download high quality YouTube video/status using video url."
 });

exports.getCommand = async (text, args, prefix, command, anyaV2, pika) => {
  if (!text) return pika.reply(`Example : ${prefix + command} <your_url_query>`);
  const YT = require('../lib/ytdlcore');
  if (!YT.isYTUrl(text)) return pika.reply("🚫 This isn't a YouTube video URL.");  
  const Config = require('../../config');
  const proceed = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
  const vidQuality = (args[0] && args[0].includes('@') ? args[0].split('@')[1] : '360') || '360';
  const vidUrl = (args[1] && args[1].includes('@') ? args[1].split('@')[1] : text) || text;
  const { fancy32, fancy10, tiny } = require("../lib/stylish-font");
  if (args[0] && !args[1] && !args[0].includes('@')) {
    const quality = await YT.getAvailableQualityOptions(vidUrl, "video");
    let count = 1;
    let qual = `⌈ 🎃 Choose Quality 🎃 ⌋\n\n*🌊 Url:* ${vidUrl}\n\n✨ *_REPLY A NUMBER TO CHOOSE:_*\n\n*╭─┈⟡*\n`;    
    for (let yt of quality) {
      qual += `*├❒ ${count++}:* ${yt}\n`;
    };
    qual += `*╰──────┈✧*\n\n_ID: QA31_`;
    pika.edit(qual, proceed.key);
    return;
  }

  try {
    const getVideo = await YT.mp4(vidUrl, vidQuality);
    let videoCaption = `✗──⌈ ${fancy32("URL VIDEO DOWN")} ⌋──✗\n\n`;
    videoCaption += `🎃 *${tiny("Title")}:* ${getVideo.title}\n\n`;
    videoCaption += `🌊 *${tiny("Link")}:* ${vidUrl}\n\n┬\n`;
    videoCaption += `│❒ *${tiny("Duration")}:* ${getVideo.duration} minutes\n`;
    videoCaption += `│❒ *${tiny("Quality")}:* ${getVideo.quality}\n`;
    videoCaption += `│❒ *${tiny("Uploaded")}:* ${formatDateAgo(getVideo.date)}\n`;
    videoCaption += `╰────────────────┈✧`;
    videoCaption += `\n\n${Config.footer}`;
    let vidMedia;
    let imgThumb;
    try {
      vidMedia = { url: getVideo.requestedQuality };
    } catch (error) {
      vidMedia = await getBuffer(getVideo.requestedQuality);
    }
    if (!getVideo.requestedQuality) return pika.edit("❌ There's a problem in this plugin or video, please contact developer.", proceed.key);
  getVideo.document
  ? await sendDoc(pika, anyaV2, videoCaption, vidMedia, getVideo, vidUrl, fancy10, proceed)
  : await sendVid(pika, anyaV2, videoCaption, vidMedia, proceed);
  } catch (err) {
    console.error(err);
    pika.edit(`❌ An Error occurred.\n\n*✨ Tap On This Link To Report Developer.*\n*- wa.me/918811074852?text=Error%20In%20ytv%20command%20${encodeURIComponent(err)}*`, proceed.key);
  }
};


async function getBuffer(url, options) {
const axios = require("axios");
  try {
    options = options || {};
    const res = await axios({ method: "get", url, headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1 }, ...options, responseType: 'arraybuffer' });
    return res.data;
  } catch (err) {
    return err;
  }
}

function formatDateAgo(dateString) {
  const currentDate = new Date();
  const targetDate = new Date(dateString);
  const timeDiff = currentDate - targetDate;
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  if (years > 0) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }
};

async function sendVid(pika, anyaV2, videoCaption, vidMedia, proceed) {
  await anyaV2.sendMessage(pika.chat, { video: vidMedia, caption: videoCaption }, { quoted: pika });
  pika.delete(proceed.key);
//  pika.edit("✅ 𝚅𝚒𝚍𝚎𝚘 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚍!", proceed.key);
}

async function sendDoc(pika, anyaV2, videoCaption, vidMedia, getVideo, vidUrl, fancy10, proceed) {
  await anyaV2.sendMessage(pika.chat, {
    caption: videoCaption,
    document: vidMedia,
    fileName: fancy10("TAP HERE") + ".mp4",
    mimetype: "video/mp4",
    contextInfo: {
      externalAdReply: {
        title: `© ${fancy10("YT URL VIDEO DOWNLOADER")}`,
        body: getVideo.description,
        thumbnail: await getBuffer(getVideo.thumb.url),
        showAdAttribution: false,
        mediaType: 2,
        mediaUrl: vidUrl,
        sourceUrl: vidUrl,
      },
    },
  }, { quoted: pika });
  pika.delete(proceed.key);
//  pika.edit("✅ 𝙳𝚘𝚌𝚞𝚖𝚎𝚗𝚝 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚍!", proceed.key);
}
