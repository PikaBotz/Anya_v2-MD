const Config = require('../../config');
const {
	anya,
	User,
	Bot,
	fancy11,
	pickRandom,
	getBuffer,
	delay
} = require('../lib');

//༺─────────────────────────────────────

anya(
	{
		name: "listgc",
		react: "👥",
		category: "general",
		desc: "See Which Groups The Bot Is Running In!",
		cooldown: 10,
		filename: __filename
	},
	async (anyaV2, pika) => {
		const { key } = await pika.keyMsg("```Loading List...```");
		const fetch = await anyaV2.groupFetchAllParticipating();
		const groups = Object.entries(fetch)
			.slice(0)
			.map((entry) => entry[1])
			.map((v) => v.id);
		if (groups.length < 1) return pika.edit("_❌No Group List Found!_", key);
		let caption = "👥 *Bot Is In `" + groups.length + "` Group(s)..!*\n\n";
		let num = 1;
		for (const i of groups) {
			await delay(500);
			const info = await anyaV2.groupMetadata(i);
			caption += num++ + ". " + info.subject + "\n";
			caption += "- _members: " + info.participants.length + "_\n";
			caption += "- _jid: " + i + " ;_\n\n";
		}
		caption += `> ${Config.footer}`;
		return pika.edit(caption, key);
	}
)

//༺─────────────────────────────────────

anya(
	{
		name: "listpc",
		react: "🐾",
		category: "general",
		desc: "See Which Private Chats The Bot Was Running In!",
		filename: __filename
	},
	async (anyaV2, pika) => {
		const store = require(__dirname + "/../database/store.json");
		//console.log(store);
		const fetch = store.chats
			.filter(v => v.id.endsWith('@s.whatsapp.net'))
			.map(v => v.id);
		let caption = "*🗣️ List Private Chat..! 🗣️*\n\n";
		caption += "_`Bot Is Running In " + fetch.length + " chat(s).`_\n\n";
		let num = 1;
		for (const i of fetch) {
			caption += num++ + ". _@" + i.split("@")[0] + "_\n";
		}
		caption += "\n> " + Config.footer;
		return pika.reply(caption, { mentions: fetch });
	}
)
//༺─────────────────────────────────────༻

anya({
             name: "modlist",
             alias: ['mods'],
             react: "👑",
             category: "general",
             desc: "See the mod's list of this bot",
             filename: __filename
      }, async (anyaV2, pika, { db }) => {
           const bot = db.Bot?.[0];
           const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
           const modlist = bot.modlist;
           if (modlist < 1) return pika.reply("❎ No Mods Found");
           const reply = [];
           let c = 1;
           reply.push(
`════════════════════════
          ▢▢▢ \`\`\`Bot Modlist\`\`\` ▢▢▢
════════════════════════

*👑 @${botNumber.split("@")[0]}*`);
           for (const i of modlist) {
                reply.push(`${fancy11((c++).toString())}. • _@${i}_`);
           }
           reply.push("\n_▢ Reply 0 to delete every mod_\n_▢ Reply any number to delete that user_\n\n_ID: QA19_");
           return pika.reply(reply.join("\n"), { mentions: [botNumber.split("@")[0], ...modlist].map(v => v + "@s.whatsapp.net") });
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "couplepp",
            react: "❤️",
            category: "general",
            desc: "Get anime couple profile picture",
            cooldown: 8,
            filename: __filename
     }, async (anyaV2, pika) => {
        const pictures = pickRandom(require('../database/json/couplepp.json'));
        await anyaV2.sendMessage(pika.chat, {
            image: await getBuffer(pictures.male),
            caption: "*For Him 💁🏻‍♂️♂️*"
        }, { quoted:pika });
        await anyaV2.sendMessage(pika.chat, {
            image: await getBuffer(pictures.female),
            caption: "*For Her 💁🏻‍♀️♀️*"
        }, { quoted:pika });
     }
)

//༺─────────────────────────────────────༻

anya({
        name: "admins",
        alias: ['admin'],
        react: "💖",
        category: "general",
        need: "text",
        desc: "Tag every admin in the group with a text",
        cooldown: 8,
        rule: 5,
        filename: __filename
}, async (anyaV2, pika, { args }) => {
        const message = pika.quoted ? (pika.quoted.text.split(" ").length > 0 ? pika.quoted.text : (args.length > 0 ? args.join(" ") : false)) : (args.length > 0 ? args.join(" ") : false);
        if (!message) return pika.reply("❕Enter a message to tag admins, you can't tag admins without any response");
        const tagm = [];
        let num = 1;
        const metadata = await anyaV2.groupMetadata(pika.chat);
        tagm.push(`
═══════════════════════
        \`░▒▓ GROUP ADMINS ▓▒░\`
═══════════════════════
*💝 Message :* ${message}

*🌠 Announcer :* @${pika.sender.split('@')[0]}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
╭─⌈ 𝘼𝙙𝙢𝙞𝙣𝙨 ⌋`.trim());
        for (const admins of metadata.participants) {
            if (admins.admin !== null) {
                tagm.push(`${num++}. @${admins.id.split('@')[0]}`);
            }
        }
        const quoted = pika.quoted ? pika.quoted : '';
        const mime = (quoted && quoted.mimetype) ? quoted.mimetype : '';
        if (/image/.test(mime)) {
            const media = await quoted.download();
            return await anyaV2.sendMessage(pika.chat,
                {
                    image: media,
                    caption: tagm.join('\n'),
                    mentions: metadata.participants.map(v => v.id)
                })
        } else if (/video/.test(mime)) {
            const media = await quoted.download();
            return await anyaV2.sendMessage(pika.chat,
                {
                    video: media,
                    caption: tagm.join('\n'),
                    gifPlayback: ((quoted.msg || quoted).seconds > 11) ? true : false,
                    mentions: metadata.participants.filter(v => v.admin !== null).map(v => v.id)
                })
        } else pika.reply(tagm.join('\n'), { mentions: metadata.participants.map(v => v.id) });
    }
)

//༺─────────────────────────────────────༻

anya({
            name: "tts",
            alias: ['texttospeech'],
            react: "🗣️",
            need: "text",
            category: "general",
            desc: "Convert text to voice",
            cooldown: 5,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
        const message = pika.quoted ? (pika.quoted.text.split(" ").length > 0 ? pika.quoted.text : (args.length > 0 ? args.join(" ") : false)) : (args.length > 0 ? args.join(" ") : false);
        if (!message) return pika.reply(`*${Config.themeemoji} Example:* ${prefix+command} Text To Say`);
        await anyaV2.sendMessage(pika.chat, {
            audio: await getBuffer(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(message)}&tl=en&total=1&idx=0&textlen=2&client=tw-ob&prev=input&ttsspeed=1`),
            mimetype: 'audio/mp4',
            ptt: false
        }, {quoted:pika})
        .catch(err=> {
            console.error(err);
            pika.reply(Config.message.error);
        });
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "getbio",
            alias: ['getstatus'],
            react: "⚜️",
            need: "user",
            category: "general",
            desc: "Get someone's profile status",
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`*${Config.footer} Example:* ${prefix+command} @user1`);
        const user = pika.quoted ? pika.quoted.sender : args.join(" ").replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        let response;
        try {
            response = await anyaV2.fetchStatus(user);
        } catch {
            return pika.reply("*❎ Bio Not Found!*");
        }
        return pika.reply(`*👤Bio:* ${response.status}\n\n> ${Config.footer}`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "getpp",
            alias: ['getdp'],
            react: "⚜️",
            need: "user",
            category: "general",
            desc: "Get someone's profile picture",
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (!pika.quoted && args.length < 1) return pika.reply(`*${Config.footer} Example:* ${prefix+command} @user1`);
        const user = pika.quoted ? pika.quoted.sender : args.join(" ").replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        let ppuser;
        try {
            ppuser = await getBuffer(await anyaV2.profilePictureUrl(user));
        } catch {
            return pika.reply("*❎ Profile Picture Not Found!*");
        }
        await anyaV2.sendMessage(pika.chat, {
            image: ppuser,
            caption: `*👤Profile Picture:* @${user.split("@")[0]}\n\n> ${Config.footer}`,
            mentions: [user]
        }, {quoted:pika});
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "owner",
            react: "👑",
            category: "core",
            desc: "Get the owner name",
            filename: __filename
     }, async (anyaV2, pika) => {
        const vcard = 'BEGIN:VCARD\n' +
                       'VERSION:3.0\n' +
                       'FN:' + Config.ownername + '\n' +
                       'ORG:;\n' +
                       'TEL;type=CELL;type=VOICE;waid=' +
                       Config.ownernumber +
                       ':+' +
                       Config.ownernumber +
                       '\n' +
                       'END:VCARD';
        return await anyaV2.sendMessage(pika.chat, {
                contacts: {
                    displayName: Config.ownername,
                    contacts: [{ vcard }]
                },
                contextInfo: {
                    externalAdReply: {
                        title: Config.ownername,
                        body: "Tap Here To Chat With Owner",
                        renderLargerThumbnail: true,
                        thumbnailUrl: Config.imageUrl,
//                        thumbnail: Config.image_2,
                        mediaType: 2,
                        mediaUrl: `https://wa.me/${Config.ownernumber}?text=${encodeURIComponent("Hey Bro, I'm " + pika.pushName)}`,
                        sourceUrl: `https://wa.me/${Config.ownernumber}?text=${encodeURIComponent("Hey Bro, I'm " + pika.pushName)}`
                    }
                }
        }, {quoted:pika});
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "ping",
            react: "📍",
            category: "general",
            desc: "Bot speed latency",
            filename: __filename
     }, async (anyaV2, pika) => {
          const {key} = await pika.keyMsg("Pinging...");
          const timestamp = require('performance-now')();
          const {exec} = require('child_process');
          exec('neofetch --stdout', async (error, stdout) => {
          const latency = (require('performance-now')() - timestamp).toFixed(2);
               return pika.edit(`*📍Pong ${latency}ms...*`, key);
          });
     }
)
