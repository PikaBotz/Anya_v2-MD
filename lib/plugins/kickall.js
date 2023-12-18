const { anya } = require('../lib');

anya({
  name: [
    "kickall"
  ],
  alias: [
    "fkick"
  ],
  category: "owner",
  desc: "You could remove any number(s) by country code or whole group by just a command.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (botAdmin, text, groupMetadata, botNumber, args, anyaV2, pika) => {
require('../../config');
 if (!pika.isGroup) return pika.reply(message.group);
 if (!botAdmin) return pika.reply(message.botAdmin);
  const { sleep } = require('../lib/myfunc');
  const { checkSwitch, updateSwitch } = require('../lib/mongoDB');
  const numbers = (args[0] === 'numBut')
  ? text.replace(`${args[0]} `, '').split('|')
  : (Number(args[0]))
    ? groupMetadata.participants
      .filter(item => item.id.startsWith(args[0].replace('+', '')) && item.id !== botNumber && item.id !== `${ownernumber}@s.whatsapp.net`)
      .map(item => item.id)
    : groupMetadata.participants
      .filter(item => item.id !== botNumber && item.id !== `${ownernumber}@s.whatsapp.net`)
      .map(item => item.id);

/*
  const numbers = (args[0] === 'numBut')
                     ? text.replace(`${args[0]} `, '').split('|')
                     : groupMetadata.participants
    .filter(item => item.id !== botNumber && item.id !== `${ownernumber}@s.whatsapp.net`)
    .map(item => item.id);
*/
 const checkLeft = await checkSwitch('goodbye');
 if (checkLeft) {
  await updateSwitch('goodbye', false);
  }
 
 for (let remove of numbers) {
 await anyaV2.groupParticipantsUpdate(pika.chat, [(args[0] === "numBut") ? `${remove}@s.whatsapp.net` : remove], "remove");
 await sleep(100);
 }
 pika.reply(message.success + '\n\n' + '_( ! ) Disabled "Goodbye alert" to avoid spam, please turn it again if needed._');
});
