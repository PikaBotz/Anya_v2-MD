const Config = require('../../config');
const axios = require('axios');
const { anya, getBuffer, formatNumber, formatRuntime, formatDate, Group, pikaApi, hentaivid, pickRandom } = require('../lib');

//༺─────────────────────────────────────༻

anya({
            name: "hwaifu",
            react: "🤤",
            category: "nsfw",
            description: "Anime waifu Hentai pictures",
            rule: 5,
            cooldown: 8,
            filename: __filename
     },
     async (anyaV2, pika) => {
        const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
        if (!group.nsfw) return pika.reply(Config.message.nsfw);
        const {key} = await pika.keyMsg(Config.message.wait);
        axios.get("https://waifu.pics/api/nsfw/waifu")
        .then(async response=> {
            await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(response.data.url),
                caption: "Here You Go! ❤️\n\n_Reply 1_\n_ID: QA13_"
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
            name: "hneko",
            react: "🤤",
            category: "nsfw",
            description: "Cat girl Hentai pictures",
            rule: 5,
            cooldown: 8,
            filename: __filename
     },
     async (anyaV2, pika) => {
        const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
        if (!group.nsfw) return pika.reply(Config.message.nsfw);
        const {key} = await pika.keyMsg(Config.message.wait);
        axios.get("https://waifu.pics/api/nsfw/neko")
        .then(async response=> {
            await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(response.data.url),
                caption: "Here You Go! Nya~ 🤤\n\n_Reply 1_\n_ID: QA12_"
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
        name: "xnxx",
        react: "🤧",
        need: "query",
        category: "nsfw",
        desc: "Search videos from www.xnxx.com website",
        rule: 5,
        cooldown: 10,
        filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
        if (!group.nsfw) return pika.reply(Config.message.nsfw);
        if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* ${prefix + command} MILF`);
        if (/www.xnxx.com/.test(args.join(" "))) return pika.reply(`If you want video using url, type *${prefix}xnxxdl <url>*`);
        pikaApi.get("api", "xnxx", `q=${encodeURIComponent(args.join(" "))}`)
        .then(async response=> {
            const {results} = response;
            if (results.length < 1) return pika.reply('❎ No results found');
            let c = 1;
            let caption = `⌬---⌈ 𝗔𝗻𝘆𝗮 𝗫𝗡𝗫𝗫 𝗘𝗻𝗴𝗶𝗻𝗲 ⌋---⌬\n\n⌦ _Reply a number to get video_\n⌦ _Example: 2_\n\n`;
            for (const i of results) {
                if (c > 24) break;
                caption += `*🍁 ${c++}. ${i.title}*\n_🔗 ${i.link}_\n\n`;
            }
            caption += `_ID: QA07_\n\n${Config.footer}`;
            pika.reply(caption);
        })
     }
)

//༺─────────────────────────────────────༻

anya({
        name: "xnxxdl",
        alias: ['xnxxvid'],
        react: "↙️",
        need: "url",
        category: "nsfw",
        desc: "Download videos from www.xnxx.com website using url",
        rule: 5,
        cooldown: 30,
        filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
        if (!group.nsfw) return pika.reply(Config.message.nsfw);
        if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* ${prefix + command} https://www.xnxx.com/video-v5xov9e/video_do_casal_10`);
        if (!/www.xnxx.com/.test(args[0])) return pika.reply(`Invalid url, type *${prefix}xnxx <query>* to search`);
        const {key} = await pika.keyMsg("𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙𝙞𝙣𝙜...");
        pikaApi.get("api", "xnxxdl", `url=${encodeURIComponent(args[0])}`)
        .then(async response=> {
            const {results} = response;
            if (!results) return pika.edit("❎ No results found", key);
            if (Number(results.duration) > 2700) return pika.edit("❎ The video size is more than 45 minutes, it could crash the bot!", key);
            await anyaV2.sendMessage(pika.chat, {
                    video: await getBuffer(results.url_dl.high),
                    caption: `
╔──── ¤ ◎🇽 🇳 🇽 🇽◎ ¤ ────╗
╨
❃ *Title: ${results.title}*
❃ *Url:* _${args[0]}_
╥
║➥ *Duration:* ${formatRuntime(results.duration)}
║➥ *Quality:* ${results.quality}
║➥ *Views:* ${formatNumber(results.views)}
║➥ *Likes:* ${formatNumber(results.likes)}
║➥ *Dislikes:* ${formatNumber(results.dislikes)}
║➥ *Upload:* ${formatDate(results.date).date}
╚═══════════════════▢▢

${Config.footer}
`.trim(),
                    }, {
                        quoted: pika
                    })
                    .then(()=> pika.deleteMsg(key))
                    .catch(err=> {
                        console.error(err);
                        pika.edit(Config.message.error, key);
                 });
        })
     }
)

//༺─────────────────────────────────────༻

anya({
        name: "xvid",
        alias: ['xvideo', 'xvideos'],
        react: "✖️",
        category: "nsfw",
        need: "query",
        desc: "Search videos from www.xvideos.com website",
        rule: 5,
        cooldown: 15,
        filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
        if (!group.nsfw) return pika.reply(Config.message.nsfw);
        if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* ${prefix + command} Step Sister`);
        if (/www.xvideos.com/.test(args.join(" "))) return pika.reply(`If you want video using url, type *${prefix}xviddl <url>*`);
        pikaApi.get("api", "xvideos", `q=${encodeURIComponent(args.join(" "))}`)
        .then(async response=> {
            const {results} = response;
            if (results.length < 1) return pika.reply('❎ No results found');
            let c = 1;
            let caption = `⌬---⌈ 𝗔𝗻𝘆𝗮 𝗫𝗩𝗜𝗗𝗘𝗢𝗦 𝗘𝗻𝗴𝗶𝗻𝗲 ⌋---⌬\n\n⌦ _Reply a number to get video_\n⌦ _Example: 4_\n\n`;
            for (const i of results) {
                if (c > 24) break;
                caption += `*🍁 ${c++}. ${i.title}*\n_🔗 ${i.url}_\n\n`;
            }
            caption += `_ID: QA08_\n\n${Config.footer}`;
            pika.reply(caption);
        })
     }
)

//༺─────────────────────────────────────༻

anya({
        name: "xviddl",
        alias: ['xvideodl', 'xvideosdl'],
        react: "↘️",
        category: "nsfw",
        need: "url",
        desc: "Download videos from www.xnxx.com website using url",
        rule: 5,
        cooldown: 30,
        filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
        if (!group.nsfw) return pika.reply(Config.message.nsfw);
        if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* ${prefix + command} https://www.xvideos.com/video60017235/my_hot_mom_fucked_`);
        if (!/www.xvideos.com/.test(args[0])) return pika.reply(`Invalid url, type *${prefix}xvid <query>* to search`);
        const {key} = await pika.keyMsg("𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙𝙞𝙣𝙜...");
        pikaApi.get("api", "xvideosdl", `url=${encodeURIComponent(args[0])}`)
        .then(async response=> {
            const {results} = response;
            if (!results) return pika.edit("❎ No results found", key);
            if (results.sizeB > 250000) return pika.edit("❎ The video size is more than 250MB, it could crash the bot!", key);
            let thumbnail;
            const views = parseInt(results.views.replace(/[^\d]/g, '').trim());
            const votes = parseInt(results.vote.replace(/[^\d]/g, '').trim());
            const likes = parseInt(results.likes.replace(/[^\d]/g, '').trim());
            const dislikes = parseInt(results.dislikes.replace(/[^\d]/g, '').trim());
            await anyaV2.sendMessage(pika.chat, {
                    video: await getBuffer(results.url_dl),
                    caption: `
╔──── ¤ ◎🇽 🇻 🇮 🇩◎ ¤ ────╗
╨
❃ *Title: ${results.title}*
❃ *Url:* _${args[0]}_
╥
║👀 *Views:* ${formatNumber(views)} views
║✨ *Votes:* ${formatNumber(votes)}
║👍🏻 *Likes:* ${formatNumber(likes)}
║🫤 *Dislikes:* ${formatNumber(dislikes)}
╚═══════════════════▢▢

${Config.footer}
`.trim(),
                    }, {
                        quoted: pika
                    })
                    .then(()=> pika.deleteMsg(key))
                    .catch(err=> {
                        console.error(err);
                        pika.edit(Config.message.error, key);
                 });
        })
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "hentai",
            alias: ['hentaivid'],
            react: "🥵",
            category: "nsfw",
            desc: "Get Random Hentai Videos",
            rule: 5,
            cooldown: 20,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
            const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
            if (!group.nsfw) return pika.reply(Config.message.nsfw);
            const {key} = await pika.keyMsg(Config.message.wait);
            hentaivid().then(async response=> {
                const res = response[Math.floor(response.length * Math.random())];
                if (res.type !== 'video/mp4') return pika.edit("❎ Invalid Video Type, please try again!");
                return await anyaV2.sendMessage(pika.chat, {
                        video: await getBuffer(res.video_1),
                        caption: `
╭────╼❒ 𝐇𝐄𝐍𝐓𝐀𝐈 𝐕𝐈𝐃 ❒╾───❖
┴
▢ *Title:* ${res.title}
▢ *Category:* ${res.category}
▢ *Views:* ${res.views}
▢ *Shares:* ${res.shares}
▢ *Url:* ${res.link}

${Config.footer}
`.trim(),
                }, {quoted:pika})
                .then(()=> pika.deleteMsg(key));
            })
            .catch(err=> {
                console.error(err);
                pika.edit(Config.message.error, key);
            }
        );
    }
)

//༺─────────────────────────────────────༻

anya({
                name: "loli3",
                category: "nsfw",
                react: "😍",
                desc: "Get lolicon nsfw pictures",
                rule: 5,
                filename: __filename
     }, async (anyaV2, pika, { command }) => {
          const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
          if (!group.nsfw) return pika.reply(Config.message.nsfw);
          const {key} = await pika.keyMsg(Config.message.wait);
          const response = axios.get(`http://api.nekos.fun:8080/api/lewd`);
          return await anyaV2.sendMessage(pika.chat, {
                    image: await getBuffer(response.url),
                    caption: `*Reply 1 for next "${command}"*\n_ID: QA21_`
          }, {quoted:pika})
          .then(()=> pika.deleteMsg(key))
          .catch(err=> {
                console.error(err);
                return pika.edit(Config.message.error, key);
          });
     }
)

//༺─────────────────────────────────────༻

const waifuim = ['ass', 'hentai2', 'milf', 'oral', 'paizuri', 'ecchi', ];
waifuim.forEach(anime => {
    anya({
            name: anime,
            react: "👰🏻",
            category: "anime",
            description: "Get anime 4k hentai waifu pictures",
            filename: __filename
     }, async (anyaV2, pika, { command }) => {
          const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
          if (!group.nsfw) return pika.reply(Config.message.nsfw);
          const {key} = await pika.keyMsg(Config.message.wait);
          let cmd;
          //----------------------
          if (/hentai2/.test(command)) cmd = "hentai";
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
                        caption: `*Reply 1 for next "${cmd}"*\n_ID: QA21_`
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

const nsfw2 = [
    'spreadpussy', 'genshin', 'squirt', 'swimsuit', 'schoolswimsuit',
    'holoLive', 'ass2', 'underwear', 'nipples', 'uncensored', 'sex', 'sex2', 'sex3', 'blonde', 'twintails', 'breasts', 'thighhighs', 'skirt', 'gamecg', 'animalears', 'foxgirl', 'dress', 'schooluniform', 'twogirls', 'gloves', 'vocaloid', 'touhou',
    'weapon', 'withflowers', 'pinkhair', 'cloudview', 'white', 'animal', 'tail', 'nude', 'ponyTail', 'bed', 'whitehair', 'ribbons', 'japaneasecloths', 'hatsunemiku', 'bikini', 'barefoot', 'nobra', 'food', 'wings', 'pantyhouse', 'openshirt', 'headband',
    'penis', 'close', 'wet', 'catgirl', 'wolfgirl', 'loli2', 'spreadlegs', 'bra', 'fateseries', 'tree', 'elbowgloves', 'greenhair', 'horns', 'withpetals', 'drunk', 'headdress', 'tie', 'shorts', 'maid2', 'headphones', 'anusview', 'idol', 'gun', 'stockings',
    'tears', 'breasthold', 'neckplace', 'seethrought', 'bunnyears', 'bunnygirl', 'topless', 'beach', 'erectnipples', 'vampire', 'shirt', 'pantypull', 'torncloths', 'bondage', 'demon', 'bell', 'shirtlift', 'tattoo', 'chain', 'flatchest', 'fingering'
];
nsfw2.forEach(h => {
    anya({
                name: h,
                react: "💦",
                category: "nsfw",
                desc: "High quality hentai pictures",
                cooldown: 8,
                rule: 5,
                filename: __filename
          }, async (anyaV2, pika, { command }) => {
              const group = await Group.findOne({ id: pika.chat.split("@")[0] }) || (await new Group({ id: pika.chat.split("@")[0] }).save());
              if (!group.nsfw) return pika.reply(Config.message.nsfw);
              const {key} = await pika.keyMsg(Config.message.wait);
              let cmd;
              //----------------------
              if (/ass2/.test(command)) cmd = "ass";
//              else if (/cum2/.test(command)) cmd = "cum";
//              else if (/pussy2/.test(command)) cmd = "pussy";
//              else if (/yuri2/.test(command)) cmd = "yuri";
              else if (/maid2/.test(command)) cmd = "maid";
              //----------------------
              else cmd = command;
              axios.get(`https://fantox-apis.vercel.app/${cmd}`)
              .then(async ({data})=> {
                  return await anyaV2.sendMessage(pika.chat, {
                        image: await getBuffer(data.url),
                        caption: `*Reply 1 for next "${cmd}"*\n_ID: QA21_`
                  }, {quoted:pika})
                  .then(()=> pika.deleteMsg(key));
              })
              .catch(err=> {
                console.error(err);
                return pika.edit("❌ Server is busy... try again", key);
              });
          }
    )
});