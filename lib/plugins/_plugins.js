const fs = require("fs");
const path = require('path');
const axios = require("axios");
const chalk = require("chalk");
const Config = require('../../config');
const { anya, commands, Plugins, installPlugins, deletePlugins } = require('../lib');

//༺─────────────────────────────────────

anya({ name: "plugins", alias: ['plugin'], react: "🚀", category: "core", desc: "See all plugins list", rule: 1, filename: __filename },
    async (anyaV2, pika, { args }) => {
        const external = await Plugins.find({});
        if (external.length < 1) return pika.reply("_❌No plugins found..!_");
        const pluginlist = external.map((item, index) => "*" + Config.themeemoji + "Url: (" + index + 1 + "):* " + item.url + "\n*🌟File:* " + item.id + ".js").join('\n\n');
        return pika.reply(`*\`Reply Number:\`*
- _Reply 0 to delete all plugins_
- _Reply a specific number to delete that plugin_
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
\n${pluginlist}
\n_ID: QA32_`);
});

//༺─────────────────────────────────────

anya({ name: "install", react: "🔌", category: "core", rule: 1, desc: "Install external plugin commands", filename: __filename },
    async (anyaV2, pika, { args, prefix }) => {
        if (!args[0]) return pika.reply(`Enter a plugin *url*, type \`${prefix}pluginstore\` to get plugin URLs..!`);
        const input = args[0].toLowerCase();
        if (!/^https:\/\/gist\.githubusercontent\.com\/.+\/.+\/raw\//.test(input)) return pika.reply("_❌Invalid URL._");
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
            return pika.reply("*🔌Plugin Installed!*");
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

anya({
        name: "pluginstore",
        alias: ['pluginsstore'],
        react: "🦀",
        category: "core",
        desc: "External Plugins url and info store",
        filename: __filename
}, async (anyaV2, pika, { args }) => {

    /**
     * ⚠️ If anyhow you want to use this API, this is a private API
     * made for this bot specifically, it'll not work in your bot until you can the json URLs
     */
    axios.get("https://raw.githubusercontent.com/PikaBotz/My_Personal_Space/main/Plugins/Anya_v2/pluginsStore.json")
    .then(({data})=> {
        if (data.length < 1) return pika.reply("_❌No External Plugins Are Available To Download..!");
        let message = "*```🏪 PikaBotz Plugins Store!```*\n\n";
        message += "`Reply Number:`\n- _Reply 0 to install all plugins_\n- _Reply a specific number to install that plugin_\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n";
        const storelist = data.map((item, index) => "*" + Config.themeemoji + "Url: (" + index + 1 + "):* " + item.url + "\n*🌟File:* " + item.name + "\n*👣Type:* " + item.type + "\n*🏖️About:* " + item.desc).join('\n\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n');
        return pika.reply(message + storelist + "\n\n> " + Config.footer);
    })
    .catch(err=>{
        console.error("Error in store API:", err);
        return pika.reply("_⚠️ERROR:_", err.message);
    });
});

//༺─────────────────────────────────────

anya({
        name: "bulkplugininstall",
        react: "🔌",
        category: "core",
        notCmd: true,
        rule: 1,
        desc: "Install external plugin commands in bulk",
        filename: __filename
}, async (anyaV2, pika, { args }) => {
    if (args.length < 1) return pika.reply(`Enter one or more plugin *urls*, separated by spaces.`);
    const reply = [];
    const invalidUrls = args.filter(url => !/^https:\/\/gist\.githubusercontent\.com\/.+\/.+\/raw\//.test(url));
    if (invalidUrls.length > 0) reply.push(`_❌Invalid URLs:_ ${invalidUrls.join(', ')}`);
    const { key } = await pika.keyMsg(Config.message.wait);
    const external = await Plugins.find({});
    const existingPlugins = external.map(v => v.url);
    for (const i of args) {
        if (existingPlugins.includes(i)) {
            reply.push(`_✔️Plugin already exist:_ ${i}`);
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
            } else reply.push("_‼️" + response.message + ":_ " + i);
        } catch (error) {
            console.error(error);
            reply.push("_‼️Error installing " + i + ":_ " + error.message);
        }
    }
    syncPlugins(__dirname);
    return pika.edit(reply.join("\n\n"), key);
});

//༺─────────────────────────────────────

anya({
        name: "bulkplugindelete",
        react: "♻️",
        category: "core",
        notCmd: true,
        rule: 1,
        desc: "Remove external plugin commands in bulk",
        filename: __filename
}, async (anyaV2, pika, { args }) => {
    if (args.length < 1) return pika.reply(`Enter one or more plugin *urls*, separated by spaces.`);
    const reply = [];
    const invalidUrls = args.filter(url => !/^https:\/\/gist\.githubusercontent\.com\/.+\/.+\/raw\//.test(url));
    if (invalidUrls.length > 0) reply.push(`_❌Invalid URLs:_ ${invalidUrls.join(', ')}`);
    const { key } = await pika.keyMsg(Config.message.wait);
    const external = await Plugins.find({});
    const existingPlugins = external.map(v => v.url);
    for (const i of args) {
        if (!existingPlugins.includes(i)) {
            reply.push(`_❌Plugin does not exist:_ ${i}`);
            continue;
        }
        try {
            const response = await deletePlugins(i);
            if (response.status === 200) {
                const pluginFile = path.join(__dirname, i.split("/").pop());
                const resolvedPath = require.resolve(pluginFile);
                delete require.cache[resolvedPath];
                fs.unlinkSync(pluginFile, (err) => {
                    if (err) {
                        console.error("Error deleting the file: " + err);
                        reply.push("_❌Error deleting file:_ " + i);
                    } else {
                        reply.push(`*☑️Plugin Deleted:* ${i}`);
                    }
                });
                for (let i = commands.length - 1; i >= 0; i--) {
                    if ((!commands[i].filename ? "yamete kudasai ahh~🥵💦" : commands[i].filename.split("/").pop()) === save.filename + ".js") {
                        commands.splice(i, 1);
                    }
                }
            } else reply.push("_‼️Error deleting " + i + ":_ " + response.message);
        } catch (error) {
            console.error(error);
            reply.push("_‼️Error deleting " + i + ":_ " + error.message);
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
