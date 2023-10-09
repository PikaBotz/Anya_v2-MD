exports.cmdName = () => {
  return {
    name: ['onlineseen'],
    alias: ['setonlinep','setonlineseen','setonline'],
    category: "whatsapp",
    listMode: true,
    desc: "Change the online seen privacy."
  };
}

exports.getCommand = async (userSudo, prefix, userOwner, args, botNumber, anyaV2, pika) => {
require('../../config');
   if (userSudo) {
   if (!userOwner) return pika.reply("Sorry, i know you're the sudo of this bot but i can't provide you this private data.");
     }
   if (!userOwner) return pika.reply(message.owner);
   const checkPrivacy = await anyaV2.fetchPrivacySettings(anyaV2.user.id);
   const message = `*🔖 Current setting:* ${(checkPrivacy.online === 'all')
        ? 'Everyone'
        : (checkPrivacy.online === 'contacts')
        ? 'Only Contacts'
        : (checkPrivacy.online === 'contact_blacklist')
        ? 'Contacts Except'
        : (checkPrivacy.online === 'none')
        ? 'Nobody'
        : 'Same as last seen'}

\`\`\`Reply a number to select:\`\`\`

----------------------------------------->

*1* 👤 All:
Iɴꜰᴏ➛ Everyone will able to see when you came online.

----------------------------------------->

*2* 🎏 Same as last seen:
Iɴꜰᴏ➛ Your last seen privacy will be applied to the online seen privacy, to check online privacy type *${prefix}lastseen*.

_ID: QA09_`
   if (!args[0]) return pika.reply(message);
   let choice;
   switch (args[0]) {
     case 'all':
      choice = 'all';
     break;
     case 'likelast':
      choice = 'match_last_seen';
     break;
     default:
       return pika.reply('*⚠️ Invalid option!*\n\n' + message);
     }
   if (checkPrivacy.online == choice) return pika.reply("Already activated this privacy option, choose another.");
   await anyaV2.updateOnlinePrivacy(choice);
   await pika.react("✨");
   pika.reply(message.success);
   }
   
   

