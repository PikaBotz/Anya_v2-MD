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
        const caption = "```📝 Search Term: " + input + "\n🌊 Results: " + output.length + " found!```";
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
                for (const item of output.slice(0, 24)) {
                    cards.push(await anyaV2.createCardImage({
                        image: { url: item.thumbnail },
                        header: item.title,
                        footer: Config.footer,
                        caption: `> Views: _${formatNumber(item.views)}_\n> Duration: _${item.timestamp}_\n> Uploaded: _${item.ago}_`,
                        buttons: [{ "name": "cta_copy", "buttonParamsJson": `{"display_text":"Copy URL","id":"1234","copy_code":"${item.url}"}` }]
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


//===============================================
function escapeText(text) {
    return text.replace(/["'\\]/g, '\\$&');
}
//===============================================
