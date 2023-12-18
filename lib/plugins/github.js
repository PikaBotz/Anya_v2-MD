const { anya } = require('../lib');

anya({
  name: [
    "github"
  ],
  alias: [
    "git"
  ],
  category: "stalker",
  desc: "Stalk any public GitHub profile.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, prefix, command, args, anyaV2, pika) => {
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
            });
