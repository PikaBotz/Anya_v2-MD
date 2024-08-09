const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const Config = require('../../config');
const {
    anya,
    UploadFileUgu,
//    stickerToVideo,
    getRandom,
    toAudio
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
        if (pika.msg.isAnimated) return pika.reply("_❗Please use a non-animated sticker, darling~_");
        const tempDir = path.join(__dirname, '../../.temp');
        const randomName = getRandom(5);
        const stickerPath = path.join(tempDir, `sticker-${randomName}.webp`);
        const outputFilePath = path.join(tempDir, `photo-${randomName}.png`);
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
            await anyaV2.sendMessage(pika.chat, { image: outputBuffer }, { quoted: pika });
            await fs.promises.unlink(stickerPath);
            await fs.promises.unlink(outputFilePath);
        } catch (err) {
            console.error('Error processing toimg:', err);
            pika.reply("_Sorry, there was an error processing your request_");
        }
    } else {
        return pika.reply(`_Huh❗ Reply a sticker with caption \`${prefix + command}\` darling~_`);
    }
});

/*
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
    const quoted = pika.quoted || pika;
    const mime = quoted.mimetype || pika.mtype;
    if (/webp/.test(mime) && pika.quoted.isAnimated) {
        try {
            const stickerBuffer = await quoted.download();
            const response = await stickerToVideo(stickerBuffer);
            await anyaV2.sendMessage(pika.chat, {
                video: response
            }, { quoted: pika });
            fs.unlink(webpFilePath);
        } catch (err) {
            console.error('Error processing animated sticker to video:', err);
            pika.reply("_Sorry, there was an error processing your request_");
        }
    } else {
        return pika.reply(`_Huh❗ Reply an animated sticker with caption \`${prefix + command}\` darling~_`);
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
*/

//༺─────────────────────────────────────

anya(
    {
        name: "toaud",
        alias: ['mp3', 'tomp3'],
        react: "🔊",
        need: "audio/video",
        category: "convert",
        desc: "Convert videos or whatsapp PTT audios into mp3",
        filename: __filename
    },
    async (anyaV2, pika, { prefix, command }) => {
        if (!pika.quoted) return pika.reply("_❗Tag a video or vn_");
        const quoted = pika.quoted ? pika.quoted : pika;
        const mime = (quoted && quoted.mimetype) ? quoted.mimetype : pika.mtype;
        console.log(mime);
        if (/audio/.test(mime)) {
            const buffer = await quoted.download();
            return await anyaV2.sendMessage(pika.chat, {
                audio: buffer,
                mimetype: 'audio/mp4',
                ptt: false
            }, { quoted: pika });
        } else if (/video/.test(mime)) {
            const { key } = await pika.keyMsg(Config.message.wait);
            const video = await quoted.download();
            const buffer = await toAudio(video, "mp4");
            return await anyaV2.sendMessage(pika.chat, {
                audio: buffer,
                mimetype: 'audio/mp4',
                ptt: false
            }, { quoted: pika })
            .then(()=> pika.edit("> ✅ Conversion Done!", key));
        } else return pika.reply("❌Invalid media!");
    }
)

//༺─────────────────────────────────────

anya(
    {
        name: "vv",
        alias: ['onceview', 'retrive'],
        react: "🔂",
        need: "onceview",
        category: "convert",
        desc: "Convert view once messages into standard media",
        filename: __filename
    },
    async (anyaV2, pika, { prefix, command }) => {
        const quoted = pika.quoted;
        if (!quoted || !quoted.message) return pika.reply(`_Tag a once view message with the caption \`${prefix + command}\`_`);
        const isOnceView = quoted.message.imageMessage || quoted.message.videoMessage;
        if (!isOnceView) return pika.reply("_It's not a once view message baka ❗_");      
        const { key } = await pika.keyMsg(Config.message.wait);
        const type = quoted.message.imageMessage ? "image" : "video";
        const extension = type === "image" ? ".jpg" : ".mp4";
        const buffer = await anyaV2.downloadAndSaveMediaMessage(quoted.message[type + "Message"], getRandom(8) + extension, false);
        const caption = quoted.message[type + "Message"]?.caption;
        const message = { 
            [type]: { url: buffer }, 
            ...(caption && { caption: `*Message Senpai:*\n${caption}` })
        };        
        await anyaV2.sendMessage(pika.chat, message, { quoted: pika });
        await pika.deleteMsg(key);
        fs.promises.unlink(buffer);
    }
);

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
    if (/image/.test(mime) || /video/.test(mime)) {
        const { key } = await pika.keyMsg(Config.message.wait);
        const media = await quoted.download();
        const extension = /image/.test(mime) ? '.jpg' : '.mp4';
        const path = `./.temp/${pika.sender.split('@')[0] + Math.random().toString(36).substr(2, 5)}${extension}`;
        try {
            await fs.promises.writeFile(path, media);
            const response = await UploadFileUgu(path);
            const message = `\`⏳ Url Is Only Valid For 3 hrs\`\n\n❒ Filename : ${response.filename}\n❒ Size : ${(response.size / 1000000).toFixed(2)}MB\n❒ Url : ${response.url}`;
            pika.edit(message, key);
            await fs.promises.unlink(path);
        } catch (err) {
            console.error('Error processing tempurl:', err);
            pika.edit("_Sorry, there was an error processing your request_", key);
        }
    } else {
        pika.reply(`Tag or reply to an image/video with caption *${prefix + command}*`);
    }
});

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
            return await anyaV2.sendImageAsSticker(pika.chat, media, pika, { packname: Config.packname, author: Config.author });
        } else if (/video/.test(mime)) {
            if ((quoted.msg || pika.quoted).seconds > 11) return pika.reply("_‼️Video length should be between `1-9` seconds!_");
            const media = await quoted.download();
            return await anyaV2.sendVideoAsSticker(pika.chat, media, pika, { packname: Config.packname, author: Config.author });
        } else return pika.reply("_Tag or reply an image/video with caption `" + prefix + command + "`_");
    }
);
