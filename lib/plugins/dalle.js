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

exports.cmdName = () => {
  return {
    name: ['dalle'],
    category: "ai",
    alias: ['aiimg','aipic'],
    desc: "This command generates images from text prompts."
  };
}

exports.getCommand = async (text, prefix, anyaV2, command, pika) => {
require('../../config');
await pika.react("🗣️");
const { get } = require('axios');
  if (!text) return pika.reply(`*Example:* ${prefix + command} Beautiful anime girl on bike.`);
  try {
  pika.reply(message.wait);
  // Credit: @GURU [owner of link]
   const fetch = `https://gurugpt.cyclic.app/dalle?prompt=${encodeURIComponent(text)}`;
    const response = await get(fetch, { responseType: 'arraybuffer' });
    if (response.status === 200) {
      const generatedImg = Buffer.from(response.data, 'binary');
      await anyaV2.sendMessage(pika.chat, {
          image: generatedImg,
          caption: `_Genrated by: ${global.botname}_`,
          headerType: 4
        }, {quoted:pika});
    } else {
      return pika.reply(message.error);
    }
  } catch (error) {
  console.log(error);
      return pika.reply(message.error);
  }
}
