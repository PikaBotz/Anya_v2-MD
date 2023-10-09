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
    name: ['anime'],
    alias: ['searchanime','animesearch'],
    category: "myanimelist",
    desc: 'Search anime by their names directly from myanimelist.net'
  };
}

exports.getCommand = async (text, prefix, anyaV2, pika) => {
  require('../../config');
  if (!text) return pika.reply("Give me an anime name!");
  await pika.react("✨");
  const { Anime } = require("@shineiichijo/marika");
  const result = await new Anime().searchAnime(text);
  if (result.data.length < 1) return pika.reply('Data not found please check the title again.');
  const header = "```Reply a number:```\n" +
    "*1.<number>* for pictures.\n" +
    "*2.<number>* for episodes.\n" +
    "*3.<number>* for information.\n" +
    "*4.<number>* for character info.\n\n" +
    "👉🏻 Example: 2.4\n\n";
  const animeDetails = result.data.map((anime, index) => (
    `•----------------------------------------------•♪♪\n\n` +
    `*${index + 1}. Title :* ${anime.title}\n` +
    `*🎀 Type :* ${anime.type}\n` +
    `*🌈 ID : ${anime.mal_id}*\n\n`
  )).join('');
  const response = `${header}${animeDetails}_ID: QA24_\n${footer}`;
  pika.reply(response);
}

        
