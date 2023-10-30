exports.cmdName = () => ({
  name: ['video'],
  alias: ['vid','ytv','ytmp4','ytvideo'],
  need: "query",
  category: "download",
  desc: "Search for high quality videos of YouTube by search term."
});

exports.getCommand = async (text, prefix, command, anyaV2, pika) => {
  if (!text) return pika.reply(`Example : ${prefix + command} <your_text_query>`);
  if (text.includes("https://youtube.com/") && text.includes("https://youtu.be/")) return pika.reply(`Use *${prefix}ytv2* to search using links.`);
  await pika.react("🌊");
  const Config = require('../../config');
  const proceed = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
  try {
  const YT = require('../lib/ytdlcore');
  const { tiny, fancy32 } = require('../lib/stylish-font');
  const yts = require("@queenanya/ytsearch");
  const get = await yts(text);
  
  function getRandomNumber() {
  return Math.floor(Math.random() * 11); //~ You can choose how much range should be of search list [random]
  };
  
  const search = get.all[getRandomNumber()];
  const getVideo = await YT.mp4(search.url);
  let videoCaption = `✗──⌈ ${fancy32("YT VIDEO DOWN")} ⌋──✗\n\n`;
       videoCaption += `🎃 *${tiny("Title")}:* ${search.title}\n\n`;
       videoCaption += `🌊 *${tiny("Link")}:* ${search.url}\n\n┬\n`;
       videoCaption += `│❒ *${tiny("Duration")}:* ${search.timestamp} minute\n`;
       videoCaption += `│❒ *${tiny("Views")}:* ${formatNumber(search.views)}\n`;
       videoCaption += `│❒ *${tiny("Uploaded")}:* ${search.ago}\n`;
       //~videoCaption += `│❒ *${tiny("Link")}:* ${search.url}`
       //~videoCaption += `│❒ *${tiny("Desc")}:* ${search.description ? search.description : "no description available"}`;
       videoCaption += `╰────────────────┈✧`;
       videoCaption += `\n\n${Config.footer}`;
    
       try {
       var vidMedia = { url: getVideo.videoUrl };
       } catch {
       var vidMedia = await getBuffer(getVideo.videoUrl);
       };
    
       await anyaV2.sendMessage(pika.chat,{ video: vidMedia, caption: videoCaption }, { quoted: pika });
     pika.edit("✅ 𝚅𝚒𝚍𝚎𝚘 𝚂𝚎𝚊𝚛𝚌𝚑𝚎𝚍!", proceed.key);
    } catch (err) {
     pika.edit(`❌ An Error occurred.\n\n*✨ Tap On This Link To Report Developer.*\n*- wa.me/918811074852?text=Error%20In%20ytv%20command%20${encodeURIComponent(err)}*`, proceed.key);
   }
 }
 
async function getBuffer(url, options) {
const axios = require("axios");
try {
    options = options || {};
    const res = await axios({ method: "get", url, headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1 },
      ...options,
      responseType: 'arraybuffer' });
    return res.data;
  } catch (err) {
    return err;
  }
};

function formatNumber(number) {
  if (number >= 1000000) { return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) { return (number / 1000).toFixed(1) + 'K';
  } else { return number.toString(); }
};
