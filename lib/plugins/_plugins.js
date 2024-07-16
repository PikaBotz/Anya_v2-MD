const fs = require("fs");
const path = require('path');
const axios = require("axios");
const chalk = require("chalk");
const Config = require('../../config');
const { anya, Plugins, installPlugins, deletePlugins } = require('../lib');

//༺─────────────────────────────────────

anya({
        name: "plugins",
        react: "🚀",
        category: "core",
        desc: "See all plugins list",
        rule: 1,
        filename: __filename
},
async (anyaV2, pika, { args, prefix }) => {
        const external = await Plugins.find({});
        console.log(external);
        if (external.length < 1) return pika.reply("_❌No plugins found..!_");
        const pluginlist = external.map((item, index) => `*${Config.themeemoji}Url: (${index + 1}):* ${item.url}\n*🌟File:* ${item.id}.js`).join('\n\n');
        return pika.reply(`═══════════════════════
*\`🔌 External Plugins List..! 🔌\`*
═══════════════════════

*\`Reply Number:\`*
- _Reply 0 to delete all plugins_
- _Reply a specific number to delete that plugin_
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

${pluginlist}

_ID: QA32_`);
});

//༺─────────────────────────────────────

anya({
        name: "install",
        react: "🔌",
        category: "core",
        rule: 1,
        desc: "Install external plugin commands",
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix }) => {
        if (!args[0]) return pika.reply(`Enter a plugin *url*, type \`${prefix}pluginstore\` to install plugins..!`);
        if (!/^https:\/\/gist\.githubusercontent\.com\/.+\/.+\/raw\//.test(args[0].toLowerCase())) return pika.reply("_❌Invalid URL._");
        const external = await Plugins.find({});
        const plugins = external.map(v => v.url);
        if (plugins.includes(args[0])) return pika.reply("_✅ Plugin already exist..!_");
        const response = await installPlugins(args[0]);
        if (response.status === 200) {
            const check = await Plugins.find({});
            for (let i = 0; i < check.length; i++) {
                const {data} = await axios.get(check[i].url);
                await fs.writeFileSync(__dirname + "/" + check[i].id + '.js', data, "utf8");
            }
            syncPlugins(__dirname);
            console.log(chalk.green("✅ External plugins downloaded..!"));
         return pika.reply("*🔌Plugin Installed!*");
        } else return pika.reply(`_‼️${response.message}_`);
});

//༺─────────────────────────────────────

anya({
    name: "delplugin",
    alias: ['deleteplugin'],
    react: "♻️",
    category: "core",
    rule: 1,
    desc: "Delete external plugin commands",
    filename: __filename
},
async (anyaV2, pika, { args, prefix }) => {
    if (!args[0]) return pika.reply(`Enter a plugin *url* to delete.`);
//    if (!/^https:\/\/gist\.githubusercontent\.com\/.+\/.+\/raw\//.test(args[0].toLowerCase())) return pika.reply("_❌Invalid URL._");
    const external = await Plugins.find({});
    let plugins;
    if (/^https:\/\/gist\.githubusercontent\.com\/.+\/.+\/raw\//.test(args[0].toLowerCase())) {
        plugins = external.map(v => v.url);
    } else plugins = external.map(v => v.id);
    if (!plugins.includes(args[0])) return pika.reply("_❌Plugin does not exist._");
    const response = await deletePlugins(args[0]);
    if (response.status === 200) {
            delete require.cache[require.resolve(__dirname + "/" + args[0].split("/").pop())];
            fs.unlink(`${__dirname + args[0].split("/").pop()}`, (err) => {
                if (err) console.error(`Error deleting the file: ${err}`); 
            });
        return pika.reply("*☑️Plugin Deleted!*");
    } else return pika.reply(`_‼️${response.message}_`);
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
    },
async (anyaV2, pika, { args, prefix }) => {
    if (args.length < 1) return pika.reply(`Enter one or more plugin *urls*, separated by spaces. Type \`${prefix}pluginstore\` to install plugins..!`);
    const reply = [];
    const invalidUrls = args.filter(url => !/^https:\/\/gist\.githubusercontent\.com\/.+\/.+\/raw\//.test(url));
    if (invalidUrls.length > 0) reply.push(`❌Invalid URLs: ${invalidUrls.join(', ')}`);
    const {key} = await pika.keyMsg(Config.message.wait);
    const external = await Plugins.find({});
    const existingPlugins = external.map(v => v.url);
    for (const url of args) {
        if (existingPlugins.includes(url)) {
            reply.push(`_✅Plugin already exists:_ ${url}`);
            continue;
        }
        try {
            const response = await installPlugins(url);
             if (response.status === 200) reply.push(`*🔌Plugin Installed:* ${url}`);
            else reply.push(`_‼️Error installing ${url}:_ ${response.message}`);            
        } catch (error) {
            reply.push(`_‼️Error installing ${url}:_ ${error.message}`);
        }
    }
            const check = await Plugins.find({});
            for (let i = 0; i < check.length; i++) {
                const {data} = await axios.get(check[i].url);
                await fs.writeFileSync(__dirname + "/" + check[i].id + '.js', data, "utf8");
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
        desc: "Delete external plugin commands in bulk",
        filename: __filename
},
async (anyaV2, pika, { args, prefix }) => {
    if (args.length < 1) return pika.reply(`Enter one or more plugin *urls*, separated by spaces.`);    
    const reply = [];
    const invalidUrls = args.filter(url => !/^https:\/\/gist\.githubusercontent\.com\/.+\/.+\/raw\//.test(url));
    if (invalidUrls.length > 0) reply.push(`❌Invalid URLs: ${invalidUrls.join(', ')}`);    
    const {key} = await pika.keyMsg(Config.message.wait);
    const external = await Plugins.find({});
    const existingPlugins = external.map(v => v.url);
    for (const url of args) {
        if (!existingPlugins.includes(url)) {
            reply.push(`_❌Plugin does not exist:_ ${url}`);
            continue;
        }
        try {
            const response = await deletePlugins(url);
            delete require.cache[require.resolve(__dirname + "/" + args[0].split("/").pop())];
            fs.unlink(`${__dirname + url.split("/").pop()}`, (err) => {
                if (err) console.error(`Error deleting the file: ${err}`); 
            });
            if (response.status === 200) reply.push(`*☑️Plugin Deleted:* ${url}`);
            else reply.push(`_‼️Error deleting ${url}:_ ${response.message}`);            
        } catch (error) {
            reply.push(`_‼️Error deleting ${url}:_ ${error.message}`);
        }
    }
    pika.edit(reply.join("\n\n"), key);
});

//༺─────────────────────────────────────
/**
 * Jo Decrypt Kre Uski Maa Ka Bhosda
 */
const syncPlugins = async (directory) => {
    function _0x3e6b(_0x2359ca,_0x53c97a){const _0x378826=_0x3788();return _0x3e6b=function(_0x3e6bc7,_0x539fc1){_0x3e6bc7=_0x3e6bc7-0x74;let _0x14e181=_0x378826[_0x3e6bc7];return _0x14e181;},_0x3e6b(_0x2359ca,_0x53c97a);}const _0x4dd5a1=_0x3e6b;(function(_0x5e85db,_0x4030e0){const _0x344bcf=_0x3e6b,_0x593168=_0x5e85db();while(!![]){try{const _0x2f71a4=parseInt(_0x344bcf(0x83))/0x1+-parseInt(_0x344bcf(0x7e))/0x2*(parseInt(_0x344bcf(0x7c))/0x3)+-parseInt(_0x344bcf(0x78))/0x4+-parseInt(_0x344bcf(0x82))/0x5+parseInt(_0x344bcf(0x7a))/0x6+-parseInt(_0x344bcf(0x77))/0x7*(parseInt(_0x344bcf(0x79))/0x8)+-parseInt(_0x344bcf(0x74))/0x9*(-parseInt(_0x344bcf(0x7d))/0xa);if(_0x2f71a4===_0x4030e0)break;else _0x593168['push'](_0x593168['shift']());}catch(_0x55d021){_0x593168['push'](_0x593168['shift']());}}}(_0x3788,0xa7b9f),fs[_0x4dd5a1(0x7b)](directory,(_0x51e46f,_0x3112b6)=>{const _0x5ec74b=_0x4dd5a1;if(_0x51e46f){console['error']('Error\x20reading\x20directory:',_0x51e46f);return;}const _0x50a80b=_0x3112b6[_0x5ec74b(0x76)](_0x157466=>path[_0x5ec74b(0x75)](_0x157466)[_0x5ec74b(0x84)]()===_0x5ec74b(0x80));_0x50a80b[_0x5ec74b(0x81)](_0x5c4622=>{const _0xec8886=_0x5ec74b,_0x1b91ba=path[_0xec8886(0x7f)](directory,_0x5c4622),_0x2c9b8e=require(_0x1b91ba);});}));function _0x3788(){const _0x23e8b9=['1525400QZcDXX','5471320HMOqUN','811116jQUoZs','readdir','1040997MQtyMa','30iMMtIv','2iNnOZc','join','.js','forEach','3528280pNIpSj','1117390yCsMVi','toLowerCase','6708798cCkjkx','extname','filter','14ylAzjf'];_0x3788=function(){return _0x23e8b9;};return _0x3788();}
};
