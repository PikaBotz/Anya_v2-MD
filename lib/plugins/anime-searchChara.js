const { anya } = require('../lib');

anya({
  name: [
    "searchchara"
  ],
  alias: [
    "scharacter",
    "searchcharacter"
  ],
  category: "myanimelist",
  desc: "Search character by their names directly from myanimelist.net",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, prefix, anyaV2, pika) => {
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
     });
