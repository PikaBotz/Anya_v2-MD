const Config = require('../../config');
const axios = require('axios');
const {
    anya,
    UI,
    pikaApi,
    tiny,
    getBuffer,
    wikimedia,
    playStoreSearch,
    SoundCloudeSearch,
    SteamSearch,
    WattPad,
    trendingTwitter,
    webtoons,
    happymodSearch,
    android1,
    Wikipedia,
    konachanSearch,
    lyrics,
    gimg,
    google,
    formatDate,
    formatNumber,
    formatRuntime,
    getObjArray,
    pickRandom
} = require('../lib');
const wikimedaLimit = 5;
const googleImageLimit = 5;

//༺─────────────────────────────────────

anya(
	{
		name: "wikipedia",
		alias: ['wiki'],
		react: "🌐",
		category: "search",
		desc: "Search for information on wikipedia",
		need: "query",
		filename: __filename
	},
	async (anyaV2, pika, { args }) => {
		if (args.length < 1) return pika.reply("_What you want to sesrch❔_");
		const response = await Wikipedia(args.join(" "));
		if (!response.status) return pika.reply("_❌ Data not found!_");
		const { wiki, thumb, title } = pickRandom(response.results);
		return await anyaV2.sendMessage(pika.chat, {
			image: { url: thumb },
			caption: `
*🌐 WIKIPEDIA SEARCH 🌐*

\`🌟 Title:\` ${title}

\`${Config.themeemoji} Result:\` ${wiki}

> ${Config.footer}
`.trim()
		}, { quoted:pika });
	}
)

//༺─────────────────────────────────────

anya(
	{
		name: "konachan",
		react: "🔖",
		category: "search",
		desc: "Search 4k anime wallpapers",
		need: "query",
		filename: __filename
	},
	async (anyaV2, pika, { args }) => {
		if (args.length < 1) return pika.reply("_❗Enter a search term._");
		const { key } = await pika.keyMsg(Config.message.wait);
		const text = args.join(" ");
		const response = await konachanSearch(text);
		if (!response.results || (response?.results.length < 1)) return pika.edit("_❌Wall Not Found!_", key);
		const url = pickRandom(response.results);
		await anyaV2.sendMessage(pika.chat, {
			image: { url: url },
			caption: text
		}, { quoted:pika });
		return pika.edit("> Searched!", key);
	}
)

//༺─────────────────────────────────────

anya(
	{
		name: "an1",
		alias: ['android1'],
		react: "🥌",
		category: "search",
		desc: "Search for mod apks",
		need: "query",
		filename: __filename
	},
	async (anyaV2, pika, { args }) => {
		if (args.length < 1) return pika.reply("_Which mod apk do you want❔_");
		const response = await android1(args.join(" "));
		if (!response.status || (response?.results.length < 1)) return pika.reply("_❌No Mod Apks Found!_");
		let caption = "*🪀 ANDROID1 SEARCH ENGINE 🪀*\n\n";
		caption += `🔎 *Term:* ${args.join(" ")}\n`;
		caption += `🎖️ *Host:* _| an1.com |_\n`;
		caption += `📝 *Results:* _${response.results.length} found_`;
		caption += "\n\n•┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈•\n\n";
		let num = 1;
		for (const { title, developer, rating, link } of response.results) {
			caption += `${Config.themeemoji} *${num++}. ${title}*\n`;
			//caption += `_🧧 \`Genre:\` ${genre}_\n`;
			caption += `_👤 \`Dev:\` ${developer}_\n`;
			caption += `_🌟 \`Rating:\` ${rating}\n`;
			caption += `_🔗 ${link} ;_\n\n`;
			caption += "•- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -•\n\n";
		}
		caption += `> ${Config.footer}`;
		return await anyaV2.sendMessage(pika.chat, {
			text: caption,
			contextInfo: {
				externalAdReply: {
					showAdAttribution: true,
                    			title: `${Config.botname} ANDROID1 Engine`,
                    			body: Config.ownername,
                    			thumbnailUrl: Config.imageUrl,
					mediaType: 1,
					renderLargerThumbnail: true
				}
			}
		}, { quoted:pika });
	}
)

//༺─────────────────────────────────────

anya(
	{
		name: "happymod",
		alias: ['hm'],
		react: "😈",
		category: "search",
		desc: "Search for mod APKs on happymod",
		need: "query",
		filename: __filename
	},
	async (anyaV2, pika, { db, args, prefix, command }) => {
		if (args.length < 1) return pika.reply("_Which mod apk do you want❓_");
	    const text = args.join(" ");
		if (text.includes('https://happymod.com/')) return pika.reply('_Use `' + prefix + command + 'dl <url>` for URLs_');
	    const response = await happymodSearch(text);
	    if (!response.status || (response?.results.length < 1)) return pika.reply("_❌No APK Found!_");
	    const ui = db.UI?.[0] || (await new UI({ id: "userInterface" }).save());
	    if (ui.buttons) {
			const list = [];
			for (const { link, title, rating } of response.results) {
				list.push(`{\"header\":\"\",\"title\":\"${Config.themeemoji} ${title}\",\"description\":\"ratings: ${rating}\",\"id\":\"${prefix + command}dl ${link}\"}`);
		    }
			const caption = `
*😈 𝙷𝚊𝚙𝚙𝚢𝚖𝚘𝚍 𝚂𝚎𝚊𝚛𝚌𝚑 𝙴𝚗𝚐𝚒𝚗𝚎 😈*

🔎 *Term:* ${text}
⛩️ *Host:* _| HappyMod.com |_
📝 *Results:* _${response.results.length} found_

_click on the button below to download!_
`.trim();
			await anyaV2.sendButtonImage(pika.chat, {
				caption: caption,
				image: await getBuffer(response.results[0].thumbnail),
				footer: Config.footer,
				buttons: [{
					"name": "single_select",
                                        "buttonParamsJson": `{\"title\":\"Get APKs 🔮\",\"sections\":[{\"title\":\"🔍Term: ${text}\",\"highlight_label\":\"HappyMod\",\"rows\":[${list.join(",")}]}]}`
				}]
			}, { quoted: pika });
		} else {
			let caption = "*➣ REPLY A NUMBER TO DOWNLOAD APK:*\n\n";
			caption += "•┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈•\n\n";
			let num = 1;
			for (const { link, title, rating } of response.results) {
				caption += `${Config.themeemoji} *${num++}. ${title.trim()}*\n`;
				caption += `_🌟 Rattlings: ${rating}_\n`;
				//caption += `_👤 Devs: ${developer}_\n`;
				caption += `_🔗 ${link} ;_\n\n`;
				caption += "•- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -•\n\n";
			}
		        caption += `> ${Config.footer}\n> _ID: QA43_`;
			return await anyaV2.sendMessage(pika.chat, {
				text: caption,
				contextInfo: {
					externalAdReply: {
						showAdAttribution: true,
						title: `${Config.botname} HAPPYMOD Engine`,
                             			body: 'Reply with a number to download app',
                        			thumbnailUrl: response.results[0].thumbnail,
						mediaType: 1,
						renderLargerThumbnail: true
					}
				}
			}, { quoted:pika });
		}
	}
)

//༺─────────────────────────────────────

anya(
	{
		name: "webtoons",
		alias: ['webtoon'],
		react: "🔮",
		category: "search",
		desc: "Search for comics",
		need: "query",
		filename: __filename
	},
	async (anyaV2, pika, { args }) => {
		if (args.length < 1) return pika.reply("_Which comic do you want❓_");
		const response = await webtoons(args.join(" "));
		if (!response.status || (response?.results.length < 1)) return pika.reply("_❌No Comic Found!_");
		let caption = "*⛩️ WEBTOONS SEARCH ENGINE ⛩️*\n\n";
		caption += `🔎 *Term:* ${args.join(" ")}\n`;
		caption += `☁️ *Host:* _| Webtoons.net |_\n`;
		caption += `📝 *Results:* _${response.results.length} found_`;
		caption += "\n\n•┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈•\n\n";
		let num = 1;
		for (const { title, genre, author, likes, link } of response.results) {
			caption += `${Config.themeemoji} *${num++}. ${title}*\n`;
			caption += `_🧧 \`Genre:\` ${genre}_\n`;
			caption += `_👤 \`Author:\` ${author}_\n`;
			caption += `_📈 \`Likes:\` ${Number(likes.replace(/,/g, ''))}_\n`;
			caption += `_🔗 ${link} ;_\n\n`;
			caption += "•- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -•\n\n";
		}
		caption += `> ${Config.footer}`;
		return await anyaV2.sendMessage(pika.chat, {
			text: caption,
			contextInfo: {
				externalAdReply: {
					showAdAttribution: true,
                    			title: `${Config.botname} WEBTOONS Engine`,
                    			body: Config.ownername,
                    			thumbnailUrl: "https://iili.io/d1VhZLx.jpg",
					mediaType: 1,
					renderLargerThumbnail: true
				}
			}
		}, { quoted:pika });
	}
)

//༺─────────────────────────────────────

anya(
	{
		name: "tth",
		react: "#️⃣",
		category: "search",
		desc: "Search trending twitter hashtags of given countries",
		need: "query",
		filename: __filename
	},
	async (anyaV2, pika, { args, prefix, command }) => {
		if (args.length < 1) return pika.reply("_*❗Enter a country name.*_\ne.g. `" + prefix + command + " india`");
		const response = await trendingTwitter(args.join(" "));
		if (!response.status || (response?.results < 1)) return pika.reply("_❌ Found Nothing!_");
		let caption = "*✦ TWITTER TRENDING HASH ✦*\n\n";
		caption += `_🌐 \`Country:\` ${response.country}_\n`;
		caption += `_🧧 \`Trendings:\` ${response.results.length} hashtags_\n\n`;
		caption += "➥ \`RANK..!:\`\n";
		let num = 1;
		for (const { rank, hashtag, tweet } of response.results) {
			caption += num++ + ". *" + hashtag + "*\n";
			caption += "- _🎖️rank: " + rank + "_\n";
			caption += "- _🍒tweets: " + tweet + "_\n\n";
		}
		caption += `> ${Config.footer}`;
		return pika.reply(caption);
	}
)

//༺─────────────────────────────────────

anya(
	{
		name: "wattpad",
		react: "👀",
		category: "search",
		desc: "Search stories using query on wattpad",
		need: "query",
		filename: __filename
	},
	async (anyaV2, pika, { db, args, prefix }) => {
		if (args.length < 1) return pika.reply("_Which story do you wanna search ❓_");
		const text = args.join(" ");
		if (text.includes("https://www.wattpad.com/story/")) return pika.reply("_Use `" + prefix + "wattread <url>` for URLs_");
		const response = await WattPad(text);
		if (!response.status || (response?.results.length < 1)) return pika.reply("_❌ No Story Found._");
		const ui = db.UI?.[0] || (await new UI({ id: "userInterface" }).save());
		const num = 1;
		const stories = response.results.map(({ link, vote, reads, title }) => ({
			title,
			link,
			vote: Number(vote.replace(/,/g, '')),
			reads: Number(reads.replace(/,/g, '')),
		}));
		if (ui.buttons) {
			const list = stories.map(({ title, vote, reads, link }) => 
				`{\"header\":\"\",\"title\":\"${Config.themeemoji} ${title}\",\"description\":\"${formatNumber(vote)} votes with ${formatNumber(reads)} reads\",\"id\":\"${prefix}wattread ${link}\"}`
			).join(",");
			const caption = `
*🧩 𝐖𝐚𝐭𝐭𝐏𝐚𝐝 𝐒𝐞𝐚𝐫𝐜𝐡 𝐄𝐧𝐠𝐢𝐧𝐞 🧩*

🔎 *Term:* ${text}
🌊 *Host:* _| WattPad.com |_
📝 *Results:* _${response.results.length} found_

_click on the button below to read story!_
`.trim();
			await anyaV2.sendButtonImage(pika.chat, {
				caption,
				image: { url: "https://iili.io/d1R6UAJ.jpg" },
				footer: Config.footer,
				buttons: [{
					"name": "single_select",
					"buttonParamsJson": `{\"title\":\"See Results 〽️\",\"sections\":[{\"title\":\"🔍Term: ${text}\",\"highlight_label\":\"WattPad\",\"rows\":[${list}]}]}`
				}]
			}, { quoted: pika });
		} else {
			let caption = "*➣ REPLY A NUMBER TO READ:*\n\n";
			stories.forEach(({ title, vote, reads, link }, index) => {
				caption += `${Config.themeemoji} *${index + 1}. ${title}*\n`;
				caption += `_\`🧧 Reads:\` ${formatNumber(reads)}_\n`;
				caption += `_\`📈 Votes:\` ${formatNumber(vote)}_\n`;
				caption += `_🔗 ${link} ;_\n\n`;
				caption += "•- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -•\n\n";
			});
			caption += `> ${Config.footer}\n> _ID: QA42_`;
			return await anyaV2.sendMessage(pika.chat, {
				text: caption,
				contextInfo: {
					externalAdReply: {
						showAdAttribution: true,
						title: `${Config.botname} WATTPAD Engine`,
						body: 'Reply with a number to read',
						thumbnailUrl: "https://iili.io/d1R6UAJ.jpg",
						mediaType: 1,
						renderLargerThumbnail: true
					}
				}
			}, { quoted: pika });
		}
	}
);

//༺─────────────────────────────────────

anya(
	{
		name: "steam",
		react: "🚂",
		category: "search",
		desc: "Search PC games",
		cooldown: 8,
		need: "query",
		filename: __filename
	},
	async (anyaV2, pika, { args }) => {
	    if (args.length < 1) return pika.reply("_Which song do you wanna search ❓_");
	    const text = args.join(" ");
	    const response = await SteamSearch(text);
	    if (!response.status || !response.results || (response.results.length < 1)) return pika.reply("_❌ No Result Found!_");
	    let caption = `
*🧩 𝐒𝐭𝐞𝐚𝐦 𝐒𝐞𝐚𝐫𝐜𝐡 𝐄𝐧𝐠𝐢𝐧𝐞 🧩*

> 🔎 *Term:* ${text}
> 🍜 *Host:* _| SteamPowered.com |_
> 📝 *Results:* _${response.results.length} found_

`.trim();
	    caption += "\n\n•┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈•\n\n";
	    let num = 1;
	    for (const { title, link, releaseDate, rating } of response.results) {
		    caption += `${Config.themeemoji} *${num++}. ${title}*\n`;
		    caption += `> _🌟 \`Rate:\` ${rating}_\n`;
		    caption += `> _📆 \`Released On:\` ${releaseDate !== "" ? releaseDate : "NO_DATE"}_\n`;
		    caption += `> _🔗 ${link} ;_\n\n`;
		    caption += "•- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -•\n\n";
	    }
	    caption += `> ${Config.footer}`;
	    return await anyaV2.sendMessage(pika.chat, {
		    text: caption,
		    contextInfo: {
			externalAdReply: {
				showAdAttribution: true,
				title: `${Config.botname} STEAM SEARCH Engine`,
				body: 'Reply with a number to download song',
				thumbnailUrl: "https://iili.io/d1ijBkl.jpg",
				mediaType: 1,
				renderLargerThumbnail: true
			}
		  }
	    }, { quoted:pika });
	}
)

//༺─────────────────────────────────────

anya(
	{
		name: "soundcloud",
		alias: ['scs', 'sss'],
		react: "🎵",
		need: "query",
		category: "search",
		desc: "Search on Sound Cloud",
		cooldown: 8,
		filename: __filename
	},
	async (anyaV2, pika, { db, args, prefix, command }) => {
	    if (args.length < 1) return pika.reply("_Which song do you wanna search ❓_");
	    const text = args.join(" ");
	    if (text.includes('https://on.soundcloud.com/')) return pika.reply("_Use `" + prefix + "soundclouddl <url>` for URLs!_");
	    const response = await SoundCloudeSearch(text);
	    if ((response.results.length < 1) || !response.status) return pika.reply("_❌ No Song Result Found!_");
	    const ui = db.UI?.[0] || (await new UI({ id: "userInterface" }).save());
	    if (ui.buttons) {
			const list = [];
			for (const { link, title } of response.results) {
				list.push(`{\"header\":\"\",\"title\":\"${Config.themeemoji} ${title}\",\"description\":\"click here to download\",\"id\":\"${prefix}SoundClouddl ${link}\"}`);
		    }
			const caption = `
*💖 𝐒𝐨𝐮𝐧𝐝 𝐂𝐥𝐨𝐮𝐝 𝐒𝐞𝐚𝐫𝐜𝐡 𝐄𝐧𝐠𝐢𝐧𝐞 💖*

🔎 *Term:* ${text}
💖 *Host:* _| SoundCloud.com |_
📝 *Results:* _${response.results.length} found_

_click on the button below to download song!_
`.trim();
			await anyaV2.sendButtonImage(pika.chat, {
				caption: caption,
				image: await getBuffer("https://iili.io/d0Q6MN4.jpg"),
				footer: Config.footer,
				buttons: [{
                        "name": "single_select",
                        "buttonParamsJson": `{\"title\":\"See Results 🔊\",\"sections\":[{\"title\":\"🔍Term: ${text}\",\"highlight_label\":\"Sound Cloud\",\"rows\":[${list.join(",")}]}]}`
				}]
			}, { quoted: pika });
		} else {
			let caption = "*➣ REPLY A NUMBER TO DOWNLOAD SONG:*\n\n";
			caption += "•┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈•\n\n";
			let num = 1;
			for (const { link, title } of response.results) {
				caption += `${Config.themeemoji} *${num++}. ${title}*\n`;
				//caption += `_🌟 Rattlings: ${rate}_\n`;
				//caption += `_👤 Devs: ${developer}_\n`;
				caption += `_🔗 ${link} ;_\n\n`;
				//caption += "•- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -•\n\n";
			}
		        caption += `> ${Config.footer}\n> _ID: QA41_`;
			return await anyaV2.sendMessage(pika.chat, {
				text: caption,
				contextInfo: {
					externalAdReply: {
						showAdAttribution: true,
                                                title: `${Config.botname} SOUND CLOUD Engine`,
                                                body: 'Reply with a number to download song',
                                                thumbnailUrl: "https://iili.io/d0Q6MN4.jpg",
						mediaType: 1,
						renderLargerThumbnail: true
					}
				}
			}, { quoted:pika });
		}
	}
)

//༺─────────────────────────────────────

anya(
	{
		name: "playstore",
		alias: ['ps'],
		react: "🍎",
		category: "search",
		need: "query",
		desc: "Search on Play Store",
		cooldown: 8,
		filename: __filename
	},
	async (anyaV2, pika, { db, args, prefix, command }) => {
	    if (args.length < 1) return pika.reply("_Which app do you wanna search ❓_");
	    const text = args.join(" ");
	    if (text.includes('https://play.google.com/store/apps/details?id=')) return pika.reply("_Use `" + prefix + command + "dl <url>` for URLs!_");
	    const response = await playStoreSearch(text);
	    if ((response.results.length < 1) || !response.status) return pika.reply("_❌ No Search Result Found!_");
	    const ui = db.UI?.[0] || (await new UI({ id: "userInterface" }).save());
	    if (ui.buttons) {
			const list = [];
			for (const { link, name, developer, rate_string } of response.results) {
				list.push(`{\"header\":\"${Config.themeemoji} ${name ? name : "No_Title"}\",\"title\":\"by: ${developer ? developer : "Not Found"}\",\"description\":\"${rate_string}\",\"id\":\"${prefix + command}dl ${link}\"}`);
		    }
			const caption = `
*❤️‍🩹 𝐏𝐥𝐚𝐲 𝐒𝐭𝐨𝐫𝐞 𝐒𝐞𝐚𝐫𝐜𝐡 𝐄𝐧𝐠𝐢𝐧𝐞 ❤️‍🩹*

🔎 *Term:* ${text}
💖 *Host:* _Play Store_
📝 *Results:* _${response.results.length} found_

_click on the button below to download!_
`.trim();
			await anyaV2.sendButtonImage(pika.chat, {
				caption: caption,
				image: await getBuffer("https://iili.io/d06OGAG.jpg"),
				footer: Config.footer,
				buttons: [{
                        "name": "single_select",
                        "buttonParamsJson": `{\"title\":\"See Results 📌\",\"sections\":[{\"title\":\"🔍Term: ${text}\",\"highlight_label\":\"Playstore\",\"rows\":[${list.join(",")}]}]}`
				}]
			}, { quoted: pika });
		} else {
			let caption = "*➣ REPLY A NUMBER TO DOWNLOAD:*\n\n";
			caption += "•┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈•\n\n";
			let num = 1;
			for (const { link, name, developer, rate } of response.results) {
				caption += `${Config.themeemoji} *${num++}. ${name}*\n`;
				caption += `_🌟 Rattlings: ${rate}_\n`;
				caption += `_👤 Devs: ${developer}_\n`;
				caption += `_🔗 ${link} ;_\n\n`;
				caption += "•- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -•\n\n";
			}
		        caption += `> ${Config.footer}\n> _ID: QA40_`;
			return await anyaV2.sendMessage(pika.chat, {
				text: caption,
				contextInfo: {
					externalAdReply: {
						showAdAttribution: true,
                                                title: `${Config.botname} PLAY STORE Engine`,
                                                body: 'Reply with a number to download app',
                                                thumbnailUrl: "https://iili.io/d06OGAG.jpg",
						mediaType: 1,
						renderLargerThumbnail: true
					}
				}
			}, { quoted:pika });
		}
	}
)

//༺─────────────────────────────────────

anya({
            name: "wikimedia",
            react: "📑",
            need: "query",
            category: "search",
            desc: `Search and get ${wikimedaLimit} images from Wikipedia media`,
            cooldown: 8,
            filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} Anime Origin`);
        const {key} = await pika.keyMsg(Config.message.wait);
        wikimedia(encodeURIComponent(args.join(" ")))
        .then(async res=> {
            let min = 1;
            for (const i of res) {
                if (min > wikimedaLimit) break;
                min++
                await anyaV2.sendMessage(pika.chat, {
                    image: await getBuffer(i.image),
                    caption: `*💠 𝚃𝚒𝚝𝚕𝚎 :* ${i.title}\n*🍜 𝚂𝚘𝚞𝚛𝚌𝚎 :* ${i.source}`
                },
                {
                    quoted:pika
                });
            }
        })
        .then(()=> pika.deleteMsg(key))
        .catch(err=> {
            console.error(err);
            pika.edit(Config.message.error, key);
        })
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "lyrics",
            alias: ['lyric'],
            react: "🎼",
            need: "query",
            category: "search",
            desc: "Search song lyrics",
            cooldown: 8,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} Dandelions by ruth B`);
        lyrics(encodeURIComponent(args.join(" ")))
        .then(async res=> {
            return anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(res.thumb),
                caption: res.lyrics
            },
            {
                quoted:pika
            });
        })
        .catch(err=> {
            console.error(err);
            axios.get(`https://lyrist.vercel.app/api/${encodeURIComponent(args.join(" "))}`)
            .then(async ({data})=> {
                return anyaV2.sendMessage(pika.chat, {
                        image: await getBuffer(data.image),
                        caption: `*${Config.themeemoji}Title:* ${data.title}\n*${Config.themeemoji}Lyrics:*\n\n${data.lyrics}`
                }, { quoted:pika });
            })
            .catch(err=> {
                console.error(err);
                pika.reply("*Not Found! Please Use Different Keywords!*");
            });
        });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "npm",
            react: "📦",
            need: "query",
            category: "search",
            desc: "Search module info from NPM",
            cooldown: 10,
            filename: __filename
    }, async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} chalk`);
    axios.get(`https://api.npms.io/v2/search?q=${encodeURIComponent(args[0].toLowerCase())}`)
        .then(async response => {
            const { data } = response;
            const matchingPackages = data.results.filter(pkg => pkg.package.name === args[0].toLowerCase());
            if (matchingPackages.length < 1) return pika.reply("❎ No Results Found!");
            const pkg = matchingPackages[0].package;
            const uploaded = formatDate(pkg.date);
            let links = '';
            for (const i of getObjArray(pkg.links)) {
                links += `\n> *${tiny(i.key.charAt(0).toUpperCase() + i.key.slice(1))}:* ${i.url}`;
            }
            let maintainers = '';
            for (const i of pkg.maintainers) {
                maintainers += `\n> *Usᴇʀɴᴀᴍᴇ:* @${i.username}\n  - *Eᴍᴀɪʟ:* ${i.email}\n`;
            }
            const readmore = String.fromCharCode(8206).repeat(4001);
            return await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer("https://i.ibb.co/zNPdJr5/npm.png"),
                caption: `
*>>> 🇳 🇵 🇲  • 🇨 🇭 🇪 🇨 🇰 <<<*

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
▢ *Nᴀᴍᴇ:* ${pkg.name}
▢ *Sᴄᴏᴘᴇ:* ${pkg.scope}
▢ *Vᴇʀsɪᴏɴ:* v${pkg.version}
▢ *Uᴘʟᴏᴀᴅᴇᴅ Oɴ:* ${uploaded.date}
▢ *Oᴡɴᴇʀ Nᴀᴍᴇ:* @${pkg.publisher.username}
▢ *Oᴡɴᴇʀ Eᴍᴀɪʟ:* ${pkg.publisher.email}
${readmore}┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
▢ *Kᴇʏᴡᴏʀᴅs:* ${(pkg?.keywords?.length > 0) ? pkg.keywords.join(", ") : 'No Keywords' || "N/A"}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
▢ *Lɪɴᴋs:*${links}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
▢ *Mᴀɪɴᴛᴀɪɴᴇʀs:*\n${maintainers}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
▢ *Sᴄᴏʀᴇs:*
    - *Fɪɴᴀʟ:* ${(matchingPackages[0].score.final * 10).toFixed(0)}/10
    - *Qᴜᴀʟɪᴛʏ:* ${(matchingPackages[0].score.detail.quality * 10).toFixed(0)}/10
    - *Pᴏᴘᴜʟᴀʀɪᴛʏ:* ${(matchingPackages[0].score.detail.popularity* 10).toFixed(0)}/10
    - *Mᴀɪɴᴛᴇɴᴀɴᴄᴇ:* ${(matchingPackages[0].score.detail.maintenance * 10).toFixed(0)}/10
    - *Sᴇᴀʀᴄʜᴇᴅ:* ${(matchingPackages[0].searchScore / 10000).toFixed(0)}/10
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

> ${Config.footer}
`.trim()
            },
            {
                quoted:pika
            });
        })
        .catch(err => {
            console.error(err);
            return pika.reply("❎ Too much traffic!! try again in 15 secs");
        });
    }
)

//༺─────────────────────────────────────༻

anya({
            name: "imdb",
            alias: ['movie', 'film'],
            react: "🍿",
            need: "query",
            category: "search",
            desc: "Find latest movie details from IMDB.com",
            cooldown: 15,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} Game Of Thrones`);
        axios.get(`https://www.omdbapi.com/?apikey=d05b607e&t=${encodeURIComponent(args.join(" "))}&plot=full`)
        .then(async response=> {
            const {data} = response;
            if (data.Response === 'False') return pika.reply("❎ " + data.Error);
            return await anyaV2.sendMessage(pika.chat,
                    {
                        image: await getBuffer(data.Poster),
                        caption: `
═══════════════════════
        ░▒▓ \`\`\`IMDB ENGINE\`\`\` ▓▒░
═══════════════════════

*🎬Title :* ${data.Title}
*💬Type :* ${data.Type}
*🌤️Seasons :* ${data.totalSeasons !== undefined ? data.totalSeasons : 'N/A'}
*📅Year :* ${data.Year}
*⭐Rated :* ${data.Rated}
*📆Released :* ${data.Released}
*⏳Runtime :* ${data.Runtime !== 'N/A' ? formatRuntime(parseInt(data.Runtime) * 60) : 'N/A'}
*🌀Genre :* ${data.Genre}
*🌐Language :* ${data.Language}
*🌍Country :* ${data.Country}
*🎖️Awards :* ${data.Awards}
*📦BoxOffice :* ${data.BoxOffice !== undefined ? data.BoxOffice : 'N/A'}
*🏙️Production :* ${data.Production !== undefined ? data.Production : 'N/A'}
*🌟imdbRating :* ${data.imdbRating}
*🗳️imdbVotes :* ${data.imdbVotes}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*👨🏻‍💻Director :* ${data.Director}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*✍🏻Writer :* ${data.Writer}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*🧑🏻‍💼Actors :* ${data.Actors}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*📃Plot :* ${data.Plot}

> ${Config.footer}
`.trim()
                    },
                    {
                        quoted:pika
                    });
        })
        .catch(err=> {
            console.error(err);
            pika.reply(Config.message.error);
        });
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "weather",
            react: "🌁",
            need: "query",
            category: "search",
            desc: "Get live weather reports of a specific city",
            cooldown: 10,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} Assam`);
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(args.join(" "))}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`)
        .then(async res=> {
            const {data} = res;
            if (data.cod === 404) return pika.reply(`❎ City ${args.join(" ")} not found!`);
            return await anyaV2.sendMessage(pika.chat, {
                    video: await getBuffer("https://media.tenor.com/bC57J4v11UcAAAPo/weather-sunny.mp4"),
                    gifPlayback: true,
                    caption: `
\`\`\`🌦️ Weather Reporting ${data.name}\`\`\`

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*🌐 Coord:-*
    - 🌍 longitude : ${data.coord.lon}
    - 🌏 latitude : ${data.coord.lat}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*☁️ Weather:-*
    - id : ${data.weather[0].id}
    - main : ${data.weather[0].main}
    - desc : ${data.weather[0].description}
    - icon : ${String.fromCodePoint(parseInt('0x' + data.weather[0].icon))}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*🌡️ Main:-*
    - 🌡️ temp : ${data.main.temp}°C
    - 👣 feels Like : ${data.main.feels_like}°C
    - 🥶 temp. Min. : ${data.main.temp_min}°C
    - 🥵 temp. Max. : ${data.main.temp_max}°C
    - 🌬️ pressure : ${data.main.pressure}hPa
    - 💧 humidity : ${data.main.humidity}%
    - 🌊 sea level : ${data.main.sea_level !== undefined ? data.main.sea_level + 'hPa' : 'N/A'}
    - 🌎 ground level : ${data.main.grnd_level !== undefined ? data.main.grnd_level + 'hPa' : 'N/A'}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*💨 wind:-*
    - 💫 speed : ${data.wind.speed}m/s
    - 🧭 direction : ${data.wind.deg}°
    - 💨 gust : ${data.wind.gust !== undefined ? data.wind.gust + 'm/s' : 'N/A'}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*🌞 Sys:*
    - 🌍 country : ${data.sys.country}
    - 🌅 sunrise : ${(new Date(data.sys.sunrise * 1000)).toLocaleString().split(", ")[1]}
    - 🌇 sunset : ${(new Date(data.sys.sunset * 1000)).toLocaleString().split(", ")[1]}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*☁️ Clouds:-* ${data.clouds.all}%
*📆 Update Date:-* ${(new Date(data.dt * 1000)).toLocaleString().split(", ")[0]}
*🕒 Update Time:-* ${(new Date(data.dt * 1000)).toLocaleString().split(", ")[1]}
*👁️ Visibility:-* ${data.visibility / 1000}km
*🏢 Source:-* ${data.base}
*🏙️ City:-* ${data.name}

> ${Config.footer}
`.trim()
                    }, { quoted: pika });
        })
        .catch(err=> {
            console.error(err);
            pika.reply("❎ Error, please check the city name again or try again later.");
        });
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "search",
            alias: ['google', 'g'],
            react: "🌐",
            need: "query",
            category: "search",
            desc: "Search from Google website",
            cooldown: 10,
            filename: __filename
     }, async (anyaV2, pika, { args }) => {
        if (args.length < 1) return pika.reply("_❗Enter a search term!_");
	const input = args.join(" ");
        google(input)
        .then(async (response)=> {
            if (!response.status || response.results < 1) return pika.reply("_❎No results found!_");
            let caption = `\`\`\`🌐 Google Search Engine\`\`\`

❒ *Results For :* _${input}_
❒ *Results Found :* _${response.results.length}_
❒ *Sesrch Engine :* www.google.com

════════════════════════
`;
            for (const i of response.results) {
                caption += `\n❖ *Title:* ${i.title}\n`;
                caption += `> ❖ *Link:* ${i.link}\n`;
                caption += `> ❖ *About:* ${i.description || "NO_DESC"}\n`;
//                caption += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
            }
            caption += `\n${Config.footer}`;
            pika.reply(caption);
        });
     }
)

//༺─────────────────────────────────────༻

anya(
            {
                        name: "gimg",
                        alias: ['googleimage', 'image'],
                        react: "🌌",
                        need: "query",
                        category: "search",
                        desc: `Search ${googleImageLimit} images from Google`,
                        filename: __filename
            }, async (anyaV2, pika, { args, prefix, command }) => {
    if (!args.length) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} 2 mug 1 girl`);
    const { key } = await pika.keyMsg(Config.message.wait);
    try {
        const response = await gimg(args.join(" "));
        if (!response.length) return pika.edit("*❎ No Results Found!*", key);
        for (let i = 0; i < Math.min(googleImageLimit, response.length); i++) {
            const buffer = await getBuffer(response[i]);
            await anyaV2.sendMessage(pika.chat, {
                image: buffer,
                caption: tiny("Searched By " + Config.botname)
            }, { quoted: pika });
        }
        await pika.deleteMsg(key);
    } catch (err) {
        console.error(err);
        pika.edit(Config.message.error, key);
    }
});
