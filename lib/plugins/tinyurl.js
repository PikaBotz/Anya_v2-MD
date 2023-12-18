const { anya } = require('../lib');

anya({
  name: [
    "tinyurl"
  ],
  alias: [
    "tinylink"
  ],
  category: "tools",
  desc: "Make long links into tiny.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (args, text, anyaV2, pika) => {
require('../../config');
  await pika.react("🤏🏻");
  if (text.includes("tinyurl.com")) return pika.reply("Already a tiny url.");
  const { get } = require('axios');
  if (!text) return pika.reply("Enter a link to make it tiny.");
  const wait = await anyaV2.sendMessage(pika.chat, {
     text: message.wait
   }, {quoted:pika});
  await get("https://tinyurl.com/api-create.php?url=" + args[0])
    .then((response) => {
     anyaV2.sendMessage(pika.chat, {
       text: "✅ Successfully made your link Tiny: " + response.data,
       edit: wait.key, })
        .catch((e) => {
        pika.reply(message.error);
         });
      });
    });
