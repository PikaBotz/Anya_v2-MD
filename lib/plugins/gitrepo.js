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
    name: ['gitrepo'],
    alias: [],
    category: "stalker",
    desc: "Stalk GitHub repositories."
  };
}

exports.getCommand = async (text, args, prefix, command, anyaV2, pika) => {
  require('../../config');
  if (!text || !text.includes("/")) return pika.reply(`Enter username / repository name.\n\n*Example:* ${prefix + command} Pikabotz/Anya_v2-MD`);
  if (!text.split("/")[1]) return pika.reply("Where's the repository name?");
  const username = args[0].split("/")[0];
  const repository = args[0].split("/")[1];
  const { get } = require('axios');
  const { ssweb } = require('../lib/scraper');
  
  try {
    const fetch = await get("https://api.github.com/repos/" + username + "/" + repository);
    const result = fetch.data;
    if (!result) return pika.reply("Something is wrong!");
    function formatDate(dateString) {
      const dateObject = new Date(dateString);
      const month = dateObject.getMonth() + 1;
      const day = dateObject.getDate();
      const year = dateObject.getFullYear() % 100;
      return `${month}/${day}/${year}`;
    }
    pika.reply(message.wait);
    const image = await ssweb(`https://github.com/${username}/${repository}`);    
    anyaV2.sendMessage(pika.chat, {
      image: image,
      caption: `\`\`\`Reply 1 to download this repo:\`\`\`\n\n` +
               `*🔮 Name:* ${result.name}\n` +
               `*👤 Owner:* ${result.full_name.split("/")[0]}\n` +
               `*🔀 isForked:* ${result.fork ? 'Yes' : 'No'}\n` +
               `*🗓️ Created On:* ${formatDate(result.created_at)}\n` +
               `*📍 Updated On:* ${formatDate(result.pushed_at)}\n` + // Added missing parenthesis
               `*♾️ Size:* ${result.size / 1000}MB\n` +
               `*🌟 Stars:* ${result.stargazers_count}\n` +
               `*🍽️ Forks:* ${result.forks}\n` +
               `*🗣️ Language:* ${result.language}\n` +
               `*🛄 Branch:* ${result.branch}\n` +
               `*🔗 Link:* ${result.html_url}\n` +
               `*🍂 Desc:* ${result.description}\n\n` +
               `_ID: QA29_\n${footer}`,
    }, { quoted: pika });
  } catch (error) {
    console.error('Error fetching repository data:', error);
    pika.reply("An error occurred while fetching repository data.");
  }
}

      
      
      
