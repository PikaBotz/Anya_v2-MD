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
  return ['fbdl',
        'facebook'];
}

async function getCommand(text, AnyaPika){
require('../../config');
  const { fbdl } = require('api-dylux');
  try {
    if (!text.includes("facebook.com/")) return m.reply("Please enter a valid Facebook video link!");
    m.reply(mess.wait);
    const result = await fbdl(text);
    AnyaPika.sendMessage(m.chat, {
      video: { url: result.videoUrl },
      caption: `*🎀 Title :* ${result.title}`,
      headerType: 4,
    }, { quoted: m });
  } catch (e) {
    m.reply("Error occurred. Please try again later or check the URL you provided.");
  }
}
module.exports = { cmdName, getCommand }
