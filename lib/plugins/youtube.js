const fs = require('fs');
const Config = require('../../config');
const { 
    anya,
    youtube,
    UI,
    getBuffer,
    formatNumber,
    pickRandom
} = require('../lib');

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
                buttonsArray.push(`{\"header\":\"🍁 ${item.title}\",\"title\":\"${formatNumber(item.views)} views | ${item.timestamp}min\",\"description\":\"channel: ${item.author.name}\",\"id\":\"${prefix}ytsqualityandformateselector ${item.url}\"}`);
            }
            const caption = "*📝 Search Term:* " + text + "\n\n*🥵 User:* @" + pika.sender.split("@")[0] + "\n*🦋 Bot:* " + Config.botname + "\n*🌊 Results:* " + info.length + " found!";
            return await anyaV2.sendButtonImage(pika.chat, {
                image: await getBuffer("https://i.ibb.co/wcxrZVh/hero.png"),
                caption: caption,
                footer: Config.footer,
                buttons: [
                    {
                        "name": "single_select",
                        "buttonParamsJson": `{\"title\":\"Choose Video 🔖\",\"sections\":[{\"title\":\"🔖 𝗡𝗲𝘅𝘁 𝗦𝘁𝗲𝗽: 𝗙𝗼𝗿𝗺𝗮𝘁 𝗦𝗲𝘁𝘁𝗶𝗻𝗴𝘀 🔖\",\"highlight_label\":\"${Config.botname}\",\"rows\":[${buttonsArray.join(",")}]}]}`
                    },
                    {
                        "name": "cta_url",
                        "buttonParamsJson": `{\"display_text\":\"Website ⚡\",\"url\":\"${Config.socialLink}\",\"merchant_url\":\"${Config.socialLink}\"}`
                    },
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Explore more ✨\",\"id\":\"${prefix}list\"}`
                    }],
                contextInfo: { mentionedJid: [pika.sender] }
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

//༺─────────────────────────────────────

anya({
    name: "ytsqualityandformateselector",
    react: "✨",
    notCmd: true,
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (!args[0]) return pika.reply("_Enter a query to search!_");
    if (!youtube.isYouTubeUrl(args[0])) return pika.reply("_Using this command not allowed!_");
    try {
        const info = await youtube.downloadYtVideo(args[0]);
        if (!info.status) return pika.reply("_❌No video Found!_");
        let activeQualities = [];
        for (let i in info.qualities) {
            if (info.qualities.hasOwnProperty(i) && info.qualities[i] !== false) {
                activeQualities.push({ quality: i.split("video")[1], url: info.qualities[i] });
            }
        }
        const symbols = pickRandom(["⭔", "❃", "❁", "✬", "⛦", "◌", "⌯", "⎔", "▢", "▣", "◈", "֍", "֎", "࿉", "۞", "⎆", "⎎"]);
        const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());
        if (ui.buttons) {
            const caption = `
*⌈⭔ ANYA YOUTUBE ENGINE ⭔⌋*

*📝 Title:* ${info.title}

*✨ Likes:* ${formatNumber(info.likes)}
*👁️‍🗨️ Views:* ${formatNumber(info.views)}
*⏳ Duration:* ${info.duration}
*🔖 Uploaded On:* ${info.uploadedOn}
*🍁 Channel:* ${info.author.user}
`;
            const buttonsArray = [];
            for (const i of activeQualities) {
                buttonsArray.push(`{\"header\":\"${Config.themeemoji} ${i.quality}\",\"title\":\"${/2160|1440|1080|720/.test(i.quality) ? "☝🏻⚠️ 𝘥𝘰𝘯'𝘵 𝘴𝘦𝘭𝘦𝘤𝘵, 𝘪𝘧 𝘣𝘰𝘵 𝘩𝘢𝘴 𝘭𝘰𝘸 𝘙𝘈𝘔!" : "𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘵𝘰 𝘥𝘰𝘸𝘯𝘭𝘰𝘢𝘥"}\",\"description\":\"\",\"id\":\"${prefix}ytv2 ${info.url}\"}`);
            }
            for (const i of activeQualities) {
                buttonsArray.push(`{\"header\":\"${Config.themeemoji} ${i.quality} (document)\",\"title\":\"${/2160|1440|1080|720/.test(i.quality) ? "☝🏻⚠️ 𝘥𝘰𝘯'𝘵 𝘴𝘦𝘭𝘦𝘤𝘵, 𝘪𝘧 𝘣𝘰𝘵 𝘩𝘢𝘴 𝘭𝘰𝘸 𝘙𝘈𝘔!" : "𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘵𝘰 𝘥𝘰𝘸𝘯𝘭𝘰𝘢𝘥"}\",\"description\":\"\",\"id\":\"${prefix}ytvdoc ${info.url}\"}`);
            }
                buttonsArray.push(`{\"header\":\"${Config.themeemoji} audio\",\"title\":\"𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘵𝘰 𝘥𝘰𝘸𝘯𝘭𝘰𝘢𝘥 𝘵𝘩𝘪𝘴 𝘢𝘶𝘥𝘪𝘰\",\"description\":\"\",\"id\":\"${prefix}yta2 ${info.url}\"}`);
                buttonsArray.push(`{\"header\":\"${Config.themeemoji} audio (document)\",\"title\":\"𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘵𝘰 𝘥𝘰𝘸𝘯𝘭𝘰𝘢𝘥 𝘵𝘩𝘪𝘴 𝘢𝘶𝘥𝘪𝘰\",\"description\":\"\",\"id\":\"${prefix}ytadoc ${info.url}\"}`);
            return await anyaV2.sendButtonText(pika.chat, {
                text: caption.trim(),
                footer: Config.footer,
                buttons: [
                    {
                        "name": "single_select",
                        "buttonParamsJson": `{\"title\":\"Choose Quality 👀\",\"sections\":[{\"title\":\"🔖 𝗡𝗲𝘅𝘁 𝗦𝘁𝗲𝗽: 𝗙𝗼𝗿𝗺𝗮𝘁 𝗦𝗲𝘁𝘁𝗶𝗻𝗴𝘀 🔖\",\"highlight_label\":\"${Config.botname}\",\"rows\":[${buttonsArray.join(",")}]}]}`
                    },
                    {
                        "name": "cta_url",
                        "buttonParamsJson": `{\"display_text\":\"Watch video ❤️\",\"url\":\"${info.url}\",\"merchant_url\":\"${info.url}\"}`
                    },
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Explore more ✨\",\"id\":\"${prefix}list\"}`
                    }],
            }, { quoted: pika });
        } else {
            let num = 1;
            let caption = "`Reply a number to select:`\n\n";
            for (const i of activeQualities) {
                caption += "*" + num++ + " " + symbols + " " + i.quality + "*" + (/2160|1440|1080|720|480/.test(i.quality) ? " _(⚠️ crash risk!)_\n" : "\n");
            }
            for (const i of activeQualities) {
                caption += "*" + num++ + " " + symbols + " " + i.quality + "* _(📄document)_" + (/2160|1440|1080|720|480/.test(i.quality) ? " _(⚠️ crash risk!)_\n" : "\n");
            }
            caption += "*" + (num++) + " " + symbols + " audio*\n";
            caption += "*" + (num++) + " " + symbols + " audio* _(📄document)_\n\n";
            caption += "> VID: " + info.videoId + "\n";
            caption += "> _ID: QA34_";
            return await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(info.thumbnail.url),
                caption: caption
            }, { quoted: pika });
        }
    } catch (err) {
        console.error("ERROR:", err);
        return pika.reply("ERROR: " + err.message);
    }
});
