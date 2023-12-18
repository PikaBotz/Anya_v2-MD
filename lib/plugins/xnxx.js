const { anya } = require('../lib');

anya({
  name: [
    "xnxx"
  ],
  alias: [],
  category: "search",
  desc: "Search premium unlocked pornographical videos directly from xnxx.com web.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (prefix, command, text, anyaV2, pika) => {
require('../../config');
    const { isCaseEnabled } = require('../lib/mongoDB');
    if (!pika.isGroup) return pika.reply(message.group);
    const isEnabled = await isCaseEnabled("nsfw");
    if (!isEnabled.includes(pika.chat)) return pika.reply(message.nsfw);
    if (!text) return pika.reply("*Example :* " + prefix + command + " forehead kiss on pussy.");
    await pika.react("🤤");
    const { get } = require('axios');
    const process = await anyaV2.sendMessage(pika.chat, {
        text: message.wait
        }, {quoted:pika});
    const fetch = await get("https://api.zahwazein.xyz/searching/xnxx?apikey="
                       + global.zApiKey.one
                       + "&query="
                       + text );
    const video = fetch.data;
    console.log(video.result)
    let count = 1;
    let xnxx = `Total *${video.result.length}* results found.\n\n\`\`\`Reply a number to download\`\`\`\n\n`;
       for (let i of video.result) {
            xnxx += `*${count++}.* ${i.title}\n`;
    //        xnxx += `*⏱️ Duration :* _${i.duration}_\n`;
            xnxx += `*🌈 Link :* ${i.url} •\n\n\n`;
          }
       xnxx += `_ID: QA26_\n${footer}`;
   await anyaV2.sendMessage(pika.chat, {
        text: xnxx,
        edit: process.key, });
        });
