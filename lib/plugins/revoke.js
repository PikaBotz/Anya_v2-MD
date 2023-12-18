const { anya } = require('../lib');

anya({
  name: [
    "revoke"
  ],
  alias: [
    "resetlinkgroup",
    "resetlinkgrup",
    "resetlinkgc",
    "resetlink",
    "resetgrouplink",
    "resetgclink",
    "resetgruplink"
  ],
  category: "admin",
  desc: "Reset a group's invitation link.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (botAdmin, userAdmin, userOwner, userSudo, anyaV2, pika) => {
require('../../config');
   if (!pika.isGroup) return pika.reply(message.group);
   if (!botAdmin) return pika.reply(message.botAdmin);
   if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);
   await anyaV2.groupRevokeInvite(pika.chat);
   await pika.react("🖇️");
   pika.reply(message.success);
  });
