const Config = require('../../config');
const axios = require('axios');
const { anya, getBuffer, pickRandom } = require('../lib');

//༺─────────────────────────────────────༻

anya({
            name: "waifu",
            react: "😍",
            category: "anime",
            description: "Get anime sexy waifus pictures",
            filename: __filename
     },
     async (anyaV2, pika) => {
        const {key} = await pika.keyMsg(Config.message.wait);
        axios.get("https://api.waifu.pics/sfw/waifu")
        .then(async response=> {
            await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(response.data.url),
                caption: "A picture of waifu can destroy your whole laifu ❤️\n\n_Reply 1_\n_ID: QA09_"
            },
            {
                quoted:pika
            }).then(()=> pika.deleteMsg(key));
        }).catch(err=> {
            console.error(err);
            pika.edit(Config.message.error, key);
        });
     }
)

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
               return await anyaV2.sendMessage(pika.chat, {
                        image: await getBuffer(data.images[0].url),
                        caption: "A picture of waifu can destroy your whole laifu ❤️\n\n_Reply 1_\n_ID: QA22_"
               }, {quoted:pika})
               .then(()=> pika.deleteMsg(key));
          })
          .catch(error => {
              console.error(error);
              return pika.edit(Config.message.error, key);
          });  
     });
});

//༺─────────────────────────────────────༻

anya({
            name: "neko",
            react: "😍",
            category: "anime",
            description: "Get kitty anime waifu pictures",
            cooldown: 8,
            filename: __filename
     },
     async (anyaV2, pika) => {
        const {key} = await pika.keyMsg(Config.message.wait);
        axios.get("https://api.waifu.pics/sfw/neko")
        .then(async response=> {
            await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(response.data.url),
                caption: "Here you go nya!! 😼\n\n_Reply 1_\n_ID: QA10_"
            },
            {
                quoted:pika
            }).then(()=> pika.deleteMsg(key));
        }).catch(err=> {
            console.error(err);
            pika.edit(Config.message.error, key);
        });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "loli",
            react: "💃🏻",
            category: "anime",
            description: "Get loli anime waifu pictures",
            cooldown: 8,
            filename: __filename
     },
     async (anyaV2, pika) => {
        const {key} = await pika.keyMsg(Config.message.wait);
        axios.get("https://api.waifu.pics/sfw/neko")
        .then(async response=> {
            await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(response.data.url),
                caption: "Here you go nya!! 😼\n\n_Reply 1_\n_ID: QA10_"
            },
            {
                quoted:pika
            }).then(()=> pika.deleteMsg(key));
        }).catch(err=> {
            console.error(err);
            pika.edit(Config.message.error, key);
        });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "shinobu",
            react: "🦋",
            category: "anime",
            description: "Get shinobu pictures",
            cooldown: 8,
            filename: __filename
     },
     async (anyaV2, pika) => {
        const {key} = await pika.keyMsg(Config.message.wait);
        axios.get("https://api.waifu.pics/sfw/shinobu")
        .then(async response=> {
            await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(response.data.url),
                caption: "Ara Ara Sayonara~🦋\n\n_Reply 1_\n_ID: QA11_"
            },
            {
                quoted:pika
            }).then(()=> pika.deleteMsg(key));
        }).catch(err=> {
            console.error(err);
            pika.edit(Config.message.error, key);
        });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "gasm",
            react: "🥵",
            category: "anime",
            description: "Get gasmic anime pictures",
            cooldown: 8,
            filename: __filename
     },
     async (anyaV2, pika) => {
        const {key} = await pika.keyMsg(Config.message.wait);
        axios.get("https://nekos.life/api/v2/img/gasm")
        .then(async response=> {
            await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(response.data.url),
                caption: "Here You Go!\n\n_Reply 1_\n_ID: QA14_"
            },
            {
                quoted:pika
            }).then(()=> pika.deleteMsg(key));
        }).catch(err=> {
            console.error(err);
            pika.edit(Config.message.error, key);
        });
     }
)

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
            await anyaV2.sendMessage(pika.chat, message, { quoted: pika })
            .then(()=> pika.deleteMsg(key));
        } catch (err) {
            console.error(err);
            pika.edit(Config.message.error, key);
        }
    }
);