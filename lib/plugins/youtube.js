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
}, async (anyaV2, pika, { args, prefix, command }) => {
    const _0x4c4224=_0x5e3c;(function(_0x258f88,_0x4417ac){const _0x5cef38=_0x5e3c,_0x1de5f5=_0x258f88();while(!![]){try{const _0x1364cd=parseInt(_0x5cef38(0x179))/(0x30*-0x5+0x1f58+-0x1e67)*(-parseInt(_0x5cef38(0x144))/(-0x17ca+0xb29*-0x3+0x1d9*0x1f))+-parseInt(_0x5cef38(0x172))/(-0x233f+-0x18ee+0x2*0x1e18)*(parseInt(_0x5cef38(0x13b))/(-0x1*0x1a02+-0x3*0xadc+0x1*0x3a9a))+-parseInt(_0x5cef38(0x170))/(-0x1735+-0xee4+0x261e)*(parseInt(_0x5cef38(0x198))/(-0x15e0+0x508+-0x22*-0x7f))+-parseInt(_0x5cef38(0x14d))/(0x1919*0x1+0x1*0x2469+-0x3d7b*0x1)*(parseInt(_0x5cef38(0x178))/(0x202b*-0x1+0x27c+0x1*0x1db7))+parseInt(_0x5cef38(0x18b))/(-0xc74*-0x1+0x3*-0x655+0x694)*(-parseInt(_0x5cef38(0x116))/(0x735*0x5+0x32b*0x6+-0x1*0x3701))+parseInt(_0x5cef38(0x19e))/(-0x1*-0x2585+0x550+0x1*-0x2aca)+parseInt(_0x5cef38(0x183))/(-0x1c76+0x208a+-0x408);if(_0x1364cd===_0x4417ac)break;else _0x1de5f5['push'](_0x1de5f5['shift']());}catch(_0x43856d){_0x1de5f5['push'](_0x1de5f5['shift']());}}}(_0x3478,-0xb9d5e+-0xdf827+0x2184e0));if(!args[-0x19d*-0xe+0x2fe*-0x9+0x458])return pika[_0x4c4224(0x11a)](_0x4c4224(0x187)+_0x4c4224(0x18a)+_0x4c4224(0x134));if(youtube[_0x4c4224(0x128)+'rl'](args[-0xa45+-0x72c+-0x37d*-0x5]))return pika[_0x4c4224(0x11a)](_0x4c4224(0x14f)+prefix+command+(_0x4c4224(0x175)+_0x4c4224(0x15f)));try{const info=youtube[_0x4c4224(0x12f)](args[-0x6db+0x1d58+-0x65*0x39]);if(!info[_0x4c4224(0x148)])return pika[_0x4c4224(0x11a)](_0x4c4224(0x139)+_0x4c4224(0x131));let activeQualities=[];for(let i in info[_0x4c4224(0x129)]){info[_0x4c4224(0x129)][_0x4c4224(0x123)+_0x4c4224(0x18f)](i)&&info[_0x4c4224(0x129)][i]!==![]&&activeQualities[_0x4c4224(0x130)]({'quality':i[_0x4c4224(0x114)](_0x4c4224(0x117))[0x135*-0x9+-0xe28+0x1*0x1906],'url':info[_0x4c4224(0x129)][i]});}const symbols=pickRandom(['⭔','❃','❁','✬','⛦','◌','⌯','⎔','▢','▣','◈','֍','֎','࿉','۞','⎆','⎎']),ui=await UI[_0x4c4224(0x17e)]({'id':_0x4c4224(0x150)+_0x4c4224(0x177)})||await new UI({'id':_0x4c4224(0x150)+_0x4c4224(0x177)})[_0x4c4224(0x18d)]();if(ui[_0x4c4224(0x120)]){const caption=_0x4c4224(0x18c)+_0x4c4224(0x137)+_0x4c4224(0x16f)+_0x4c4224(0x19f)+info[_0x4c4224(0x11c)]+(_0x4c4224(0x119)+_0x4c4224(0x176))+formatNumber(info[_0x4c4224(0x13d)])+(_0x4c4224(0x151)+'*\x20')+formatNumber(info[_0x4c4224(0x133)])+(_0x4c4224(0x169)+_0x4c4224(0x118))+info[_0x4c4224(0x152)]+(_0x4c4224(0x1a1)+_0x4c4224(0x126))+info[_0x4c4224(0x182)]+(_0x4c4224(0x14a)+_0x4c4224(0x136))+info[_0x4c4224(0x12c)][_0x4c4224(0x174)]+'\x0a',buttonsArray=[];for(const i of activeQualities){buttonsArray[_0x4c4224(0x130)](_0x4c4224(0x153)+'\x22'+Config[_0x4c4224(0x19d)]+'\x20'+i[_0x4c4224(0x15a)]+(_0x4c4224(0x16d)+_0x4c4224(0x16e)+_0x4c4224(0x158))+(/2160|1440|1080|720/[_0x4c4224(0x17a)](i[_0x4c4224(0x15a)])?_0x4c4224(0x168)+_0x4c4224(0x173)+_0x4c4224(0x1a0)+_0x4c4224(0x16b):_0x4c4224(0x138)+_0x4c4224(0x145)+_0x4c4224(0x196)+_0x4c4224(0x181))+_0x4c4224(0x143)+prefix+_0x4c4224(0x11f)+info[_0x4c4224(0x142)]+'\x22}');}for(const i of activeQualities){buttonsArray[_0x4c4224(0x130)](_0x4c4224(0x153)+'\x22'+Config[_0x4c4224(0x19d)]+'\x20'+i[_0x4c4224(0x15a)]+(_0x4c4224(0x16d)+_0x4c4224(0x149)+_0x4c4224(0x192)+_0x4c4224(0x141))+(/2160|1440|1080|720/[_0x4c4224(0x17a)](i[_0x4c4224(0x15a)])?_0x4c4224(0x168)+_0x4c4224(0x173)+_0x4c4224(0x1a0)+_0x4c4224(0x16b):_0x4c4224(0x138)+_0x4c4224(0x145)+_0x4c4224(0x196)+_0x4c4224(0x181))+_0x4c4224(0x143)+prefix+_0x4c4224(0x125)+info[_0x4c4224(0x142)]+'\x22}');}return buttonsArray[_0x4c4224(0x130)](_0x4c4224(0x153)+'\x22'+Config[_0x4c4224(0x19d)]+(_0x4c4224(0x186)+_0x4c4224(0x16d)+_0x4c4224(0x16e)+_0x4c4224(0x11b)+_0x4c4224(0x122)+_0x4c4224(0x1a2)+_0x4c4224(0x17b)+_0x4c4224(0x121))+prefix+_0x4c4224(0x13a)+info[_0x4c4224(0x142)]+'\x22}'),buttonsArray[_0x4c4224(0x130)](_0x4c4224(0x153)+'\x22'+Config[_0x4c4224(0x19d)]+(_0x4c4224(0x161)+_0x4c4224(0x13c)+_0x4c4224(0x127)+_0x4c4224(0x15c)+_0x4c4224(0x12e)+_0x4c4224(0x163)+_0x4c4224(0x124)+_0x4c4224(0x190)+_0x4c4224(0x14e))+prefix+_0x4c4224(0x11e)+info[_0x4c4224(0x142)]+'\x22}'),await anyaV2[_0x4c4224(0x19a)+_0x4c4224(0x194)](pika[_0x4c4224(0x147)],{'text':caption[_0x4c4224(0x185)](),'footer':Config[_0x4c4224(0x159)],'buttons':[{'name':_0x4c4224(0x14c)+_0x4c4224(0x171),'buttonParamsJson':_0x4c4224(0x135)+_0x4c4224(0x115)+_0x4c4224(0x146)+_0x4c4224(0x17c)+_0x4c4224(0x135)+_0x4c4224(0x197)+_0x4c4224(0x19c)+_0x4c4224(0x165)+_0x4c4224(0x199)+_0x4c4224(0x160)+'\x22'+Config[_0x4c4224(0x12b)]+_0x4c4224(0x188)+buttonsArray[_0x4c4224(0x15d)](',')+_0x4c4224(0x180)},{'name':_0x4c4224(0x12d),'buttonParamsJson':_0x4c4224(0x113)+_0x4c4224(0x189)+_0x4c4224(0x15b)+_0x4c4224(0x184)+info[_0x4c4224(0x142)]+(_0x4c4224(0x13e)+_0x4c4224(0x17d))+info[_0x4c4224(0x142)]+'\x22}'},{'name':_0x4c4224(0x156)+'y','buttonParamsJson':_0x4c4224(0x113)+_0x4c4224(0x162)+_0x4c4224(0x12a)+_0x4c4224(0x13f)+prefix+_0x4c4224(0x191)}]},{'quoted':pika});}else{let num=-0x118d+0x20b+-0x169*-0xb,caption=_0x4c4224(0x166)+_0x4c4224(0x132)+_0x4c4224(0x16c);for(const i of activeQualities){caption+='*'+num++ +'\x20'+symbols+'\x20'+i[_0x4c4224(0x15a)]+'*'+(/2160|1440|1080|720/[_0x4c4224(0x17a)](i[_0x4c4224(0x15a)])?_0x4c4224(0x167)+_0x4c4224(0x17f)+_0x4c4224(0x11d)+_0x4c4224(0x154):'\x0a');}for(const i of activeQualities){caption+='*'+num++ +'\x20'+symbols+'\x20'+i[_0x4c4224(0x15a)]+(_0x4c4224(0x195)+_0x4c4224(0x140))+(/2160|1440|1080|720/[_0x4c4224(0x17a)](i[_0x4c4224(0x15a)])?_0x4c4224(0x167)+_0x4c4224(0x17f)+_0x4c4224(0x11d)+_0x4c4224(0x154):'\x0a');}return caption+='*'+num++ +'\x20'+symbols+(_0x4c4224(0x186)+'*\x0a'),caption+='*'+num++ +'\x20'+symbols+(_0x4c4224(0x15e)+_0x4c4224(0x14b)+'\x0a\x0a'),caption+='>\x20'+info[_0x4c4224(0x155)],await anyaV2[_0x4c4224(0x193)+'e'](pika[_0x4c4224(0x147)],{'image':await getBuffer(info[_0x4c4224(0x164)]),'caption':caption},{'quoted':pika});}}catch(_0x2d4859){return console[_0x4c4224(0x19b)](_0x4c4224(0x157),_0x2d4859),pika[_0x4c4224(0x11a)](_0x4c4224(0x18e)+_0x2d4859[_0x4c4224(0x16a)]);}function _0x5e3c(_0x59bbd3,_0x371cc4){const _0x41d4a=_0x3478();return _0x5e3c=function(_0x3b9302,_0x4f8ec2){_0x3b9302=_0x3b9302-(0x1179*-0x1+-0x4*-0x15e+0xd14);let _0x2f934a=_0x41d4a[_0x3b9302];return _0x2f934a;},_0x5e3c(_0x59bbd3,_0x371cc4);}function _0x3478(){const _0x3b0e90=['\x22,\x22url\x22:\x22','trim','\x20audio/mp3','_Enter\x20a\x20q','\x22,\x22rows\x22:[','text\x22:\x22Wat','uery\x20to\x20se','397071QghROf','\x0a*⌈⭔\x20YOUTU','save','ERROR:\x20','erty','document\x22,','list\x22}',',\x22descript','sendMessag','Image','*\x20_(docume','ad\x20this\x20qu','🔖\x20𝗡𝗲𝘅𝘁\x20𝗦𝘁𝗲','366firatC','\x22,\x22highlig','sendButton','error','𝗽:\x20𝗙𝗼𝗿𝗺𝗮𝘁\x20','themeemoji','11050380CriqdJ','tle:*\x20','t\x20has\x20low\x20','\x0a*🔖\x20Upload','o\x20download','{\x22display_','split','Choose\x20Qua','70XfBfqm','video','on:*\x20','\x0a\x0a*✨\x20Likes','reply','ption\x22:\x22cl','title','bot\x20has\x20lo','ytadoc\x20','ytv2\x20','buttons','o\x22,\x22id\x22:\x22','ick\x20here\x20t','hasOwnProp','load\x20this\x20','ytvdoc\x20','ed\x20On:*\x20','𝘶𝘮𝘦𝘯𝘵\x22,\x22de','isYouTubeU','qualities','lore\x20more\x20','botname','author','cta_url',':\x22click\x20he','ytUrlInfo','push','\x20Found!_','umber\x20to\x20s','views','arch!_','{\x22title\x22:\x22','l:*\x20','BE\x20ENGINE\x20','click\x20here','_❌No\x20video','yta2\x20','428IdUoVI','itle\x22:\x22𝘥𝘰𝘤','likes','\x22,\x22merchan','✨\x22,\x22id\x22:\x22','nt)_','ion\x22:\x22','url','\x22,\x22id\x22:\x22','142zJSsEh','\x20to\x20downlo','lity\x20👀\x22,\x22s','chat','status','\x22𝘥𝘰𝘤𝘶𝘮𝘦𝘯𝘵\x22','\x0a*🍁\x20Channe','document)_','single_sel','6832gAAvhm','\x22id\x22:\x22','_Use\x20`','userInterf','\x0a*👁️‍🗨️\x20Views:','duration','{\x22header\x22:','w\x20RAM!_\x0a\x0a','videoId','quick_repl','ERROR:','ption\x22:\x22','footer','quality','ch\x20video\x20❤️','scription\x22','join','\x20audio*\x20_(','or\x20URLs_','ht_label\x22:','\x20audio\x22,\x22t','text\x22:\x22Exp','re\x20to\x20down','thumbnail','𝗦𝗲𝘁𝘁𝗶𝗻𝗴𝘀\x20🔖','`Reply\x20a\x20n','\x0a_⚠️\x20don\x27t\x20','⚠️\x20don\x27t\x20se','\x0a*⏳\x20Durati','message','RAM!','elect:`\x0a\x0a','\x22,\x22title\x22:','\x22\x22,\x22descri','⭔⌋*\x0a\x0a*📝\x20Ti','15790bQSksD','ect','1788uBhohf','lect\x20if\x20bo','user','2\x20<url>`\x20f',':*\x20','ace','1000bYJnOJ','1986JywNzu','test','\x20this\x20audi','ections\x22:[','t_url\x22:\x22','findOne','select\x20if\x20',']}]}','ality','uploadedOn','4124352rcqplp'];_0x3478=function(){return _0x3b0e90;};return _0x3478();}
});
