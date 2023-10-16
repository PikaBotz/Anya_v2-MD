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

exports.cmdName = () => ({
  name: ['help'],
  alias: ['menu', 'h', 'panel'],
  category: "general",
  desc: "Dashboard of the bot."
});

exports.getCommand = async (command, args, prefix, userAdmin, anyaV2, pika) => {
  require('../../config');
  await pika.react("🥵");
  const { fancy13, fancy31, tiny } = require('../lib/stylish-font');
  const ownerq = {
    key: {
      participant: `0@s.whatsapp.net`,
      ...(pika.chat ? { remoteJid: `status@broadcast` } : {}),
    },
    message: {
      contactMessage: {
        displayName: ownername,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${fancy31(
          ownername,
        )},;;;\nFN:${fancy31(
          ownername,
        )}\nitem1.TEL;waid=${ownernumber}:${ownernumber}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
        jpegThumbnail: global.image_3,
        thumbnail: global.image_3,
        sendEphemeral: true,
      },
    },
  };

  const { readdir } = require('fs').promises;
  const { totalmem, freemem } = require('os');
  const { get } = require('axios');
  const speed = require('performance-now');
  const { formatp, getBuffer } = require('../lib/myfunc.js');
  const oldVersion = require('../../package.json').version;
  const newVersion = await getVersion();

  const totalMem = formatp(totalmem());
  const freeMem = formatp(freemem());
  const usedMem = formatp(totalmem() - freemem());

  let help = `*🦋>>> Hi, I'pika ${botname} <<<🦋*\n\n`;
  help += `*» User :* @${pika.sender.split('@')[0]}\n`;
  help += (!pika.isGroup)
    ? `*» Speed : _${(speed() - speed()).toFixed(2).replace('-', '') * 1000} ms_ 🌈*\n`
    : `*» Grp Role :* ${fancy13(userAdmin ? "Admin 👑️" : "Member 👤")}\n`;
  help += `*» RAM : _${usedMem}/${totalMem}_*\n\n`;
  help += `\`\`\`Reply a number:\`\`\`\n`;
  help += `*1 ${prefix}allmenu* for all menu list.\n`;
  help += `*2 ${prefix}listmenu* for list.\n\n`;
  help += `_ID: QA02_`; // ⚠️ Don't change
  help += (newVersion !== oldVersion) ? `\n\n*Please update your script, ${newVersion} version available. ⚠️*` : `\n\n${tiny(footer)}`;

  const commandsPath = require('path').join(__dirname, './');
  const commands = {};

  const files = await readdir(commandsPath);
  files.filter((file) => file.endsWith('.js')).forEach((file) => {
    const commandName = require('path').parse(file).name;
    commands[commandName] = require(require('path').join(commandsPath, file));
  });

  function getVariables(func) {
    const fnStr = func.toString();
    return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g) || [];
  }

  async function handleCommand(args, commands, ID) {
    for (const cmdGroupName in commands) {
      const cmdGroup = commands[cmdGroupName];
      const cmd = cmdGroup.cmdName().name.concat(cmdGroup.cmdName().alias);
      if (cmd.includes(args)) {
        if (ID == 0) {
          return cmdGroup.cmdName().name;
        } else if (ID == 1) {
          return args;
        } else if (ID == 2) {
          return (!cmdGroup.cmdName().alias.length > 0)
            ? cmdGroup.cmdName().alias.join(", ")
            : 'null';
        } else if (ID == 3) {
          return cmdGroup.cmdName().category;
        } else if (ID == 4) {
          return cmdGroup.cmdName().desc;
        }
      }
    }
  }

  async function sendDesc() {
    const pikaFeched = await handleCommand(args[0], commands, 0);
    if (!pikaFeched) return pika.reply("Given query didn't match any existing plugins.");
    let description = `\`\`\`${botname} Plugins Info:\`\`\`\n\n`;
    description += `*🚀 ${tiny("Name")} :* ${await handleCommand(args[0], commands, 1)}\n`;
    description += `*🔖 ${tiny("Alias")} :* ${await handleCommand(args[0], commands, 2)}\n`;
    description += `*🧧 ${tiny("Category")} :* ${await handleCommand(args[0], commands, 3)}.\n`;
    description += `*🎐 ${tiny("Description")} :* ${await handleCommand(args[0], commands, 4)}`;
    pika.reply(description);
  }
  
  async function getVersion() {
  try {
    const response = await get("https://api.github.com/repos/Pikabotz/Anya_v2-MD/contents/package.json");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch package.json: ${response.data.message}`);
    }
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    const packageJson = JSON.parse(content);
    if (packageJson.version) {
      return packageJson.version;
    } else {
      throw new Error('Version not found in package.json');
    }
  } catch (error) {
    console.error(error.message);
  }
}  

  if (!args[0]) {
    anyaV2.sendMessage(pika.chat, {
      image: await getBuffer(menu_pic),
      caption: help,
      headerType: 4,
      mentions: [pika.sender]
    }, { quoted: ownerq });
  } else if (command !== 'help') {
    anyaV2.sendMessage(pika.chat, {
      image: global.Menuimage,
      caption: help,
      headerType: 4,
      mentions: [pika.sender]
    }, { quoted: ownerq });
  } else {
    sendDesc();
  }
};
