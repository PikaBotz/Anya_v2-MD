const { anya } = require('../lib');

anya({
  name: [
    "setgroup"
  ],
  alias: [
    "groupset"
  ],
  category: "admin",
  desc: "To make group public and private.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (args, prefix, command, botAdmin, userAdmin, userOwner, userSudo, anyaV2, pika) => {
  try {
    if (!pika.isGroup) return pika.reply(message.group);
    if (!botAdmin) return pika.reply(message.botAdmin);
    if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);
    if (args[0] === "off" || args[0] === "close") {
      await anyaV2.groupSettingUpdate(pika.chat, "announcement");
      pika.reply("✅ Successfully closed this group.");
    } else if (args[0] === "on" || args[0] === "open") {
      await anyaV2.groupSettingUpdate(pika.chat, "not_announcement");
      pika.reply("☑️ Successfully opened this group.");
    } else {
      pika.reply("Please type *" + prefix + command + " open/close*");
    }
  } catch (err) {
    pika.reply(message.error); 
  }
});
