const { anya } = require('../lib');

anya({
  name: [
    "translate"
  ],
  alias: [
    "trans",
    "translation"
  ],
  need: "query",
  react: "🌍",
  category: "tools",
  desc: "This plugin translate automatically/manually to one language to another.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, pika) => {
 if (!text && !pika.quoted) return pika.reply("Enter something to translate into English 👀");
 const Config = require("../../config");
 const { api } = require("../.dev");
 api.apiHub("api", "translate", `fl=auto&tl=en&q=${encodeURIComponent(pika.quoted ? ((pika.quoted.text.length !== 0) ? pika.quoted.text : (text ? text : '')) : (text ? text : ''))}`)
  .then((res) => {
   if (res.status === 404) return pika.reply(`\`\`\`😐 Text not found.\`\`\``);
   if (res.status === 500) return pika.reply(`\`\`\`Server 📶 not responding...\`\`\``);
   if (res.status === 200) return pika.reply(`_Translate to: *"${res.result.to}"*_\n\n✨ Translated Text: ${res.result.data}`);
  })
   .catch((error) => {
   console.log(error);
   pika.reply(Config.message.error);
   });
 });
