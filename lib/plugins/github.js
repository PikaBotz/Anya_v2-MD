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
    name: ['github'],
    alias: ['git'],
    category: "stalker",
    desc: "Stalk any public GitHub profile."
  };
}

exports.getCommand = async (text, prefix, command, args, anyaV2, pika) => {
require('../../config');
  const { get } = require('axios');
  if (!text) return pika.reply(`Please enter username.\n*Example :* ${prefix + command} PikaBotz`);
  const check = await anyaV2.sendMessage(pika.chat, {
     text: `\`\`\`Inspecting...\`\`\`` },
    { quoted: pika });
 try {
  const st4lk = await get("https://api.github.com/users/" + args[0]);
  const stalk = st4lk.data;
//  if (!stalk.login) return pika.reply('❌ Please check the username provided!');

  const caption = `*🦋 User Name :* ${stalk.login}
*👤 Full name :* _${stalk.name}_
*🔮 Location :* _${stalk.location}_
*🔗 Email :* _${stalk.email}_
*↙️ Followers :* _${stalk.followers} followers_
*🎀 Following :* _${stalk.following} following_
*🎐 Public repos :* _${stalk.public_repos} repos_
*⚜️ User Bio :* ${stalk.bio}\n
_User data stalking rights accessed by ${botname} legally._`;

  const profile = { url: stalk.avatar_url };
  await anyaV2.sendMessage(pika.chat, {
              image: profile,
              caption: caption,
              headerType: 4,
        }, { quoted: pika });
} catch (error) {
 return await anyaV2.sendMessage(pika.chat, {
               text: '❌ Please check the provided username again.',
               edit: check.key });
                }
            }

