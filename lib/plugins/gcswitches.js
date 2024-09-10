const Config = require('../../config');
const { anya, fancy13, UI, Group, announce, pickRandom, getBuffer } = require('../lib');

//༺─────────────────────────────────────༻

const dataArray = [
    {
        id: "antilink",
        name: "Antilink",
        emoji: "🔗",
        announcement: true,
        announcementTxt: "_Users are not allowed to send any `links 🔗` in this group._"
    },
    {
        id: "antibot",
        name: "Antibot",
        emoji: "🤖",
        announcement: false
    },
    {
        id: "antitoxic",
        name: "Antitoxic",
        alias: ['antibad', 'antiword'],
        emoji: "☣️",
        announcement: true,
        announcementTxt: "_Users are not allowed to use any `abusive or toxic ☣️ language` in this group._"
    },
    {
        id: "antivirus",
        name: "Antivirus",
        emoji: "⚡",
        announcement: false
    },
    {
        id: "antipicture",
        name: "Antipicture",
        emoji: "🖼️",
        announcement: true,
        announcementTxt: "_Users are not allowed to send any `images 🖼️` in this group._"
    },
    {
        id: "antivideo",
        name: "Antivideo",
        emoji: "🎦",
        announcement: true,
        announcementTxt: "_Users are not allowed to send any `videos 🎦` in this group._"
    },
    {
        id: "antisticker",
        name: "Antisticker",
        emoji: "👻",
        announcement: true,
        announcementTxt: "_Users are not allowed to send any `stickers 👻` in this group._"
    },
    {
        id: "antispam",
        name: "Antispam",
        emoji: "💖",
        announcement: true,
        announcementTxt: "_Users are not allowed to `spam` in this group._"
    },
    {
        id: "chatbot",
        name: "Gc Chatbot",
        alias: ['gcchatbot', 'chatbot'],
        emoji: "💝",
        announcement: false
    },
    {
        id: "nsfw",
        name: "NSFW",
        emoji: "💦",
        announcement: false
    }
];

//༺─────────────────────────────────────

anya({
    name: "enable",
    alias: ['act', 'activate', 'active'],
    react: "✅",
    category: "admins",
    need: "options",
    desc: "Enable group options",
    rule: 3,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const group = db.Group.find(v => v.id === pika.chat.split("@")[0]) || (await new Group({ id: pika.chat.split("@")[0] }).save());
    if (args.length < 1) {
        const ui = db.UI?.[0] || (await new UI({ id: "userInterface" }).save());
        if (ui.buttons) {
            const butArray = [];
            for (const i of dataArray) {
                butArray.push(`{"header":"","title":"${i.emoji} ${i.name} ${group[i.id] ? fancy13("(✅ enabled)") : ""}","description":"${fancy13("tap here to " + command + " " + i.id)}","id":"${prefix + command} ${i.id}"}`);
            }
            const settinglist = butArray.join(",");
            const metadata = await anyaV2.groupMetadata(pika.chat);
            return await anyaV2.sendButtonText(pika.chat, {
                text: `
*⚙️«« Group Settings »»⚙️*

\`Choose To Enable!\`

> *Group:* ${metadata.subject}
> *Members:* ${metadata.participants.length} _members_

_⚡ Click on the button below to enable settings!_
`.trim(),
                footer: Config.footer,
                buttons: [{
                    "name": "single_select",
                    "buttonParamsJson": `{"title":"Settings ⚙️","sections":[{"title":"⚙️ Group Settings ⚙️","highlight_label":"${Config.botname}","rows":[${settinglist}]}]}`
                }],
                contextInfo: { mentionedJid: [pika.sender] }
            }, { quoted: pika });
        } else {
            //const thumbUrl = pickRandom(require('../database/json/flaming.json')) + "Group%20Settings";
            let caption = "";
            let num = 1;
            caption += `\`Reply a number to enable:\`\n\n`;
            for (const i of dataArray) {
                caption += `${num++}. _${i.name}_ ${i.emoji} ${group[i.id] ? fancy13("_(✅ enabled)_") : ""}\n`;
            }
            caption += "\n> Tip: type `" + prefix + command + " <option>` to enable directly!\n";
            caption += "\n> _ID: QA35_";
            return pika.reply(caption.trim());
        }
    }

    const option = args[0].toLowerCase();
    const matchedItem = dataArray.find(item => item.name.toLowerCase() === option || (item.alias && item.alias.some(alias => alias.toLowerCase() === option)));
    if (!matchedItem) return pika.reply("_❌Wrong option selected: " + option + "_");
    const { id, emoji, name, announcement, announcementTxt } = matchedItem;
    if (group[id]) return pika.reply("_" + emoji + " Already Enabled " + name + "!_");
    await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { [id]: true } }, { new: true });
    if (announcement) {
        await announce(anyaV2, pika, { message: announcementTxt });
    }
    return pika.reply("✅ Successfully Enabled `" + name + emoji + "`");
});

//༺─────────────────────────────────────

anya({
    name: "disable",
    alias: ['deact', 'deactivate', 'deactive'],
    react: "⚙️",
    category: "admins",
    need: "options",
    desc: "Disable group options",
    rule: 3,
    filename: __filename
}, async (anyaV2, pika, { db, args, prefix, command }) => {
    const group = db.Group.find(v => v.id === pika.chat.split("@")[0]) || (await new Group({ id: pika.chat.split("@")[0] }).save());
    if (args.length < 1) {
        const ui = db.UI?.[0] || (await new UI({ id: "userInterface" }).save());
        if (ui.buttons) {
            const butArray = [];
            for (const i of dataArray) {
                butArray.push(`{"header":"","title":"${i.emoji} ${i.name} ${group[i.id] ? fancy13("(✅ enabled)") : ""}","description":"${fancy13("tap here to " + command + " " + i.id)}","id":"${prefix + command} ${i.id}"}`);
            }
            const settinglist = butArray.join(",");
            const metadata = await anyaV2.groupMetadata(pika.chat);
            return await anyaV2.sendButtonText(pika.chat, {
                text: `
*⚙️«« Group Settings »»⚙️*

\`Choose To Disable!\`

> *Group:* ${metadata.subject}
> *Members:* ${metadata.participants.length} _members_

_⚡ Click on the button below to \`disable\` settings!_
`.trim(),
                footer: Config.footer,
                buttons: [{
                    "name": "single_select",
                    "buttonParamsJson": `{"title":"Settings ⚙️","sections":[{"title":"⚙️ Disable Settings ⚙️","highlight_label":"${Config.botname}","rows":[${settinglist}]}]}`
                }],
                contextInfo: { mentionedJid: [pika.sender] }
            }, { quoted: pika });
        } else {
            //const thumbUrl = pickRandom(require('../database/json/flaming.json')) + "Group%20Settings";
            let caption = "";
            let num = 1;
            caption += `\`Reply a number to disable:\`\n\n`;
            for (const i of dataArray) {
                caption += `${num++}. _${i.name}_ ${i.emoji} ${group[i.id] ? fancy13("_(✅ enabled)_") : ""}\n`;
            }
            caption += "\n> Tip: type `" + prefix + command + " <option>` to disable directly!\n";
            caption += "\n> _ID: QA36_";
            return pika.reply(caption.trim());
        }
    } else {
        const option = args[0].toLowerCase();
        const matchedItem = dataArray.find(item => item.name.toLowerCase() === option.toLowerCase() || (item.alias && item.alias.some(alias => alias.toLowerCase() === option.toLowerCase())));
        if (!matchedItem) return pika.reply("_❌Wrong option selected: " + option + "_");
        const { id, emoji, name } = matchedItem;
        if (!group[id]) return pika.reply("_" + emoji + " Already Disabled " + name + "!_");
        await Group.findOneAndUpdate({ id: pika.chat.split("@")[0] }, { $set: { [id]: false } }, { new: true });
        return pika.reply("✅ Successfully Disabled `" + name + emoji + "`");
    }
});
