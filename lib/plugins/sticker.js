const Config = require('../../config');
const axios = require('axios');
const fs = require('fs');
const {
    anya,
    pickRandom,
    UploadFileUgu,
    ttp,
    getRandom,
    getBuffer
} = require('../lib');

//༺─────────────────────────────────────

anya(
  {
    name: "quotely",
    alias: ['quotly', 'q'],
    react: "💬",
    need: "text",
    category: "sticker",
    cooldown: 8,
    desc: "Make message command stickers",
    filename: __filename
  },
  async (anyaV2, pika, { args }) => {
    if (args.length < 1) return pika.reply("_❗Enter a text!_");
    const text = args.join(" ");
    const pfp = await anyaV2.profilePictureUrl(pika.sender).catch(() => "https://i.ibb.co/tHbNPQL/images.jpg");
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

//༺─────────────────────────────────────

anya(
    {
        name: "smeme",
        alias: ['smemegen'],
        react: "😂",
        need: "image",
        category: "sticker",
        cooldown: 10,
        desc: "Make sticker meme using an image and text",
        filename: __filename
    },
    async (anyaV2, pika, { args }) => {
        if (!args[0] && !pika.quoted?.text) return pika.reply("_❗Reply an image with a caption_");
        const quoted = pika.quoted ? pika.quoted : pika;
        const mime = (quoted && quoted.mimetype) ? quoted.mimetype : pika.mtype;
        if (!/image/.test(mime) || /webp/.test(mime)) return pika.reply("_Where's the image❓_");
        const { key } = await pika.keyMsg(Config.message.wait);
        const imagePath = await anyaV2.downloadAndSaveMediaMessage(quoted, getRandom(8) + ".jpg", false);
        const response = await UploadFileUgu(imagePath);
        const buffer = await getBuffer("https://api.memegen.link/images/custom/-/" + encodeURIComponent(args.length > 0 ? args.join(" ") : pika.quoted.text) + ".png?background=" + response.url);
        await anyaV2.sendImageAsSticker(pika.chat, buffer, pika, { packname: Config.packname, author: Config.author });
        pika.edit("> ✅ Created!", key);
        fs.promises.unlink(imagePath);
    }
)

//༺─────────────────────────────────────

/*anya(
    {
        name: "attp",
        react: "🔤",
        need: "text",
        category: "sticker",
        cooldown: 10,
        desc: "Make colourfull text stickers using texts",
        filename: __filename
    },
    async (anyaV2, pika, { args }) => {
        if (!args[0]) return pika.reply("_Where's the text❓_");
        const buffer = await getBuffer();
        await anyaV2.sendVideoAsSticker(pika.chat, buffer, pika, { packname: Config.packname, author: Config.author });
    }
)*/

//༺─────────────────────────────────────

anya(
    {
        name: "ttp",
        react: "🔤",
        need: "text",
        category: "sticker",
        cooldown: 10,
        desc: "Make text stickers",
        filename: __filename
    },
    async (anyaV2, pika, { args }) => {
        if (!args[0]) return pika.reply("_Where's the text❓_");
        const colours = ["red", "green", "blue", "black", "white"];
        ttp(args.join(" "), pickRandom(colours)) 
        .then(async response=> {
            if (!response?.[0].status || response.length < 1) return pika.reply("_Can't process, try again later._");
            const buffer = await getBuffer(response[0].url);
            await anyaV2.sendVideoAsSticker(pika.chat, buffer, pika, { packname: Config.packname, author: Config.author });
        });
    }
)
