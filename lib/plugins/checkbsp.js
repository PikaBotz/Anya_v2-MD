const { anya } = require('../lib');

anya({
  name: [
    "checkbsp"
  ],
  alias: [
    "business"
  ],
  category: "stalker",
  desc: "Check the business account details of any user that have a business profile on WhatsApp.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userSudo, userOwner, text, prefix, command, anyaV2, pika) => {
require('../../config');
  const { tiny } = require('../lib/stylish-font');
  if (!userOwner && !userSudo) return pika.reply(message.owner);
      if (!text && !pika.quoted) return pika.reply("Provide me a number.");
  const num = pika.quoted ? pika.quoted.sender : text.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  const profile = await anyaV2.getBusinessProfile(num);
  if (!profile) return pika.reply("Maybe not an business account.");
  await pika.react("🌌");
  pika.reply(`*📌 ${tiny("Category")} :* ${profile.category}\n\n*🔖 ${tiny("Desc")} :* ${profile.description}`);
 });
