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
    name: ['setting'],
    alias: ['settings','mode','modes'],
    category: "owner",
    desc: "You can commit changes directly into the bot."
  };
}

exports.getCommand = async (pickRandom, text, prefix, command, anyaV2, pika) => {
require('../../config');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
  const speed = require('performance-now');
  const version = require('../../package.json').version;
  const { data } = await axios.get('https://api.github.com/repos/PikaBotz/Anya_v2-MD');
  let caption = "┌─⌈ 𝙒𝙝𝙖𝙩𝙨𝘼𝙥𝙥 𝘽𝙤𝙩 𝙢𝙤𝙙𝙚𝙨 ⌋\n";
const folderPath = path.join(__dirname, './');
     fs.readdir(folderPath, (err, files) => {
       if (err) return pika.reply(message.error);
      const filesWithData = [];
    files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (fileContent.includes('listMode: true')) {
    const regex = /exports\.cmdName\s*=\s*\(\s*\)\s*=>\s*\{(?:[\s\S](?!exports\.cmdName))*?name:\s*\[(['"])(.*?)\1pika/;
      const match = fileContent.match(regex);
      if (match && match[2]) {
        filesWithData.push(match[2]);
      }
    }
  });
  caption += "❲❒❳ *Bot :* _" + botname + "_\n";
  caption += "❲❒❳ *Version :* _v" + version + "_\n";
  caption += "❲❒❳ *Speed :* _" + (speed() - speed()).toFixed(2).replace('-', '') * 1000 + " ms_\n";
  caption += "❲❒❳ *My Script : _github.com/PikaBotz/Anya_v2-MD_*\n\n"; // Please ask the developer if you want to change this link
  for (let settings of filesWithData) {
      caption += `➛ ${prefix + settings}\n`;
      }
  pika.reply(caption);
  }); 
}