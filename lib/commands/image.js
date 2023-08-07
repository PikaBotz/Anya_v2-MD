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
  return ['image','img'];
}

async function getCommand(text, react, AnyaPika){
require('../../config');
  const doReact = false;
  const { pinterest } = require('api-dylux');
  const { sleep } = require('../lib/myfunc');
  if (!text) return m.reply("Enter a search term to proceed!");
  m.reply("Here are 5 results for the matching search term!");
  try {
    const pic = await pinterest(text);
    for (let i = 0; i < 5; i++) {
      await AnyaPika.sendMessage(m.chat, {
                        image: { url: pic[i] },
                        headerType: 4
                       });
      await sleep(100);
    }
  } catch {
    m.reply(mess.error);
  }
  doReact ? react("5️⃣") : null;
}
module.exports = { cmdName, getCommand }
