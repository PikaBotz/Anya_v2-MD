function cmdName() {
  return {
    name: ['listmenu'],
    alias: ['commands','command'],
    category: "general",
    desc: "Get the list of all command's categories that exists."
  };
}

async function getCommand(pickRandom, prefix, anyaV2, pika, storage) {
require('../../config');
  const os = require('os');
  const fs = require('fs');
  const path = require('path');
  const speed = require('performance-now');
  const { formatp } = require('../lib/myfunc');
  const { tiny, fancy32 } = require('../lib/stylish-font');
  const commandsPerLine = 1;
  const pluginsPath = path.join(__dirname, './');
  const plugins = {};
  let caption = '';
  let upper = "";
  let count = 1;
  function getGreetingMessage() {
  const time = new Date();
  const hour = time.getHours();
  if (hour >= 3 && hour < 12) {
    return "Good morning ☀️";
  } else if (hour >= 12 && hour < 16) {
    return "Good afternoon 🏜️";
  } else if (hour >= 16 && hour < 20.5) {
    return "Good evening 🌆";
  } else if (hour >= 20.5 || hour < 3) {
    return "Good night 😴";
  } else {
    return "```Error Time Out!```";
    }
  }
  const PikaDay = getGreetingMessage();
    upper += `\`\`\`${PikaDay}, ${pika.pushName} choose your menu.\`\`\`\n\n`;
    upper += `╭───❬ ${fancy32(botname)} ❭─┄┄┈•\n`;
    upper += `│   ╭───────┄┄┈•\n`;
    upper += `│ *✨ ${tiny("Prefix")} :* " ${prefix} "\n`;
    upper += `│ *🎸 ${tiny("Botname")} :* ${global.botname}\n`;
    upper += `│ *🔖 ${tiny("Users")} :* ${storage.chats.all().length}\n`;
    upper += `│ *🎏 ${tiny("Ping")} :* ${(speed() - speed()).toFixed(2).replace('-', '') * 1000} ms\n`;
    upper += `│ *🧧 ${tiny("Ram")} : ${formatp(os.totalmem() - os.freemem())}/${formatp(os.totalmem())}*\n`;
    upper += `│   ╰───────┄┄┈•\n`;
    upper += `╰─────────────┄┄┈•\n\n`;
    upper += `\`\`\`📌 Reply a number to select:\`\`\`\n\n`;
  fs.readdirSync(pluginsPath)
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => {
      const pluginName = path.parse(file).name;
      plugins[pluginName] = require(path.join(pluginsPath, file));
    });

  function pik4listmenu(plugins) {
  const allCategories = {};
  for (const pluginGroupName in plugins) {
    const pluginGroup = plugins[pluginGroupName];
    const categoryName = pluginGroup.cmdName().category;
    if (!allCategories.hasOwnProperty(categoryName)) {
      allCategories[categoryName] = [];
    }
    const commandName = pluginGroup.cmdName().name;
    if (Array.isArray(commandName)) {
      allCategories[categoryName].push(...commandName);
    } else {
      allCategories[categoryName].push(commandName);
    }
  }
  for (const category in allCategories) {
    caption += `*${count++}*➛ ${category}\n`; // 📌 Header
    const commands = allCategories[category];
    for (let i = 0; i < commands.length; i += commandsPerLine) {
      const commandLine = commands.slice(i, i + commandsPerLine);
//      caption += `│   │➛ ${commandLine.map(cmd => tiny(cmd)).join(', ')}\n`; // 📌 Middle
    }
      }
   return caption.trim();
   }
   pika.reply(upper + await pik4listmenu(plugins) + `\n\n🔖 _${pickRandom(Tips).replace("$prefix ", prefix)}_\n\n_ID: QA03_`);
 }
module.exports = { cmdName, getCommand }


