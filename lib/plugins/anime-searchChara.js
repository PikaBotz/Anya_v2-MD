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
    name: ['searchchara'],
    alias: ['scharacter','searchcharacter'],
    category: "myanimelist",
    desc: 'Search character by their names directly from myanimelist.net'
  };
}

exports.getCommand = async (text, prefix, anyaV2, pika) => {
require('../../config');
  if (!text) return pika.reply("Give me an anime character name!");
  await pika.react("✨");
 try {
  pika.reply(message.wait);
  const { Character } = require("@shineiichijo/marika");
  const charaClient = new Character();
  const result = await charaClient.searchCharacter(text);
  if (result.data.length < 1) return pika.reply('Data not found please check the title again.');
  const data = result.data[Math.floor(Math.random() * result.data.length)];
            let res = `*👤 Name :* ${data.name}\n`;
            res += `*🎀 Nickname :* ${(data.nicknames.length > 0) ? data.nicknames : 'no nickname'}\n`;
            res += `*🔮 Favorites :* ${data.favorites}\n`;
            res += `*⚜️ Url : _${data.url}_\n\n`;
            res += `*🎐 About :* ${data.about}\n`;
  await anyaV2.sendMessage(pika.chat, {
          image: { url: data.images.jpg.image_url },
          caption: res,
          headerType: 4,
         }, { quoted: pika });
          } catch {
        pika.reply(message.error);
        }
     }

        
