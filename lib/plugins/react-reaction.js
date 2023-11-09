const axios = require("axios");
module.exports = {
  cmdName: () => ({
    name: [
      "awoo", "bonk", "bite", "blush", "cuddle", "cry", "cringe", "dance", "hug", "happy",
      "handhold", "highfive", "glomp", "kiss", "kill", "kick", "lick", "nom", "pat", "ponk",
      "smug", "smile", "slap", "wave", "wink", "yeet",
    ],
    alias: [],
    category: "reaction",
    react: "👻",
    desc: "React with emotion! Use the 'reaction' command to share feelings instantly with fun stickers.",
  }),
  getCommand: async (pika, anyaV2, command) => {
    try {
      const Config = require("../../config");
      const { data } = await axios.get(`https://api.waifu.pics/sfw/${command}`);
      const media = await getBuffer(data.url);
      const { Sticker, StickerTypes } = require("wa-sticker-formatter");
      const sticker = new Sticker(media, {
        pack: Config.packname,
        author: Config.author,
        type: StickerTypes.FULL,
        categories: ["🤩", "🎉"],
        id: "QAVer2",
        quality: 75,
        background: "transparent",
      });
      const buffer = await sticker.toBuffer();
      anyaV2.sendMessage(pika.chat, { sticker: buffer }, { quoted: pika });
    } catch (error) {
      console.error('Error fetching or processing sticker:', error.message);
      pika.reply(Config.message.error);
    }
  },
};

async function getBuffer(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error('Error fetching buffer:', error.message);
    throw error;
  }
};
