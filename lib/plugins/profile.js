const { anya } = require('../lib');

anya({
  name: [
    "profile"
  ],
  alias: [
    "profil"
  ],
  category: "general",
  desc: "Get Your profile dashboard.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userAdmin, anyaV2, pika) => {
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
});
