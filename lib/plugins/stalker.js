const Config = require('../../config');
const axios = require('axios');
const {
  anya,
  getBuffer,
  formatDate,
  formatNumber,
  UI,
  igstalk
} = require('../lib');

//༺─────────────────────────────────────༻

anya({
            name: "igstalk",
            alias: ['instagram', 'insta', 'ig'],
            react: "📸",
            need: "username",
            category: "stalker",
            desc: "Get Instagram user information",
            filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    if (args.length < 1) return pika.reply("_Enter an insta username_");    
    const username = args[0];
    igstalk(username)
    .then(async response => {
        if (!response.status) return pika.reply("```Account not found or not an ERR!```");
        const details = response.results;
        const cpt = [
            '*❖ Username :* ' + details.username,
            '*❖ Fullname :* ' + details.fullname,
            '*❖ Followers :* ' + formatNumber(details.followers),
            '*❖ Following :* ' + formatNumber(details.followings),
        ];
        const others = ['\n\n_*Other details :*_'];
        if (details.is_private) {
            cpt.push('```⚠️ Account Is Private..!\n```', '*❖ Private Acc :* YES');
        } else {
            if (details.new_to_ig) cpt.push('*❖ New To Ig :* YES');
            if (details.is_2nd_acc) cpt.push('*❖ Is 2nd Acc :* YES');
            if (details.is_verified !== 'N/A') cpt.push('*❖ Verified :* YES');
            if (details.category !== 'None') cpt.push('*❖ Category :* ' + details.category);
            if (details.pronouns.length > 0) cpt.push('*❖ Pronouns :* ' + details.pronouns.join(", "));
            if (details.bio) cpt.push('*❖ Bio :*\n' + details.bio + '\n');
            [
                { key: 'is_whatsapp_linked', text: '*❖ WhatsApp Linked :* YES' },
                { key: 'anti_followers_spam', text: '*❖ Anti Spam Followers :* ENABLED' },
                { key: 'igtv_posts', text: '*❖ IgTv Posts :* ' + formatNumber(details.igtv_posts) },
                { key: 'is_business', text: '*❖ Is Business :* YES' },
                { key: 'public_email', text: '*❖ Mail :* ' + details.public_email },
                { key: 'public_phone_number', text: '*❖ Number :* ' + details.public_phone_number },
                { key: 'has_bitmoji', text: '*❖ Has Bitmoji :* YES' },
                { key: 'has_highlight_reels', text: '*❖ Has Highlighted Reels :* YES' },
                { key: 'has_music_on_profile', text: '*❖ Has Music On Profile :* YES' },
                { key: 'has_collab_collections', text: '*❖ Has Collab Collection :* YES' },
                { key: 'has_exclusive_feed_content', text: '*❖ Has Exclusive Feed Content :* YES' },
                { key: 'has_private_collections', text: '*❖ Has Private Collection :* YES' },
                { key: 'is_parenting_acc', text: '*❖ Parenting Acc :* YES' },
                { key: 'is_open_to_collab', text: '*❖ Open To Collab :* YES' },
                { key: 'direct_messaging', text: '*❖ Direct Messaging :* ALLOWED' },
                { key: 'post_remix', text: '*❖ Post Remix :* ALLOWED' },
                { key: 'reels_remix', text: '*❖ Reels Remix :* ALLOWED' },
                { key: 'is_favorite', text: '*❖ Favourite Acc :* YES' },
                { key: 'is_memorialized', text: '*❖ Memorialized Acc :* YES' },
                { key: 'is_eligible_for_meta_verified_label', text: '*❖ Eligible For Meta Verified Label :* YES' },
                { key: 'is_eligible_for_meta_verified_related_accounts', text: '*❖ Eligible For Meta Verified Related Accounts :* YES' },
            ].forEach(({ key, text }) => details[key] && others.push(text));
        }
        const pfpUrl = details.profile_picture || Config.imageUrl;
        const accUrl = 'https://instagram.com/' + username;
        const ui = db.UI?.[0] || await new UI({ id: "userInterface" }).save();
        if (ui.buttons) {
            return anyaV2.sendButtonImage(pika.chat, {
                image: { url: pfpUrl },
                caption: "_*🌟 Instagram User Info 🌟*_\n\n" + cpt.join("\n") + (others.length > 1 ? others.join("\n> ") : ''),
                footer: Config.footer,
                buttons: [{ "name": "cta_url", "buttonParamsJson": `{"display_text":"Visit Profile","url":"${accUrl}","merchant_url":"${accUrl}"}` }]
            }, { quoted: pika });
        }
        anyaV2.sendMessage(pika.chat, {
            text: "_*🌟 Instagram User Info 🌟*_\n\n" + cpt.join("\n") + (others.length > 1 ? others.join("\n> ") : '') + `\n\n> ${Config.footer}`,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: `${details.fullname} (${details.username}) • Instagram Profile`,
                    body: `${details.followers} Followers, ${details.followings} Following${details.posts ? `, ${details.posts} Posts` : ''} • @PikaBotz Inc.`,
                    thumbnailUrl: pfpUrl,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    mediaUrl: accUrl,
                    sourceUrl: accUrl
                }
            }
        }, { quoted: pika });
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
}, async (anyaV2, pika, { db, args, prefix, command }) => {
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

*⚜️ Bio:* ${data.bio || "N/A"}`.trim();
            const buffer = await getBuffer(data.avatar_url);
            const ui = db.UI?.[0] || (await new UI({ id: "userInterface" }).save());
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
                    caption: caption + `\n\n> ${Config.footer}`
                }, { quoted: pika });
            }

            await pika.deleteMsg(key);
        })
        .catch(err => {
            console.error(err);
            pika.edit("*❎ User Not Found!*", key);
        });
});
