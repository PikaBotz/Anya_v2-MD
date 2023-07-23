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
  return ['allmenu'];
}

async function getCommand(menuCategories, prefix, react, pickRandom, AnyaPika) {
require('../../config');
  const doReact = true;
  const os = require('os');
  const speed = require('performance-now');
  const latensi = speed() - speed();
  const { formatp } = require('../lib/myfunc.js');
  const { tiny, fancy13 } = require('../lib/stylish-font');
  let send = "";
     send += `*⛔ _${tiny("Prefix")}_ :* " ${prefix} "\n`;
     send += `*👤 _${tiny("User")}_ :* @${m.sender.split('@')[0]}\n`;
  if (!m.group){
     send += `*🎏 _${tiny("Speed")}_ : _${latensi.toFixed(4)}.ms_*\n`;
  } else {
     send += `*🎏 _${tiny("Grp Role")}_ :* ${fancy13(isAdmins? "Admin 👑️":"Member 👤")}\n`;     
     }
     send += `*💻 _${tiny("Ram")}_ : _${formatp(os.totalmem() - os.freemem())}/${formatp(os.totalmem())}_*\n`;
     send += `*🤖 _${tiny("Bot")}_ :* ${botname}\n\n`;
     send += `_⛔ Please type *${prefix}support* if you need help._\n\n`;
  for (const category of menuCategories) {
     category.menu.sort((a, b) => a.localeCompare(b)); 
     send += `*>>>\t${themeemoji}\t${category.title}*\n\`\`\`${category.menu.join(", ")}\`\`\`\n\n`;
  }
    send += `🌟 ${tiny(pickRandom(Tips).replace("$prefix ", prefix))}\n\n${fancy13('© All rights reserved "PikaBotz inc." 2023.')}`;
  AnyaPika.sendMessage(m.chat, {
      image: global.allmenuImg,
      caption: send,
      headerType: 4,
      mentions: [m.sender]
    },
    { quoted: m }
  );
   doReact ? react("📃") : null;
   return send;
}
module.exports = { getCommand, cmdName };
