const Config = require('../../config');
const axios = require('axios');
const { anya, getBuffer, formatDate } = require('../lib');

//༺─────────────────────────────────────༻

anya({
    name: "igstalk",
    alias: ['instagram', 'insta'],
    react: "📸",
    need: "username",
    category: "stalker",
    desc: "Get Instagram user information",
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} 3.69_pika\n\n> Bot will fetch details about the specified Instagram user.`);
    const username = args[0];
    const { key } = await pika.keyMsg(Config.message.wait);
    axios.get(`${Config.api.api1}/api/igstalk?username=${username}`)
        .then(async ({ data }) => {
            const caption = `
*👤Username:* ${data.username}
*🍁Name:* ${data.name}
*💖Posts:* ${data.posts}
*👥Followers:* ${data.followers}
*🍄Following:* ${data.following}

*📖Biography:* ${data.biography}

> ${Config.footer}`;
            const ui = await UI.findOne({ id: "userInterface" }) || await new UI({ id: "userInterface" }).save();
            const profileUrl = `https://www.instagram.com/${data.username}`;
            let pfp;
            try {
                pfp = await getBuffer(data.profile_picture);
            } catch {
                pfp = await getBuffer(Config.imageUrl);
            }
            if (ui.buttons) {
                await anyaV2.sendButtonImage(pika.chat, {
                    image: pfp,
                    caption: caption.trim(),
                    footer: Config.footer,
                    buttons: [
                        { "name": "cta_url", "buttonParamsJson": `{\"display_text\":\"Visit Profile\",\"url\":\"${profileUrl}\",\"merchant_url\":\"${profileUrl}\"}` }
                    ]
                }, { quoted: pika });
            } else {
                await anyaV2.sendMessage(pika.chat, {
                    image: await getBuffer(data.profile_picture),
                    caption: caption.trim(),
                    footer: Config.footer
                }, { quoted: pika });
            }
            await pika.deleteMsg(key);
        })
        .catch(err => {
            console.error(err);
            pika.reply("❌ User Not Found or Unable to Fetch Data!");
        });
});

//༺─────────────────────────────────────༻

anya({
    name: "gcinfo",
    alias: ['groupinfo', 'gcstalk'],
    react: "🪩",
    need: "url",
    category: "stalker",
    desc: "Get group info using invite links",
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX\n\n> Bot will fetch details about the specified group using the invite link.`);
    const url = args.join(" ").trim();
    if (!/https:\/\/chat.whatsapp.com\//.test(url)) return pika.reply("❎ Invalid WhatsApp Group Url");
    const inviteCode = url.split("https://chat.whatsapp.com/")[1];
    const { key } = await pika.keyMsg(Config.message.wait);
    anyaV2.groupGetInviteInfo(inviteCode)
        .then(async response => {
            let participants = "";
            let c = 1;
            if (response.participants.length > 0) {
                participants += `\n*👥You May Know:*\n`;
                response.participants.forEach(i => {
                    participants += `└ _${c++}. @${i.id.split("@")[0]}_\n`;
                });
            }
            const creationDate = new Date(response.creation * 1000).toLocaleString().split(", ");
            const subjectDate = new Date(response.subjectTime * 1000).toLocaleString().split(", ");
            const caption = `
*🔥Gc Type:* ${response.isCommunity ? "community" : "group chat"}
*🍁Gc Name:* ${response.subject}
> └ _change date :_ ${subjectDate[0]}
> └ _change time :_ ${subjectDate[1]}
> └ _changed by :_ ${response.subjectOwner !== undefined ? "@" + response.subjectOwner.split("@")[0] : "unknown"}

*🌟Gc Owner:* ${response.owner !== undefined ? "@" + response.owner.split("@")[0] : "unknown"}
*📅Creation Date:* ${creationDate[0]}
*⌚Creation Time:* ${creationDate[1]}
*👤Members:* ${response.size} members (not accurate)
*🧿Mem Can Edit Gc:* ${response.restrict ? "yes!" : "no!"}
*🌠Mem Can Send Msg:* ${response.announce ? "no!" : "yes!"}
*⏳Has Disappearing Time:* ${response.ephemeralDuration !== undefined ? response.ephemeralDuration : "no!"}
${participants} (not accurate)

*🧩Desc:* ${response.desc !== undefined ? "\n" + response.desc : "no description available"}`.trim();

            let ppgroup;
            try {
                ppgroup = await getBuffer(await anyaV2.profilePictureUrl(response.id));
            } catch {
                ppgroup = await getBuffer(Config.imageUrl);
            }
            await anyaV2.sendMessage(pika.chat, {
                image: ppgroup,
                caption: caption,
                mentions: caption.match(/@(\d+)/g).map(mention => `${mention.slice(1)}@s.whatsapp.net`)
            }, { quoted: pika });
            await pika.deleteMsg(key);
        })
        .catch(err => {
            console.error(err);
            pika.reply("❌ No Group Data Found! Maybe The Group Link Has Been Expired");
        });
});

//༺─────────────────────────────────────༻

anya({
    name: "gitstalk",
    alias: ['githubstalker'],
    react: "🧿",
    need: "username",
    category: "stalker",
    desc: "Get GitHub user information",
    filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} PikaBotz\n\n> Bot will fetch details about the specified GitHub user.`);
    const username = args[0].replace("@", "").trim();
    const { key } = await pika.keyMsg(Config.message.wait);    
    axios.get(`https://api.github.com/users/${username}`)
        .then(async ({ data }) => {
            const creation = formatDate(data.created_at);
            const updated = formatDate(data.updated_at);
            const caption = `
*👤 Username:* @${data.login}
> └ _Creation date:_ ${creation.date}
> └ _Creation time:_ ${creation.time}
> └ _Update date:_ ${updated.date}
> └ _Update time:_ ${updated.time}

*🍁 Name:* ${data.name || "N/A"}
*💖 Followers:* ${data.followers} followers
*🎀 Followings:* ${data.following} followings
*🚀 Public Repos:* ${data.public_repos} repositories
*🪩 Public Gists:* ${data.public_gists} gists
*🧩 Account Type:* ${data.type}
*🌇 Company:* ${data.company || "N/A"}
*🐦 Twitter:* ${data.twitter_username || "N/A"}
*🌍 Location:* ${data.location || "N/A"}
*🌟 Email:* ${data.email || "N/A"}

*⚜️ Bio:* ${data.bio || "N/A"}

> ${Config.footer}`.trim();
            const buffer = await getBuffer(data.avatar_url);
            const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());
            if (ui.buttons) {
                await anyaV2.sendButtonImage(pika.chat, {
                    image: buffer,
                    caption: caption,
                    footer: Config.footer,
                    buttons: [{ "name": "cta_url", "buttonParamsJson": `{\"display_text\":\"User Repositories\",\"url\":\"${data.html_url}\",\"merchant_url\":\"https://github.com/${username}?tab=repositories\"}` }]
                }, { quoted: pika });
            } else {
                await anyaV2.sendMessage(pika.chat, {
                    image: buffer,
                    caption: caption
                }, { quoted: pika });
            }

            await pika.deleteMsg(key);
        })
        .catch(_ => pika.reply("*❎ User Not Found!*"));
});
