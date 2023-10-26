exports.cmdName = () => ({
  name: ['fbdl'],
  alias: ['facebookdl'],
  category: "download",
  desc: "Download Facebook video posts in HD."
});

exports.getCommand = async (text, anyaV2, pika) => {
 const Config = require('../../config');
  try {
    if (!text) return pika.reply("Please give me a Facebook video url.");
    if (!text.includes("facebook.com/")) return pika.reply("Please enter a valid Facebook video link!");
    await pika.react("↙️");
    const proceed = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
    const result = await facebookDl(text, pika, proceed);
    if (!result) return;
    anyaV2.sendMessage(pika.chat, {
      video: { url: result.videoUrl },
      caption: `*🎀 Title :* ${result.title}\n\n${Config.footer}`
    }, { quoted: pika });
    pika.delete(proceed.key);
    } catch (e) {
    pika.edit(Config.message.error, proceed.key);
  }
};

async function facebookDl(url, pika, proceed) {
const { post } = require('axios');
const { load } = require('cheerio');
const FormData = require('form-data');
try {
    const formData = `id=${encodeURIComponent(url)}&locale=en`;
    const { data } = await post('https://getmyfb.com/process', formData, {
      headers: {
        accept: '*/*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'hx-current-url': 'https://getmyfb.com/',
        'hx-request': 'true',
        'hx-target': 'target',
        'hx-trigger': 'form',
        pragma: 'no-cache',
        Referer: 'https://getmyfb.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    });
    const $ = load(data);
    const title = $('.results-item-text')
      .text()
      .replace(/\s{2,}/g, '')
      .replace(/[\t\n]/g, '');
    const urls = [];
    $('.results-download > ul > li').each((i, e) => {
      const type = $(e).find('a').attr('download');
      const url = $(e).find('a').attr('href');
      if (/hd/i.test(type)) {
        urls.push({ quality: 'HD', url });
      } else if (/sd/i.test(type)) {
        urls.push({ quality: 'SD', url });
      }
    });
    if (urls.length === 0) {
    pika.edit('❌ No download links found, check your url again.', proceed.key);
    return false;
    };
    const hdUrl = urls.find(u => u.quality === 'HD');
    const videoUrl = hdUrl ? hdUrl.url : urls[0].url;
    return { title, videoUrl };
  } catch (e) {
    pika.edit("❌ Error getting Facebook video! Try again.");
    return false;
  };
};
