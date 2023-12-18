const { anya } = require('../lib');

anya({
  name: [
    "leave"
  ],
  alias: [
    "leavegc",
    "leavegroup",
    "left",
    "leftgc"
  ],
  category: "owner",
  desc: "To leave any group from bot's number.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userOwner, userSudo, anyaV2, pika) => {
require('../../config');
  const { sleep } = require('../lib/myfunc');
  if (!pika.isGroup) return pika.reply(message.group);
  if (!userOwner && !userSudo) return pika.reply(message.owner);
  await anyaV2.sendMessage(pika.chat, {
    text: `Leaving in 3 seconds.`,
  }, { quoted: pika });
  await sleep(3000);
  await anyaV2.groupLeave(pika.chat)
    .catch((err) => pika.reply(message.error));
  await anyaV2.sendMessage(pika.sender, {
    text: `✅ Successfully left the group chat by @${pika.sender.split("@")[0]}`,
    mentions: [pika.sender],
  }, { quoted: pika });
});
