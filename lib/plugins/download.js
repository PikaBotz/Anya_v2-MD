const Config = require('../../config');
const axios = require('axios');
const { anya, pikaApi, getBuffer, getStream, delay, pinterest, mediafireDl, twitter, telesticker, fbdl, ttdl, formatDate, fancy11, isButton, writeExifInVid } = require('../lib');
const pinterestImageCount = 5;

//༺─────────────────────────────────────༻

anya({
        name: "pinterest",
        react: "🔖",
        need: "query",
        category: "download",
        desc: `Download ${pinterestImageCount} images from Pinterest`,
        cooldown: 8,
        filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`${Config.themeemoji}Example: ${prefix + command} Hinata Hyuga`);
        const { key } = await pika.keyMsg(`𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙𝙞𝙣𝙜 𝙞𝙢𝙖𝙜𝙚:-\n_${args.join(" ")}_`);
        pinterest(args.join(" "), pinterestImageCount)
        .then(async (response) => {
            for (const i of response) {
              await anyaV2.sendMessage(pika.chat,
                    {
                        image: await getBuffer(i),
                        caption: `_Searched by ${Config.botname}_`
                    },
                    {
                        quoted: pika
                    }).catch(err => console.error(err));
            }
            pika.deleteMsg(key);
        })
        .catch((err) => {
            console.error(err);
            pika.edit(Config.message.error, key);
        });
     }
)


//༺─────────────────────────────────────༻

/*
const instagram = ['igdl', 'igstory', 'igpic'];

instagram.forEach(dl => {
    anya({
        name: dl,
        alias: ['reel'],
        react: "ℹ️",
        need: "url",
        category: "download",
        desc: "Download Instagram videos",
        filename: __filename
      },
      async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* ${prefix + command} https://www.instagram.com/reel/CmOTcQID7fQ/?igsh=MzRlODBiNWFlZA==`);
        const text = args.join(" ");
        const api = `https://myfirstexpress-1.xvdxsix.repl.co/api/dowloader/igdowloader?url=`;
        if (!/instagram\.com/.test(text)) return pika.reply("❎ Invalid Url");  
        const story = /instagram\.com\/stories/.test(text);
        const post = /instagram\.com\/p/.test(text);
        const reel = /instagram\.com\/reel/.test(text);
        const { key } = await pika.keyMsg(Config.message.wait);
        axios.get(api + encodeURIComponent(args[0]))
            .then(async (response) => {
                const { result } = response.data;
                if (!result) return pika.edit(Config.message.error, key);

                if (reel) {
                    await anyaV2.sendMessage(pika.chat, {
                        video: await getBuffer(result[0].download_link),
                        caption: `Here's Your Video\n\n${Config.footer}`
                    }, { quoted: pika })
                    .then(()=> pika.deleteMsg(key));
                } else if (story) {
                    if (result.length > 4 && args[1] !== "✅accept") {
                        return pika.edit(`There are more than 3 stories in the provided url, please reply like this, to proceed:\n\n${prefix + command} ${args[0]} ✅accept`, key);
                    } else {
                        for (const i of result) {
                            await anyaV2.sendMessage(pika.chat, { video: await getBuffer(i.download_link), caption: `Here's your story` });
                        }
                        return pika.deleteMsg(key);
                    }
                } else if (post) {
                    for (const i of result) {
                        await anyaV2.sendMessage(pika.chat, { image: await getBuffer(i.download_link), caption: "Here's your post pictures" });
                    }
                    return pika.deleteMsg(key);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                return pika.edit(Config.message.error, key);
            });
    })
});*/

//༺─────────────────────────────────────༻

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
        if (!/www.mediafire.com/.test(args.join(" "))) return pika.reply("❎ Invalid Url");
        const {key} = await pika.keyMsg(Config.message.wait);
        mediafireDl(args[0])
        .then(async res=> {
            const uploadDate = formatDate(res.upload_date);
            await anyaV2.sendMessage(pika.chat, {
                    document: await getBuffer(res.url, './.temp'),
                    caption: `
❒         ✦ 𝙈𝙀𝘿𝙄𝘼𝙁𝙄𝙍𝙀 ✦         ❒

▢ *Name:* ${res.filename}
▢ *Type:* ${res.filetype}
▢ *Extension:* ${res.ext}
▢ *Size:* ${res.filesize}
▢ *Uploaded On:* ${uploadDate.date} | ${uploadDate.time}

${Config.footer}
`.trim(),
                    fileName: res.filename,
                    mimetype: res.filetype,
                    contextInfo: {
                        externalAdReply: {
                            title: "𝗠𝗘𝗗𝗜𝗔𝗙𝗜𝗥𝗘 𝗗𝗟 𝗘𝗡𝗚𝗜𝗡𝗘",
                            body: "Owner: " + Config.ownername,
                            thumbnail: await getBuffer("https://i.ibb.co/wz43WhM/41-Sk-Snee-W-L.png"),
                            showAdAttribution: false,
                            mediaType: 2,
                            mediaUrl: res.url2,
                            sourceUrl: res.url2
                        }
                    }
            }, {quoted:pika})
            .then(()=> pika.deleteMsg(key));
        })
        .catch(err=> {
            console.error(err);
            pika.edit(Config.message.error, key);
        });
     }
)

//༺─────────────────────────────────────༻

anya({
      name: "twitter",
      alias: ['twiter'],
      react: "💫",
      need: "url",
      category: "download",
      desc: "Download Twitter audios/videos",
      cooldown: 10,
      filename: __filename
  },
  async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} https://x.com/Lamborghini/status/1740417327999660214?s=20`);
    const text = args.join(" ");
    if (!/x.com|twitter.com/.test(text)) return pika.reply("❎ Invalid Url");
    const {key} = await pika.keyMsg(Config.message.wait);
    const sRegex = /selectedMediaType/.test(text);
    const vRegex = /inVoiceNoteFormate/.test(text);
    const vvRegex = /inVideoFormate/.test(text);
    const aRegex = /inAudioFormate/.test(text);
    const dRegex = /inDocumentFormate/.test(text);
    const searchUrl = text.replace(/selectedMediaType|inDocumentFormate|inVideoFormate|inAudioFormate|inVoiceNoteFormate/g, '');
    twitter(searchUrl.trim())
    .then(async res=> {
      if (!sRegex) {
        return await anyaV2.sendMessage(pika.chat,
          {
            image: await getBuffer(res.thumb),
            caption: `${fancy11(res.desc)}\n\n` +
                     `\`\`\`𝟭. • video\n` +
                     `𝟮. • video | document\n` +
                     `𝟯. • audio\n` +
                     `𝟰. • audio | document\n` +
                     `𝟱. • voicenote\`\`\`\n\n` +
                     `𝙍𝙚𝙥𝙡𝙮 𝙖 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙\n_ID: QA16_\n_🔗 URI: ${res.url}_`,
                     mediaType: 4
          },
          {
            quoted: pika
          })
          .then(()=> pika.deleteMsg(key));
      } else if (!dRegex) {
        if (aRegex) {
          return await anyaV2.sendMessage(pika.chat,
            {
              audio: await getBuffer(res.audio),
              mimetype: 'audio/mp4',
              ptt: vRegex ? true : false,
              contextInfo: {
                externalAdReply: {
                  title: "𝗔𝗻𝘆𝗮 𝗧𝘄𝗶𝘁𝘁𝗲𝗿 𝗘𝗻𝗴𝗶𝗻𝗲",
                  body: res.desc,
                  thumbnail: await getBuffer(res.thumb),
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
            .then(()=> pika.deleteMsg(key));
          } else if (vvRegex) {
            return await anyaV2.sendMessage(pika.chat,
              {
                video: await getBuffer(res.HD),
                caption: `
*⎙ Twitter*
        
▢ *Title:* ${res.desc}
▢ *Quality:* 720p
▢ *Host:* https://x.com
▢ *Link:* ${res.url}
                
${Config.footer}
`.trim(),
              },
              {
                quoted:pika
              })
              .then(()=> pika.deleteMsg(key));
          }
          } else {
            if (aRegex) {
              return await anyaV2.sendMessage(pika.chat,
                {
                  document: await getBuffer(res.audio),
                  caption: `
*⎙ Twitter*

▢ *Title:* ${res.desc}
▢ *Quality:* 720p
▢ *Host:* https://x.com
▢ *Link:* ${res.url}

${Config.footer}
`.trim(),
                 fileName: `Anya_Twitter_Download.mp3`,
                 mimetype: "audio/mp3",
                 contextInfo: {
                  externalAdReply: {
                    title: "𝗔𝗻𝘆𝗮 𝗧𝘄𝗶𝘁𝘁𝗲𝗿 𝗘𝗻𝗴𝗶𝗻𝗲",
                    body: res.desc,
                    thumbnail: await getBuffer(res.thumb),
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
            } else if (vvRegex) {
            return await anyaV2.sendMessage(pika.chat,
              {
              video: await getBuffer(res.HD),
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
              contextInfo: {
                externalAdReply: {
                  title: "𝗔𝗻𝘆𝗮 𝗧𝘄𝗶𝘁𝘁𝗲𝗿 𝗘𝗻𝗴𝗶𝗻𝗲",
                  body: res.desc,
                  thumbnail: await getBuffer(res.thumb),
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
        }
      }
    })
    .catch(err=> {
      console.error(err);
      pika.edit("Error! Be sure if it's a *video* url or not, or try again in 30 seconds.", key);
    })
  }
)

//༺─────────────────────────────────────༻

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

//༺─────────────────────────────────────༻

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

//༺─────────────────────────────────────༻

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

//༺─────────────────────────────────────༻

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

//༺─────────────────────────────────────༻

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
