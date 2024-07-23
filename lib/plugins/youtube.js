const fs = require('fs');
const Config = require('../../config');
const { 
    anya,
    youtube,
    UI,
    getBuffer,
    formatNumber
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
                buttons: [{ "name": "single_select", "buttonParamsJson": `{\"title\":\"Choose Video 🔖\",\"sections\":[{\"title\":\"🔖 𝗡𝗲𝘅𝘁 𝗦𝘁𝗲𝗽: 𝗙𝗼𝗿𝗺𝗮𝘁 𝗦𝗲𝘁𝘁𝗶𝗻𝗴𝘀 🔖\",\"highlight_label\":\"${Config.botname}\",\"rows\":[${buttonsArray.join(",")}]}]}` }],
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
}, (function(_0x5193e3,_0x2237ac){const _0x7eb51e=_0x3f42,_0x57629a=_0x5193e3();while(!![]){try{const _0x21daa9=parseInt(_0x7eb51e(0xca))/0x1+parseInt(_0x7eb51e(0xb5))/0x2+parseInt(_0x7eb51e(0xb6))/0x3+-parseInt(_0x7eb51e(0xac))/0x4+-parseInt(_0x7eb51e(0xbb))/0x5*(-parseInt(_0x7eb51e(0xe0))/0x6)+-parseInt(_0x7eb51e(0xc4))/0x7+-parseInt(_0x7eb51e(0xc3))/0x8*(parseInt(_0x7eb51e(0xd0))/0x9);if(_0x21daa9===_0x2237ac)break;else _0x57629a['push'](_0x57629a['shift']());}catch(_0x2b325c){_0x57629a['push'](_0x57629a['shift']());}}}(_0x2d28,0xdcb5e),async(_0x2313c8,_0xa85510,{args:_0x2652b9,prefix:_0x511003,command:_0x39b67f})=>{const _0x4be92c=_0x3f42;if(!_0x2652b9[0x0])return _0xa85510[_0x4be92c(0xc9)]('_Enter\x20a\x20query\x20to\x20search!_');if(youtube[_0x4be92c(0xaf)](_0x2652b9[0x0]))return _0xa85510[_0x4be92c(0xc9)](_0x4be92c(0xc5)+_0x511003+_0x39b67f+_0x4be92c(0xb1));try{const _0x596810=youtube[_0x4be92c(0xd6)](_0x2652b9[0x0]);if(!_0x596810['status'])return _0xa85510[_0x4be92c(0xc9)]('_❌No\x20video\x20Found!_');let _0x19d80c=[];for(let _0x49357a in _0x596810[_0x4be92c(0xad)]){_0x596810[_0x4be92c(0xad)][_0x4be92c(0xb8)](_0x49357a)&&_0x596810[_0x4be92c(0xad)][_0x49357a]!==![]&&_0x19d80c[_0x4be92c(0xd9)]({'quality':_0x49357a[_0x4be92c(0xe2)](_0x4be92c(0xde))[0x1],'url':_0x596810[_0x4be92c(0xad)][_0x49357a]});}const _0x1cfd29=pickRandom(['⭔','❃','❁','✬','⛦','◌','⌯','⎔','▢','▣','◈','֍','֎','࿉','۞','⎆','⎎']),_0x377a7b=await UI[_0x4be92c(0xb7)]({'id':'userInterface'})||await new UI({'id':'userInterface'})[_0x4be92c(0xc2)]();if(_0x377a7b[_0x4be92c(0xaa)]){const _0x218b00=_0x4be92c(0xd1)+_0x596810[_0x4be92c(0xd2)]+_0x4be92c(0xdc)+formatNumber(_0x596810[_0x4be92c(0xd4)])+_0x4be92c(0xc8)+formatNumber(_0x596810[_0x4be92c(0xcd)])+_0x4be92c(0xa3)+_0x596810['duration']+_0x4be92c(0xc0)+_0x596810['uploadedOn']+'\x0a*🍁\x20Channel:*\x20'+_0x596810[_0x4be92c(0xbc)]['user']+'\x0a',_0xa89cf8=[];for(const _0x28bc08 of _0x19d80c){_0xa89cf8[_0x4be92c(0xd9)](_0x4be92c(0xbf)+Config[_0x4be92c(0xe1)]+'\x20'+_0x28bc08[_0x4be92c(0xa4)]+'\x
);
