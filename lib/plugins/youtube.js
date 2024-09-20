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
                        buttons: [{ name: "quick_reply", buttonParamsJson: `{"display_text":"Get This❗","id":"${prefix}ytsqualityandformateselector ${item.url}"}` },]
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
      alias: [
          "ytv",
          "ytaudio",
          'yta', 'song', 'music',
          "ytvideo2",
          "ytv2",
          "ytaudio2",
          'yta2', 'song2', 'music2',
          "ytvdoc",
          'ytvdocument',
          "ytadoc",
          'ytadocument'
          ],
    react: "✨",
    notCmd: true,
    filename: __filename,
  },
  async (anyaV2, pika, { db, args, prefix, command }) => {
return pika.reply(`
*⚠️ Sorry For The Issue..!*

Due to youtube IP restriction our YouTube downloader APIs aren't working well.

*We'll fix the issue and announce the conditions soon, join this channel & group for updates.*

• https://whatsapp.com/channel/0029VaDIPkA6buMS9hRE7y2G

• https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX
`);
  });
//===============================================
function escapeText(text) {
    return text.replace(/["'\\]/g, '\\$&');
}
//===============================================
