//const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const Config = require('../../config');
const {
    anya,
    UploadFileUgu,
    getRandom,
    getBuffer
} = require('../lib');

//༺─────────────────────────────────────

anya(
    {
        name: "meme",
        alias: ['memegen'],
        react: "😂",
        need: "image",
        category: "maker",
        cooldown: 10,
        desc: "Make meme using an image and text",
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
        const buffer = await getBuffer("https://api.memegen.link/images/custom/-/" + encodeURIComponent(args.join(" ")) + ".png?background=" + response.url);
        await anyaV2.sendMessage(pika.chat, {
          image: buffer,
          caption: "Here's your meme!\n\n> " + Config.footer
        }, { quoted:pika });
        pika.edit("> ✅ Created!", key);
        fs.promises.unlink(imagePath);
    }
)
