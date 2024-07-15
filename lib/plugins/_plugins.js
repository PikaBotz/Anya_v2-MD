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
        if (external.length < 1) return pika.reply("_❌No plugins found..!_");
        const pluginlist = external.map((item, index) => `*${Config.themeemoji}Url: (${index + 1}):* ${item.url}\n*🌟Command:* ${item.id}`).join('\n\n');
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
        if (!/^https:\/\/gist\.github\.com\//.test(args[0])) return pika.reply("_❌Invalid Url._");
        const external = await Plugins.find({});
        const plugins = external.map(v => v.url);
        if (plugins.includes(args[0])) return pika.reply("_✅ Plugin already exist..!_");
        const {key} = await pika.keyMsg(Config.message.wait);
        const response = await installPlugins(args[0]);
        if (response.status === 200) {
        for (let i = 0; i < external.length; i++) {
               const {data} = await axios.get(external[i].url);
               await fs.writeFileSync(__dirname + '/../plugins/' + external[i].id + '.js', data, "utf8");
          }
          fs.readdirSync(__dirname + "/../plugins").forEach((plugin) => {
              if (path.extname(plugin).toLowerCase() == ".js") {
                  require(__dirname + "/../plugins/" + plugin);
              }
          });
          console.log(chalk.green("✅ External plugins downloaded..!"));
         return pika.edit("*🔌Plugin Installed!*", key);
        } else return pika.edit(`_❌${response.message}_`, key);
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
    if (!/^https:\/\/gist\.github\.com\//.test(args[0])) return pika.reply("_❌Invalid Url._");    
    const external = await Plugins.find({});
    const plugins = external.map(v => v.url);
    if (!plugins.includes(args[0])) return pika.reply("_❌Plugin does not exist._");
    const {key} = await pika.keyMsg(Config.message.wait);
    const response = await deletePlugins(args[0]);
    if (response.status === 200) {
        fs.readdirSync(__dirname + "/../plugins").forEach((plugin) => {
            if (path.extname(plugin).toLowerCase() == ".js" && plugin.includes(args[0])) {
                fs.unlinkSync(__dirname + "/../plugins/" + plugin);
            }
        });
        return pika.edit("*❌Plugin Deleted!*", key);
    } else return pika.edit(`_❌${response.message}_`, key);
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
    const invalidUrls = args.filter(url => !/^https:\/\/gist\.github\.com\//.test(url));
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
            else reply.push(`_❌Error installing ${url}:_ ${response.message}`);            
        } catch (error) {
            reply.push(`_❌Error installing ${url}:_ ${error.message}`);
        }
    }
    for (let i = 0; i < external.length; i++) {
        const {data} = await axios.get(external[i].url);
        await fs.writeFileSync(__dirname + '/../plugins/' + external[i].id + '.js', data, "utf8");
    }
    fs.readdirSync(__dirname + "/../plugins").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
            require(__dirname + "/../plugins/" + plugin);
        }
    });
    return pika.key(reply.join("\n\n"), key);
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
    const invalidUrls = args.filter(url => !/^https:\/\/gist\.github\.com\//.test(url));
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
            if (response.status === 200) reply.push(`*❌Plugin Deleted:* ${url}`);
            else reply.push(`_❌Error deleting ${url}:_ ${response.message}`);            
        } catch (error) {
            reply.push(`_❌Error deleting ${url}:_ ${error.message}`);
        }
    }
    for (let i = 0; i < external.length; i++) {
        const {data} = await axios.get(external[i].url);
        await fs.writeFileSync(__dirname + '/../plugins/' + external[i].id + '.js', data, "utf8");
    }
    fs.readdirSync(__dirname + "/../plugins").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
            require(__dirname + "/../plugins/" + plugin);
        }
    });    
    pika.edit(reply.join("\n\n"), key);
});
