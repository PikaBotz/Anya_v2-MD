/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Management: (@teamolduser)

📜 GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

📌 Permission & Copyright:
If you're using any of these codes, please ask for permission or mention https://github.com/PikaBotz/Anya_v2-MD in your repository.

⚠️ Warning:
- This bot is not an officially certified WhatsApp bot.
- Report any bugs or glitches to the developer.
- Seek permission from the developer to use any of these codes.
- This bot does not store user's personal data.
- Certain files in this project are private and not publicly available for edit/read (encrypted).
- The repository does not contain any misleading content.
- The developer has not copied code from repositories they don't own. If you find matching code, please contact the developer.

Contact: alammdarif07@gmail.com (for reporting bugs & permission)
          https://wa.me/918811074852 (to contact on WhatsApp)

🚀 Thank you for using Queen Anya MD v2! 🚀
**/

function cmdName() {
  return {
    name: ['allmenu'],
    alias: [],
    category: "general",
    desc: "Show list of all commands of this bot."
  };
}

async function getCommand(prefix, react, pickRandom, anyaV2, pika) {
require('../../config');
  const os = require('os');
  const fs = require('fs');
  const path = require('path');
  const speed = require('performance-now');
  const latensi = speed() - speed();
  const { tiny } = require('../lib/stylish-font');
  const { formatp } = require('../lib/myfunc');
  const commandsPerLine = 1; // Set the number of commands you want per line here
  const pluginsPath = path.join(__dirname, './');
  const plugins = {};
  let caption = "";
  let upper = "";
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
  fs.readdirSync(pluginsPath)
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => {
      const pluginName = path.parse(file).name;
      plugins[pluginName] = require(path.join(pluginsPath, file));
    });

  function pik4allmenu(plugins) {
    const allCommands = {};
    const totalCmd = [];
    for (const pluginGroupName in plugins) {
      const pluginGroup = plugins[pluginGroupName];
      const categoryName = pluginGroup.cmdName().category;
        totalCmd.push(pluginGroup.cmdName().name.length);
      if (!allCommands.hasOwnProperty(categoryName)) {
        allCommands[categoryName] = [];
      }
      const commandName = pluginGroup.cmdName().name;
      if (Array.isArray(commandName)) {
        allCommands[categoryName].push(...commandName);
      } else {
        allCommands[categoryName].push(commandName);
      }
    }
    upper += `\`\`\`${PikaDay}, ${pika.pushName} sensei!!\`\`\`\n\n`;
    upper += `╭─────────────┄┄┈•\n`;
    upper += `│   ╭───────┄┄┈•\n`;
    upper += `│ *✨ ${tiny("Prefix")} :* " ${prefix} "\n`;
    upper += `│ *🎸 ${tiny("Botname")} :* ${global.botname}\n`;
    upper += `│ *🔖 ${tiny("Plugins")} :* ${totalCmd.reduce((acc, curr) => acc + curr, 0).toString()}\n`;
    upper += `│ *🎏 ${tiny("Ping")} :* ${latensi.toFixed(2).replace('-', '') * 1000} ms\n`;
    upper += `│ *🧧 ${tiny("Ram")} : ${formatp(os.totalmem() - os.freemem())}/${formatp(os.totalmem())}*\n`;
    upper += `│   ╰───────┄┄┈•\n`;
    upper += `╰─────────────┄┄┈•\n\n`;
    upper += `📌 _Type *${prefix}support* if you need help._\n\n`;
    for (const category in allCommands) {
      caption += `╭─────────────┄┄┈•\n┠───═❮ *${category}* ❯═─┈•\n│   ╭──┈•\n`; // 📌 Header
      const commands = allCommands[category];
      for (let i = 0; i < commands.length; i += commandsPerLine) {
        const commandLine = commands.slice(i, i + commandsPerLine);
        caption += `│   │➛ ${commandLine.map(cmd => tiny(cmd)).join(', ')}\n`; // 📌 Middle
      }
      caption += `│   ╰───────────⦁\n╰────────────────❃\n\n`; // 📌 End
    }
    return upper + caption.trim();
  }

  await pika.react("📃");
  anyaV2.sendMessage(
    pika.chat,
    {
      image: global.image_1,
      caption: pik4allmenu(plugins) +
               `\n\n🔖 _${pickRandom(Tips).replace("$prefix ", prefix)}_\n\n` +
               `_Type *${prefix}help <command>* to Know more._\n` +
               `*e.g:* ${prefix}help waifu`,
      headerType: 4,
      mentions: [pika.sender]
    },
    { quoted: pika }
  );
}
module.exports = { getCommand, cmdName };


