const Config = require('../../config');
const axios = require('axios');
const { mediafiredl } = require('@bochilteam/scraper');
const {
    anya,
    pikaApi,
    getBuffer,
    delay,
    PinterestDownloader,
    twitter,
    telesticker,
    ttdl,
    formatDate,
    fancy11,
    isButton,
    writeExifInVid
 } = require('../lib');
let pinterestImageCount = 3; // Should be more than 1

//༺─────────────────────────────────────

anya({
    name: "pinterest",
    alias: ["pint"],
    react: "🍸",
    need: "query",
    category: "download",
    desc: "Search images from Pinterest",
    filename: __filename
},
async (anyaV2, pika, { args }) => {
    if (args.length < 1) return pika.reply("_Enter a query!_");
    const text = args.join(" ");
    if (/^https:\/\/(www\.)?pinterest\.com\/.+/i.test(text)) return pika.reply("_Use `" + prefix + "pinturl <url>` for URLs");
    if (/https:/.test(text)) return pika.reply("_❌ Invalid pinterest url!_");
    const { key } = await pika.keyMsg("```Searching...```");
    try {
        const downloader = new PinterestDownloader();
        downloader.searchPinterest(text)
        .then(async r => {
            if (r.length < 1) return pika.edit("_🅾️No results found!_", key);
            const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());
            if (ui.buttons) {
                const list = [];
                for (const i of r) {
                    list.push(`{\"header\":\"\",\"title\":\"${Config.themeemoji} ${i.grid_title !== "" ? i.grid_title : "No_Title"}\",\"description\":\"Creation Date: ${i.created_at}\",\"id\":\"${prefix}pinturl ${i.pin}\"}`);
                }
                await anyaV2.sendButtonImage(pika.chat, {
                    caption: caption,
                    image: await getBuffer(r[0].images_url),
                    footer: Config.footer,
                    buttons: [{
                        "name": "single_select",
                        "buttonParamsJson": `{\"title\":\"Tap to choose 📌\",\"sections\":[{\"title\":\"Term: ${text}\",\"highlight_label\":\"Pinterest\",\"rows\":[${list.join(",")}]}]}`
                    },
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Script 🔖\",\"id\":\"${prefix}sc\"}`
                    },
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Owner 👤\",\"id\":\"${prefix}owner\"}`
                    }],
                    contextInfo: { mentionedJid: [pika.sender] }
                }, { quoted: pika });
                return pika.edit(Config.message.success, key);
            } else {
                let num = 1;
                for (const i of r) {
                    if (num === pinterestImageCount) return;
                    await anyaV2.sendMessage(pika.chat, {
                        image: await getBuffer(i.images_url),
                        caption: `
*💖 Title:* ${i.grid_title !== "" ? i.grid_title : "No_Title"}
*⛩️ Uploaded On:* ${i.created_at}

> Url: ${i.pin}
> ${Config.footer}
`.trim()
                    }, { quoted:pika });
                    num++
                }
                return pika.edit(Config.message.success, key);
            }
        });
    } catch (err) {
        console.error(err);
        return pika.edit("ERROR!: " + err.message, key);
    }
});

//༺─────────────────────────────────────

anya({
    name: "pinturl",
    alias: ["pinteresturl"],
    react: "🏮",
    need: "url",
    category: "download",
    desc: "Search images from Pinterest using url",
    filename: __filename
},
async (anyaV2, pika, { args }) => {
    if (args.length < 1) return pika.reply("_Enter a pinterest image url!_");
    if (!/^https:\/\/(www\.)?pinterest\.com\/.+/i.test(args[0])) return pika.reply("_Invalid url!_");
    const { key } = await pika.keyMsg("```Downloading...```");
    try {
        const downloader = new PinterestDownloader();
        downloader.imageDown(args[0])
        .then(async r => {
            if (!r.url) return pika.edit("_🅾️No image found!_", key);
            await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(r.url)
            }, { quoted:pika });
            pika.edit(Config.message.success, key);
        });
    } catch (err) {
        console.error(err);
        return pika.edit("ERROR!: " + err.message, key);
    }
});

//༺─────────────────────────────────────

anya({
    name: "igdl",
    react: "🌠",
    need: "url",
    category: "download",
    desc: "Download Instagram Posts",
    filename: __filename
},
async (anyaV2, pika, { args, prefix, command }) => {
    if (!args[0]) return pika.reply(`Post URL needed..!`);
    if (!/instagram.com/.test(args[0])) return pika.reply(`❌Invalid Url..!`);
    const { key } = await pika.keyMsg(Config.message.wait);
    try {
        const fetch = await axios.get(`${Config.api.api1}/api/igdlv1?url=${args.join(" ")}`);
        const response = fetch.data.data;
        for (let i = 0; i < response.length; i++) {
            await anyaV2.sendFileUrl(pika.chat, response[i].url_download, `> Downloaded from Instagram`, pika);
        }
    } catch (error) {
        pika.deleteMsg(key);
        return pika.reply(`Failed to download post: ${error.message}`);
    }
});


//༺─────────────────────────────────────

anya({
            name: "mediafire",
            react: "📑",
            need: "url",
            category: "download",
            desc: "Download files from www.mediafire.com",
            filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* ${prefix + command} https://www.mediafire.com/file/5mt5qtr7nv4igt7/TmWhatsApp_v2.1_-_Stock.apk/file`);
        if (!/www.mediafire.com/.test(args.join(" "))) return pika.reply("_❎ Invalid Url_");
        const {key} = await pika.keyMsg(Config.message.wait);
        mediafiredl(args[0])
        .then(async res=> {
//            const uploadDate = formatDate(res.upload_date);
            await anyaV2.sendMessage(pika.chat, {
                    document: { url: res.url },
                    caption: `
❒         ✦ 𝙈𝙀𝘿𝙄𝘼𝙁𝙄𝙍𝙀 ✦         ❒

▢ *Name:* ${res.filename}
▢ *Type:* ${res.filetype}
▢ *Extension:* ${res.ext}
▢ *Size:* ${res.filesize}
▢ *Uploaded On:* ${res.aploud}

> ${Config.footer}
`.trim(),
                    fileName: res.filename,
                    mimetype: res.filetype,
                    contextInfo: {
                        externalAdReply: {
                            title: "𝗠𝗘𝗗𝗜𝗔𝗙𝗜𝗥𝗘 𝗗𝗟 𝗘𝗡𝗚𝗜𝗡𝗘",
                            body: "Owner: " + Config.ownername,
                           // thumbnail: await getBuffer(""),
                            showAdAttribution: false,
                            thumbnailUrl: "https://i.ibb.co/wz43WhM/41-Sk-Snee-W-L.png",
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
            }, {quoted:pika})
            .then(()=> pika.deleteMsg(key));
        })
        .catch(err=> {
            console.error(err);
            pika.edit("ERROR: " + err.message, key);
        });
     }
)

//༺─────────────────────────────────────

anya({
    name: "twitterdl",
    alias: ['twittervideo', 'twittervid'],
    react: "💫",
    need: "url",
    category: "download",
    desc: "Download Twitter videos in MP4 format or choose format",
    cooldown: 10,
    filename: __filename
  },
  async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`_Enter a twitter video url!`);    
    const text = args.join(" ");
    if (!/x.com|twitter.com/.test(text)) return pika.reply("❎ Invalid Url");
    const format = args[1] ? args[1].toUpperCase() : null;
    twitter(args[0])
    .then(async res => {
      if (format === "MP4") {
        await anyaV2.sendMessage(pika.chat, {
            video: await getBuffer(res.HD),
            caption: `
*⎙ Twitter*
          
▢ *Title:* ${res.desc}
▢ *Quality:* 720p
▢ *Host:* https://x.com
▢ *Link:* ${res.url}
          
> ${Config.footer}
`.trim(),
          },
          { quoted: pika })
        .then(() => pika.deleteMsg(key));
      } else {
        const {key} = await pika.keyMsg(Config.message.wait);
        const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());
            if (ui.buttons) {
                const list = [];
                list.push(`{\"header\":\"${Config.themeemoji} Video\",\"title\":\"\",\"description\":\"click here to download\",\"id\":\"${prefix + command} ${res.url} MP4\"}`);
                list.push(`{\"header\":\"${Config.themeemoji} Video document\",\"title\":\"\",\"description\":\"click here to download\",\"id\":\"${prefix}twitviddoc ${res.url}\"}`);
                list.push(`{\"header\":\"${Config.themeemoji} Audio\",\"title\":\"\",\"description\":\"click here to download\",\"id\":\"${prefix}twitaudio ${res.url}\"}`);
                list.push(`{\"header\":\"${Config.themeemoji} Audio document\",\"title\":\"\",\"description\":\"click here to download\",\"id\":\"${prefix}twitauddoc ${res.url}\"}`);
                await anyaV2.sendButtonImage(pika.chat, {
                    caption: `
*⎙ Twitter*
          
▢ *Title:* ${res.desc}
▢ *Quality:* 720p
▢ *Host:* https://x.com
▢ *Link:* ${res.url}
`.trim(),
                    image: await getBuffer(res.thumb),
                    footer: Config.footer,
                    buttons: [{
                        "name": "single_select",
                        "buttonParamsJson": `{\"title\":\"Tap to choose 🐦\",\"sections\":[{\"title\":\"Title: ${res.desc}\",\"highlight_label\":\"Twitter\",\"rows\":[${list.join(",")}]}]}`
                    },
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Script 🔖\",\"id\":\"${prefix}sc\"}`
                    },
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Owner 👤\",\"id\":\"${prefix}owner\"}`
                    }],
                    contextInfo: { mentionedJid: [pika.sender] }
                }, { quoted: pika });
        } else {
        await anyaV2.sendMessage(pika.chat, {
            image: await getBuffer(res.thumb),
            caption: `
\`Reply a number darling:\`

1. video
2. video document
3. audio
4. audio document

> URL: ${res.url}
> _ID: QA16_
`.trim()                     
          }, { quoted: pika })
        .then(() => pika.deleteMsg(key));
        }
      }
    })
    .catch(err => {
      console.error(err);
      pika.edit("Error! Be sure if it's a *video* url or not, or try again in 30 seconds.", key);
    });
  }
);

//༺─────────────────────────────────────

anya({
    name: "twitviddoc",
    alias: ['twitterviddoc', 'twittervideodoc'],
    react: "💫",
    need: "url",
    category: "download",
    desc: "Send Twitter videos as documents",
    cooldown: 10,
    filename: __filename
  },
  async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} https://x.com/Lamborghini/status/1740417327999660214?s=20`);    
    if (!/x.com|twitter.com/.test(text)) return pika.reply("❎ Invalid Url");
    const {key} = await pika.keyMsg(Config.message.wait);
    twitter(args[0])
    .then(async res => {
      await anyaV2.sendMessage(pika.chat, {
          document: await getBuffer(res.HD),
          caption: `
*⎙ Twitter*
            
▢ *Title:* ${res.desc}
▢ *Quality:* 720p
▢ *Host:* https://x.com
▢ *Link:* ${res.url}
            
${Config.footer}
`.trim(),
          fileName: 'Anya_Twitter_Download.mp4',
          mimetype: "video/mp4",
        }, { quoted: pika })
      .then(() => pika.deleteMsg(key));
    })
    .catch(err => {
      console.error(err);
      pika.edit("Error! Be sure if it's a *video* url or not, or try again in 30 seconds.", key);
    });
  }
);

//༺─────────────────────────────────────

anya({
    name: "twitteraudio",
    alias: ['twittermp3', 'twittersong'],
    react: "💫",
    need: "url",
    category: "download",
    desc: "Send Twitter audio in MP3 format",
    cooldown: 10,
    filename: __filename
  },
  async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} https://x.com/Lamborghini/status/1740417327999660214?s=20`);
    if (!/x.com|twitter.com/.test(text)) return pika.reply("❎ Invalid Url");
    const {key} = await pika.keyMsg(Config.message.wait);
    twitter(args[0])
    .then(async res => {
      await anyaV2.sendMessage(pika.chat,
        {
          audio: await getBuffer(res.audio),
          mimetype: 'audio/mp4',
          ptt: false,
          contextInfo: {
            externalAdReply: {
              title: "𝗔𝗻𝘆𝗮 𝗧𝘄𝗶𝘁𝘁𝗲𝗿 𝗘𝗻𝗴𝗶𝗻𝗲",
              body: res.desc,
              thumbnail: await getBuffer(res.thumb),
              showAdAttribution: true,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        },
        {
          quoted: pika
        })
      .then(() => pika.deleteMsg(key));
    })
    .catch(err => {
      console.error(err);
      pika.edit("Error! Be sure if it's an *audio* url or not, or try again in 30 seconds.", key);
    });
  }
);

//༺─────────────────────────────────────

anya({
    name: "twitauddoc",
    alias: ['twitviddoc', 'twitteraudoc'],
    react: "💫",
    need: "url",
    category: "download",
    desc: "Send Twitter audio as a document",
    cooldown: 10,
    filename: __filename
  },
  async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} https://x.com/Lamborghini/status/1740417327999660214?s=20`);    
    if (!/x.com|twitter.com/.test(text)) return pika.reply("❎ Invalid Url");
    const {key} = await pika.keyMsg(Config.message.wait);
    twitter(args[0])
    .then(async res => {
      await anyaV2.sendMessage(pika.chat, {
          document: await getBuffer(res.audio),
          caption: `
*⎙ Twitter*

▢ *Title:* ${res.desc}
▢ *Quality:* 720p
▢ *Host:* https://x.com
▢ *Link:* ${res.url}

${Config.footer}
`.trim(),
          fileName: 'Anya_Twitter_Download.mp3',
          mimetype: "audio/mp3",
        }, { quoted: pika })
      .then(() => pika.deleteMsg(key));
    })
    .catch(err => {
      console.error(err);
      pika.edit("Error! Be sure if it's an *audio* url or not, or try again in 30 seconds.", key);
    });
  }
);

//༺─────────────────────────────────────

anya({
          name: "facebook",
          alias: ['fb', 'fbdl'],
          react: "💠",
          need: "url",
          category: "download",
          desc: "Download Videos From Facebook",
          cooldown: 10,
          filename: __filename
  },
  async (anyaV2, pika, { args, prefix, command}) => {
    if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* https://www.facebook.com/100089673993286/posts/294357803563351/?mibextid=rS40aB7S9Ucbxw6v`);
    const text = args.join(" ");
    if (!/facebook.com/.test(text)) return pika.reply("❎ Invalid Url");
    const {key} = await pika.keyMsg(Config.message.wait);
    const sRegex = /selectedMediaType/.test(text);
    const dRegex = /inDocumentFormate/.test(text);
    const searchUrl = text.replace(/selectedMediaType|inDocumentFormate/g, '');
    pikaApi.get("api", "facebook", `url=${encodeURIComponent(searchUrl.replace(/_+$/, '').trim())}`)
    .then(async res=> {
      const {results} = res;
      if (!sRegex) {
        return await anyaV2.sendMessage(pika.chat,
          {
            image: await getBuffer(results.thumb),
            caption: `${fancy11(results.title)}\n\n` +
                     `\`\`\`𝟭. • video\n` +
                     `𝟮. • video | document\`\`\`\n\n` +
                     `𝙍𝙚𝙥𝙡𝙮 𝙖 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙\n_ID: QA17_\n_🔗 URI: ${results.url}_`,
                     mediaType: 4
          },
          {
            quoted: pika
          })
          .then(()=> pika.deleteMsg(key));
      } else if (dRegex) {
        return await anyaV2.sendMessage(pika.chat,
          {
          document: await getBuffer(results.video),
          caption: `
*⎙ Facebook*

▢ *Title :* ${results.title}            
▢ *Quality:* HD
▢ *Link:* ${results.url}
          
${Config.footer}
`.trim(),
          fileName: 'Anya_Facebook_Download.mp4',
          mimetype: "video/mp4",
          contextInfo: {
            externalAdReply: {
              title: "𝗔𝗻𝘆𝗮 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗘𝗻𝗴𝗶𝗻𝗲",
              body: "Owner: " + Config.ownername,
              thumbnail: await getBuffer(results.thumb),
              showAdAttribution: true,
              mediaType: 2,
              mediaUrl: "https://instagram.com/" + Config.instagramId,
              sourceUrl: "https://instagram.com/" + Config.instagramId
            }
          }
        },
        {
          quoted:pika
        })
        .then(() => pika.deleteMsg(key));
      } else {
        return await anyaV2.sendMessage(pika.chat,
          {
            video: await getBuffer(results.video),
            caption: `
*⎙ Facebook*

▢ *Title :* ${results.title}            
▢ *Quality:* HD
▢ *Link:* ${results.url}
              
${Config.footer}
`.trim(),
          },
          {
            quoted:pika
          })
      }
    })
    .catch(err=> {
      console.error(err);
      pika.edit("Error! Be sure if it's a *video* url or not, or try again in 30 seconds.", key);
    });
  }
)

//༺─────────────────────────────────────

anya({
        name: "animewall",
        alias: ['animewallpaper'],
        react: "🖼️",
        category: "download",
        desc: "High quality anime wallpapers",
        cooldown: 3,
        filename: __filename
    },
    async (anyaV2, pika) => {
        axios.get("https://nekos.life/api/v2/img/wallpaper")
        .then(async (response) => {
            await anyaV2.sendMessage(pika.chat,
                {
                    image: await getBuffer(response.data.url),
                    caption: "Rᴇᴘʟʏ 1 Fᴏʀ Nᴇxᴛ\n_ID: QA02_"
                },
                {
                    quoted: pika
                })
        })
    }
)

//༺─────────────────────────────────────

anya({
        name: "avatar",
        alias: ['pfp'],
        react: "🍁",
        category: "download",
        desc: "High quality profile pic material pictures",
        cooldown: 3,
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command }) => {
        if ((args.length > 0 || pika.quoted) && !isButton(args)) {
            const text = args.join(" ");
            const users = pika.quoted ? [pika.quoted.sender] : text.split(',').map(v => v.replace(/[^0-9,]/g, '') + '@s.whatsapp.net');
            const caption = [];
            const failed = [];
            for (const i of users) {
                await anyaV2.profilePictureUrl(i, "image")
                .then(async (response) => await anyaV2.sendMessage(pika.chat,
                    {
                        image: await getBuffer(response),
                        caption: `_🌀 Profile Picture of @${i.split('@')[0]}_`,
                        mentions: [i]
                    },
                    {
                        quoted: pika
                })).catch(() => {
                    caption.push(`❌ Can't get *@${i.split('@')[0]}'s* profile picture`);
                });
            }
            if (caption.length > 0) return pika.reply(caption.join("\n\n"), { mentions: users });
        } else {
            axios.get("https://nekos.life/api/v2/img/avatar")
            .then(async (response) => { 
                await anyaV2.sendMessage(pika.chat,
                    {
                        image: await getBuffer(response.data.url),
                        caption: `Rᴇᴘʟʏ 1 Fᴏʀ Nᴇxᴛ\n_ID: QA03_\n\n_*Tip:* Try ${prefix + command} @user1, @user2 etc..._`
                    },
                    {
                        quoted: pika
                    })
            });
        }
    }
)

//༺─────────────────────────────────────

anya({
            name: "telesticker",
            alias: ['telegramsticker'],
            react: "👻",
            need: "url",
            category: "download",
            desc: "Download telegram stickers from telegram",
            cooldown: 5,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix+command} https://t.me/addstickers/a5670095072_by_Makima_UltraXBot`);
        if (!/https:\/\/t\.me\//.test(args.join(" "))) return pika.reply("❎ Invalid Telegram Sticker Url");
        const {key} = await pika.keyMsg(Config.message.wait);
        telesticker(args[0])
        .then(async res=> {
            if (res.length < 1) return pika.edit("❎ No Results Found", key);
            const isn10 = res.length > 11;
            if (isn10 && !pika.chat.endsWith("@s.whatsapp.net")) pika.edit(`There are more than 10 stickers, sending *@${pika.sender.split("@")[0]}* privately`, key, { mentions: [pika.sender] });
            //else pika.edit(Config.message.wait);
            const fs = require("fs");
            const path = `./.temp/${pika.sender.split('@')[0] + Math.random().toString(36).substr(2, 5)}`;
            for (const i of res) {
                fs.writeFileSync(path + '.webp', await getBuffer(i.url));
                await writeExifInVid(path + '.webp', { packname: Config.packname, author: Config.author })
                .then(async response=> {
                    await anyaV2.sendMessage(isn10 ? pika.sender : pika.chat, {
                                sticker: fs.readFileSync(response),
                        });
                    })
                    .catch(err=> {
                        console.error(err);
                        pika.reply(Config.message.error + '\n\n' + err);
                    });
                await delay(100);
            }
        })
        .catch(err=>{
            console.error(err);
            pika.edit(Config.message.error, key);
        });
     }
)

//༺─────────────────────────────────────

anya({
            name: "ttdl",
            alias: ['ttvid'],
            react: "💃🏻",
            need: "url",
            category: "download",
            desc: "Download tiktok videos without watermark",
            cooldown: 10,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Exmaple:* ${prefix+command} https://vt.tiktok.com/ZSND4xYqR`);
        if (!/vt.tiktok.com/) return pika.reply("❎ Invalid Url");
        const {key} = await pika.keyMsg(Config.message.wait);
        ttdl(args[0])
        .then(async response=> {
            if (!response) return pika.reply("❎ No results found!");
            await anyaV2.sendMessage(pika.chat, {
                video: await getBuffer(response.video_HD),
                caption: `*🗣️User:* ${response.username}\n\n*🍂Description:* ${response.description ? response.description : "N/A"}\n\n${Config.footer}`
            }, {quoted:pika})
            .then(()=> pika.deleteMsg(key));
        })
        .catch(err=> {
            console.error(err);
            pika.edit(Config.message.erro, key);
        });     
      }
)
