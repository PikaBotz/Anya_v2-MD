const { anya } = require('../lib');

anya({
  name: [
    "join"
  ],
  alias: [],
  category: "owner",
  desc: "Join several groups by links.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userOwner, userSudo, text, args, anyaV2, pika) => {
   require('../../config');
   const { isUrl } = require('../lib/myfunc');
   if (!userOwner && !userSudo) return pika.reply(message.owner);
   if (!text) return pika.reply("Enter the group link!");
   if (!isUrl(args[0]) && !args[0].includes("whatsapp.com")) return pika.reply("Link Invalid!");
   const joining = await anyaV2.sendMessage(pika.chat, {
      text: message.wait
   }, { quoted: pika });
   const result = args[0].split("https://chat.whatsapp.com/")[1];   
   anyaV2.groupAcceptInvite(result)
      .then((res) => {
         anyaV2.sendMessage(pika.chat, {
            text: message.success,
            edit: joining.key
         });
      })
      .catch((err) => {
         anyaV2.sendMessage(pika.chat, {
            text: message.error,
            edit: joining.key
         });
      });
});
