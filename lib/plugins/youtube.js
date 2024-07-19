const fs = require('fs');
const Config = require('../../config');
const { anya, youtube, formatNumber, getBuffer } = require('../lib');

//༺─────────────────────────────────────

anya({ name: "yts", react: "🎈", need: "query", category: "download", desc: "Search videos on YouTube", filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (!args[0]) return pika.reply("_Enter a query to search!_");
    const text = args.join(" ");
    if (youtube.isYouTubeUrl(text)) return pika.reply("_Use `" + prefix + command + "2 <url>` for URLs_");
    try {
        const info = await youtube.search(text, "videos");
        if (info.length < 1) return pika.reply("_❌ No Videos Found!_");
        let caption = "👉 _Reply with a number to get the video_\n👉 _Example: 3_\n\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n";
        for (let i = 0; i < Math.min(info.length, 24); i++) {
            const item = info[i];
            caption += `*🍁 ${i + 1}. ${item.title}*\n_👁️‍🗨️ Views: ${formatNumber(item.views)}_\n_⏳ Duration: ${item.timestamp}min_\n_🌟 Uploaded: ${item.ago}_\n_👑 Author: ${item.author.name}_\n_🔗 ${item.url} ;_\n\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n`;
        }
        caption += `> _ID: QA06_\n> ${Config.footer}`;
        return await anyaV2.sendMessage(pika.chat, {
            text: caption,
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
    } catch (err) {
        console.error("ERROR:", err);
        return pika.reply("ERROR: " + err.message);
    }
});

//༺─────────────────────────────────────

anya({ name: "ytsqualityandformateselector", notCmd: true, react: "🎈", filename: __filename
}, async (anyaV2, pika, { args }) => {
    if (!args[0]) return pika.reply("⚠️ Don't use this command!");
    if (!youtube.isYouTubeUrl(args[0])) return pika.reply("❌ Invalid YouTube URL!");
    try {
        const info = youtube.getVideoInfo(args[0]);
        let caption = "";
        caption += "*</> Reply Number: </>*\n\n";
        caption += "_1. video_\n_2. video document_\n_3. audio_\n_4. audio document_\n\n";
        caption += "> VID: " + info.id;
        caption += "\n_ID: QA33_";
        return await anyaV2.sendMessage(pika.chat, {
            image: await getBuffer(info.thumbnail),
            caption: caption
        }, { quoted: pika });
    } catch (err) {
        console.error("ERROR:", err);
        return pika.reply("ERROR: " + err.message);
    }
});


//༺─────────────────────────────────────

anya({ name: "ytv2", alias: ['video2'], react: "🥭", need: "url", category: "download", desc: "Download video using url from youtube", filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (!args[0]) return pika.reply("_Enter a video url to download!_");
    if (!youtube.isYouTubeUrl(args[0])) return pika.reply("_Use `" + prefix + "video <query>` for queries_");
    const { key } = await pika.keyMsg(Config.message.wait);
    try {
        const info = await youtube.downloadVideo(args[0]);
        if (!info.status) return pika.reply("_❌No results found!_");
        let caption = "";
        caption += "*🍓Title:* " + info.title + "\n\n";
        caption += "*👁️‍🗨️Views:* " + info.views + "\n\n";
        caption += "*⏳Duration:* " + info.duration + "\n\n";
        caption += "*📆Upload:* " + info.upload + "\n\n";
        caption += "*⚡Likes:* " + info.likes + "\n\n";
        caption += "*👤Author:* " + info.author.name + "\n\n";
        caption += "> " + Config.footer
        const buffer = await getBuffer(info.videoFormats.url360);
        await anyaV2.sendMessage(pika.chat, {
            video: buffer,
            caption: caption
        }, { quoted: pika });
        await pika.deleteMsg(key);
    } catch (err) {
        console.error("ERROR:", err);
        return pika.edit("ERROR: " + err.message, key);
    }
});

//༺─────────────────────────────────────

anya({ name: "yta2", alias: ['song2'], react: "💃", need: "url", category: "download", desc: "Download song using url from youtube", filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (!args[0]) return pika.reply("_Enter a video url to download!_");
    if (!youtube.isYouTubeUrl(args[0])) return pika.reply("_Use `" + prefix + "song <query>` for queries_");
    const { key } = await pika.keyMsg(Config.message.wait);
    try {
        const info = await youtube.downloadAudio(args[0]);
        if (!info.status) return pika.reply("_❌No results found!_");
        await anyaV2.sendMessage(pika.chat, {
            audio: info.audio,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: info.title,
                    body: info.description,
                    thumbnailUrl: info.thumbnail,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: pika });
        await pika.deleteMsg(key);
    } catch (err) {
        console.error("ERROR:", err);
        return pika.edit("ERROR: " + err.message, key);
    }
});
