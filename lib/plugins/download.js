const Config = require('../../config');
const axios = require('axios');
const { mediafiredl, facebookdl, twitter } = require('@bochilteam/scraper');
const {
    anya,
    UI,
    getBuffer,
    getRandom,
    PinterestDownloader,
    igs,
    igdl,
    formatDate,
    RingTone,
    pickRandom
} = require('../lib');
let pinterestImageCount = 3; // Should be more than 1

//༺─────────────────────────────────────

anya({
    name: "pinterest",
    alias: ["pint"],
    react: "🍸",
    need: "query",
    category: "download",
    desc: "Search images from Pinterest",
    filename: __filename
},
async (anyaV2, pika, { db, args, prefix }) => {
    if (args.length < 1) return pika.reply("_Enter a query!_");
    const text = args.join(" ");
    if (/^https:\/\/(www\.)?pinterest\.com\/.+/i.test(text)) return pika.reply("_Use `" + prefix + "pinturl <url>` for URLs");
    if (/https:/.test(text)) return pika.reply("_❌ Invalid pinterest url!_");
    const { key } = await pika.keyMsg("```Searching...```");
    try {
        const downloader = new PinterestDownloader();
        downloader.searchPinterest(text)
        .then(async r => {
            if (r.length < 1) return pika.edit("_🅾️No results found!_", key);
            const ui = db.UI?.[0] || (await new UI({ id: "userInterface" }).save());
            if (ui.buttons) {
                const list = [];
                for (const i of r) {
                    list.push(`{\"header\":\"\",\"title\":\"${Config.themeemoji} ${i.grid_title !== "" ? i.grid_title : "No_Title"}\",\"description\":\"Creation Date: ${i.created_at}\",\"id\":\"${prefix}pinturl ${i.pin}\"}`);
                }
                const caption = `
\`📌 »» Pinterest Search!\`

*👤 Name:* _@${pika.sender.split("@")[0]}_
*🏮 Search Term:* _${text}_

_click on the button below and choose image!_
`;
                await anyaV2.sendButtonImage(pika.chat, {
                    caption: caption,
                    image: await getBuffer(r[0].images_url),
                    footer: Config.footer,
                    buttons: [{
                        "name": "single_select",
                        "buttonParamsJson": `{\"title\":\"Tap to choose 📌\",\"sections\":[{\"title\":\"Term: ${text}\",\"highlight_label\":\"Pinterest\",\"rows\":[${list.join(",")}]}]}`
                    },
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Script 🔖\",\"id\":\"${prefix}sc\"}`
                    },
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": `{\"display_text\":\"Owner 👤\",\"id\":\"${prefix}owner\"}`
                    }],
                    contextInfo: { mentionedJid: [pika.sender] }
                }, { quoted: pika });
            } else {
                let num = 1;
                for (const i of r) {
                    if (num === pinterestImageCount) return;
                    await anyaV2.sendMessage(pika.chat, {
                        image: await getBuffer(i.images_url),
                        caption: `
*💖 Title:* ${i.grid_title !== "" ? i.grid_title : "No_Title"}
*⛩️ Uploaded On:* ${i.created_at}

> Url: ${i.pin}
> ${Config.footer}
`.trim()
                    }, { quoted:pika });
                    num++
                }
            }
        });
        return pika.edit("> ✅ Searched!", key);
    } catch (err) {
        console.error(err);
        return pika.edit("ERROR!: " + err.message, key);
    }
});

//༺─────────────────────────────────────

anya({
    name: "pinturl",
    alias: ["pinteresturl"],
    react: "🏮",
    need: "url",
    category: "download",
    desc: "Search images from Pinterest using url",
    filename: __filename
},
async (anyaV2, pika, { args }) => {
    if (args.length < 1) return pika.reply("_Enter a pinterest image url!_");
    if (!/^https:\/\/(www\.)?pinterest\.com\/.+/i.test(args[0])) return pika.reply("_Invalid url!_");
    const { key } = await pika.keyMsg("```Downloading...```");
    try {
        const downloader = new PinterestDownloader();
        downloader.imageDown(args[0])
        .then(async r => {
            if (!r.url) return pika.edit("_🅾️No image found!_", key);
            await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(r.url)
            }, { quoted:pika });
            pika.edit("> ✅ Downloaded!", key);
        });
    } catch (err) {
        console.error(err);
        return pika.edit("ERROR!: " + err.message, key);
    }
});

//༺─────────────────────────────────────

anya(
    {
        name: "ringtone",
	react: "📳",
	category: "download",
	need: "text",
	desc: "Download ringtones",
	filename: __filename
    },
	async (anyaV2, pika, { args }) => {
		if (args.length < 1) return pika.reply("_❗Enter a search term._");
		const response = await RingTone(args.join(" "));
		if ((response.results.length < 1) || !response.status) return pika.reply("_❌ No Ringtone Found!_");
		const random = pickRandom(response.results);
		return await anyaV2.sendMessage(pika.chat, {
			document: { url: random.audio },
			caption: random.title,
			fileName: getRandom(8) + ".mp3",
			mimetype: "audio/mp3",
			contextInfo: {
				externalAdReply: {
					title: "𝗔𝗻𝘆𝗮 𝗥𝗶𝗻𝗴𝘁𝗼𝗻𝗲 𝗘𝗻𝗴𝗶𝗻𝗲",
					body: random.title,
					thumbnailUrl: "https://i.ibb.co/n07Pt3c/1000809200.jpg",
					showAdAttribution: true,
					mediaType: 1,
					renderLargerThumbnail: true
				}
			}
		}, { quoted:pika });
	}
)

//༺─────────────────────────────────────

anya({
            name: "mediafire",
            react: "📑",
            need: "url",
            category: "download",
            desc: "Download files from www.mediafire.com",
            filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* ${prefix + command} https://www.mediafire.com/file/5mt5qtr7nv4igt7/TmWhatsApp_v2.1_-_Stock.apk/file`);
        if (!/www.mediafire.com/.test(args.join(" "))) return pika.reply("_❎ Invalid Url_");
        const {key} = await pika.keyMsg(Config.message.wait);
        mediafiredl(args[0])
        .then(async res=> {
            const uploadDate = formatDate(res.aploud);
            await anyaV2.sendMessage(pika.chat, {
                    document: { url: res.url },
                    caption: `
❒   ✦ 𝙈𝙀𝘿𝙄𝘼𝙁𝙄𝙍𝙀 ✦   ❒

▢ *Name:* ${res.filename}
▢ *Type:* ${res.filetype}
▢ *Extension:* ${res.ext}
▢ *Size:* ${res.filesize}
▢ *Uploaded On:* ${uploadDate.date} _at_ ${uploadDate.time}

> ${Config.footer}
`.trim(),
                    fileName: res.filename,
                    mimetype: res.filetype,
                    contextInfo: {
                        externalAdReply: {
                            title: "𝗠𝗘𝗗𝗜𝗔𝗙𝗜𝗥𝗘 𝗗𝗟 𝗘𝗡𝗚𝗜𝗡𝗘",
                            body: "Owner: " + Config.ownername,
                           // thumbnail: await getBuffer(""),
                            showAdAttribution: false,
                            thumbnailUrl: "https://i.ibb.co/wz43WhM/41-Sk-Snee-W-L.png",
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
            }, {quoted:pika})
            .then(()=> pika.deleteMsg(key));
        })
        .catch(err=> {
            console.error(err);
            pika.edit("ERROR: " + err.message, key);
        });
     }
)

//༺─────────────────────────────────────

anya({
    name: "igdl",
    react: "🌠",
    need: "url",
    category: "download",
    desc: "Download Instagram Posts",
    filename: __filename
},
async (anyaV2, pika, { args, prefix, command }) => {
    if (!args[0]) return pika.reply(`Post URL needed..!`);
    if (!/instagram.com/.test(args[0])) return pika.reply(`❌Invalid Url..!`);
    const keyMsg = await pika.keyMsg(Config.message.wait);
    //try {
    //    const fetch = await axios.get(`${Config.api.api1}/api/igdlv1?url=${args.join(" ")}`);
        const response = await igdl(args[0]);
	if (!response.status || response.results.length < 1) return pika.edit("_No public video found!_", keyMsg.key);
        for (let i = 0; i < response.results.length; i++) {
            await anyaV2.sendFileUrl(pika.chat, {
                url: response.results[i].url,
                caption: `> Downloaded from Instagram`,
                mime: response.results[i].type
            }, { quoted:pika });
        }
	await pika.deleteMsg(keyMsg.key);
    //} catch (error) {
    //    pika.deleteMsg(key);
    //    return pika.reply(`Failed to download post: ${error.message}`);
    //}
});

//༺------------------------------------------------------------------------------------------------

anya(
	{
		name: "igs",
		alias: ['igstory'],
		need: "username",
		react: "💖",
		category: "download",
		cooldown: 10,
		desc: "Download Instagram account all stories",
		filename: __filename
	},
	async (anyaV2, pika, { args, prefix, command }) => {
		if (!args[0]) return pika.reply("_Enter an insta username_");
		if (/instagram.com/.test(args.join(" "))) return pika.reply("_Use `" + prefix + "igdl <URL>` for downloading using url!_");
		//const keyMsg = await pika.keyMsg(Config.message.wait);
		igs(args[0])
		.then(async response => {
			if (!response.status || response.results.length < 1) return pika.reply("_No stories or public account found!_");
			for (let i = 0; i < response.results.length; i++) {
				await anyaV2.sendFileUrl(pika.chat, {
					url: response.results[i].url,
					caption: `> Downloaded story from Instagram`,
					mime: response.results[i].type
				}, { quoted:pika });
			}
		});
		//await pika.deleteMsg(keyMsg.key);
	}
)

//༺─────────────────────────────────────

anya({
    name: "twitterdl",
    alias: ['twittervideo', 'twitvid', 'twittervid'],
    react: "💫",
    need: "url",
    category: "download",
    desc: "Download Twitter videos without watermark",
    cooldown: 10,
    filename: __filename
},
async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} https://twitter.com/someone/status/1234567890123456789`);
    if (!/twitter\.com\/\w+\/status\/\d+|x\.com\/\w+\/status\/\d+/.test(args[0])) return pika.reply("❎ Invalid URL, baka!");
    const { key } = await pika.keyMsg(Config.message.wait);
    twitter(args[0])
    .then(async res => {
        if (!res || res.length < 1) return pika.reply("❎ No results found!");        
        const highestQualityVideo = res.reduce((max, video) => (video.bitrate > max.bitrate ? video : max), res[0]);
        const videoBuffer = await getBuffer(highestQualityVideo.url);
        await anyaV2.sendMessage(pika.chat, {
            video: videoBuffer,
            caption: `
\`⎙ Twitter\`

🐦 *Quality:* ${highestQualityVideo.height}p
📌 *Link:* ${args[0]}

> ${Config.footer}
`.trim()
        }, { quoted: pika });
        return pika.edit("> ✅ Downloaded!", key);
    })
    .catch(err => {
        console.error(err);
        return pika.edit("Error! Be sure if it's a *video* url or not, or try again in 30 seconds.", key);
    });
});

//༺─────────────────────────────────────

anya({
    name: "facebook",
    alias: ['fb', 'fbdl'],
    react: "💠",
    need: "url",
    category: "download",
    desc: "Download Videos From Facebook",
    cooldown: 10,
    filename: __filename
},
async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`_Onii-chan, provide a Facebook video URL!_`);    
    if (!/facebook\.com\/watch\/|fb\.watch\//.test(args[0])) return pika.reply("❎ Invalid URL, baka!");
    const { key } = await pika.keyMsg("_Processing your request, senpai..._");
    facebookdl(args[0])
    .then(async response => {
        if (!response) return pika.reply("❎ No results found, gomen!");
        const highestQualityVideo = response.video[0];
        const videoBuffer = await getBuffer(await highestQualityVideo.download());
        await anyaV2.sendMessage(pika.chat, {
            video: videoBuffer,
            caption: `
*⎙ Facebook*

▢ *Duration:* ${response.duration}
▢ *Quality:* ${highestQualityVideo.quality}
▢ *Link:* ${args[0]}
              
> ${Config.footer}
`.trim()
        }, { quoted: pika })
        .then(() => pika.edit("> ✅ Downloaded, enjoy! 💕", key));
    })
    .catch(err => {
        console.error(err);
        pika.edit("❎ Error occurred, try again in 30 seconds, senpai.", key);
    });
});

//༺------------------------------------------------------------------------------------------------

anya(
    {
        name: "gitclone",
        alias: ['gitdl'],
        react: "🐙",
        need: "url",
        category: "download",
        desc: "Download public GitHub repositories",
        cooldown: 10,
        filename: __filename
    },
    async (anyaV2, pika, { args }) => {
        if (args.length < 1) return pika.reply("_❗Please provide a GitHub repository URL_");      
        const inputUrl = args[0];
        if (!/^https:\/\/github\.com\/[\w-]+\/[\w-]+\/?$/.test(inputUrl)) return pika.reply("_❌ The provided URL is not a valid GitHub repository URL_");
        const [author, repository] = inputUrl.replace("https://github.com/", "").split("/");
        const gitApiUrl = `https://api.github.com/repos/${author}/${repository}`;
        const zipball = `${gitApiUrl}/zipball`;
        const response = await fetch(gitApiUrl);
        const repoInfo = await response.json();
        if (!repoInfo || response.status !== 200) return pika.reply("_❌ Unable to find the repository. Please ensure the URL is correct and public._");
        const repoSizeMB = (repoInfo.size / 1024).toFixed(2);
        pika.reply(`✅ Found repository. _*${repoSizeMB} MB*_ size.`);
        await anyaV2.sendMessage(pika.chat, {
            document: { url: zipball },
            fileName: `${repoInfo.owner.login}_${repoInfo.name}.zip`,
            mimetype: 'application/zip',
            caption: `
\`\`\`Repo: ${repoInfo.name}
Author: ${repoInfo.owner.login}
Forks: ${repoInfo.forks_count}
Stars: ${repoInfo.stargazers_count}\`\`\`
            `.trim(),
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: `${repoInfo.owner.login}/${repoInfo.name}`,
                    body: repoInfo?.description || "No description available",
                    thumbnailUrl: repoInfo.owner.avatar_url,
                    sourceUrl: repoInfo?.html_url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: pika });
    }
);
