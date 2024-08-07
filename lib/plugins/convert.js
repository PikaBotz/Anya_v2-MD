const { exec } = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const Config = require('../../config');
const {
    Sticker,
    createSticker,
    StickerTypes
} = require("wa-sticker-formatter");
const {
    anya,
    UploadFileUgu,
    getRandom
    } = require('../lib');

//༺─────────────────────────────────────

anya({
    name: "toimg",
    alias: ['tophoto', 'photo'],
    react: "🖼️",
    need: "image",
    category: "convert",
    desc: "Convert stickers to images",
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    const quoted = pika.quoted ? pika.quoted : pika;
    const mime = (quoted && quoted.mimetype) ? quoted.mimetype : pika.mtype;
    if (/webp/.test(mime)) {
        const tempDir = path.join(__dirname, '../../.temp');
        const randomName = getRandom(5);
        const stickerPath = path.join(tempDir, `sticker-${randomName}.webp`);
        const outputFilePath = pika.msg.isAnimated
            ? path.join(tempDir, `video-${randomName}.mp4`)
            : path.join(tempDir, `photo-${randomName}.png`);
        const stickerBuffer = await quoted.download();
        try {
            await fs.promises.writeFile(stickerPath, stickerBuffer);
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i ${stickerPath} ${outputFilePath}`, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
            const outputBuffer = await fs.promises.readFile(outputFilePath);
            const messageType = pika.msg.isAnimated ? { video: outputBuffer } : { image: outputBuffer };
            await anyaV2.sendMessage(pika.chat, messageType, { quoted: pika });
            await fs.promises.unlink(stickerPath);
            await fs.promises.unlink(outputFilePath);
        } catch (err) {
            console.error('Error processing toimg:', err);
            pika.reply("_Sorry, there was an error processing your request_");
        }
    } else {
        return pika.reply(`_Huh! Reply a sticker with caption \`${prefix + command}\` darling~_`);
    }
});

//༺─────────────────────────────────────

anya({
    name: "tovideo",
    alias: ['video'],
    react: "🎥",
    need: "image",
    category: "convert",
    desc: "Convert animated stickers to video",
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    const quoted = pika.quoted ? pika.quoted : pika;
    const mime = (quoted && quoted.mimetype) ? quoted.mimetype : pika.mtype;
    console.log(pika);
    if (/webp/.test(mime) && pika.quoted.isAnimated) {
        const tempDir = path.join(__dirname, '../../.temp');
        const randomName = getRandom(5);
        const stickerPath = path.join(tempDir, `sticker-${randomName}.webp`);
        const videoPath = path.join(tempDir, `video-${randomName}.mp4`);
        const stickerBuffer = await quoted.download();
        try {
            await fs.promises.writeFile(stickerPath, stickerBuffer);
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i ${stickerPath} ${videoPath}`, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
            const videoBuffer = await fs.promises.readFile(videoPath);
            await anyaV2.sendMessage(pika.chat, {
                video: videoBuffer
            }, { quoted: pika });
            await fs.promises.unlink(stickerPath);
            await fs.promises.unlink(videoPath);
        } catch (err) {
            console.error('Error processing animated sticker to video:', err);
            pika.reply("_Sorry, there was an error processing your request_");
        }
    } else {
        return pika.reply(`_Huh! Reply an animated sticker with caption \`${prefix + command}\` darling~_`);
    }
});

//༺─────────────────────────────────────

anya({
    name: "togif",
    alias: ['gif'],
    react: "🎥",
    need: "image",
    category: "convert",
    desc: "Convert animated stickers to GIF",
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    const quoted = pika.quoted ? pika.quoted : pika;
    const mime = (quoted && quoted.mimetype) ? quoted.mimetype : pika.mtype;
    if (/webp/.test(mime) && pika.msg.isAnimated) {
        const tempDir = path.join(__dirname, '../../.temp');
        const randomName = getRandom(5);
        const stickerPath = path.join(tempDir, `sticker-${randomName}.webp`);
        const videoPath = path.join(tempDir, `video-${randomName}.mp4`);
        const stickerBuffer = await quoted.download();
        try {
            await fs.promises.writeFile(stickerPath, stickerBuffer);
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i ${stickerPath} ${videoPath}`, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
            const videoBuffer = await fs.promises.readFile(videoPath);
            await anyaV2.sendMessage(pika.chat, {
                video: videoBuffer,
                gifPlayback: true
            }, { quoted: pika });
            await fs.promises.unlink(stickerPath);
            await fs.promises.unlink(videoPath);
        } catch (err) {
            console.error('Error processing animated sticker to video:', err);
            pika.reply("_Sorry, there was an error processing your request_");
        }
    } else {
        return pika.reply(`_Huh! Reply an animated sticker with caption \`${prefix + command}\` darling~_`);
    }
});

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
        if (/image/.test(mime)) {
            const media = await quoted.download();
            const sticker = new Sticker(media, {
                    pack: Config.packname,
                    author: Config.author,
                    type: args.join(" ").includes("--crop" || '-c') ? StickerTypes.CROPPED : StickerTypes.FULL,
                    categories: ["🤩", "🎉"],
                    id: pika.sender.split("@")[0],
                    quality: 75,
                    background: "transparent"
                });
            const buffer = await sticker.toBuffer();
            return await anyaV2.sendMessage(pika.chat, { sticker: buffer }, { quoted: pika });
        } else if (/video/.test(mime)) {
            if ((quoted.msg || pika.quoted).seconds > 11) return pika.reply("_‼️Video length should be between `1-9` seconds!_");
            const media = await quoted.download();
            const sticker = new Sticker(media, {
                    pack: Config.packname,
                    author: Config.author,
                    type: StickerTypes.FULL,
                    categories: ["🤩", "🎉"],
                    id: pika.sender.split("@")[0],
                    quality: 70,
                    background: "transparent"
                });
            const buffer = await sticker.toBuffer();
            return await anyaV2.sendMessage(pika.chat, { sticker: buffer }, { quoted: pika });
        } else return pika.reply("_Tag or reply an image/video with caption `" + prefix + command + "`_");
    }
);
