const Config = require('../../config');
const {
	anya,
	commands,
	UI,
	rules,
	fancy32,
	dayToday,
	pickRandom,
	formatRuntime,
	getMemoryInfo
} = require('../lib');
const symbolLists = ["⭔", "❃", "❁", "✬", "⛦", "◌", "⌯", "⎔", "▢", "▣", "◈", "֍", "֎", "࿉", "۞", "⎆"];

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
		//const bot = await Bot.findOne({ id: 'anyabot' });
		const os = require('os');
		const { commands } = require('../lib');
		const symbols = pickRandom(symbolLists);
		const caption = `\`\`\`${Config.themeemoji} 𝕎𝔸𝔹𝕠𝕥 𝕀𝕟𝕗𝕠𝕣𝕞𝕒𝕥𝕚𝕠𝕟 ${Config.themeemoji}\`\`\`

> ${symbols} 𝚄𝚜𝚎𝚛 : @${pika.sender.split("@")[0]}
> ${symbols} 𝙱𝚘𝚝 : ${Config.botname}
> ${symbols} 𝙾𝚠𝚗𝚎𝚛 : ${Config.ownername}
> ${symbols} 𝙿𝚕𝚞𝚐𝚒𝚗𝚜 : ${commands.length}
> ${symbols} 𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : ${require('../../package.json').version}
> ${symbols} 𝙿𝚕𝚊𝚝𝚏𝚘𝚛𝚖 : ${os.platform()}

> *▢* I'm alive from _${formatRuntime(process.uptime()).trim()}_.
> *▢* Used _*${getMemoryInfo().usedMemory}*_ out of _*${getMemoryInfo().totalMemory}*_ memory.`;
		const footText = `R𝚎𝚙𝚕𝚢 A N𝚞𝚖𝚋𝚎𝚛 T𝚘 G𝚎𝚝:\n   1 Allmenu\n   2 MenuList\n> _ID: QA01_`;

		// menu message types
		const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());

		// Text message
		if (ui.alive === 1) return pika.reply(`${caption.trim()}\n\n${footText}`, { mentions: [pika.sender] });

		// Image message
		else if (ui.alive === 2) return await anyaV2.sendMessage(pika.chat, {
			image: Config.image_2,
			caption: `${caption.trim()}\n\n${footText}`,
			mentions: [pika.sender]
		}, { quoted: pika });

		// Text Ad message
		else if (ui.alive === 3) return await anyaV2.sendMessage(pika.chat, {
			text: `${caption.trim()}\n\n${footText}`,
			mentions: [pika.sender],
			contextInfo: {
				externalAdReply: {
					showAdAttribution: true,
					title: Config.botname,
					body: "Alive from " + formatRuntime(process.uptime()),
					thumbnailUrl: Config.imageUrl,
					mediaType: 1,
					renderLargerThumbnail: true
				}
			}
		}, { quoted: pika });

		// Video message
		else if (ui.alive === 4) return await anyaV2.sendMessage(pika.chat, {
			video: Config.aliveMedia,
			caption: `${caption.trim()}\n\n${footText}`,
			mentions: [pika.sender]
		}, { quoted: pika });

		// GIF message
		else if (ui.alive === 5) return await anyaV2.sendMessage(pika.chat, {
			video: Config.aliveMedia,
			caption: `${caption.trim()}\n\n${footText}`,
			gifPlayback: true,
			mentions: [pika.sender]
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
							mentionedJid: [pika.sender],
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
				mentionedJid: [pika.sender],
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
			mentions: [pika.sender],
			contextInfo: {
				//mentionedJid: [pika.sender],
				externalAdReply: {
					//mentionedJid: [pika.sender],
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
			mentions: [pika.sender],
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
			mentions: [pika.sender],
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
			mentions: [pika.sender],
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
					"buttonParamsJson": `{"display_text":"Allmenu 🌟","id":"${prefix}allmenu"}`
				},
				{
					"name": "quick_reply",
					"buttonParamsJson": `{"display_text":"Listmenu 🧾","id":"${prefix}listmenu"}`
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
			mentions: [pika.sender],
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
					"buttonParamsJson": `{"display_text":"Allmenu 🌟","id":"${prefix}allmenu"}`
				},
				{
					"name": "quick_reply",
					"buttonParamsJson": `{"display_text":"Listmenu 🧾","id":"${prefix}listmenu"}`
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

//༺─────────────────────────────────────

anya(
	{
		name: "help",
		alias: ['h', 'menu', 'allmenu'],
		react: Config.themeemoji,
		category: "core",
		desc: "Bot's command panel",
		filename: __filename
	},
	async (anyaV2, pika, { args, prefix, command }) => {
		if (command === "help" && args.length > 0) {
			const caption = [];
			const cmd = commands.find(v => v.name === args[0].toLowerCase() || (v.alias && v.alias.includes(args[0].toLowerCase())));
			if (cmd) {
				caption.push(`*🧿 Name :* ${cmd.name}`);
				cmd.alias && caption.push(`*🔖 Alias :* ${cmd.alias.join(", ")}`);
				cmd.react && caption.push(`*🌀 React :* ${cmd.react}`);
				cmd.need && caption.push(`*💭 Usage :* ${cmd.need}`);
				cmd.category && caption.push(`*❤️‍🩹 Category :* ${cmd.category}`);
				caption.push(`*🕜 Cooldown :* ${cmd.cooldown} seconds`);
				cmd.filename && caption.push(`*📑 File :* ${cmd.filename}`);
				if (cmd.rule !== 0) {
					const i = rules(cmd.rule);
					caption.push(`*📃 Access :*\n> ${i.owner} : Owner\n> ${i.admin} : Admin\n> ${i.botAdmin} : Bot Admin\n> ${i.group} : Group Chat\n> ${i.pc} : Private Chat`);
					caption.push(`*📜 Description :* ${cmd.desc}`);
				}
				return pika.reply(caption.join("\n\n"));
			} else {
				return pika.reply("_❌No such plugin found with: " + args[0]);
			}
		} else {
			const readmore = String.fromCharCode(8206).repeat(4001);
			const cateJson = require('../database/categories.json');
			const calender = dayToday();
			const symbols = pickRandom(symbolLists);
			const patterns = commands.reduce((acc, cmd) => {
				if (cmd.name && !cmd.notCmd) {
					acc[cmd.category] = acc[cmd.category] || [];
					acc[cmd.category].push(`${cmd.name}${cmd.need ? "  ⌈" + cmd.need + "⌋" : ""}`);
				}
				return acc;
			}, {});

			let caption = `
\`\`\`╭════ ${fancy32(Config.ownername)} ════─❃
┃${symbols}╭─────────────┈
┃${symbols}│ Prefix : ${prefix}
┃${symbols}│ User : ${pika.pushName}
┃${symbols}│ Bot : ${Config.botname}
┃${symbols}│ Owner : ${Config.ownername}
┃${symbols}│ Date : ${calender.date}
┃${symbols}│ Time : ${calender.time}
┃${symbols}│ Plugins : ${commands.length}
┃${symbols}│ Version : v${require('../../package.json').version}
┃${symbols}│ Ram : ${getMemoryInfo().usedMemory}/${getMemoryInfo().totalMemory}
┃${symbols}│ Uptime : ${formatRuntime(process.uptime())}
┃${symbols}╰─────────────┈
╰══════════════════─❃\`\`\`

> Type \`${prefix}system\` to see bot status.
${readmore}\n`;

			for (const [category, plugins] of Object.entries(patterns)) {
				const { cateSymbol, pluginSymbol } = cateJson[category] || {};
				caption += `┌─⊰ _*${cateSymbol || "🍜"} ${category.toUpperCase()} ${cateSymbol || "🍜"}*_\n`;
				caption += plugins.map(plugin => `│⊳ ${prefix + plugin}\n`).join('');
				caption += `└───────────────┈⊰\n\n`;
			}
			caption += `🎀 _Type \`${prefix}listmenu\` for my command list._

*Eg: _${prefix}help nsfw_*

> ${Config.footer}`;

		// menu message types
		const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());

		// Text message
		if (ui.menu === 1) return pika.reply(caption.trim(), { mentions: [pika.sender] });

		// Image message
		else if (ui.menu === 2) return await anyaV2.sendMessage(pika.chat, {
			image: Config.image_1,
			caption: caption.trim(),
			mentions: [pika.sender]
		}, { quoted: pika });

		// Text Ad message
		else if (ui.menu === 3) return await anyaV2.sendMessage(pika.chat, {
			text: caption.trim(),
			mentions: [pika.sender],
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
		else if (ui.menu === 4) return await anyaV2.sendMessage(pika.chat, {
			video: Config.menuMedia,
			caption: caption.trim(),
			mentions: [pika.sender]
		}, { quoted: pika });

		// GIF message
		else if (ui.menu === 5) return await anyaV2.sendMessage(pika.chat, {
			video: Config.menuMedia,
			caption: caption.trim(),
			gifPlayback: true,
			mentions: [pika.sender]
		}, { quoted: pika });

		// Money request
		else if (ui.menu === 6) return await anyaV2.relayMessage(pika.chat, {
			requestPaymentMessage: {
				currencyCodeIso4217: 'INR',
				amount1000: '10000000000',
				requestFrom: pika.sender,
				noteMessage: {
					extendedTextMessage: {
						text: caption.trim(),
						contextInfo: {
							mentionedJid: [pika.sender],
							externalAdReply: {
								showAdAttribution: true
							}
						}
					}
				}
			}
		}, { quoted: pika });

		// Document Ad message
		else if (ui.menu === 7) return await anyaV2.sendMessage(pika.chat, {
			document: {
				url: Config.imageUrl
			},
			caption: caption.trim(),
			mimetype: 'application/zip',
			fileName: Config.ownername,
			fileLength: "99999999999",
			contextInfo: {
				mentionedJid: [pika.sender],
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
		else if (ui.menu === 8) return await anyaV2.sendMessage(pika.chat, {
			image: Config.image_1,
			caption: caption.trim(),
			contextInfo: {
				mentionedJid: [pika.sender],
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
		else if (ui.menu === 9) return await anyaV2.sendMessage(pika.chat, {
			video: Config.menuMedia,
			caption: caption.trim(),
			mentions: [pika.sender],
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
		else if (ui.menu === 10) return await anyaV2.sendMessage(pika.chat, {
			video: Config.menuMedia,
			caption: caption.trim(),
			gifPlayback: true,
			mentions: [pika.sender],
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
		else if (ui.menu === 11) return await anyaV2.sendButtonImage(pika.chat, {
			image: Config.image_1,
			caption: caption.trim(),
			footer: Config.footer,
			mentions: [pika.sender],
			buttons: [
				{
					"name": "quick_reply",
					"buttonParamsJson": `{"display_text":"Owner 👤","id":"${prefix}owner"}`
				},
				{
					"name": "quick_reply",
					"buttonParamsJson": `{"display_text":"Script 🍜","id":"${prefix}sc"}`
				}
			],
			contextInfo: {
				mentionedJid: [pika.sender],
				forwardingScore: 9999,
				isForwarded: true,
				forwardedNewsletterMessageInfo: {
					newsletterName: `𝐔𝐩𝐭𝐢𝐦𝐞 : ${formatRuntime(process.uptime())}`,
					newsletterJid: "120363193293157965@newsletter"
				}
			}
		}, { quoted: pika });

		// Video Button message
		else if (ui.menu === 12) return await anyaV2.sendButtonVideo(pika.chat, {
			video: Config.menuMedia,
			caption: caption.trim(),
			footer: Config.footer,
			mentions: [pika.sender],
			buttons: [
				{
					"name": "quick_reply",
					"buttonParamsJson": `{"display_text":"Owner 👤","id":"${prefix}owner"}`
				},
				{
					"name": "quick_reply",
					"buttonParamsJson": `{"display_text":"Script 🍜","id":"${prefix}sc"}`
				}
			],
			contextInfo: {
				mentionedJid: [pika.sender],
				forwardingScore: 9999,
				isForwarded: true,
				forwardedNewsletterMessageInfo: {
					newsletterName: `𝐔𝐩𝐭𝐢𝐦𝐞 : ${formatRuntime(process.uptime())}`,
					newsletterJid: "120363193293157965@newsletter"
				}
			}
		}, { quoted: pika });
		}
	}
)

//༺─────────────────────────────────────

anya(
    {
        name: "listmenu",
        alias: ['menulist', 'list'],
        react: "📑",
        category: "core",
        desc: "List of the available menus",
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command }) => {
        let caption = "";
        let c = 1;
        const patterns = {};
        for (const cmd of commands) {
            if (cmd.name && !cmd.notCmd) {
                if (!patterns[cmd.category]) patterns[cmd.category] = [];
                patterns[cmd.category].push(`${cmd.name}${cmd.need ? "  ⌈" + cmd.need + "⌋" : ""}`);
            }
        }
        const cateJson = require('../database/categories.json');
        const { cateSymbol, pluginSymbol, desc } = cateJson[cmd.category] || {};
        const ui = await UI.findOne({ id: "userInterface" }) || new UI({ id: "userInterface" }).save();

        caption += `\`\`\`╭════ ${fancy32(Config.ownername)} ════─❃
┃${symbols}╭─────────────┈
┃${symbols}│ Prefix : ${prefix}
┃${symbols}│ User : ${pika.pushName}
┃${symbols}│ Bot : ${Config.botname}
┃${symbols}│ Owner : ${Config.ownername}
┃${symbols}│ Date : ${calender.date}
┃${symbols}│ Time : ${calender.time}
┃${symbols}│ Plugins : ${commands.length}
┃${symbols}│ Version : v${require('../../package.json').version}
┃${symbols}│ Ram : ${getMemoryInfo().usedMemory}/${getMemoryInfo().totalMemory}
┃${symbols}│ Uptime : ${formatRuntime(process.uptime())}
┃${symbols}╰─────────────┈
╰══════════════════─❃\`\`\``;

        const replyTag = `> *\`🌟 Reply A Number To Get Command List\`*`;
        const footerTag = `_Type *${prefix + command} <category>* to get that specific list_\n*Eg: _${prefix + command} owner_*`;

        const sendMenu = async (messageContent, options = {}) => {
            switch (ui.listmenu) {
                case 1:
                    return pika.reply(messageContent + footerTag);
                case 2:
                    return await anyaV2.sendMessage(pika.chat, {
                        image: Config.image_1,
                        caption: messageContent.trim(),
                        mentions: [pika.sender],
                        ...options
                    }, { quoted: pika });
                case 3:
                    return await anyaV2.sendMessage(pika.chat, {
                        text: messageContent.trim(),
                        mentions: [pika.sender],
                        contextInfo: {
                            externalAdReply: {
                                showAdAttribution: true,
                                title: Config.botname,
                                body: 'Here\'s the full list of commands',
                                thumbnailUrl: Config.imageUrl,
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        },
                        ...options
                    }, { quoted: pika });
                case 4:
                case 5:
                    return await anyaV2.sendMessage(pika.chat, {
                        video: Config.menuMedia,
                        caption: messageContent.trim(),
                        gifPlayback: ui.listmenu === 5,
                        mentions: [pika.sender],
                        ...options
                    }, { quoted: pika });
                case 6:
                    return await anyaV2.sendMessage(pika.chat, {
                        document: { url: Config.imageUrl },
                        caption: messageContent.trim(),
                        mimetype: 'application/zip',
                        fileName: Config.ownername,
                        fileLength: "99999999999",
                        contextInfo: {
                            mentionedJid: [pika.sender],
                            externalAdReply: {
                                showAdAttribution: true,
                                title: Config.botname,
                                body: Config.ownername,
                                thumbnailUrl: Config.imageUrl,
                                sourceUrl: Config.socialLink,
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        },
                        ...options
                    }, { quoted: pika });
                case 7:
                    const buttons = Object.keys(patterns).map(category => {
                        const upperCase = category.charAt(0).toUpperCase() + category.slice(1);
                        return {
                            name: "quick_reply",
                            buttonParamsJson: `{"display_text":"${cateSymbol || '🍜'} ${upperCase}","id":"${prefix}list ${category}"}`
                        };
                    });
                    return await anyaV2.sendButtonImage(pika.chat, {
                        image: Config.image_1,
                        caption: messageContent.trim(),
                        footer: Config.footer,
                        mentions: [pika.sender],
                        buttons,
                        contextInfo: {
                            mentionedJid: [pika.sender],
                            forwardingScore: 9999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterName: `𝐔𝐩𝐭𝐢𝐦𝐞 : ${formatRuntime(process.uptime())}`,
                                newsletterJid: "120363193293157965@newsletter"
                            }
                        },
                        ...options
                    }, { quoted: pika });
                default:
                    return pika.reply("No valid menu type found!");
            }
        };

        for (const i in patterns) {
            const upperCase = i.charAt(0).toUpperCase() + i.slice(1);
            
            if (args.length > 0 && args[0].toLowerCase() === i.toLowerCase()) {
                let categoryMessage = `╭──⌈ _*${cateSymbol || "🍜"} ${fancy10(upperCase)} ${cateSymbol || "🍜"}*_ ⌋\n`;
                for (const y of patterns[i]) {
                    categoryMessage += `│⊳ ${pluginSymbol || "🪅"} ${prefix + y}\n`;
                }
                categoryMessage += `└───────────────⟢`;
                return sendMenu(categoryMessage);
            } else {
                caption += `*${c++}. ${cateSymbol || "🍜"} ${upperCase}*\n`;
                caption += `> *Commands :* ${patterns[i].length}\n`;
                caption += `> *About :* ${fancy13(desc || "No Data Available About This Category")}\n\n`;
            }
        }

        if (args.length > 0) return pika.reply("*🍁 No Such Category Found!*");
        return sendMenu(caption);
    }
);

