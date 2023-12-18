const { anya } = require('../lib');

anya({
  name: [
    "fbdl"
  ],
  alias: [
    "facebookdl"
  ],
  category: "download",
  desc: "Download Facebook video posts in HD.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, anyaV2, pika) => {
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
    pika.edit("✅ Video found!", proceed.key);
    } catch (e) {
    pika.edit(Config.message.error, proceed.key);
  }
});
