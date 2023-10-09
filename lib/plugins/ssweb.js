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
    name: ['ssweb'],
    alias: [],
    category: "tools",
    desc: "Get a HD screenshot through a web link."
  };
}

async function getCommand(text, args, anyaV2, pika){
require('../../config');
  const { ssweb } = require('api-dylux');
  if (!text) return pika.reply("Enter a website URL to stalk.");
  if (!text.includes("https://")) return pika.reply("Please enter a valid URL.");
  pika.reply(message.wait);
  try {
  const screenshot = await ssweb(args[0]);
  await pika.react("✨");
    anyaV2.sendMessage(pika.chat, {
            image: screenshot,
            caption: text,
            headerType: 4
    }, { quoted: pika });
    } catch {
    pika.reply(message.error);
  }

}
module.exports = { cmdName, getCommand }
