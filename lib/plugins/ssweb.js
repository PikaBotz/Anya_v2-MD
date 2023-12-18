const { anya } = require('../lib');

anya({
  name: [
    "ssweb"
  ],
  alias: [],
  category: "tools",
  desc: "Get a HD screenshot through a web link.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async function getCommand(text, args, anyaV2, pika){
require('../../config');
  const { ssweb } = require('api-dylux');
  if (!text) return pika.reply("Enter a website URL to stalk.");
  if (!text.includes("https://")) return pika.reply("Please enter a valid URL.");
  pika.reply(message.wait);
  try {
  const screenshot = await ssweb(args[0]);
  await pika.react("✨");
    anyaV2.sendMessage(pika.chat, {
            image: screenshot,
            caption: text,
            headerType: 4
    }, { quoted: pika });
    } catch {
    pika.reply(message.error);
  }

});
