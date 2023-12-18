const { anya } = require('../lib');

anya({
  name: [
    "edit"
  ],
  alias: [
    "e"
  ],
  category: "owner",
  desc: "Edit the message that sent by this bot.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, botNumber, anyaV2, pika) => {
require('../../config');
// const { sleep } = require('../lib/myfunc');
 const moment = require("moment-timezone");
  if (!pika.quoted) return pika.reply('Mention a message to edit.');
  if (!text) return pika.reply('Also enter some texts to replace existing message.');
  if (!pika.quoted.sender.includes(botNumber)) return pika.reply('Only the messages sent by this number could get edited! (under 15 minutes)');
  await anyaV2.sendMessage(pika.chat, {
      text: text,
      edit: pika.quoted.fakeObj.key, });
});
