const fs = require("fs");
const path = require('path');
const axios = require("axios");
const chalk = require("chalk");
const Config = require('../../config');
const { anya, commands, UI, Plugins, installPlugins, deletePlugins, getBuffer, pickRandom } = require('../lib');

//༺─────────────────────────────────────

anya({ name: "plugins", alias: ['plugin'], react: "🚀", category: "core", desc: "See all plugins list", rule: 1, filename: __filename },
    async (anyaV2, pika, { args, prefix }) => {
    const external = await Plugins.find({});
    if (external.length < 1) return pika.reply("_❌ No plugins found..!_");
    const thumbUrl = pickRandom(require('./lib/database/json/flaming')) + "Plugins%20List";
    const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());
    if (ui.buttons) {
        const pluginlist = external.map((item, index) => `{\"header\":\"${item.id.charAt(0).toUpperCase() + item.id.slice(1)}\",\"title\":\"\",\"description\":\"𝘵𝘢𝘱 𝘩𝘦𝘳𝘦 𝘵𝘰 𝘥𝘦𝘭𝘦𝘵𝘦\",\"id\":\"${prefix}delplugins ${item.id}\"}`).join(',');
        const links = external.map(item => item.url).join(" ");
        const caption = "`⧉ Plugins List ⧉`\n\n*👤 User:* @" + pika.sender.split("@")[0] + "\n*🍉 Bot:* " + Config.botname + "\n*🍓 Total Plugins:* " + external.length + " installed";
        return await anyaV2.sendButtonImage(pika.chat, {
            caption: caption,
            image: await getBuffer(thumbUrl),
            footer: Config.footer,
            buttons: [{
                "name": "single_select",
                "buttonParamsJson": `{\"title\":\"See Plugins 🧾\",\"sections\":[{\"title\":\"⚡ 𝗣𝗹𝘂𝗴𝗶𝗻𝘀 𝗟𝗶𝘀𝘁 ⚡\",\"highlight_label\":\"${Config.botname}\",\"rows\":[{\"header\":\"🍓 Delete All Plugins 🍓\",\"title\":\"\",\"description\":\"°click here to delete all plugins\",\"id\":\"${prefix}bulkplugindelete ${links}\"}]},{\"title\":\"⚡ 𝗣𝗹𝘂𝗴𝗶𝗻𝘀 𝗟𝗶𝘀𝘁 ⚡\",\"highlight_label\":\"${Config.botname}\",\"rows\":[${pluginlist}]}]}`
            },
            {
                 "name": "cta_url",
                 "buttonParamsJson": `{\"display_text\":\"Website ⚡\",\"url\":\"${Config.socialLink}\",\"merchant_url\":\"${Config.socialLink}\"}`
            },
            {
                "name": "quick_reply",
                "buttonParamsJson": `{\"display_text\":\"Script 🔖\",\"id\":\"${prefix}sc\"}`
            }],
            contextInfo: { mentionedJid: [pika.sender] }
        }, { quoted: pika });
    } else {
        const pluginlist = external.map((item, index) => `*${Config.themeemoji} Url: (${index + 1}):* ${item.url}\n*🌟 File:* ${item.id}.js`).join('\n\n');
        const caption = "- _Reply 0 to delete all plugins_\n- _Reply with a specific number to delete that plugin_\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n" + pluginlist + "\n\n> _ID: QA32_";
        return await anyaV2.sendMessage(pika.chat, {
            text: caption,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: `🔌 Installed Plugins List`,
                    body: 'Reply with a number to delete that plugin',
                    thumbnailUrl: thumbUrl,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: pika });
    }
});

//༺─────────────────────────────────────

anya({ name: "install", react: "🍇", category: "core", rule: 1, desc: "Install external plugin commands", filename: __filename },
    async (anyaV2, pika, { args, prefix }) => {
        if (!args[0]) return pika.reply("Enter a plugin *url*, type `" + prefix + "pluginstore` to get plugin URLs..!");
        const input = args[0].toLowerCase();
        if (!/^https:\/\/gist\.githubusercontent\.com\/.+\/.+\/raw\//.test(input)) return pika.reply("_🌀Invalid URL._");
        const external = await Plugins.find({});
        const checkurl = external.map(v => v.url);
        if (checkurl.includes(input)) return pika.reply("_Plugin already exist..!_");
        const response = await installPlugins(input);
        if (response.status === 200) {
            const save = await Plugins.find({});
            for (let i = 0; i < save.length; i++) {
                const {data} = await axios.get(save[i].url);
                await fs.writeFileSync(__dirname + "/" + save[i].id + '.js', data, "utf8");
            }
            syncPlugins(__dirname);
            return pika.reply("*⚡Plugin Installed!*");
        } else return pika.reply("_‼️" + response.message + "_");
});

//༺─────────────────────────────────────

anya({ name: "delplugin", alias: ['deleteplugin', 'uninstall'], react: "♻️", category: "core", rule: 1, desc: "Remove external plugin commands", filename: __filename },
    async (anyaV2, pika, { args }) => {
        if (!args[0]) return pika.reply("Enter a valid `url` or `id`");
        const external = await Plugins.find({});
        let plugins;
        const input = args[0].toLowerCase();
        if (/^https:\/\/gist\.githubusercontent\.com\/.+\/.+\/raw\//.test(input)) {
            plugins = external.map(v => v.url);
        } else plugins = external.map(v => v.id);
        if (!plugins.includes(input)) return pika.reply("_Plugin does not exist._");
        const save = await deletePlugins(input);
        if (save.status === 200) {
            delete require.cache[require.resolve("./" + save.filename + ".js")];
            fs.unlinkSync(__dirname + "/" + save.filename + ".js");
            for (let i = commands.length - 1; i >= 0; i--) {
                if ((!commands[i].filename ? "yamete kudasai ahh~🥵💦" : commands[i].filename.split("/").pop()) === save.filename + ".js") {
                    commands.splice(i, 1);
                }
            }
            return pika.reply("*☑️Plugin Deleted!*");
        } else return pika.reply("_‼️" + save.message + "_");
});

//༺─────────────────────────────────────

anya({ name: "pluginstore", alias: ['pluginsstore'], react: "🍓", category: "core", desc: "External Plugins url and info store", filename: __filename }, async (anyaV2, pika, { args, prefix }) => {

    /**
     * ⚠️ If anyhow you want to use this API, this is a private API
     * made for this bot specifically, it'll not work in your bot until you can use the json URLs
     */
    try {
        const { data } = await axios.get("https://raw.githubusercontent.com/PikaBotz/My_Personal_Space/main/Plugins/Anya_v2/pluginsStore.json");
        if (data.length < 1) return pika.reply("_❌ No External Plugins Are Available To Download..!_");
        const thumbUrl = pickRandom(require('./lib/database/json/flaming')) + "Plugins%20Store";
        const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());
        if (ui.buttons) {
            const pluginlist = data.map((item, index) => `{\"header\":\"${item.name.charAt(0).toUpperCase() + item.name.slice(1)}\",\"title\":\"${item.type}\",\"description\":\"${item.desc}\",\"id\":\"${prefix}install ${item.url}\"}`).join(',');
            const links = data.map(item => item.url).join(" ");
            const caption = "`🏪 PikaBotz Plugins Store!`\n\n*👤 User:* @" + pika.sender.split("@")[0] + "\n*🤖 Bot:* " + Config.botname + "\n*🧾 Available To Download:* " + data.length + " plugins";
            return await anyaV2.sendButtonImage(pika.chat, {
                caption: caption,
                image: await getBuffer(thumbUrl),
                footer: Config.footer,
                buttons: [{
                    "name": "single_select",
                    "buttonParamsJson": `{\"title\":\"Tap Here To Download 🧾\",\"sections\":[{\"title\":\"⚡ 𝗣𝗹𝘂𝗴𝗶𝗻𝘀 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 ⚡\",\"highlight_label\":\"${Config.botname}\",\"rows\":[{\"header\":\"🍉 Install All Plugins 🍉\",\"title\":\"\",\"description\":\"Click here to install every plugin\",\"id\":\"${prefix}bulkplugininstall ${links}\"}]},{\"title\":\"⚡ 𝗣𝗹𝘂𝗴𝗶𝗻𝘀 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 ⚡\",\"highlight_label\":\"${Config.botname}\",\"rows\":[${pluginlist}]}]}`
                },
                {
                    "name": "cta_url",
                    "buttonParamsJson": `{\"display_text\":\"Website 🎐\",\"url\":\"${Config.socialLink}\",\"merchant_url\":\"${Config.socialLink}\"}`
                },
                {
                    "name": "quick_reply",
                    "buttonParamsJson": `{\"display_text\":\"Script 🔖\",\"id\":\"${prefix}sc\"}`
                }],
                contextInfo: { mentionedJid: [pika.sender] }
            }, { quoted: pika });
        } else {
            const message = "- _Reply 0 to install all plugins_\n- _Reply with a specific number to install that plugin_\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n";
            const storelist = data.map((item, index) => `*${Config.themeemoji} Url: (${index + 1}):* ${item.url}\n*🌟 File:* _${item.name}_\n*🍜 Type:* _${item.type}_\n*🗣️ About:* _${item.desc.trim()}_`).join('\n\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n');
            return await anyaV2.sendMessage(pika.chat, {
                text: message + storelist + "\n\n> _ID: QA33_\n> " + Config.footer,
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        title: `🏪 PikaBotz Plugins Store!`,
                        body: 'Reply with a number to install that plugin',
                        thumbnailUrl: thumbUrl,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: pika });
        }
    } catch (err) {
        console.error("Error in store API:", err);
        return pika.reply("_⚠️ ERROR:_ " + err.message);
    }
});

//༺─────────────────────────────────────

anya({
        name: "bulkplugininstall",
        react: "🍥",
        category: "core",
        notCmd: true,
        rule: 1,
        desc: "Install external plugin commands in bulk",
        filename: __filename
}, async (anyaV2, pika, { args }) => {
    if (args.length < 1) return pika.reply(`Enter one or more plugin *urls*, separated by spaces.`);
    const reply = [];
    const invalidUrls = args.filter(url => !/^https:\/\/gist\.githubusercontent\.com\/.+\/.+\/raw\//.test(url.toLowerCase()));
    if (invalidUrls.length > 0) reply.push("_🌀Invalid URLs:_ " + invalidUrls.join(', '));
    const { key } = await pika.keyMsg(Config.message.wait);
    const external = await Plugins.find({});
    const existingPlugins = external.map(v => v.url);
    for (const i of args) {
        if (existingPlugins.includes(i.toLowerCase())) {
            reply.push("_`❌Plugin already exist:`_ " + i);
            continue;
        }
        try {
            const response = await installPlugins(i);
            if (response.status === 200) {
                //const save = await Plugins.find({});
                for (let i = 0; i < args.length; i++) {
                    const {data} = await axios.get(args[i]);
                    await fs.writeFileSync(__dirname + "/" + args[i].split("/").pop(), data, "utf8");
                }
                reply.push("_`✅Plugin Installed:`_ " + i);
            } else reply.push("_‼️" + response.message + " :_ " + i);
        } catch (error) {
            console.error(error);
            reply.push("_‼️Error installing " + i + " :_ " + error.message);
        }
    }
    syncPlugins(__dirname);
    return pika.edit(reply.join("\n\n"), key);
});

//༺─────────────────────────────────────

anya({
        name: "bulkplugindelete",
        react: "🌪️",
        category: "core",
        notCmd: true,
        rule: 1,
        desc: "Remove external plugin commands in bulk",
        filename: __filename
}, async (anyaV2, pika, { args }) => {
    if (args.length < 1) return pika.reply(`Enter one or more plugin *urls*, separated by spaces.`);
    const reply = [];
    const invalidUrls = args.filter(url => !/^https:\/\/gist\.githubusercontent\.com\/.+\/.+\/raw\//.test(url.toLowerCase()));
    if (invalidUrls.length > 0) reply.push("_🌀Invalid URLs:_ " + invalidUrls.join(', '));
    const { key } = await pika.keyMsg(Config.message.wait);
    const external = await Plugins.find({});
    const existingPlugins = external.map(v => v.url);
    for (const i of args) {
        if (!existingPlugins.includes(i.toLowerCase())) {
            reply.push("_`❌Plugin does not exist:`_ " + i);
            continue;
        }
        try {
            const delplug = await deletePlugins(i);
            if (delplug.status === 200) {
                const pluginFile = path.join(__dirname, i.split("/").pop());
                const resolvedPath = require.resolve(pluginFile);
                delete require.cache[resolvedPath];
                fs.unlinkSync(pluginFile, (err) => {
                    if (err) {
                        console.error("Error deleting the file: " + err);
                        reply.push("_❌Error deleting file:_ " + i);
                    } else {
                        reply.push("_`✅Plugin Deleted:`_ " + i);
                    }
                });
                for (let i = commands.length - 1; i >= 0; i--) {
                    if ((!commands[i].filename ? "yamete kudasai ahh~🥵💦" : commands[i].filename.split("/").pop()) === delplug.filename + ".js") {
                        commands.splice(i, 1);
                    }
                }
            } else reply.push("_‼️Error deleting " + i + " :_ " + delplug.message);
        } catch (error) {
            console.error(error);
            reply.push("_‼️Error deleting " + i + " :_ " + error.message);
        }
    }
    return pika.edit(reply.join("\n\n"), key);
});

//༺─────────────────────────────────────
/**
 * Jo Decrypt Kre Uski Maa Ka Bhosda
 */
const syncPlugins = async (directory) => {
    function _0x3e6b(_0x2359ca,_0x53c97a){const _0x378826=_0x3788();return _0x3e6b=function(_0x3e6bc7,_0x539fc1){_0x3e6bc7=_0x3e6bc7-0x74;let _0x14e181=_0x378826[_0x3e6bc7];return _0x14e181;},_0x3e6b(_0x2359ca,_0x53c97a);}const _0x4dd5a1=_0x3e6b;(function(_0x5e85db,_0x4030e0){const _0x344bcf=_0x3e6b,_0x593168=_0x5e85db();while(!![]){try{const _0x2f71a4=parseInt(_0x344bcf(0x83))/0x1+-parseInt(_0x344bcf(0x7e))/0x2*(parseInt(_0x344bcf(0x7c))/0x3)+-parseInt(_0x344bcf(0x78))/0x4+-parseInt(_0x344bcf(0x82))/0x5+parseInt(_0x344bcf(0x7a))/0x6+-parseInt(_0x344bcf(0x77))/0x7*(parseInt(_0x344bcf(0x79))/0x8)+-parseInt(_0x344bcf(0x74))/0x9*(-parseInt(_0x344bcf(0x7d))/0xa);if(_0x2f71a4===_0x4030e0)break;else _0x593168['push'](_0x593168['shift']());}catch(_0x55d021){_0x593168['push'](_0x593168['shift']());}}}(_0x3788,0xa7b9f),fs[_0x4dd5a1(0x7b)](directory,(_0x51e46f,_0x3112b6)=>{const _0x5ec74b=_0x4dd5a1;if(_0x51e46f){console['error']('Error\x20reading\x20directory:',_0x51e46f);return;}const _0x50a80b=_0x3112b6[_0x5ec74b(0x76)](_0x157466=>path[_0x5ec74b(0x75)](_0x157466)[_0x5ec74b(0x84)]()===_0x5ec74b(0x80));_0x50a80b[_0x5ec74b(0x81)](_0x5c4622=>{const _0xec8886=_0x5ec74b,_0x1b91ba=path[_0xec8886(0x7f)](directory,_0x5c4622),_0x2c9b8e=require(_0x1b91ba);});}));function _0x3788(){const _0x23e8b9=['1525400QZcDXX','5471320HMOqUN','811116jQUoZs','readdir','1040997MQtyMa','30iMMtIv','2iNnOZc','join','.js','forEach','3528280pNIpSj','1117390yCsMVi','toLowerCase','6708798cCkjkx','extname','filter','14ylAzjf'];_0x3788=function(){return _0x23e8b9;};return _0x3788();}
};
