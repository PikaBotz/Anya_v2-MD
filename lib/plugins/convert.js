const fs = require('fs/promises');
const Config = require('../../config');
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { anya, UploadFileUgu } = require('../lib');

//༺─────────────────────────────────────

anya({
            name: "tempurl",
            alias: ['templink'],
            react: "🔗",
            need: "media",
            category: "convert",
            desc: "Convert medias into urls for 3 hours",
            cooldown: 10,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
          const quoted = pika.quoted ? pika.quoted : pika;
          const mime = (quoted && quoted.mimetype) ? quoted.mimetype : pika.mtype;
          if (/image/.test(mime)) {
            const {key} = await pika.keyMsg(Config.message.wait);
            const media = await quoted.download(); 
            const path = `./.temp/${pika.sender.split('@')[0] + Math.random().toString(36).substr(2, 5)}.jpg`;        
            await fs.writeFile(path, media);
            const response = await UploadFileUgu(path);
            await pika.reply(`*⏳ Url Is Only Valid For 3 hrs*\n\n❒ Filename : ${response.filename}\n❒ Size : ${(response.size / 1000000).toFixed(2)}MB\n❒ Url : ${response.url}`, key);
          } else if (/video/.test(mime)) {
            const {key} = await pika.keyMsg(Config.message.wait);
            const media = await quoted.download(); 
            const path = `./.temp/${pika.sender.split('@')[0] + Math.random().toString(36).substr(2, 5)}.mp4`;        
            await fs.writeFile(path, media);
            const response = await UploadFileUgu(path)
            pika.edit(`*⏳ Url Is Only Valid For 3 hrs*\n\n❒ Filename : ${response.filename}\n❒ Size : ${(response.size / 1000000).toFixed(2)}MB\n❒ Url : ${response.url}`, key);
          } else pika.reply(`Tag or reply a image/video with caption *${prefix + command}*`);
     }
)

//༺─────────────────────────────────────

anya({
        name: "sticker",
        alias: ['stick', 's'],
        react: "❤️",
        need: "media",
        category: "convert",
        desc: "Create stickers",
        filename: __filename
    }, async (anyaV2, pika, { args, prefix, command }) => {
        const quoted = pika.quoted ? pika.quoted : pika;
        const mime = (quoted && quoted.mimetype) ? quoted.mimetype : pika.mtype;
        if (/image|video/.test(mime)) {
            const media = await quoted.download();
            const sticker = new Sticker(media, {
                    pack: Config.packname,
                    author: Config.author,
                    type: args.join(" ").includes("--crop" || '-c') ? StickerTypes.CROPPED : StickerTypes.FULL,
                    categories: ["🤩", "🎉"],
                    id: pika.sender.split("@")[0],
                    quality: 100,
                    background: "transparent"
                });
            const buffer = await sticker.toBuffer();
            return await anyaV2.sendMessage(pika.chat, { sticker: buffer }, { quoted: pika });
        } return pika.reply("_Tag or reply an image/video with caption `" + prefix + command + "`_");
    }
)
