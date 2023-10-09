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
    name: ['listnum'],
    alias: ['listnumber','numlist','numberlist'],
    category: "stalker",
    desc: "Stalk all the numbers from given country code."
  };
}

exports.getCommand = async (groupMetadata, botNumber, args, anyaV2, pika) => {
  require('../../config');
  if (!pika.isGroup) return pika.reply(message.group);
  if (!args[0]) return pika.reply('Provide me a country code to search users.');
  const numbers = groupMetadata.participants
    .filter(item => item.id.startsWith(args[0].replace('+', '')) && item.id !== botNumber && item.id !== `${ownernumber}@s.whatsapp.net`)
    .map(item => item.id);
  if (numbers.length === 0) return pika.reply('Not found!!');
  await pika.react("#️⃣");  
  let count = 1;
  let caption = '';
  for (let number of numbers) {
    caption += `${count++}. @${number.split("@")[0]}\n`;
  }
  anyaV2.sendMessage(pika.chat, {
    text: `⌈ ${numbers.length} ${numbers.length < 2 ? 'result' : 'results'} found for *+${args[0].replace('+', '')}* ⌋\n\n${caption}\n*Reply:*\n   *0* to remove everyone.\n   *Any Number* to remove that user.\n\n_ID: QA22_`,
    mentions: numbers.map(v => v),
  }, { quoted: pika });
}


