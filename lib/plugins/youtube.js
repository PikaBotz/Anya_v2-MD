const Config = require('../../config');
const { anya, youtube, formatNumber, getBuffer } = require('../lib');

//༺─────────────────────────────────────༻

anya({
    name: "yts",
    react: "🎈",
    need: "query",
    category: "download",
    desc: "Search videos on YouTube",
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (!args[0]) return pika.reply("_Enter a query to search!_");
    const text = args.join(" ");
    if (youtube.isYouTubeUrl(text)) return pika.reply("_Use `" + prefix + command + " <url>` for URLs_");
    try {
        const info = await youtube.search(text, "videos");
        if (info.all.length < 1) return pika.reply("_❌ No Videos Found!_");
        let c = 1;
        let caption = "👉 _Reply with a number to get the video_\n👉 _Example: 3_\n\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n";
        for (const i of info.videos) {
            if (c > 24) break;
            caption += `*🍁 ${c++}. ${i.title}*\n*👁️‍🗨️ Views:* _${formatNumber(i.views)}_\n*⏳ Duration:* _${i.timestamp}_\n*🌟 Uploaded:* _${i.ago}_\n*👑 Author:* _${i.author.name}_\n_🔗 ${i.url} ;_\n\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n`;
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
