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
    name: ['profile'],
    alias: ['profil'],
    category: "general",
    desc: "Get Your profile dashboard."
  };
}

exports.getCommand = async (userAdmin, anyaV2, pika) => {
require('../../config');
  pika.reply(`\`\`\`🔃 Fetching User...\`\`\``);
  const { checkWarn, checkModUser, checkBanUser } = require('../lib/mongoDB');
  const { getBuffer } = require('../lib/myfunc');
  const isMod = await checkModUser(pika.sender);
  const isBan = await checkBanUser(pika.sender);
  const warned = await checkWarn(pika.sender);
  const userBio = await anyaV2.fetchStatus(pika.sender);
  const isbsp = await anyaV2.getBusinessProfile(pika.sender);
  try { var pfp = await anyaV2.profilePictureUrl(pika.sender, "image");
  } catch (e) { var pfp = "https://i.ibb.co/D9G4snb/736007.png"; };
  let info = `\`\`\`>>> User Profile Dash\`\`\`\n\n`;
       info += `*👤 Name:* @${pika.sender.split("@")[0]}\n\n`;
       info += pika.isGroup ? `*☀️ User Admin:* ${userAdmin ? 'Yes!' : 'No!'}\n` : '';
       info += `*🌟 User Mod:* ${isMod ? 'Yes!' : 'No!'}\n`;
       info += `*⭕ User Ban:* ${isBan ? 'Banned!' : 'Not Banned!'}\n`;
       info += `*🛄 Business Acc:* ${isbsp ? 'Yes!' : 'No!'}\n\n`;
       info += `*🔮 Warns:* ${warned}/${warns}\n\n`;
       info += (!isbsp) ?`*✨ Bio:* ${userBio ? userBio.status : 'no bio'}\n\n${footer}`
                        : `*🍂 Business Cate:* ${isbsp.category}\n*💌 Desc:* ${isbsp.description}`;
  await anyaV2.sendMessage(pika.chat, {
     image: await getBuffer(pfp),
     caption: info,
     mentions: [pika.sender]
    }, {quoted:pika});
}
  
  
  
  
  
 