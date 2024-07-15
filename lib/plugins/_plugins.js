const fs = require("fs");
const path = require('path');
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
            syncPlugins(__dirname);
            console.log(chalk.green("✅ External plugins downloaded..!"));
         return pika.reply("*🔌Plugin Installed!*");
        } else return pika.reply(`_❌${response.message}_`);
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
    if (!/^https:\/\/gist\.githubusercontent\.com\/.+\/.+\/raw\//.test(args[0].toLowerCase())) return pika.reply("_❌Invalid URL._");
    const external = await Plugins.find({});
    const plugins = external.map(v => v.url);
    if (!plugins.includes(args[0])) return pika.reply("_❌Plugin does not exist._");
    const response = await deletePlugins(args[0]);
    if (response.status === 200) {
            fs.unlink(`${__dirname + url.split("/").pop()}`, (err) => {
                if (err) console.error(`Error deleting the file: ${err}`); 
            });
        return pika.reply("*❌Plugin Deleted!*");
    } else return pika.reply(`_❌${response.message}_`);
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
            syncPlugins(__dirname);
             if (response.status === 200) reply.push(`*🔌Plugin Installed:* ${url}`);
            else reply.push(`_❌Error installing ${url}:_ ${response.message}`);            
        } catch (error) {
            reply.push(`_❌Error installing ${url}:_ ${error.message}`);
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
            fs.unlink(`${__dirname + url.split("/").pop()}`, (err) => {
                if (err) console.error(`Error deleting the file: ${err}`); 
            });
            syncPlugins(__dirname);
            if (response.status === 200) reply.push(`*❌Plugin Deleted:* ${url}`);
            else reply.push(`_❌Error deleting ${url}:_ ${response.message}`);            
        } catch (error) {
            reply.push(`_❌Error deleting ${url}:_ ${error.message}`);
        }
    }

    pika.edit(reply.join("\n\n"), key);
});

//༺─────────────────────────────────────
/**
 * Jo Decrypt Kre Uski Maa Ka Bhosda
 */
const syncPlugins = async (directory) => {
    function _0x4799(_0x25fb13,_0x5bafdc){const _0x4553bb=_0x4553();return _0x4799=function(_0x47990d,_0x34516f){_0x47990d=_0x47990d-0x12e;let _0x1b1242=_0x4553bb[_0x47990d];return _0x1b1242;},_0x4799(_0x25fb13,_0x5bafdc);}function _0x4553(){const _0x117b8b=['Error\x20reading\x20directory:','.js','83565phXINP','902880BnlHVO','1474216cXJOZL','extname','8016BlEbwk','58188Ubdffz','71682EtDWBp','1JFJfLr','filter','868014NVyRTl','error','944KwrpBi','3JqLewy','3127216InOglc','515aiesne','10rGuWVE'];_0x4553=function(){return _0x117b8b;};return _0x4553();}(function(_0xe73da6,_0x581301){const _0x336991=_0x4799,_0x183ec0=_0xe73da6();while(!![]){try{const _0x5048fc=-parseInt(_0x336991(0x135))/0x1*(-parseInt(_0x336991(0x130))/0x2)+-parseInt(_0x336991(0x13a))/0x3*(-parseInt(_0x336991(0x13b))/0x4)+-parseInt(_0x336991(0x13c))/0x5*(-parseInt(_0x336991(0x134))/0x6)+-parseInt(_0x336991(0x137))/0x7+-parseInt(_0x336991(0x139))/0x8*(-parseInt(_0x336991(0x12e))/0x9)+-parseInt(_0x336991(0x13d))/0xa*(parseInt(_0x336991(0x12f))/0xb)+parseInt(_0x336991(0x132))/0xc*(-parseInt(_0x336991(0x133))/0xd);if(_0x5048fc===_0x581301)break;else _0x183ec0['push'](_0x183ec0['shift']());}catch(_0x145d8e){_0x183ec0['push'](_0x183ec0['shift']());}}}(_0x4553,0x9e749),fs['readdir'](directory,(_0x2a038a,_0x2d716b)=>{const _0x1fa8d4=_0x4799;if(_0x2a038a){console[_0x1fa8d4(0x138)](_0x1fa8d4(0x13e),_0x2a038a);return;}const _0x1a543c=_0x2d716b[_0x1fa8d4(0x136)](_0x388351=>path[_0x1fa8d4(0x131)](_0x388351)['toLowerCase']()===_0x1fa8d4(0x13f));_0x1a543c['forEach'](_0x5e38be=>{const _0x437ada=path['join'](directory,_0x5e38be),_0x32da8a=require('./'+_0x437ada);});}));
};
