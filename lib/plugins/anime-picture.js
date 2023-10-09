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
    name: ['animepic'],
    alias: ['animepicture','animeimage','animeimg'],
    category: "myanimelist",
    desc: 'Search anime pictures by their myanimelist.net ID.'
  };
}

exports.getCommand = async (text, args, prefix, anyaV2, pika) => {
require('../../config');
  const { Anime } = require("@shineiichijo/marika");
   if (!text) return pika.reply(`Please enter an anime ID. Type *${prefix}anime* to get an anime ID.`);
    try {
   await pika.react("✨");
  const result = await new Anime().getAnimePictures(args[0]);
  pika.reply(`Sending *${result.data.length}* picture(s) related to your search ID.`);
  const maxImages = 5;
  let count = 0;
  let count2 = 1;
  for (let i of result.data) {
  if (count >= maxImages) break;
  await anyaV2.sendMessage(pika.chat, {
             caption: `_${count2++}\uFE0F\u20E3 From myanimelist.net_`,
             image: { url: i.jpg.large_image_url },
             headerType: 4
           });
        count++;
      }} catch {
       pika.reply("Error occurred. Please check the anime ID again.");
      }
    }




