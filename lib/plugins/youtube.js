const fs = require('fs');
const Config = require('../../config');
const { anya, youtube, UI } = require('../lib');

//༺─────────────────────────────────────

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
    if (youtube.isYouTubeUrl(text)) return pika.reply("_Use `" + prefix + command + "2 <url>` for URLs_");
    try {
        const info = await youtube.search(text, "videos");
        if (info.length < 1) return pika.reply("_❌ No Videos Found!_");
        const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());
        if (ui.buttons) {
            const buttonsArray = [];
            for (let i = 0; i < Math.min(info.length, 24); i++) {
                const item = info[i];
                buttonsArray.push(`{\"header\":\"${item.title}\",\"title\":\"${formatNumber(item.views)} views | ${item.timestamp}min\",\"description\":\"channel: ${item.author.name}\",\"id\":\"${prefix}ytsqualityandformateselector ${item.url}\"}`);
            }
            const caption = "📝Search Term:* " + text + "\n\n*🥵User:* @" + pika.sender.split("@")[0] + "\n*🦋Bot:* " + Config.botname + "\n*Results:* " + info.length + " found!";
            return await anyaV2.sendButtonImage(pika.chat, {
                caption: caption,
                footer: Config.footer,
                buttons: [{ "name": "single_select", "buttonParamsJson": `{\"title\":\"Choose Video 🔖\",\"sections\":[{\"title\":\"🔖 𝗡𝗲𝘅𝘁 𝗦𝘁𝗲𝗽: 𝗙𝗼𝗿𝗺𝗮𝘁 𝗦𝗲𝘁𝘁𝗶𝗻𝗴𝘀 🔖\",\"highlight_label\":\"${Config.botname}\",\"rows\":[${buttonsArray.join(",")}]}]}` }]
            }, { quoted: pika });
        } else {
            let caption = "👉 _Reply with a number to get the video_\n👉 _Example: 3_\n\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n";
            for (let i = 0; i < Math.min(info.length, 24); i++) {
                const item = info[i];
                caption += `*🍁 ${i + 1}. ${item.title}*\n_👁️‍🗨️ Views: ${formatNumber(item.views)}_\n_⏳ Duration: ${item.timestamp}min_\n_🌟 Uploaded: ${item.ago}_\n_👑 Author: ${item.author.name}_\n_🔗 ${item.url} ;_\n\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n`;
            }
            caption += "> _ID: QA06_\n> " + Config.footer;
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
        }
    } catch (err) {
        console.error("ERROR:", err);
        return pika.reply("ERROR: " + err.message);
    }
});
