const { anya } = require('../lib');

anya({
  name: [
    "listnum"
  ],
  alias: [
    "listnumber",
    "numlist",
    "numberlist"
  ],
  category: "stalker",
  desc: "Stalk all the numbers from given country code.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (groupMetadata, botNumber, args, anyaV2, pika) => {
  require('../../config');
  if (!pika.isGroup) return pika.reply(message.group);
  if (!args[0]) return pika.reply('Provide me a country code to search users.');
  const numbers = groupMetadata.participants
    .filter(item => item.id.startsWith(args[0].replace('+', '')) && item.id !== botNumber && item.id !== `${ownernumber}@s.whatsapp.net`)
    .map(item => item.id);
  if (numbers.length === 0) return pika.reply('Not found!!');
  await pika.react("#️⃣");  
  let count = 1;
  let caption = '';
  for (let number of numbers) {
    caption += `${count++}. @${number.split("@")[0]}\n`;
  }
  anyaV2.sendMessage(pika.chat, {
    text: `⌈ ${numbers.length} ${numbers.length < 2 ? 'result' : 'results'} found for *+${args[0].replace('+', '')}* ⌋\n\n${caption}\n*Reply:*\n   *0* to remove everyone.\n   *Any Number* to remove that user.\n\n_ID: QA22_`,
    mentions: numbers.map(v => v),
  }, { quoted: pika });
});
