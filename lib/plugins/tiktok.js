exports.cmdName = () => {
  return {
    name: ['tiktok'],
    alias: ['tt'],
    category: "stalker",
    desc: "Stalk anyone's Tiktok account details."
  };
}

exports.getCommand = async (args, text, anyaV2, pika) => {
require('../../config');
    if (!text) return pika.reply("Please enter a tiktok username!");
    pika.reply(message.wait)
 try {
    await pika.react("💌");
    const { ttStalk } = require('api-dylux');
    const result = await ttStalk(args[0]);
  let res = "";
   res += "*🦋 Username :* " + result.username + "\n";
   res += "*👤 Fullname :* " + result.name + "\n";
   res += "*🎗️ Followers :* " + result.followers + "\n";
   res += "*🎀 Following :* " + result.following + "\n";
   res += "*⚜️ Bio :* " + result.desc + "\n\n\n";
   res += "_User data stalking rights accessed by " + botname + " legally._";
 anyaV2.sendMessage(pika.chat, {
                        image: { url: result.profile },
                        caption: res,
                        headerType: 4
                       },
                       { quoted: pika }
                     );
             } catch (error) {
   pika.reply("An unexpected error occurred, try again!");
   }
 }
    
                    


