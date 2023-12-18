const { anya } = require('../lib');

anya({
  name: [
    "disappear"
  ],
  category: "admin",
  alias: [
    "disappearmsg",
    "disappearingmsg",
    "disappearing"
  ],
  desc: "Set disappearing messages in a group chat.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (args, prefix, botAdmin, userAdmin, userOwner, userSudo, text, command, anyaV2, pika) => {
const { WA_DEFAULT_EPHEMERAL } = require("@queenanya/baileys");
  if (!pika.isGroup) return pika.reply(message.group);
  if (!botAdmin) return pika.reply(message.botAdmin);
  if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);
  if (!text) return pika.reply(`Enter The on/off Values`);
  if (args[0] === "on") {
    await anyaV2.sendMessage(pika.chat, {
      disappearingMessagesInChat: WA_DEFAULT_EPHEMERAL,
    })
      .then((res) => pika.reply(message.success))
      .catch((err) => pika.reply(message.error));
  } else if (args[0] === "off") {
    await anyaV2.sendMessage(pika.chat, {
      disappearingMessagesInChat: false,
    })
      .then((res) => pika.reply(message.success))
      .catch((err) => pika.reply(message.error));
  } else {
    return pika.reply("Please type *" + prefix + command + " on/off*");
  }
});
