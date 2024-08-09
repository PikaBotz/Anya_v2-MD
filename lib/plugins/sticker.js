const axios = require('axios');
const {
    anya,
    pickRandom
} = require('../lib');

//༺─────────────────────────────────────

anya(
  {
    name: "quotely",
    alias: ['quotly', 'q'],
    react: "💬",
    need: "text",
    category: "sticker",
    desc: "Make message command stickers",
    filename: __filename
  },
  async (anyaV2, pika, { args }) => {
    if (args.length < 1) return pika.reply("_❗Enter a text!_");
    const text = args.join(" ");
    const pfp = await anyaV2.profilePictureUrl(pika.sender) || "https://i.ibb.co/tHbNPQL/images.jpg";
    const username = pika.pushName || Config.botname;
    const background = pickRandom(["#FFFFFF", "#000000"]);
    const body = {
      type: "quote",
      format: "png",
      backgroundColor: background,
      width: 512,
      height: 512,
      scale: 3,
      messages: [{
        avatar: true,
        from: {
          first_name: username,
          language_code: "en",
          name: username,
          photo: {
            url: pfp
          }
        },
        text: text,
        replyMessage: {}
      }]
    };
    const { data } = await axios.post("https://bot.lyo.su/quote/generate", body);
    const image = Buffer.alloc(data.result.image.length, data.result.image, "base64");
    return await anyaV2.sendImageAsSticker(pika.chat, image, pika, { packname: Config.packname, author: Config.author });
  }   
)
