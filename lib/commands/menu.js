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
  return [
         'help',
         'menu',
         'h',
         'panel' ];
}

async function getCommand(botname, react, prefix, AnyaPika, ownerq, isAdmins) {
require('../../config');
  const doReact = true;
  const fs = require('fs');
  const os = require('os');
  const axios = require('axios');
  const speed = require('performance-now');
  const { formatp } = require('../lib/myfunc.js');
  const { fancy13, tiny } = require('../lib/stylish-font');
  const oldVersion = require('../../package.json').version;
  const newVersion = await axios.get('https://raw.githubusercontent.com/PikaBotz/Anya_v2-MD/master/package.json');
  let help = `*🦋>>> Hi, I'm ${botname} <<<🦋*\n\n`;
     help += `*» User :* @${m.sender.split('@')[0]}\n`;
  if (!m.isGroup) {
    help += `*» Speed : _${(speed() - speed()).toFixed(4)}ms_ 🌈*\n`;
  } else {
    help += `*» Grp Role :* ${fancy13(isAdmins? "Admin 👑️":"Member 👤")}\n`;
  }
  const totalMem = formatp(os.totalmem());
  const freeMem = formatp(os.freemem());
  const usedMem = formatp(os.totalmem() - os.freemem());
  help += `*» RAM : _${usedMem}/${totalMem}_*\n\n`;
  help += `Type *${prefix}allmenu* for all menu list.\n`;
  help += `Type *${prefix}listmenu* for list.`;
  help += (newVersion.data.version !== oldVersion) ? `\n\n*Please update your script, ${newVersion} version available. ⚠️*` : `\n\n${tiny(footer)}`;
  console.log(newVersion.data.version)
  doReact ? react("🥵") : null;
  AnyaPika.sendMessage(m.chat, {
                image: global.Menuimage,
                caption: help,
                headerType: 4,
                mentions: [m.sender]
                },
                { quoted: ownerq });
return help;
}
module.exports = { getCommand, cmdName };
