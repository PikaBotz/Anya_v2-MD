const { anya } = require('../lib');

anya({
  name: [
    "editinfo"
  ],
  category: "admin",
  alias: [
    "edigctinfo"
  ],
  desc: "Open and close group info editing accessibility.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (args, prefix, botAdmin, userAdmin, userOwner, userSudo, command, anyaV2, pika) => {
  if (!pika.isGroup) return pika.reply(message.group);
  if (!botAdmin) return pika.reply(message.botAdmin);
  if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);
  if (args[0] === "on" || args[0] === "open") {
    await anyaV2.groupSettingUpdate(pika.chat, "unlocked")
      .then((res) => pika.reply(`Successfully Opened Edit Group Info`))
      .catch((err) => pika.reply(message.error));
  } else if (args[0] === "off" || args[0] === "close") {
    await anyaV2.groupSettingUpdate(pika.chat, "locked")
      .then((res) => pika.reply(`Successfully Closed Edit Group Info`))
      .catch((err) => pika.reply(message.error));
  } else {
    return pika.reply("Please type *" + prefix + command + " on/off*");
  }
});
