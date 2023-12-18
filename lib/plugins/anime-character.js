const { anya } = require('../lib');

anya({
  name: [
    "animecharacter"
  ],
  alias: [
    "animechara"
  ],
  category: "owner",
  desc: "Get episodes info from the given anime ID.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async function (prefix, text, args, anyaV2, pika) {
  const { Anime } = require("@shineiichijo/marika");
  if (!text) return pika.reply(`Please enter an anime ID, type *${prefix}searchAnime* to get an anime ID.`);
  try {
  const wait = await anyaV2.sendMessage(pika.chat, {
     text: message.wait
    }, {quoted:pika});
    const result = await new Anime().getAnimeCharacters(args[0]);
    let cap = `\`\`\`Reply a number:\`\`\`\n *1* for getting this anime's character pics randomly!\n\n\n`;
       cap += `There are *${result.data.length}* major characters in this anime!\n\n\n`;
    for (let i of result.data) {
      cap += `*👤 Name :* ${i.character.name}\n`;
      cap += `*🦋 Role :* ${i.role}\n`;
      cap += `*🎐 Favourites :* ${i.favorites}\n\n`;
    }
     cap += `🌈 ID : ${args[0]}\n_ID: QA25_\n${footer}`;
    await anyaV2.sendMessage(pika.chat, {
        text: cap,
        edit: wait.key, });
  } catch {
    pika.reply("```Error, please check the ID again!```");
  }
});
