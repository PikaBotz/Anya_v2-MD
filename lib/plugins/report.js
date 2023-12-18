const { anya } = require('../lib');

anya({
  name: [
    "report"
  ],
  alias: [
    "bug",
    "glitch"
  ],
  category: "general",
  desc: "Reports bugs and errors to the developer..",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, botNumber, anyaV2, pika) => {
require('../../config');
 const { modList } = require('../lib/mongoDB');
 const { sleep } = require('../lib/myfunc');
 const modded = await modList();
  if (!text) return pika.reply('Please enter a error location where you caught the error.');
  const devs = [botNumber, ownernumber + "@s.whatsapp.net", ...modded];
  const sending = await anyaV2.sendMessage(pika.chat, {
          text: '🔃 Reaching Devs...'
         }, {quoted:pika});
  for (let report of devs) {
  await anyaV2.sendMessage(report, {
          text: `\`\`\`⌈ Bug Reports ⌋\`\`\`\n\n` +
               `*🌟 Name:* @${pika.sender.split("@")[0]}\n` +
               `*🤖 Bot:* @${botNumber.split("@")[0]}\n\n` +
               `*🔮 Reports:* ${text}`,
          mentions: [pika.sender, botNumber]
       }, {quoted:pika});
  await sleep(100);
     }
  await anyaV2.sendMessage(pika.chat, {
          text: '✅ Thanks for reporting, please take a screenshot of the error and send to wa.me/918811074852 if possible.',
          edit: sending.key, });
  });
