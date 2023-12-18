const { anya } = require('../lib');

anya({
  name: [
    "request"
  ],
  alias: [
    "need"
  ],
  category: "general",
  desc: "Request something from the developer or the owner..",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, botNumber, anyaV2, pika) => {
require('../../config');
 await pika.react("✨");
 const { modList } = require('../lib/mongoDB');
 const { sleep } = require('../lib/myfunc');
 const modded = await modList();
  if (!text) return pika.reply('Please enter a request that you want from the developer or the owner.');
  const devs = [botNumber, ownernumber + "@s.whatsapp.net", ...modded];
  const sending = await anyaV2.sendMessage(pika.chat, {
          text: '📩 Sending Request...'
         }, {quoted:pika});
  for (let report of devs) {
  await anyaV2.sendMessage(report, {
          text: `\`\`\`⌈ Someone Requested ⌋\`\`\`\n\n` +
               `*🌟 Name:* @${pika.sender.split("@")[0]}\n` +
               `*🤖 Bot:* @${botNumber.split("@")[0]}\n\n` +
               `*🔮 Request:* ${text}`,
          mentions: [pika.sender, botNumber]
       }, {quoted:pika});
  await sleep(100);
     }
  await anyaV2.sendMessage(pika.chat, {
          text: '✅ Thanks for requesting.',
          edit: sending.key, });
  });
