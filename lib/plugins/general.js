const Config = require('../../config');
const { anya, User, Bot, fancy11, pickRandom, getBuffer } = require('../lib');
const { proto, prepareWAMessageMedia, generateWAMessageFromContent } = require('@queenanya/baileys');

//༺─────────────────────────────────────

anya(
	{
		name: "listgc",
		react: "👥",
		category: "general",
		desc: "See In Which Groups The Bot Was Running In!",
		filename: __filename
	},
	async (anyaV2, pika) => {
		const { key } = await pika.keyMsg("```Loading List...```");
		const fetch = await anyaV2.groupFetchAllParticipating();
		const groups = Object.entries(fetch)
			.slice(0)
			.map((entry) => entry[1])
			.map((v) => v.id);
		let caption = "*Bot Is Working In `" + groups.length + "` Group(s)..!*\n\n";
		let num = 1;
		for (const i of groups) {
			const info = await anyaV2.groupMetadata(i);
			captain += num++ + ". " + info.subject + "\n";
			caption += "- _Members: " + info.participants.length + "_\n";
			caption += "- _Jid: " + i + "_\n\n";
		}
		captain += `> ${Config.footer}`;
		return pika.edit(caption, key);
	}
)

//༺─────────────────────────────────────

anya(
	{
		name: "listpc",
		react: "🐾",
		category: "general",
		desc: "See In Which Private Chats The Bot Was Running In!",
		filename: __filename
	},
	async (anyaV2, pika) => {
		const store = require(__dirname + "/../database/store.json");
		//console.log(store);
		const fetch = store.chats
			.all()
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
      }, async (anyaV2, pika) => {
           const bot = await Bot.findOne({ id: "anyabot" });
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
     }, async (anyaV2, pika, { args }) => {
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
     }, async (anyaV2, pika, { args }) => {
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
                        thumbnailUrl: "",
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

//༺─────────────────────────────────────༻

anya({
            name: "setresname",
            react: "👤",
            category: "general",
            desc: "Edit your name from group registration",
            rule: 5,
            need: "name",
            filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    const text = args.join(" ");
    if (!args[0]) return pika.reply(`Please enter your name, type like ✍🏻:\n\n\`${prefix + command} YOUR_NAME\`\n\n_AID: QA26_`);
    const regex = /^[A-Za-z ]+$/;
    if (!regex.test(text)) return pika.reply(`⚠️ Symbols or special characters not allowed! Try again.`);
    const user = await User.findOne({ id: pika.sender.split("@")[0] }) || await new User({ id: pika.sender.split("@")[0] }).save();
    if (text.toLowerCase() === user.name.toLowerCase()) return pika.reply(`☑️ This name is already registered, try another.`);
    await User.findOneAndUpdate({ id: pika.sender.split("@")[0] }, { $set: { name: text.toLowerCase() } }, { new: true });
    return pika.reply(`✅ Edited your name as \`${text}\` now.`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "setresage",
            react: "⚙️",
            category: "general",
            desc: "Edit your age from group registration",
            rule: 5,
            need: "number",
            filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (!args[0]) {
        return await anyaV2.sendButtonText(pika.chat, {
            text: `↘️ Choose your \`gender\` below!`,
            footer: Config.footer,
            buttons: [
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"11 or below\",\"id\":\"${Config.prefa}setresage 11\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"12 years\",\"id\":\"${Config.prefa}setresage 12\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"13 years\",\"id\":\"${Config.prefa}setresage 13\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"14 years\",\"id\":\"${Config.prefa}setresage 14\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"15 years\",\"id\":\"${Config.prefa}setresage 15\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"16 years\",\"id\":\"${Config.prefa}setresage 16\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"17 years\",\"id\":\"${Config.prefa}setresage 17\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"18 years\",\"id\":\"${Config.prefa}setresage 18\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"19 years\",\"id\":\"${Config.prefa}setresage 19\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"20 years\",\"id\":\"${Config.prefa}setresage 20\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"21 years\",\"id\":\"${Config.prefa}setresage 21\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"22 years\",\"id\":\"${Config.prefa}setresage 22\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"23 years\",\"id\":\"${Config.prefa}setresage 23\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"24 years\",\"id\":\"${Config.prefa}setresage 24\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"25 years\",\"id\":\"${Config.prefa}setresage 25\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"26 years\",\"id\":\"${Config.prefa}setresage 26\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"27 years\",\"id\":\"${Config.prefa}setresage 27\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"28 years\",\"id\":\"${Config.prefa}setresage 28\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"29 years\",\"id\":\"${Config.prefa}setresage 29\"}` },
                    { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"30 or above\",\"id\":\"${Config.prefa}setresage 30\"}` },
                    ],
            contextInfo: {
                  mentionedJid: [pika.sender], 
                  forwardingScore: 999,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                      newsletterJid: '120363193293157965@newsletter',
                      newsletterName: Config.botname,
                      serverMessageId: 143
                  }
            }
        }, { quoted: pika });        
    }
    const userAge = Number(args[0]);
    if (!userAge) return pika.reply(`❌ Invalid age!`);
    if (userAge < 10) return pika.reply(`❌ Age should be more than 10 years`);
    if (userAge > 50) return pika.reply(`❌ Age should be less than 50 years`);
    const user = await User.findOne({ id: pika.sender.split("@")[0] }) || await new User({ id: pika.sender.split("@")[0] }).save();
    if (userAge === user.age) return pika.reply(`☑️ This age is already registered.`);
    await User.findOneAndUpdate({ id: pika.sender.split("@")[0] }, { $set: { age: userAge } }, { new: true });
    return pika.reply(`✅ Edited your age as \`${userAge} years old\` now.`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "setresgender",
            react: "🍆",
            category: "general",
            desc: "Edit your gender identity from group registration",
            rule: 5,
            filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    const text = args.join(" ");
    if (!args[0]) {
        return await anyaV2.sendButtonText(pika.chat, {
            text: `↘️ Choose your \`gender\` below!`,
            footer: Config.footer,
            buttons: [
                { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Male ♂️\",\"id\":\"${Config.prefa}setresgender male\"}` },
                { "name": "quick_reply", "buttonParamsJson": `{\"display_text\":\"Female ♀️\",\"id\":\"${Config.prefa}setresgender female\"}` },
            ],
            contextInfo: {
                  mentionedJid: [pika.sender], 
                  forwardingScore: 999,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                      newsletterJid: '120363193293157965@newsletter',
                      newsletterName: Config.botname,
                      serverMessageId: 143
                  }
            }
        }, { quoted: pika });
}
    const regex = /^[A-Za-z ]+$/;
    if (!regex.test(text)) return pika.reply(`⚠️ Symbols or special characters not allowed! Try again.`);
    if (!/male|female/.test(args[0])) return pika.reply(`⚠️ Invalid gender name`);
    const user = await User.findOne({ id: pika.sender.split("@")[0] }) || await new User({ id: pika.sender.split("@")[0] }).save();
    if (text.toLowerCase() === user.gender.toLowerCase()) return pika.reply(`☑️ This gender is already registered.`);
    await User.findOneAndUpdate({ id: pika.sender.split("@")[0] }, { $set: { gender: args[0].toLowerCase() } }, { new: true });
    return pika.reply(`✅ Edited your gender as \`${text}\` now.`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "setresstate",
            react: "🌐",
            category: "general",
            desc: "Edit your state location name from group registration",
            rule: 5,
            need: "name",
            filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    const text = args.join(" ");
    if (!args[0]) return pika.reply(`Please enter your state name, type like ✍🏻:\n\n\`${prefix + command} YOUR_STATE_NAME\`\n\n_AID: QA27_`);
//    const regex = /^[A-Za-z ]+$/;
//    if (!regex.test(text)) return pika.reply(`⚠️ Symbols or special characters not allowed! Try again.`);
    const user = await User.findOne({ id: pika.sender.split("@")[0] }) || await new User({ id: pika.sender.split("@")[0] }).save();
    if (text.toLowerCase() === user.state.toLowerCase()) return pika.reply(`☑️ This state location is already registered, try another.`);
    await User.findOneAndUpdate({ id: pika.sender.split("@")[0] }, { $set: { state: text.toLowerCase() } }, { new: true });
    return pika.reply(`✅ Edited your state location as \`${text}\` now.`);
     }
)
