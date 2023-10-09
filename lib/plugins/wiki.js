/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Team: Tᴇᴄʜ Nɪɴᴊᴀ Cʏʙᴇʀ Sϙᴜᴀᴅꜱ (𝚻.𝚴.𝐂.𝐒) 🚀📌 (under @P.B.inc)

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
    name: ['wiki'],
    alias: ['wikipedia'],
    category: "search",
    desc: `Search from Wikipedia.`
  }; 
}

exports.getCommand = async (text, anyaV2) => {

    require('../../config');
    await pika.react("🌐");
    if (!text) return pika.reply("Enter something to search from Wikipedia.");
    const getting = await anyaV2.sendMessage(pika.chat, { text: message.wait }, { quoted: pika });
 try {
    const { get } = require('axios');
    const { load } = require('cheerio');
    const response = await get("https://en.wikipedia.org/wiki/" + text);
    const $ = load(response.data);
    const heading = $('#firstHeading').text().trim();
    const result = $('#mw-content-text > div.mw-parser-output').find('p').text().trim();
    anyaV2.sendMessage(pika.chat, {
      text: `*Topic:* ▶ \`\`\`${heading}\`\`\`\n\n${result}`,
      edit: getting.key
    });
  } catch (e) {
    anyaV2.sendMessage(pika.chat, {
       text: "An error occurred while fetching Wikipedia data.",
       edit: getting.key });
  }
};