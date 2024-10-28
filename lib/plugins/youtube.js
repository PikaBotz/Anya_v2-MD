const fs = require('fs');
const Config = require('../../config');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { 
    anya,
    youtube,
    UI,
    getBuffer,
    getRandom,
    formatNumber,
    formatRuntime,
    formatDate,
    pickRandom,
} = require('../lib');

//༺------------------------------------------------------------------------------------------------

anya(
    {
        name: "youtube",
        alias: ['yt', 'yts', 'ytsearch'],
        react: "🎈",
        need: "query",
        category: "download",
        desc: "Search videos on YouTube",
        filename: __filename
    },
    async (anyaV2, pika, { db, args, prefix, command }) => {
        if (!args[0]) return pika.reply("_Enter a query to search!_");      
        const input = args.join(" ");
        if (youtube.isYouTubeUrl(input)) return pika.reply(`_Use \`${prefix}ytv2 <url>\` for URLs_`);
        const output = await youtube.search(input, "videos");
        if (output.length < 1) return pika.reply("_❌ No Videos Found!_");
        const ui = db.UI?.[0] || await new UI({ id: "userInterface" }).save();
        let caption = "```📝 Search Term : " + input + "\n🌊 Results : " + output.length + " found!```";
        const generateButtons = (item) => {
            const eTitle = escapeText(item.title);
            const eViews = item.views ? formatNumber(item.views) : "UNKNOWN";
            const eAuthor = escapeText(item.author.name);
            return `{"header": "❤️ ${eTitle}","title": "${eViews} views | ${item.timestamp}min","description": "channel: ${eAuthor}","id": "${prefix}ytsqualityandformateselector ${item.url}"}`;
        };
        if (ui.buttons) {
        switch (ui.ytsmsg) {
            case 1: {
                const mapping = output.slice(0, 24).map((item, index) => generateButtons(item, index));
                return await anyaV2.sendButtonText(pika.chat, {
                    text: caption,
                    footer: Config.footer,
                    buttons: [{
                        "name": "single_select",
                        "buttonParamsJson": `{"title":"Choose Video","sections":[{"title":"✨ Choose your favorite video ✨","highlight_label":"Anya YT Engine","rows":[${mapping.join(",")}]}]}`
                    }]
                }, { quoted: pika });
            }
            case 2: {
                const mapping = output.slice(0, 24).map((item, index) => generateButtons(item, index));
                return await anyaV2.sendButtonImage(pika.chat, {
                    image: { url: "https://i.ibb.co/wcxrZVh/hero.png" },
                    caption: caption,
                    footer: Config.footer,
                    buttons: [{
                        "name": "single_select",
                        "buttonParamsJson": `{"title":"Choose Video","sections":[{"title":"✨ Choose your favorite video ✨","highlight_label":"Anya YT Engine","rows":[${mapping.join(",")}]}]}`
                    }]
                }, { quoted: pika });
            }
            case 3: {
                const cards = [];
                const maxResults = 5; // 😗 Edit mat karna chutiye
                let count = 1;
                caption += "\n```🍁 Showing : " + maxResults + " results```";
                for (const item of output.slice(0, maxResults)) {
                    cards.push(await anyaV2.createCardImage({
                        image: { url: item.thumbnail },
                        header: count++ + ". " + item.title,
                        footer: Config.footer,
                        caption: `> Views: _${formatNumber(item.views)}_\n> Duration: _${item.timestamp}_\n> Uploaded: _${item.ago}_`,
                        buttons: [{ name: "quick_reply", buttonParamsJson: `{"display_text":"Get This❗","id":"${prefix}ytsqualityandformateselector ${item.url}"}` }]
                    }));
                }
                console.log(cards);
                return await anyaV2.sendCards(pika.chat, { caption, footer: Config.footer, cards }, { quoted: pika });
            }
            default: 
            {
                return pika.reply("Invalid YouTube UI type");
            }
        }
       } else {
                let caption = `👉🏻 _Reply with a number to get the video_\n👉🏻 _Example: 3_\n\n`;
                output.slice(0, 24).forEach((item, index) => {
                    caption += `*🍁 ${index + 1}. ${item.title}*\n👁️‍🗨️ Views: ${formatNumber(item.views)}\n⏳ Duration: ${item.timestamp}min\n🌟 Uploaded: ${item.ago}\n👑 Author: ${item.author.name}\n🔗 ${item.url}\n\n`;
                });
                caption += `> _ID: QA06_\n> ${Config.footer}`;

                return await anyaV2.sendMessage(pika.chat, {
                    text: caption.trim(),
                    contextInfo: {
                        externalAdReply: {
                            showAdAttribution: true,
                            title: `${Config.botname} YOUTUBE Engine`,
                            body: 'Reply with a number to download audio/video',
                            thumbnailUrl: "https://i.ibb.co/wcxrZVh/hero.png",
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: pika });
           }
    }
);

//༺------------------------------------------------------------------------------------------------

anya(
  {
    name: "ytsqualityandformateselector",
    react: "✨",
    notCmd: true,
    filename: __filename,
  },
  async (anyaV2, pika, { db, args, prefix, command }) => {
    if (args.length < 1 || !youtube.isYouTubeUrl(args?.[0])) return pika.reply("_⚠️ Invalid Input_");
    const videoUrl = args[0];
    const ui = db.UI?.[0] || new UI({ id: "userInterface" }).save();
    if (ui.buttons) {
      const buttonsArray = [
        `{"header":"","title":"❖ video","description":"","id":"${prefix}ytv2 ${videoUrl} video"}`,
        `{"header":"","title":"❖ video document","description":"","id":"${prefix}ytvdoc ${videoUrl}"}`,
        `{"header":"","title":"❖ audio","description":"","id":"${prefix}yta2 ${videoUrl} audio"}`,
        `{"header":"","title":"❖ audio document","description":"","id":"${prefix}ytadoc ${videoUrl}"}`
      ];
      /*
      const buttonParams = JSON.stringify({
        title: "Tap Here ⧉",
        sections: [{
          title: "🔖 𝗖𝗵𝗼𝗼𝘀𝗲 𝘆𝗼𝘂𝗿 𝗱𝗲𝘀𝗶𝗿𝗲𝗱 𝗳𝗼𝗿𝗺𝗮𝘁 🔖",
          highlight_label: "Anya YT Engine",
          rows: buttonsArray.map((button) => JSON.parse(button))
        }]
      });
      */
      return await anyaV2.sendButtonText(pika.chat, {
        text: "```📝 Choose a format below to download!```\n\n> *Url :* " + videoUrl,
        footer: Config.footer,
        buttons: [{ "name": "single_select", "buttonParamsJson": `{"title":"Tap Here ⧉","sections":[{"title":"🔖 𝗖𝗵𝗼𝗼𝘀𝗲 𝘆𝗼𝘂𝗿 𝗱𝗲𝘀𝗶𝗿𝗲𝗱 𝗳𝗼𝗿𝗺𝗮𝘁 🔖","highlight_label":"Anya YT Engine","rows":[${buttonsArray.join(",")}]}]}` }],
      }, { quoted: pika });
    } else {
      const id = youtube.getVideoId(videoUrl);
      let caption = "`Reply with a number to select:`\n\n";
      caption += "```1 ➣ video\n";
      caption += "2 ➣ video doc\n";
      caption += "3 ➣ audio\n";
      caption += "4 ➣ audio doc```\n\n";
      caption += `> VID: ${id}\n`;
      caption += `> _ID: QA34_`;
      return await anyaV2.sendMessage(pika.chat, {
        text: caption.trim(),
      }, { quoted: pika });
    }
  }
);

//༺------------------------------------------------------------------------------------------------

anya(
        {
                name: "ytvideo",
                alias: ['ytv', 'video'],
                react: "🎦",
                need: "query",
                category: "download",
                desc: "Download videos using query",
                filename: __filename
        },
    async (anyaV2, pika, { db, args, prefix, command }) => {
        if (args.length < 1) return pika.reply("_Enter a search term first_");
        if (youtube.isYouTubeUrl(args[0])) return pika.reply(`_‼️ Invalid Input!_\n*Use ${prefix + command}url <URL> for URLs*`);
        const query = args.join(" ");
        const search = await youtube.search(query, "videos");
        if (search.length < 1) return pika.reply("_Video Not Found!_");
        const top8Videos = search.slice(0, 8);
        const random = pickRandom(top8Videos);
        pika.reply(`*Downloading • _${random.title.replace(/\*/g, "")}_*`);
        const download = await youtube.downloadYtVideo(random.url);
        if (!download.status) return pika.reply("```⚠️ API ERR```");
        const ui = db.UI?.[0] || await new UI({ id: "userInterface" }).save();
        const cpt = [];
        if (download.likes) cpt.push(`⌈Lɪᴋᴇs⌋ : ${download.likes}`);
        if (random.views || download.views) cpt.push(`⌈Vɪᴇᴡs⌋ : ${random.views ? formatNumber(random.views) : formatNumber(download.views)}`);
        if (random.seconds || download.duration) cpt.push(`⌈Dᴜʀᴀᴛɪᴏɴ⌋ : ${random.seconds ? formatRuntime(random.seconds) : formatRuntime(download.duration)}`);
        if (random.ago || download.uploadedOn) cpt.push(`⌈UᴘʟᴏᴀᴅᴇᴅOɴ⌋ : ${random.ago || download.uploadedOn}`);
        if (random.author?.url || download.channel) cpt.push(`⌈Cʜᴀɴɴᴇʟ⌋ : ${random.author?.url?.split("https://youtube.com/")[1] || download.channel}`);
        if (random.url || download.url) cpt.push(`⌈Uʀʟ⌋ : ${random.url || download.url}`);
        const caption = `
\`\`\`
${random.title || download.title || "NO_TITLE_FOUND"}

${cpt.join("\n")}
\`\`\`
        `.trim();
        if (ui.buttons) {
            return anyaV2.sendButtonVideo(pika.chat, {
                video: await getBuffer(download.videoUrl),
                caption,
                footer: Config.footer,
                buttons: [{ 
                    name: "cta_url", 
                    buttonParamsJson: `{"display_text":"Get on YouTube","url":"${download.url}","merchant_url":"${download.url}"}`
                }]
            }, { quoted: pika });
        }
        anyaV2.sendMessage(pika.chat, {
            video: { url: download.videoUrl },
            caption: caption + `\n> ${Config.footer}`
        }, { quoted: pika });
    }
);

//༺------------------------------------------------------------------------------------------------

anya(
        {
                name: "ytaudio",
                alias: ['yta', 'ytsong', 'ytaud', 'song', 'play'],
                react: "🎶",
                need: "query",
                category: "download",
                desc: "Download audios using query",
                filename: __filename
        },
    async (anyaV2, pika, { db, args, prefix, command }) => {
        if (args.length < 1) return pika.reply("_Enter a search term first_");
        if (youtube.isYouTubeUrl(args[0])) return pika.reply(`_‼️ Invalid Input!_\n*Use ${prefix + command}url <URL> for URLs*`);
        const query = args.join(" ");
        const search = await youtube.search(query, "videos");
        if (search.length < 1) return pika.reply("_Audio Not Found!_");
        const top8Videos = search.slice(0, 8);
        const random = pickRandom(top8Videos);
        pika.reply(`*Downloading • _${random.title.replace(/\*/g, "")}_*`);
        const download = await youtube.downloadYtAudio(random.url);
        if (!download.status) return pika.reply("```⚠️ API ERR```");
        const cpt = [];
        if (download.likes) cpt.push(`${download.likes} likes`);
        if (random.views || download.views) cpt.push(`${random.views ? formatNumber(random.views) : formatNumber(download.views)} views`);
        if (random.ago || download.uploadedOn) cpt.push(`${random.ago || download.uploadedOn}`);
        const tempDir = path.join(__dirname, '../../.temp');
        const outputFilePath = path.join(tempDir, getRandom(8));
        const file = await new Promise((resolve, reject) => {
            ffmpeg(download.audioUrl)
                .audioFrequency(44100)
                .audioChannels(2)
                .audioBitrate(128)
                .audioCodec('libmp3lame')
                .audioQuality(5)
                .toFormat('mp3')
                .save(outputFilePath)
                .on('end', () => resolve(outputFilePath))
                .on('error', reject);
        });
        const buffer = fs.readFileSync(outputFilePath);
        await anyaV2.sendMessage(pika.chat, {
                audio: buffer,
                mimetype: 'audio/mp4',
                ptt: false,
                contextInfo: {
                    externalAdReply: {
                        title: download.title || random.title,
                        body: cpt.join(" | "),
                        thumbnailUrl: random.thumbnail || download.thumbnail || Config.imageUrl,
                        showAdAttribution: true,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        sourceUrl: random.url || download.url
                    }
                }
        }, { quoted: pika });
        fs.unlinkSync(outputFilePath);
    }
);

//༺------------------------------------------------------------------------------------------------

anya(
        {
                name: "ytvdoc",
                alias: ['ytvideodoc', 'ytdocvid'],
                react: "📄",
                need: "query",
                category: "download",
                desc: "Download videos using query as document",
                filename: __filename
        },
    async (anyaV2, pika, { db, args, prefix, command }) => {
        if (args.length < 1) return pika.reply("_Enter a search term first_");
        if (youtube.isYouTubeUrl(args[0])) return pika.reply(`_‼️ Invalid Input!_\n*Use ${prefix + command}url <URL> for URLs*`);
        const query = args.join(" ");
        const search = await youtube.search(query, "videos");
        if (search.length < 1) return pika.reply("_Video Not Found!_");
        const top8Videos = search.slice(0, 8);
        const random = pickRandom(top8Videos);
        pika.reply(`*Downloading • _${random.title.replace(/\*/g, "")}_*`);
        const download = await youtube.downloadYtVideo(random.url);
        if (!download.status) return pika.reply("```⚠️ API ERR```");
        const cpt = [];
        if (download.likes) cpt.push(`⌈Lɪᴋᴇs⌋ : ${download.likes}`);
        if (random.views || download.views) cpt.push(`⌈Vɪᴇᴡs⌋ : ${random.views ? formatNumber(random.views) : formatNumber(download.views)}`);
        if (random.seconds || download.duration) cpt.push(`⌈Dᴜʀᴀᴛɪᴏɴ⌋ : ${random.seconds ? formatRuntime(random.seconds) : formatRuntime(download.duration)}`);
        if (random.ago || download.uploadedOn) cpt.push(`⌈UᴘʟᴏᴀᴅᴇᴅOɴ⌋ : ${random.ago || download.uploadedOn}`);
        if (random.author?.url || download.channel) cpt.push(`⌈Cʜᴀɴɴᴇʟ⌋ : ${random.author?.url?.split("https://youtube.com/")[1] || download.channel}`);
        if (random.url || download.url) cpt.push(`⌈Uʀʟ⌋ : ${random.url || download.url}`);
        const caption = `
\`\`\`
${random.title || download.title || "NO_TITLE_FOUND"}

${cpt.join("\n")}
\`\`\`
        `.trim();
        anyaV2.sendMessage(pika.chat, {
            document: { url: download.videoUrl },
            caption: caption + `\n> ${Config.footer}`,
            fileName: (random.videoId || download.id) + '.mp4',
            mimetype: "video/mp4",
            //contextInfo: {
            //    externalAdReply: {
            //        title: download.title || random.title,
            //        body: cpt.join(" | "),
            //        thumbnailUrl: random.thumbnail || download.thumbnail || Config.imageUrl,
            //        showAdAttribution: true,
            //        mediaType: 1,
            //        renderLargerThumbnail: true
            //    }
            //}
        }, { quoted: pika });
    }
);

//༺------------------------------------------------------------------------------------------------

anya(
        {
                name: "ytadoc",
                alias: ['ytaudiodoc', 'ytdocaud'],
                react: "📄",
                need: "query",
                category: "download",
                desc: "Download audios using query as document",
                filename: __filename
        },
    async (anyaV2, pika, { db, args, prefix, command }) => {
        if (args.length < 1) return pika.reply("_Enter a search term first_");
        if (youtube.isYouTubeUrl(args[0])) return pika.reply(`_‼️ Invalid Input!_\n*Use ${prefix + command}url <URL> for URLs*`);
        const query = args.join(" ");
        const search = await youtube.search(query, "videos");
        if (search.length < 1) return pika.reply("_Video Not Found!_");
        const top8Videos = search.slice(0, 8);
        const random = pickRandom(top8Videos);
        pika.reply(`*Downloading • _${random.title.replace(/\*/g, "")}_*`);
        const download = await youtube.downloadYtAudio(random.url);
        if (!download.status) return pika.reply("```⚠️ API ERR```");
        const cpt = [];
        if (download.likes) cpt.push(`⌈Lɪᴋᴇs⌋ : ${download.likes}`);
        if (random.views || download.views) cpt.push(`⌈Vɪᴇᴡs⌋ : ${random.views ? formatNumber(random.views) : formatNumber(download.views)}`);
        if (random.seconds || download.duration) cpt.push(`⌈Dᴜʀᴀᴛɪᴏɴ⌋ : ${random.seconds ? formatRuntime(random.seconds) : formatRuntime(download.duration)}`);
        if (random.ago || download.uploadedOn) cpt.push(`⌈UᴘʟᴏᴀᴅᴇᴅOɴ⌋ : ${random.ago || download.uploadedOn}`);
        if (random.author?.url || download.channel) cpt.push(`⌈Cʜᴀɴɴᴇʟ⌋ : ${random.author?.url?.split("https://youtube.com/")[1] || download.channel}`);
        if (random.url || download.url) cpt.push(`⌈Uʀʟ⌋ : ${random.url || download.url}`);
        const tempDir = path.join(__dirname, '../../.temp');
        const outputFilePath = path.join(tempDir, getRandom(8));
        const file = await new Promise((resolve, reject) => {
            ffmpeg(download.audioUrl)
                .audioFrequency(44100)
                .audioChannels(2)
                .audioBitrate(128)
                .audioCodec('libmp3lame')
                .audioQuality(5)
                .toFormat('mp3')
                .save(outputFilePath)
                .on('end', () => resolve(outputFilePath))
                .on('error', reject);
        });
        const buffer = fs.readFileSync(outputFilePath);
        const caption = `
\`\`\`
${random.title || download.title || "NO_TITLE_FOUND"}

${cpt.join("\n")}
\`\`\`
        `.trim();
        anyaV2.sendMessage(pika.chat, {
            document: buffer,
            caption: caption + `\n> ${Config.footer}`,
            fileName: (random.videoId || download.id) + '.mp3',
            mimetype: "audio/mp3",
            //contextInfo: {
            //    externalAdReply: {
            //        title: download.title || random.title,
            //        body: cpt.join(" | "),
            //        thumbnailUrl: random.thumbnail || download.thumbnail || Config.imageUrl,
            //        showAdAttribution: true,
            //        mediaType: 1,
            //        renderLargerThumbnail: true
            //    }
            //}
        }, { quoted: pika });
    }
);

//༺------------------------------------------------------------------------------------------------

anya(
        {
                name: "ytvideourl",
                alias: ['ytv2', 'ytvurl', 'ytvid2'],
                react: "🎦",
                need: "url",
                category: "download",
                desc: "Download videos using url",
                filename: __filename
        },
    async (anyaV2, pika, { db, args, prefix, command }) => {
        if (args.length < 1) return pika.reply("_Enter a youtube video url!_");
        if (!youtube.isYouTubeUrl(args[0])) return pika.reply(`_‼️ Url Needed!_\n*Use ${prefix}ytv <QUERY> for queries*`);
        const download = await youtube.downloadYtVideo(args[0]);
        if (!download.status) return pika.reply("```⚠️ API ERR```");
        pika.reply(`*Downloading • _${download.title.replace(/\*/g, "")}_*`);
        const ui = db.UI?.[0] || await new UI({ id: "userInterface" }).save();
        const cpt = [];
        if (download.likes) cpt.push(`⌈Lɪᴋᴇs⌋ : ${download.likes}`);
        if (download.views) cpt.push(`⌈Vɪᴇᴡs⌋ : ${formatNumber(download.views)}`);
        if (download.duration) cpt.push(`⌈Dᴜʀᴀᴛɪᴏɴ⌋ : ${formatRuntime(download.duration)}`);
        if (download.uploadedOn) cpt.push(`⌈UᴘʟᴏᴀᴅᴇᴅOɴ⌋ : ${download.uploadedOn}`);
        if (download.channel) cpt.push(`⌈Cʜᴀɴɴᴇʟ⌋ : ${download.channel}`);
        if (download.url) cpt.push(`⌈Uʀʟ⌋ : ${download.url || args[0]}`);
        const caption = `
\`\`\`
${download.title || "NO_TITLE_FOUND"}

${cpt.join("\n")}
\`\`\`
        `.trim();
        if (ui.buttons) {
            return anyaV2.sendButtonVideo(pika.chat, {
                video: await getBuffer(download.videoUrl),
                caption,
                footer: Config.footer,
                buttons: [{ 
                    name: "cta_url", 
                    buttonParamsJson: `{"display_text":"Get on YouTube","url":"${download.url || args[0]}","merchant_url":"${download.url || args[0]}"}`
                }]
            }, { quoted: pika });
        }
        anyaV2.sendMessage(pika.chat, {
            video: { url: download.videoUrl },
            caption: caption + `\n> ${Config.footer}`
        }, { quoted: pika });
    }
);

//༺------------------------------------------------------------------------------------------------

anya(
        {
                name: "ytaudiourl",
                alias: ['yta2', 'ytaaud2', 'ytaurl', 'ytsong', 'ytaudurl', 'song'],
                react: "🎶",
                need: "url",
                category: "download",
                desc: "Download audios using url",
                filename: __filename
        },
    async (anyaV2, pika, { db, args, prefix, command }) => {
        if (args.length < 1) return pika.reply("_Enter a youtube video url!_");
        if (!youtube.isYouTubeUrl(args[0])) return pika.reply(`_‼️ Url Needed!_\n*Use ${prefix}yta <QUERY> for queries*`);
        const download = await youtube.downloadYtAudio(args[0]);
        pika.reply(`*Downloading • _${download.title.replace(/\*/g, "")}_*`);
        if (!download.status) return pika.reply("```⚠️ API ERR```");
        const cpt = [];
        if (download.likes) cpt.push(`${download.likes} likes`);
        if (download.views) cpt.push(`${formatNumber(download.views)} views`);
        if (download.uploadedOn) cpt.push(`${download.uploadedOn}`);
        const tempDir = path.join(__dirname, '../../.temp');
        const outputFilePath = path.join(tempDir, getRandom(8));
        const file = await new Promise((resolve, reject) => {
            ffmpeg(download.audioUrl)
                .audioFrequency(44100)
                .audioChannels(2)
                .audioBitrate(128)
                .audioCodec('libmp3lame')
                .audioQuality(5)
                .toFormat('mp3')
                .save(outputFilePath)
                .on('end', () => resolve(outputFilePath))
                .on('error', reject);
        });
        const buffer = fs.readFileSync(outputFilePath);
        await anyaV2.sendMessage(pika.chat, {
                audio: buffer,
                mimetype: 'audio/mp4',
                ptt: false,
                contextInfo: {
                    externalAdReply: {
                        title: download.title,
                        body: cpt.join(" | "),
                        thumbnailUrl: download.thumbnail || Config.imageUrl,
                        showAdAttribution: true,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        sourceUrl: download.url || args[0]
                    }
                }
        }, { quoted: pika });
        fs.unlinkSync(outputFilePath);
    }
);

//༺------------------------------------------------------------------------------------------------

anya(
        {
                name: "ytvdocurl",
                alias: ['ytvideodoc2', 'ytdocvid2', 'ytvdoc2'],
                react: "📄",
                need: "url",
                category: "download",
                desc: "Download videos using url as document",
                filename: __filename
        },
    async (anyaV2, pika, { db, args, prefix, command }) => {
        if (args.length < 1) return pika.reply("_Enter a youtube video url!_");
        if (!youtube.isYouTubeUrl(args[0])) return pika.reply(`_‼️ Url Needed!_\n*Use ${prefix}ytvdoc <QUERY> for queries*`);
        const download = await youtube.downloadYtVideo(args[0]);
        pika.reply(`*Downloading • _${download.title.replace(/\*/g, "")}_*`);
        if (!download.status) return pika.reply("```⚠️ API ERR```");
        const cpt = [];
        if (download.likes) cpt.push(`⌈Lɪᴋᴇs⌋ : ${download.likes}`);
        if (download.views) cpt.push(`⌈Vɪᴇᴡs⌋ : ${formatNumber(download.views)}`);
        if (download.duration) cpt.push(`⌈Dᴜʀᴀᴛɪᴏɴ⌋ : ${formatRuntime(download.duration)}`);
        if (download.uploadedOn) cpt.push(`⌈UᴘʟᴏᴀᴅᴇᴅOɴ⌋ : ${download.uploadedOn}`);
        if (download.channel) cpt.push(`⌈Cʜᴀɴɴᴇʟ⌋ : ${download.channel}`);
        if (download.url) cpt.push(`⌈Uʀʟ⌋ : ${download.url || args[0]}`);
        const caption = `
\`\`\`
${download.title || "NO_TITLE_FOUND"}

${cpt.join("\n")}
\`\`\`
        `.trim();
        anyaV2.sendMessage(pika.chat, {
            document: { url: download.videoUrl },
            caption: caption + `\n> ${Config.footer}`,
            fileName: download.id + '.mp4',
            mimetype: "video/mp4",
            //contextInfo: {
            //    externalAdReply: {
            //        title: download.title || "NO_TITLE",
            //        body: cpt.join(" | "),
            //        thumbnailUrl: download.thumbnail || Config.imageUrl,
            //        showAdAttribution: true,
            //        mediaType: 1,
            //        renderLargerThumbnail: true
            //    }
            //}
        }, { quoted: pika });
    }
);

//༺------------------------------------------------------------------------------------------------

anya(
        {
                name: "ytadocurl",
                alias: ['ytaudiodoc2', 'ytdocaud2', 'ytadoc2'],
                react: "📄",
                need: "url",
                category: "download",
                desc: "Download audios using url as document",
                filename: __filename
        },
    async (anyaV2, pika, { db, args, prefix, command }) => {
        if (args.length < 1) return pika.reply("_Enter a youtube video url_");
        if (!youtube.isYouTubeUrl(args[0])) return pika.reply(`_‼️ Url Needed!_\n*Use ${prefix}ytadoc <QUERY> for queries*`);
        const download = await youtube.downloadYtAudio(args[0]);
        pika.reply(`*Downloading • _${download.title.replace(/\*/g, "")}_*`);
        if (!download.status) return pika.reply("```⚠️ API ERR```");
        const cpt = [];
        if (download.likes) cpt.push(`⌈Lɪᴋᴇs⌋ : ${download.likes}`);
        if (download.views) cpt.push(`⌈Vɪᴇᴡs⌋ : ${formatNumber(download.views)}`);
        if (download.duration) cpt.push(`⌈Dᴜʀᴀᴛɪᴏɴ⌋ : ${formatRuntime(download.duration)}`);
        if (download.uploadedOn) cpt.push(`⌈UᴘʟᴏᴀᴅᴇᴅOɴ⌋ : ${download.uploadedOn}`);
        if (download.channel) cpt.push(`⌈Cʜᴀɴɴᴇʟ⌋ : ${download.channel}`);
        if (download.url) cpt.push(`⌈Uʀʟ⌋ : ${download.url || args[0]}`);
        const tempDir = path.join(__dirname, '../../.temp');
        const outputFilePath = path.join(tempDir, getRandom(8));
        const file = await new Promise((resolve, reject) => {
            ffmpeg(download.audioUrl)
                .audioFrequency(44100)
                .audioChannels(2)
                .audioBitrate(128)
                .audioCodec('libmp3lame')
                .audioQuality(5)
                .toFormat('mp3')
                .save(outputFilePath)
                .on('end', () => resolve(outputFilePath))
                .on('error', reject);
        });
        const buffer = fs.readFileSync(outputFilePath);
        const caption = `
\`\`\`
${download.title || "NO_TITLE_FOUND"}

${cpt.join("\n")}
\`\`\`
        `.trim();
        anyaV2.sendMessage(pika.chat, {
            document: buffer,
            caption: caption + `\n> ${Config.footer}`,
            fileName: download.id + '.mp3',
            mimetype: "audio/mp3",
            //contextInfo: {
            //    externalAdReply: {
            //        title: download.title || "NO_TITLE",
            //        body: cpt.join(" | "),
            //        thumbnailUrl: download.thumbnail || Config.imageUrl,
            //        showAdAttribution: true,
            //        mediaType: 1,
            //        renderLargerThumbnail: true
            //    }
            //}
        }, { quoted: pika });
    }
);

//===============================================
function escapeText(text) {
    return text.replace(/["'\\]/g, '\\$&');
}
//===============================================
