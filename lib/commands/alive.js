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
  return ['alive'];
}

async function getCommand(isCreator, botNumber, prefix, userq, react, AnyaPika) {
require('../../config');
  const doReact = false;
  const axios = require('axios');
  const { runtime } = require('../lib/myfunc');
  const { tiny, fancy13 } = require('../lib/stylish-font');
  const oldVersion = require('../../package.json').version;
  const newVersion = await axios.get('https://raw.githubusercontent.com/PikaBotz/Anya_v2-MD/master/package.json');
  const alive = (newVersion.data.version == oldVersion) ? `\`\`\`Hey, I'm Alive! 👋🏻\`\`\`\n
🤖 *${tiny("Botname")} :* @${botNumber.split("@")[0]}
🎏 *${tiny("Version")} :* ${oldVersion}
👤 *${tiny("User")} :* @${m.sender.split("@")[0]}
👑 *${tiny("Owner")} :* ${ownername}
🧧 *${tiny("Runtime")} :* ${runtime(process.uptime())}\n
Type *${prefix}allmenu* for all menu list.
Type *${prefix}listmenu* for list.`
  : isCreator ?
  `${fancy13("⚠️ Dear owner please update your bot, or your bot will not behave normal.")}`
  : `${fancy13("⚠️ Sir/Ma'am please tell the owner to update his/her script, new version is now available of this bot.")}`;
  doReact ? react("👋🏻") : null;
  AnyaPika.sendMessage(m.chat, {
                text: alive,
                mentions: [m.sender, botNumber]
                  },
               { quoted: userq });
  return alive;
   }
module.exports = { cmdName, getCommand }
