//const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const Config = require('../../config');
const {
    anya,
    UploadFileUgu,
    getRandom,
    getBuffer,
    remini
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
        const buffer = await getBuffer("https://api.memegen.link/images/custom/-/" + encodeURIComponent(args.length > 0 ? args.join(" ") : pika.quoted.text) + ".png?background=" + response.url);
        await anyaV2.sendMessage(pika.chat, {
          image: buffer,
          caption: "Here's your meme!\n\n> " + Config.footer
        }, { quoted:pika });
        pika.edit("> ✅ Created!", key);
        fs.promises.unlink(imagePath);
    }
)

//༺------------------------------------------------------------------------------------------------

anya(
    {
        name: "remini",
        react: "✨",
        need: "image",
        category: "maker",
        cooldown: 10,
        desc: "Enhance your image",
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command }) => {
        const quoted = pika.quoted ? pika.quoted : pika;
        const mime = (quoted && quoted.mimetype) ? quoted.mimetype : pika.mtype;        
        if (!/image/.test(mime) || /webp/.test(mime)) return pika.reply("_Where's the image❓_");      
        const keyMsg = await pika.keyMsg(Config.message.wait);
        const image = await quoted.download();        
        //const availableFeatures = ['enhance', 'recolor', 'dehaze'];
        //const feature = availableFeatures.includes(args?.[0]) ? args[0] : "enhance";
        remini(image, "enhance")
        .then(async response => {
            (args.length > 0 && args?.[0].toLowerCase() === "--doc")
            ? await anyaV2.sendMessage(pika.chat, {
                document: response,
                caption: "```Here's your image!```",
                mimetype: "image/jpeg",
                fileName: "Anya_v2_remini_" + getRandom(8) + ".jpeg"
            }, { quoted: pika })
            : await anyaV2.sendMessage(pika.chat, {
                image: response,
                caption: "```Here's your image!```\n> Type _" + prefix + command + " --doc_ for document"
                //caption: "```Feature : " + feature + "```\n> Available features : enhance, recolor, dehaze"
            }, { quoted: pika });
            await pika.deleteMsg(keyMsg.key);
        });
    }
);
