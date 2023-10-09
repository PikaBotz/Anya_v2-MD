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
    name: ['request'],
    alias: ['need'],
    category: "general",
    desc: `Request something from the developer or the owner..`
  };
}

exports.getCommand = async (text, botNumber, anyaV2, pika) => {
require('../../config');
 await pika.react("✨");
 const { modList } = require('../lib/mongoDB');
 const { sleep } = require('../lib/myfunc');
 const modded = await modList();
  if (!text) return pika.reply('Please enter a request that you want from the developer or the owner.');
  const devs = [botNumber, ownernumber + "@s.whatsapp.net", ...modded];
  const sending = await anyaV2.sendMessage(pika.chat, {
          text: '📩 Sending Request...'
         }, {quoted:pika});
  for (let report of devs) {
  await anyaV2.sendMessage(report, {
          text: `\`\`\`⌈ Someone Requested ⌋\`\`\`\n\n` +
               `*🌟 Name:* @${pika.sender.split("@")[0]}\n` +
               `*🤖 Bot:* @${botNumber.split("@")[0]}\n\n` +
               `*🔮 Request:* ${text}`,
          mentions: [pika.sender, botNumber]
       }, {quoted:pika});
  await sleep(100);
     }
  await anyaV2.sendMessage(pika.chat, {
          text: '✅ Thanks for requesting.',
          edit: sending.key, });
  }


 