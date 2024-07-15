const axios = require('axios');
const Config = require('../../config');
const { anya, tiny, photooxy, pikaApi, getBuffer } = require('../lib');

//༺─────────────────────────────────────༻

const logo = ['pornhublogo', 'marvel', 'joker', 'lion', 'bear', 'avangers', 'retro'];

logo.forEach(style => {
    anya({
        name: style,
        react: "✨",
        need: "text",
        category: "logomaker",
        desc: "Make logo images using texts",
        cooldown: 8,
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`Example: ${prefix + command} Anya`);
        const text = args.join(" ");
        if (!text.split("|")[1]) return pika.reply("2nd text not found!");
        const { key } = await pika.keyMsg("```Making...```");
        pikaApi.get("api", "logo", `style=${command.split("logo")[0]}&text1=${encodeURIComponent(text.split("|")[0])}&text2=${encodeURIComponent(text.split("|")[1])}`)
        .then(async res => {
            if (!res.results) return pika.edit(Config.message.error, key);
            await anyaV2.sendMessage(pika.chat,
                {
                    image: await getBuffer(res.results),
                    caption: tiny("Logo image by " + Config.botname)
                },
                {
                    quoted: pika
                })
                .then(() => pika.deleteMsg(key));
        }).catch((err) => {
            console.error(err);
            pika.edit(Config.message.error, key);
        });
    });
});

//༺─────────────────────────────────────༻

const oxy = [
    'naruto2', 'neonedge', 'smoke', 'heart', 'coffee', 'harrypotter', 'mug', 'mug2',
    'dragon'
];

oxy.forEach(style => {
anya({
            name: style,
            react: "🌟",
            need: "text",
            category: "photooxy",
            desc: "Make banners using texts",
            cooldown: 8,
            filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`Example: ${prefix + command} Layla`);
        const { key } = await pika.keyMsg("```Making...```");
        let url;
        //-----------------------------------
        if (/naruto2/.test(command)) url = "https://photooxy.com/manga-and-anime/make-naruto-banner-online-free-378.html";
        if (/neonedge/.test(command)) url = "https://photooxy.com/logo-and-text-effects/make-smoky-neon-glow-effect-343.html";
        if (/smoke/.test(command)) url = "https://photooxy.com/other-design/create-an-easy-smoke-type-effect-390.html";
        if (/heart/.test(command)) url = "https://photooxy.com/logo-and-text-effects/create-a-picture-of-love-message-377.html";
        if (/coffee/.test(command)) url = "https://photooxy.com/logo-and-text-effects/put-any-text-in-to-coffee-cup-371.html";
        if (/harrypotter2/.test(command)) url = "https://photooxy.com/logo-and-text-effects/create-harry-potter-text-on-horror-background-178.html";
        if (/mug2/.test(command)) url = "https://photooxy.com/logo-and-text-effects/put-text-on-the-cup-387.html";
        if (/mug/.test(command)) url = "https://photooxy.com/logo-and-text-effects/write-text-on-the-cup-392.html";
        if (/dragon/.test(command)) url = "https://photooxy.com/other-design/create-dark-metal-text-with-special-logo-160.html";
        //-----------------------------------
        try {
            const response = await photooxy(url, [args.join(" ")]);
            await anyaV2.sendMessage(pika.chat,
                {
                    image: await getBuffer(response),
                    caption: tiny("PhotoOxy Banner by " + Config.botname)
                },
                {
                    quoted: pika
                })
                .then(() => pika.deleteMsg(key));
        } catch (err) {
            console.error(err);
            pika.edit(Config.message.error, key);
        };
     });
});

//༺─────────────────────────────────────༻

const oxy2 = [
    'pubg'
];

oxy2.forEach(style => {
anya({
            name: style,
            react: "🌟",
            need: "text",
            category: "photooxy",
            desc: "Make banners using texts",
            cooldown: 8,
            filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`Example: ${prefix + command} Layla`);
        const { key } = await pika.keyMsg("```Making...```");
        let url;
        //-----------------------------------
        if (/pubg/.test(command)) url = "https://photooxy.com/manga-and-anime/make-naruto-banner-online-free-378.html";
        //-----------------------------------
        try {
            if (!args.includes("|")) return pika.reply("❎ Invalid format, Exmaple: *word1 | word2*");
            const response = await photooxy(url, [word.split("|")[0], word.split("|")[1]]);
            await anyaV2.sendMessage(pika.chat,
                {
                    image: await getBuffer(response),
                    caption: tiny("PhotoOxy Banner by " + Config.botname)
                },
                {
                    quoted: pika
                })
                .then(() => pika.deleteMsg(key));
        } catch (err) {
            console.error(err);
            pika.edit(Config.message.error, key);
        };
     });
});

//༺─────────────────────────────────────༻

anya({
            name: "blur",
            alias: ['blurimg'],
            react: "💠",
            need: "image",
            category: "imagemaker",
            desc: "Add blur effect in images",
            cooldown: 8,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
          const quoted = pika.quoted ? pika.quoted : '';
          const mime = (quoted && quoted.mimetype) ? quoted.mimetype : '';
          if (/image/.test(mime)) {
              const {key} = await pika.keyMsg(Config.message.wait);
              const media = await quoted.download();
              const Jimp = require('jimp');
              const image = await Jimp.read(media);
              image.blur(10);
              image.color([{ apply: 'saturate', params: [5] }]);
              const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
              await anyaV2.sendMessage(pika.chat, {
                   image: buffer,
                   caption: tiny("Blur Image Made By " + Config.botname)
              }, {quoted:pika})
              .then(()=> pika.deleteMsg(key));
          } else return pika.reply(`Tag or reply an image with caption *${prefix+command}*`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "fullpic",
            alias: ['fullpicture', 'fullimg'],
            react: "🌟",
            need: "image",
            category: "imagemaker",
            desc: "Add white box edge effect in images",
            cooldown: 8,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
          const quoted = pika.quoted ? pika.quoted : '';
          const mime = (quoted && quoted.mimetype) ? quoted.mimetype : '';
          if (/image/.test(mime)) {
              const {key} = await pika.keyMsg(Config.message.wait);
              const media = await quoted.download();
              const Jimp = require('jimp');
              //--------------------------
              const image = await Jimp.read(media);
              const Width = image.getWidth();
              const Height = image.getHeight();
              const x = Math.max(0, (Width - Height) / 2);
              const y = Math.max(0, (Height - Width) / 2);
              const size = Math.min(Width, Height);
              const squareImage = image.clone().crop(x, y, size, size);
              squareImage.blur(15);
              const buffer = await squareImage.getBufferAsync(Jimp.MIME_PNG);
              //--------------------------
              const image2 = await Jimp.read(buffer);
              const Width2 = image2.getWidth();
              const Height2 = image2.getHeight();
              const pasteImage = await Jimp.read(media);
              const zoomFactor = Math.min(Width2 / pasteImage.getWidth(), Height2 / pasteImage.getHeight());
              pasteImage.resize(pasteImage.getWidth() * zoomFactor, Jimp.AUTO);
              const x2 = (Width2 - pasteImage.getWidth()) / 2;
              const y2 = (Height2 - pasteImage.getHeight()) / 2;
              image2.composite(pasteImage, x2, y2);
              const buffer2 = await image2.getBufferAsync(Jimp.MIME_PNG);
              await anyaV2.sendMessage(pika.chat, {
                   image: buffer2,
                   caption: tiny("Full Blurred Edge Image Made By " + Config.botname)
              }, {quoted:pika})
              .then(()=> pika.deleteMsg(key));
          } else return pika.reply(`Tag or reply a image with caption *${prefix+command}*`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "fullpic2",
            alias: ['fullpicture2', 'fullimg2'],
            react: "🪩",
            need: "image",
            category: "imagemaker",
            desc: "Add white box edge effect in images",
            cooldown: 8,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
          const quoted = pika.quoted ? pika.quoted : '';
          const mime = (quoted && quoted.mimetype) ? quoted.mimetype : '';
          if (/image/.test(mime)) {
              const {key} = await pika.keyMsg(Config.message.wait);
              const media = await quoted.download();
              const Jimp = require('jimp');
              const image = await Jimp.read(media);
              if (image.getWidth() === image.getHeight()) return pika.edit("✅ This media is already in a square size.", key);
              const size = Math.max(image.getWidth(), image.getHeight());
              const squareImage = new Jimp(size, size, 0xFFFFFFFF);
              squareImage.composite(image, (size - image.getWidth()) / 2, (size - image.getHeight()) / 2);
              const buffer = await squareImage.getBufferAsync(Jimp.MIME_PNG);
              await anyaV2.sendMessage(pika.chat, {
                   image: buffer,
                   caption: tiny("Full Image Made By " + Config.botname)
              }, {quoted:pika})
              .then(()=> pika.deleteMsg(key));
          } else return pika.reply(`Tag or reply a image with caption *${prefix+command}*`);
     }
)
