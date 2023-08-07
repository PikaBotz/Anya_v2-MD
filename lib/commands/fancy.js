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
const fancyList = ['fancy'];
for (let i = 1; i <= 59; i++) {
  fancyList.push(`fancy${i}`);
  }
  return fancyList; // Auto generated fancy, fancy1 - fancy59
}

async function getCommand(command, prefix, text) {
  let count = 1;
  let styler = "";
  const { listall } = require('../lib/stylish-font');
     styler += `*🔰 Exmaple :* ${prefix}fancy32 ${text ? text : "Hentai"}\n\n`;
  for (let i of listall(text ? text : "Enter Text")){
     styler += `${count++}. ${i}\n`;
     }
  (command == 'fancy')
  ? m.reply(styler)
  : m.reply(listall(text ? text : "Enter Text")[Number(command.split("ncy")[1]) - 1]);
  }
module.exports = { cmdName, getCommand }
