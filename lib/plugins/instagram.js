exports.cmdName = () => {
  return {
    name: ['instagram'],
    alias: ['ig','instastalk','igstalk'],
    category: "stalker",
    desc: "Stalk anyone's insta account data just by username."
  };
}

exports.getCommand = async (prefix, command, args, text, anyaV2, pika) => {
require('../../config');
 const { getBuffer } = require('../lib/myfunc');
 if (!text) return pika.reply(`Please enter username.\n*Example :* ${prefix + command} 3.69_pika`);
 pika.reply(message.wait)
try {
 try {
  var profile = { url: user.profilePic };
  } catch {
  var profile = await getBuffer('https://i.ibb.co/D9G4snb/736007.png');
   }
                         
  const { igStalk } = require('api-dylux');
  const user = await igStalk(args[0]);
  await pika.react("👤");
   await anyaV2.sendMessage(pika.chat, {
                  image: profile,
                  caption:
   `*🦋 Username :* ${user.username}\n` +
   `*👤 Name :* ${user.name}\n` +
   `*↙️ Followers :* ${user.followersH}\n` +
   `*🎀 Following :* ${user.followingH}\n` +
   `*🎗️ Posts :* ${user.postsH}\n` +
   `*⚜️ Bio :* ${user.description}\n\n\n` +
   `_User data stalking rights accessed by ${botname} legally._`,
                  hearderType: 4
                 }, { quoted: pika });
   } catch {
    pika.reply("Sorry i can't fetch this account's data!");
  }
}





