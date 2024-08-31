const Config = require('../../config');
const {
	anya,
	commands,
	UI,
	formatRuntime,
	getMemoryInfo
} = require('../lib');

//༺─────────────────────────────────────

anya(
	{
		name: "alive",
		alias: ['hey'],
		react: "👋🏻",
		category: "core",
		desc: "Bot will say it's alive",
		filename: __filename
	},
	async (anyaV2, pika, { prefix }) => {
		const bot = await Bot.findOne({ id: 'anyabot' });
		const os = require('os');
		const { commands } = require('../lib');
		const caption = `\`\`\`${Config.themeemoji} WABot Information ${Config.themeemoji}

> ✦ 𝚄𝚜𝚎𝚛 : @${pika.sender.split("@")[0]}
> ✦ 𝙱𝚘𝚝 : ${Config.botname}
> ✦ 𝙾𝚠𝚗𝚎𝚛 : ${Config.ownername}
> ✦ 𝙿𝚕𝚞𝚐𝚒𝚗𝚜 : ${commands.length}
> ✦ 𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : ${require('../../package.json').version}
> ✦ 𝙿𝚕𝚊𝚝𝚏𝚘𝚛𝚖 : ${os.platform()}

> *▢* I'm alive from _${formatRuntime(process.uptime()).trim()}_.
> *▢* Used _${getMemoryInfo().usedMemory}_ out of _${getMemoryInfo().totalMemory}_ memory.`;
		const footText = `R𝚎𝚙𝚕𝚢 A N𝚞𝚖𝚋𝚎𝚛 T𝚘 G𝚎𝚝:\n   1 Allmenu\n   2 MenuList\n> _ID: QA01_`;

		// menu message types
		const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());

		// Text message
		if (ui.alive === 1) return pika.reply(caption.trim());

		// Image message
		else if (ui.alive === 2) return await anyaV2.sendMessage(pika.chat, {
			image: Config.image_2,
			caption: `${caption.trim()}\n\n${footText}`
		}, { quoted: pika });

		// Text Ad message
		else if (ui.alive === 3) return await anyaV2.sendMessage(pika.chat, {
			text: `${caption.trim()}\n\n${footText}`,
			contextInfo: {
				externalAdReply: {
					showAdAttribution: true,
					title: Config.botname,
					body: 'Here\'s the full list of commands',
					thumbnailUrl: Config.imageUrl,
					mediaType: 1,
					renderLargerThumbnail: true
				}
			}
		}, { quoted: pika });

		// Video message
		else if (ui.alive === 4) return await anyaV2.sendMessage(pika.chat, {
			video: Config.aliveMedia,
			caption: `${caption.trim()}\n\n${footText}`
		}, { quoted: pika });

		// GIF message
		else if (ui.alive === 5) return await anyaV2.sendMessage(pika.chat, {
			video: Config.aliveMedia,
			caption: `${caption.trim()}\n\n${footText}`,
			gifPlayback: true
		}, { quoted: pika });

		// Money request
		else if (ui.alive === 6) return await anyaV2.relayMessage(pika.chat, {
			requestPaymentMessage: {
				currencyCodeIso4217: 'INR',
				amount1000: '10000000000',
				requestFrom: pika.sender,
				noteMessage: {
					extendedTextMessage: {
						text: `${caption.trim()}\n\n${footText}`,
						contextInfo: {
							externalAdReply: {
								showAdAttribution: true
							}
						}
					}
				}
			}
		}, { quoted: pika });

		// Document Ad message
		else if (ui.alive === 7) return await anyaV2.sendMessage(pika.chat, {
			document: {
				url: Config.imageUrl
			},
			caption: `${caption.trim()}\n\n${footText}`,
			mimetype: 'application/zip',
			fileName: Config.ownername,
			fileLength: "99999999999",
			contextInfo: {
				externalAdReply: {
					showAdAttribution: true,
					title: Config.botname,
					body: Config.ownername,
					thumbnailUrl: Config.imageUrl,
					sourceUrl: Config.socialLink,
					mediaType: 1,
					renderLargerThumbnail: true
				}
			}
		}, { quoted: pika });

		// Image Ad reply
		else if (ui.alive === 8) return await anyaV2.sendMessage(pika.chat, {
			image: Config.image_2,
			caption: `${caption.trim()}\n\n${footText}`,
			contextInfo: {
				externalAdReply: {
					showAdAttribution: true,
					title: Config.botname,
					body: Config.ownername,
					thumbnailUrl: Config.imageUrl,
					sourceUrl: Config.socialLink,
					mediaType: 1,
					renderLargerThumbnail: true
				}
			}
		}, { quoted: pika });

		// GIF Ad Reply
		else if (ui.alive === 9) return await anyaV2.sendMessage(pika.chat, {
			video: Config.aliveMedia,
			caption: `${caption.trim()}\n\n${footText}`,
			contextInfo: {
				externalAdReply: {
					showAdAttribution: true,
					title: Config.botname,
					body: Config.ownername,
					thumbnailUrl: Config.imageUrl,
					sourceUrl: Config.socialLink,
					mediaType: 1,
					renderLargerThumbnail: true
				}
			}
		}, { quoted: pika });

		// GIF Channel Ad reply
		else if (ui.alive === 10) return await anyaV2.sendMessage(pika.chat, {
			video: Config.aliveMedia,
			caption: `${caption.trim()}\n\n${footText}`,
			gifPlayback: true,
			contextInfo: {
				forwardingScore: 999,
				isForwarded: true,
				mentionedJid: [pika.sender],
				forwardedNewsletterMessageInfo: {
					newsletterName: Config.botname,
					newsletterJid: "120363193293157965@newsletter"
				},
				externalAdReply: {
					showAdAttribution: true,
					title: Config.botname,
					body: Config.ownername,
					thumbnailUrl: Config.imageUrl,
					sourceUrl: Config.socialLink,
					mediaType: 1,
					renderLargerThumbnail: true
				}
			}
		}, { quoted: pika });

		// Image Button message
		else if (ui.alive === 11) return await anyaV2.sendButtonImage(pika.chat, {
			image: Config.image_2,
			caption: caption.trim(),
			footer: Config.footer,
			buttons: [
				{
					"name": "cta_url",
					"buttonParamsJson": `{"display_text":"Instagram 🦋","url":"https://instagram.com/${Config.instagramId}","merchant_url":"https://www.google.com"}`
				},
				{
					"name": "cta_url",
					"buttonParamsJson": `{"display_text":"WhatsApp Channel 🔮","url":"https://whatsapp.com/channel/0029VaDIPkA6buMS9hRE7y2G","merchant_url":"https://whatsapp.com/channel/0029VaDIPkA6buMS9hRE7y2G"}`
				},
				{
					"name": "cta_url",
					"buttonParamsJson": `{"display_text":"YouTube Channel 💗","url":"https://youtube.com/@pika_kunn","merchant_url":"https://youtube.com/@pika_kunn"}`
				},
				{
					"name": "quick_reply",
					"buttonParamsJson": `{"display_text":"Allmenu 🌟","id:"${prefix}allmenu"}`
				},
				{
					"name": "quick_reply",
					"buttonParamsJson": `{"display_text":"Listmenu 🧾","id:"${prefix}listmenu"}`
				},
			],
			contextInfo: {
				mentionedJid: [pika.sender],
				forwardingScore: 9999,
				isForwarded: true,
				forwardedNewsletterMessageInfo: {
					newsletterName: Config.botname,
					newsletterJid: "120363193293157965@newsletter"
				}
			}
		}, { quoted: pika });

		// Video Button message
		else if (ui.alive === 12) return await anyaV2.sendButtonVideo(pika.chat, {
			video: Config.aliveMedia,
			caption: caption.trim(),
			footer: Config.footer,
			buttons: [
				{
					"name": "cta_url",
					"buttonParamsJson": `{"display_text":"Instagram 🦋","url":"https://instagram.com/${Config.instagramId}","merchant_url":"https://www.google.com"}`
				},
				{
					"name": "cta_url",
					"buttonParamsJson": `{"display_text":"WhatsApp Channel 🔮","url":"https://whatsapp.com/channel/0029VaDIPkA6buMS9hRE7y2G","merchant_url":"https://whatsapp.com/channel/0029VaDIPkA6buMS9hRE7y2G"}`
				},
				{
					"name": "cta_url",
					"buttonParamsJson": `{"display_text":"YouTube Channel 💗","url":"https://youtube.com/@pika_kunn","merchant_url":"https://youtube.com/@pika_kunn"}`
				},
				{
					"name": "quick_reply",
					"buttonParamsJson": `{"display_text":"Allmenu 🌟","id:"${prefix}allmenu"}`
				},
				{
					"name": "quick_reply",
					"buttonParamsJson": `{"display_text":"Listmenu 🧾","id:"${prefix}listmenu"}`
				},
			],
			contextInfo: {
				mentionedJid: [pika.sender],
				forwardingScore: 9999,
				isForwarded: true,
				forwardedNewsletterMessageInfo: {
					newsletterName: Config.botname,
					newsletterJid: "120363193293157965@newsletter"
				}
			}
		}, { quoted: pika });
	}
)
