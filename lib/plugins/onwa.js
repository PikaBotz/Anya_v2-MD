const { anya } = require('../lib');

anya({
  name: [
    "onwa"
  ],
  alias: [
    "iswa",
    "checkwa",
    "iswhatsapp",
    "checkwhatsapp"
  ],
  category: "tools",
  desc: "Check the given number is on WhatsApp?.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, anyaV2, pika) => {
require('../../config');
    const { tiny, fancy13 } = require('../lib/stylish-font');
      if (!text && !pika.quoted) return pika.reply("Provide me a number.");
      if (!Number(pika.quoted ? pika.quoted.sender.split("@")[0] : text.split("@")[0])) return pika.reply('Invalid query.');
    const id = pika.quoted ? pika.quoted.sender : text.replace(/[^0-9]/g, '');
    const result = await anyaV2.onWhatsApp(id.split("@")[0])
      try {
      if (!result[0].exists) return pika.reply("Can't find this number, maybe this number is not available on WhatsApp.");
    const status = await anyaV2.fetchStatus(result[0].jid);
      await pika.react("✅");
      anyaV2.sendMessage(pika.chat, {
             image: { url: await anyaV2.profilePictureUrl(result[0].jid, 'image') },
             caption: `*✅ This number is available on WhatsApp:*\n\n` +
                      `*👤 ${tiny("Name")} :* @${result[0].jid.split("@")[0]}\n` +
                      `*🔖 ${tiny("Bio")} :* ${status
                               ? fancy13(status.status)
                               : 'null'}`,
             headerType: 4,
             mentions: [result[0].jid]
             }, { quoted: pika });
           } catch {
           return pika.reply(message.error);
           }
          });
