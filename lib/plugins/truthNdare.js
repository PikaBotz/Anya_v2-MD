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
    name: ['truth','dare'],
    alias: [],
    category: "games",
    desc: "Play truth and dare!."
  };
}

exports.getCommand = async (command, pickRandom, anyaV2, pika) => {
require('../../config');
   await react(themeemoji);
   const { get } = require('axios');
   const response = await get("https://raw.githubusercontent.com/PikaBotz/My_Personal_Space/main/Json_Files/Anya_v2/truth_dare.json");
   const data = response.data;
    const dare = pickRandom(data.dares);
    const truth = pickRandom(data.truths);
    const choose = command === "dare" ? dare : truth;
    anyaV2.sendMessage(pika.chat, {
        text: `⏩ Senpai *@${pika.sender.split("@")[0]}* your "${command}" is: ${choose}`,
        mentions: [pika.sender]
       }, { quoted: pika });
     }
