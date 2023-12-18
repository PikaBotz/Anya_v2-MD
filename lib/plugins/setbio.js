const { anya } = require('../lib');

anya({
  name: [
    "setbio"
  ],
  alias: [
    "setstatus"
  ],
  category: "owner",
  desc: "To change bot number's account biography text.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userSudo, userOwner, text, prefix, command, anyaV2, pika) => {
require('../../config');
  if (!userOwner && !userSudo) return pika.reply(message.owner);
  if (!text) return pika.reply(`*Example :* ${prefix + command} Hey everyone, whatsapp using me.`);
  await anyaV2.setStatus(text);
  await pika.react("✍🏻");
  pika.reply(message.success);
 });
