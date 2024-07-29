const Config = require('../../config');
const axios = require('axios');
const { anya, tiktok, getBuffer, formatNumber, formatDate, Bot } = require('../lib');

//༺─────────────────────────────────────༻

anya({
            name: "tiktok",
            alias: ['tt'],
            react: "🎷",
            need: "query",
            category: "stalker",
            desc: "Get user information from tiktok.com",
            filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji}Example:* ${prefix + command} josh.getjiggy`);
        if (/tiktok.com/.test(args.join(" "))) return pika.reply(`Use *${prefix}ttdl <url>* to download posts`);
        const {key} = await pika.keyMsg(Config.message.wait);
        tiktok(args[0])
        .then(async res=> {
            if (!res.status) return pika.edit("❎ User Not Found");
            let thumb;
                thumb = await getBuffer(res.profileImage);
                if (!(thumb instanceof Buffer)) {
                    thumb = await getBuffer("https://i.ibb.co/D9G4snb/736007.png");
                }
            await anyaV2.sendMessage(pika.chat, {
                image: thumb,
                caption: `
👤 𝙐𝙎𝙀𝙍𝙉𝘼𝙈𝙀
➤ ${res.username}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
🦋 𝙉𝘼𝙈𝙀
➤ ${res.name}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
✅ 𝙁𝙊𝙇𝙇𝙊𝙒𝙀𝙍𝙎
➤ ${res.followers} _followers_
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
✨ 𝙁𝙊𝙇𝙇𝙊𝙒𝙄𝙉𝙂
➤ ${res.following} _followings_
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
⛩️ 𝘽𝙄𝙊 | 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝙏𝙄𝙊𝙉
➤ ${res.bio ? res.bio : "_-no biography-_"}

> ${Config.footer}`.trim(),
/*
*🦋 Username :* ${res.username}
*👤 Fullname :* ${res.name}
*🎗️ Followers :* ${res.followers} _followers_
*🎀 Following :* ${res.following} _followings_
*⚜️ Bio :* ${res.bio ? res.bio : "_-no biography-_"}
`,*/
            },
            { quoted:pika
            }).then(()=> pika.deleteMsg(key));
        })
        .catch(err=> {
            console.error(err);
            pika.edit(Config.message.error, key);
        });
     }
)

//༺─────────────────────────────────────༻

anya({
        name: "jid",
        alias: ['jids'],
        react: "🎊",
        category: "stalker",
        desc: "Get users information",
        cooldown: 30,
        rule: 5,
        filename: __filename
    },
    async (anyaV2, pika, { args }) => {
        const tagm = [];
        let c = 1;
        const metadata = await anyaV2.groupMetadata(pika.chat);
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
        const bot = await Bot.findOne({ id: 'anyabot' });
        const {key} = await pika.keyMsg(Config.message.wait);
        for (const i of metadata.participants) {
            if (i.admin !== null) {
            const presence = await anyaV2.presenceSubscribe(i.id);
            const isBusiness = await anyaV2.getBusinessProfile(i.id);
            const userOwner = [...bot.modlist, Config.ownernumber, botNumber].map(v => v.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(i.id);
            let bio;
            try {
                bio = await anyaV2.fetchStatus(i.id) || false;
            } catch {
                bio = false;
            }
            tagm.push(`
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*👑 @${i.id.split('@')[0]}*
    - jid : ${i.id}
    - admin : yes
    - position : ${c++}th member
    - direct link : wa.me/${i.id.split("@")[0]}
    - presence : ${presence}
    - business profile : ${isBusiness ? 'yes' : 'no'}
    - owner/sudo : ${userOwner ? 'yes' : 'no'}
    - status : ${bio.status ? bio.status : "~not found~"}
`.trim());
            }
        }
        for (const i of metadata.participants) {
            if (i.admin === null) {
            const presence = await anyaV2.presenceSubscribe(i.id);
            const isBusiness = await anyaV2.getBusinessProfile(i.id);
            const userOwner = [...bot.modlist, Config.ownernumber, botNumber].map(v => v.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(i.id);
            let bio;
            try {
                bio = await anyaV2.fetchStatus(i.id) || false;
            } catch {
                bio = false;
            }
            tagm.push(`
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*👤 @${i.id.split('@')[0]}*
    - jid : ${i.id}
    - admin : yes
    - position : ${c++}th member
    - direct link : wa.me/${i.id.split("@")[0]}
    - presence : ${presence}
    - business profile : ${isBusiness ? 'yes' : 'no'}
    - owner/sudo : ${userOwner ? 'yes' : 'no'}
    - status : ${bio.status ? bio.status : "unavailable"}
`.trim());
              }
        }
        return pika.edit(tagm.join('\n'), key, { mentions: metadata.participants.map(v => v.id) });
    }
)

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
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix+command} https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX`);
        const text = args.join(" ");
        if (!/https:\/\/chat.whatsapp.com\//.test(text)) return pika.reply("❎ Invalid WhatsApp Group Url");
        await anyaV2.groupGetInviteInfo(text.split("https://chat.whatsapp.com/")[1])
        .then(async response=> { 
            let participants = "";
            let c = 1;
            if (response.participants.length > 0) {
                participants += `\n*👥You May Know:*\n`;
                for (const i of response.participants) {
                    participants += `└ _${c++}. @${i.id.split("@")[0]}_\n`;
                }
            }
            const caption = `
*🔥Gc Type:* ${response.isCommunity ? "community" : "group chat"}
*🍁Gc Name:* ${response.subject}
└ _change time :_ ${(new Date(response.subjectTime * 1000)).toLocaleString().split(", ")[1]}
└ _change date :_ ${(new Date(response.subjectTime * 1000)).toLocaleString().split(", ")[0]}
└ _changed by :_ ${response.subjectOwner !== undefined ? "@" + response.subjectOwner.split("@")[0] : "unknown"}

*🌟Gc Owner:* ${response.owner !== undefined ? "@" + response.owner.split("@")[0] : "unknown"}
*📅Creation Date:* ${(new Date(response.creation * 1000)).toLocaleString().split(", ")[0]}
*⌚Creation Time:* ${(new Date(response.creation * 1000)).toLocaleString().split(", ")[1]}
*👤Members:* ${response.size} members (not accurate)
*🧿Mem Can Edit Gc:* ${response.restrict ? "yes!" : "no!"}
*🌠Mem Can Send Msg:* ${response.announce ? "no!" : "yes!"}
*⏳Has Disappearing Time:* ${response.ephemeralDuration !== undefined ? response.ephemeralDuration : "no!"}
${participants} (not accurate)\n
*🧩Desc:* ${response.desc !== undefined ? "\n" + response.desc : "no description available"}`;
            let ppgroup;
            try {
                ppgroup = await getBuffer(await anyaV2.profilePictureUrl(response.id, 'image'));
            } catch {
                ppgroup = await getBuffer('https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg');
            }
            await anyaV2.sendMessage(pika.chat, {
                image: ppgroup,
                caption: caption.trim(),
                mentions: caption.match(/@(\d+)/g).map(mention => `${mention.slice(1)}@s.whatsapp.net`)
            }, { quoted:pika });
        })
        .catch(err=> {
            console.error(err);
            pika.reply("❌ No Group Data Found! Maybe The Group Link Has Been Expired");
        });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "gitstalk",
            alias: ['githubstalker'],
            react: "🧿",
            need: "username",
            category: "stalker",
            desc: "Get github user information",
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.lengrh < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} PikaBotz`);
        axios.get(`https://api.github.com/users/${args[0].replace("@", "")}`)
        .then(async ({data})=> {
            const creation = formatDate(data.created_at);
            const updated = formatDate(data.updated_at);
            const caption = `
*👤UserName:* @${data.login}
└ _creation date :_ ${creation.date}
└ _creation time :_ ${creation.time}
└ _update date :_ ${updated.date}
└ _update time :_ ${updated.time}

*🍁Name:* ${data.name}
*💖Followers:* ${data.followers} followers
*🎀Followings:* ${data.following} followings
*🚀Public Repo:* ${data.public_repos} repositories
*🪩Public Gist:* ${data.public_gists} gists
*🧩Acc Type:* ${data.type}
*🌇Company:* ${data.company || "N/A"}
*🐦Twitter:* ${data.twitter_username || "N/A"}
*🌍Location:* ${data.location || "N/A"}
*🌟Email:* ${data.email || "N/A"}
*⚜️Bio:* ${data.bio || "N/A"}
`;
            await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(data.avatar_url),
                caption: caption.trim()
            }, {quoted:pika});
        })
        .catch(_=> pika.reply("*❎ User Not Found!*"));
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "gitrepo",
            alias: ['gitrepostalk'],
            react: "🌇",
            category: "stalker",
            need: "repo",
            desc: "Stalk github repositories",
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Exmaple:* ${prefix+command} PikaBotz|Anya_v2-MD`);
        const text = args.join(" ");
        const username = text.split("|")[0];
        const repository = text.split("|")[1];
        if (!username || !repository) return pika.reply("❌ Invalid input format!");
        const {key} = await pika.keyMsg(Config.message.wait);
        const url = `https://api.github.com/repos/${username.trim()}/${repository.trim()}`;
        axios.get(url)
        .then(async ({data})=> {
            const creation = formatDate(data.created_at);
            const updated = formatDate(data.updated_at);
            const pushed = formatDate(data.pushed_at);
            const caption = `
*🌟Name:* ${data.name}
└ _creation date :_ ${creation.date}
└ _creation time :_ ${creation.time}
└ _update date :_ ${updated.date}
└ _update time :_ ${updated.time}
└ _push date :_ ${pushed.date}
└ _push time :_ ${pushed.time}

*👤Owner Name:* @${data.owner.login}
*🌠Is Forked:* ${data.fork ? "yes!" : "no!"}
*🍁Can Fork:* ${data.allow_forking ? "yes!" : "no!"}
*🌇Is Template:* ${data.is_template ? "yes!" : "no!"}
*📑Is Archived:* ${data.archived ? "yes!" : "no!"}
*💝Size:* ${(data.size / 1024).toFixed(2)}MB
*🌟Stars:* ${formatNumber(data.stargazers_count)} stars
*🍽️Forks:* ${formatNumber(data.forks)} forks
*✍🏻Language:* ${data.language}
*🎀Branch:* ${data.default_branch}
*🧿Subscribers:* ${data.subscribers_count} subscribers
*👁️‍🗨️Watchers:* ${data.watchers} watchers

*🔗Url:* ${data.html_url}

*🧩Desc:* ${data.description}

> ${Config.footer}
`;
            await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(`https://api.screenshotmachine.com?key=81d99b&url=${data.html_url}&dimension=1920x1080&format=jpg&cacheLimit=0&delay=2000&zoom=200`),
                caption: caption.trim()
            }, {quoted:pika})
            .then(()=> pika.deleteMsg(key));
        })
        .catch(_=> pika.edit("*❎ Something Went Wrong, please recheck username and repo name!*", key));
     }
)