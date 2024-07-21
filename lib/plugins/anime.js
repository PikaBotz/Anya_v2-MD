const Config = require('../../config');
const axios = require('axios');
const { anya, UI, getBuffer, pickRandom } = require('../lib');

const sexies = [
    {
        name: "waifu",
        react: "❤️",
        desc: "Get anime waifus pictures",
        api: "https://api.waifu.pics/sfw/waifu",
        caption: "A single picture of waifu can destroy your whole laifu ❤️",
        id: "09"
    },
    {
        name: "neko",
        react: "😻",
        desc: "Get anime kitten waifus pictures",
        api: "https://api.waifu.pics/sfw/neko",
        caption: "Here you go nya!! 😼",
        id: "10"
    },
    {
        name: "loli",
        react: "🍭",
        desc: "Get anime lolicon pictures",
        api: "https://api.waifu.pics/sfw/neko",
        caption: "Here's your lolicon 🍭",
        id: "10"
    },
    {
        name: "shinobu",
        react: "🦋",
        desc: "Get anime shinonu pictures",
        api: "https://api.waifu.pics/sfw/shinobu",
        caption: "Ara Ara~ 🦋",
        id: "11"
    },
    {
        name: "gasm",
        react: "🥵",
        desc: "Get anime gasmic pictures",
        api: "https://nekos.life/api/v2/img/gasm",
        caption: "Uffff..!!! 🥵",
        id: "14"
    }
];

sexies.forEach(a => {
    anya({ name: a.name, react: a.react, category: "sfw", description: a.desc, filename: __filename },
        async (anyaV2, pika, { prefix, command }) => {
            const { key } = await pika.keyMsg(Config.message.wait);
            axios.get(a.api)
            .then(async ({data})=> {
                const picture = await getBuffer(data.url);
                const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());
                if (ui.buttons) await anyaV2.sendButtonImage(pika.chat, {
                    image: picture,
                    caption: a.caption,
                    footer: Config.footer,
                    buttons: buttons = [
                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Next ➡️\",\"id\":\"${prefix + command}\"}` },
                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Explore more 🪐\",\"id\":\"${prefix}list anime\"}` }
                    ]
                }, { quoted:pika });
                else await anyaV2.sendMessage(pika.chat, { image: picture, caption: a.caption + "\n\n_Reply 1_\n_ID: QA" + a.id + "_" }, { quoted:pika });
                await pika.deleteMsg(key);
            }).catch(err=> {
                console.error(err);
                return pika.edit("_ERROR: " + err.message, key);
            });
        }
    );
});

//༺─────────────────────────────────────༻

const waifuim = ['waifu2', 'maid', 'marin', 'mori', 'raiden', 'oppai', 'selfies', 'uniform'];
waifuim.forEach(anime => {
    anya({
            name: anime,
            react: "👰🏻",
            category: "anime",
            description: "Get anime 4k waifu pictures",
            filename: __filename
     }, async (anyaV2, pika, { command }) => {
          const {key} = await pika.keyMsg(Config.message.wait);
          let cmd;
          //----------------------
          if (/waifu2/.test(command)) cmd = "waifu";
          if (/marin/.test(command)) cmd = "marin-kitagawa";
          if (/mori/.test(command)) cmd = "mori-calliope";
          if (/raiden/.test(command)) cmd = "raiden-shogun";
          //----------------------
          else cmd = command; console.log(cmd);
          axios.get("https://api.waifu.im/search", { included_tags: cmd, height: '>=2000' })
          .then(response => {
            if (response.status >= 200 && response.status < 300) return response.data;
            else return pika.edit(Config.message.error, key);
          })
          .then(async data => {
            const caption = "A picture of waifu can destroy your whole laifu ❤️";
            const qid = "\n\n_Reply 1_\n_ID: QA22_";
            const picture = await getBuffer(data.images[0].url);
            const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());
            if (ui.buttons) await anyaV2.sendButtonImage(pika.chat, {
                    image: picture,
                    caption: caption,
                    footer: Config.footer,
                    buttons: buttons = [
                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Next ➡️\",\"id\":\"${prefix + command}\"}` },
                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Explore more 🪐\",\"id\":\"${prefix}list anime\"}` }
                    ]
                }, { quoted: pika });
            else await anyaV2.sendMessage(pika.chat, { image: picture, caption: caption + qid }, {quoted:pika})
            await pika.deleteMsg(key);
          })
          .catch(error => {
              console.error(error);
              return pika.edit(Config.message.error, key);
          });  
     });
});

//༺─────────────────────────────────────༻

anya({
            name: "smug",
            react: "😌",
            category: "anime",
            description: "Get satisfaction anime pictures",
            cooldown: 8,
            filename: __filename
      }, async (anyaV2, pika) => {
        try {
            const { key } = await pika.keyMsg(Config.message.wait);
            const response = await axios.get("https://nekos.life/api/v2/img/smug");
            const { url } = response.data;
            let message = {
                caption: "Heyyaa~! 😌\n\n_Reply 1_\n_ID: QA15_"
            };
            //------------------ if the url contains .gif extension then use 'video' else 'image'
            let mediaType = "image";
            if (/.gif|.mp4/.test(url)) {
                mediaType = "video";
                message.gifPlayback = true;
            }
            //------------------
            const media = await getBuffer(url);
            message[mediaType] = media;
            //------------------
            if (ui.buttons) {
                message.footer = Config.footer,
                message.buttons = [
                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Next ➡️\",\"id\":\"${prefix + command}\"}` },
                        { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Explore more 🪐\",\"id\":\"${prefix}list anime\"}` }
                ];
                if (/video/.test(mediaType)) await anyaV2.sendButtonVideo(pika.chat, { media }, { quoted: pika });
                else await anyaV2.sendButtonImage(pika.chat, { media }, { quoted: pika });
            } else await anyaV2.sendMessage(pika.chat, message, { quoted: pika })
            await pika.deleteMsg(key);
        } catch (err) {
            console.error(err);
            return pika.edit("ERROR: " + err.message, key);
        }
    }
);
