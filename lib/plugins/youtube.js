const Config = require('../../config');
const { anya, getBuffer, tiny, fancy11 } = require('../lib');

//༺─────────────────────────────────────༻

anya({
         name: "yts",
         alias: ['play', 'ytsearch', 'yt', 'youtube'],
         react: "🍂",
         need: "query",
         category: "download",
         desc: "Search video or song from YouTube using texts",
         cooldown: 8,
         filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* ${prefix + command} Gaming PC 4090rtx`);
        const yts = require("@queenanya/ytsearch");
        const array = await yts(args.join(" "));
        if (array.all.length < 1) return pika.reply('No search results found.');
        let c = 1;
        let caption = `⌈ 𝗔𝗻𝘆𝗮 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗘𝗻𝗴𝗶𝗻𝗲 ⌋\n\n⎔ 𝘙𝘦𝘱𝘭𝘺 𝘈 𝘕𝘶𝘮𝘣𝘦𝘳 𝘛𝘰 𝘚𝘦𝘭𝘦𝘤𝘵\n⎔ _Example: 2.1_\n\n`;
        for (const i of array.all) {
            caption += `*${Config.themeemoji} ${i.title}* \`VID: ${i.videoId}\`\n> ➥ ${c}.1 Audio     ➥ ${c}.2 Video\n\n`;
            c++;
        } 
        caption += `> ${Config.footer}\n_ID: QA06_`;
        await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer("https://i.ibb.co/wcxrZVh/hero.png"),
                caption: caption
            },
            {
                quoted: pika
            });
        
     }
)

//༺─────────────────────────────────────༻

anya({
        name: "song",
        alias: ['yta', 'ytaudio', 'ytmp3', 'audio'],
        react: "🌟",
        need: "query",
        category: "download",
        desc: "Get youtube audio using texts",
        cooldown: 8,
        filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* ${prefix + command} Murder In My Mind Phonk`);
        const YouTube = require('../lib/ytdl-core');
        const text = args.join(" ");
        if (YouTube.isYouTubeUrl(text)) return pika.reply(`If you want audio/song by link 🔗 then use *${prefix}yta2 <url>*`);
        YouTube.getAudQ(text, 5)
        .then(async (res) => {
                return await anyaV2.sendMessage(pika.chat,
                    {
                        image: await getBuffer(res.thumb.url),
                        caption: `*${res.title}*\n\n` +
                                 `\`\`\`𝟭. • audio\n` +
                                 `𝟮. • audio | document\n` +
                                 `𝟯. • voicenote\`\`\`\n\n` +
                                 `𝘙𝘦𝘱𝘭𝘺 𝘢 𝘯𝘶𝘮𝘣𝘦𝘳 𝘵𝘰 𝘥𝘰𝘸𝘯𝘭𝘰𝘢𝘥\n> _ID: QA04_\n\`VID: ${res.id}\``,
                        mediaType: 4
                    },
                    {
                        quoted: pika
                    });
        })
        .catch((err) => {
            console.error(err);
            pika.reply(Config.message.error);
        });
     }
)

//༺─────────────────────────────────────༻

anya({
        name: "song2",
        alias: ['yta2', 'ytaudio2', 'ytmp32', 'audio2'],
        react: "🌟",
        need: "url",
        category: "download",
        desc: "Get youtube audio using url",
        cooldown: 8,
        filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* ${prefix + command} https://youtu.be/HXzJ5R-HxDs?si=DoIbZpMB9VePkd3_`);
        const YouTube = require('../lib/ytdl-core');
        const text = args.join(" ");
        if (!YouTube.isYouTubeUrl(text)) return pika.reply(`If you want audio/song by search term 📜 then use *${prefix}song <query>*`);
        const sRegex = /selectedMediaType/.test(text);
        const vRegex = /inVoiceNoteFormate/.test(text);
        const dRegex = /inDocumentFormate/.test(text);
        const loading = sRegex ? await pika.keyMsg(`\`\`\`downloading audio...\`\`\``) : null;
        const searchUrl = text.replace(/selectedMediaType|inDocumentFormate|inVoiceNoteFormate/g, '');
        YouTube.getAudUrl(searchUrl)
        .then(async (res) => {
            if (!sRegex) {
                return await anyaV2.sendMessage(pika.chat,
                    {
                        image: await getBuffer(res.thumb.url),
                        caption: `*${res.title}*\n\n` +
                                 `\`\`\`𝟭. • audio\n` +
                                 `𝟮. • audio | document\n` +
                                 `𝟯. • voicenote\`\`\`\n\n` +
                                 `𝘙𝘦𝘱𝘭𝘺 𝘢 𝘯𝘶𝘮𝘣𝘦𝘳 𝘵𝘰 𝘥𝘰𝘸𝘯𝘭𝘰𝘢𝘥\n_ID: QA04_\n\`VID: ${res.id}\``,
                                 mediaType: 4
                    },
                    {
                        quoted: pika
                    });
            } else if (!dRegex) {
                return await anyaV2.sendMessage(pika.chat,
                    {
                        audio: res.audio,
                        mimetype: 'audio/mp4',
                        ptt: vRegex ? true : false,
                        contextInfo: {
                            externalAdReply: {
                                title: "𝗔𝗻𝘆𝗮 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗘𝗻𝗴𝗶𝗻𝗲",
                                body: res.title,
                                thumbnail: await getBuffer(res.thumb.url),
                                showAdAttribution: true,
                                mediaType: 2,
                                mediaUrl: res.direct_url,
                                sourceUrl: res.direct_url
                            }
                        }
                    },
                    {
                        quoted: pika
                    })
                .then(() => pika.deleteMsg(loading.key));
            } else {
                return await anyaV2.sendMessage(pika.chat,
                    {
                        document: res.audio,
                        caption: res.title,
                        fileName: `${res.id}.mp3`,
                        mimetype: "audio/mp3",
                        contextInfo: {
                            externalAdReply: {
                                title: "𝗔𝗻𝘆𝗮 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗘𝗻𝗴𝗶𝗻𝗲",
                                body: res.title,
                                thumbnail: await getBuffer(res.thumb.url),
                                showAdAttribution: true,
                                mediaType: 2,
                                mediaUrl: res.direct_url,
                                sourceUrl: res.direct_url
                            }
                        }
                    },
                    {
                        quoted: pika
                    })
                .then(() => pika.deleteMsg(loading.key));
            }
        })
     }
)

//༺─────────────────────────────────────༻

anya({
        name: "video",
        alias: ['ytv', 'ytvideo', 'ytmp4', 'shorts', 'ytshorts'],
        react: "🌟",
        need: "query",
        category: "download",
        desc: "Get youtube video using texts",
        cooldown: 8,
        filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* ${prefix + command} Why can't we pray in another religion's temple if we believe god is everywhere?`);
        const YouTube = require('../lib/ytdl-core');
        const text = args.join(" ");
        if (YouTube.isYouTubeUrl(text)) return pika.reply(`If you want video by link 🔗 then use *${prefix}ytv2 <url>*`);
        YouTube.getVidQ(text, 5)
        .then(async (res) => {
                const options = [];
                if (res.videoQuality.high) options.push('720p', '720p | document');
                if (res.videoQuality.low) options.push('360p', '360p | document');
                const caption = options.map((quality, i) => `${fancy11((i + 1).toString())}. • ${quality}`).join("\n");
                return await anyaV2.sendMessage(pika.chat,
                    {
                        image: await getBuffer(res.thumb.url),
                        caption: `*${res.title}*\n\n` +
                                 `\`\`\`${caption}\`\`\`\n\n` +
                                 `𝘙𝘦𝘱𝘭𝘺 𝘢 𝘯𝘶𝘮𝘣𝘦𝘳 𝘵𝘰 𝘥𝘰𝘸𝘯𝘭𝘰𝘢𝘥\n_ID: QA05_\n\`VID: ${res.id}\``,
                        mediaType: 4
                    },
                    {
                        quoted: pika
                    });
        })
        .catch((err) => {
            console.error(err);
            pika.reply(Config.message.error);
        });
     }
)

//༺─────────────────────────────────────༻

anya({
        name: "video2",
        alias: ['ytv2','ytvideo2','ytmp42','shorts','ytshorts'],
        react: "🌟",
        need: "url",
        category: "download",
        desc: "Get youtube video using url",
        cooldown: 8,
        filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* ${prefix + command} https://youtu.be/HXzJ5R-HxDs?si=DoIbZpMB9VePkd3_`);
        const YouTube = require('../lib/ytdl-core');
        const text = args.join(" ");
        if (!YouTube.isYouTubeUrl(text)) return pika.reply(`If you want video by search term 📜 then use *${prefix}video <query>*`);
        const sRegex = /selectedMediaType/.test(text);
        const dRegex = /inDocumentFormate/.test(text);
        const loading = sRegex ? await pika.keyMsg(Config.message.wait) : null;
        const searchUrl = text.replace(/selectedMediaType|inDocumentFormate|selectedQualityIs\d+p/g, '');
        YouTube.getVidUrl(searchUrl)
        .then(async (res) => {
            if (!sRegex) {
                const options = [];
                if (res.videoQuality.high) options.push('720p', '720p | document');
                if (res.videoQuality.low) options.push('360p', '360p | document');
                const caption = options.map((quality, i) => `${fancy11((i + 1).toString())}. • ${quality}`).join("\n");
                return await anyaV2.sendMessage(pika.chat,
                    {
                        image: await getBuffer(res.thumb.url),
                        caption: `*${res.title}*\n\n` +
                                 `\`\`\`${caption}\`\`\`\n\n` +
                                 `𝘙𝘦𝘱𝘭𝘺 𝘢 𝘯𝘶𝘮𝘣𝘦𝘳 𝘵𝘰 𝘥𝘰𝘸𝘯𝘭𝘰𝘢𝘥\n_ID: QA05_\n\`VID: ${res.id}\``,
                        mediaType: 4
                    },
                    {
                        quoted: pika
                    });
            } else if (!dRegex) {
                const option = (match = text.match(/\b(?:selectedQualityIs)(\d+)/i)) ? parseInt(match[1]) : false;
                const caption = `
✶⊶⊷⊶⊷❍ Y T - U R L ❍⊶⊷⊶⊷✶\n
🎃 *${tiny("Title")}:* ${res.title}\n
> 🌊 *${tiny("Link")}:* ${res.direct_url}\n
│❒ *${tiny("Channel")}:* ${res.channel}
│❒ *${tiny("Duration")}:* ${res.duration}
│❒ *${tiny("Quality")}:* ${(option === 720) ? '720p' : '360p'}
│❒ *${tiny("Views")}:* ${res.views}
│❒ *${tiny("Upload")}:* ${res.date}
╰────────────────┈✧
`;
                return await anyaV2.sendMessage(pika.chat,
                    {
                        video: await getBuffer((option === 720) ? res.videoQuality.high : res.videoQuality.low),
                        caption: caption
                    },
                    {
                        quoted: pika
                    })
                .then(() => pika.deleteMsg(loading.key));
            } else {
                const option = (match = text.match(/\b(?:selectedQualityIs)(\d+)/i)) ? parseInt(match[1]) : false;
                return await anyaV2.sendMessage(pika.chat,
                    {
                        document: await getBuffer((option === 720) ? res.videoQuality.high : res.videoQuality.low),
                        caption: res.title,
                        fileName: res.id + '.mp4',
                        mimetype: "video/mp4",
                         contextInfo: {
                            externalAdReply: {
                                title: "𝗔𝗻𝘆𝗮 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗘𝗻𝗴𝗶𝗻𝗲",
                                body: res.title,
                                thumbnail: await getBuffer(res.thumb.url),
                                showAdAttribution: true,
                                mediaType: 2,
                                mediaUrl: res.direct_url,
                                sourceUrl: res.direct_url
                            }
                        }

                    },
                    {
                        quoted: pika
                    })
                .then(() => pika.deleteMsg(loading.key));
            }
        })
     }
)