exports.cmdName = () => {
  return {
    name: ['setprofile'],
    alias: ['setprofilep','setdpp'],
    category: "whatsapp",
    listMode: true,
    desc: "Change the profile picture privacy."
  };
} 

exports.getCommand = async (userSudo, userOwner, args, botNumber, anyaV2, pika) => {
require('../../config');
   if (userSudo) {
   if (!userOwner) return pika.reply("Sorry, i know you're the sudo of this bot but i can't provide you this private data.");
     }
   if (!userOwner) return pika.reply(message.owner);
   const checkPrivacy = await anyaV2.fetchPrivacySettings(anyaV2.user.id);
   const message = `*🔖 Current setting:* ${(checkPrivacy.profile === 'all')
        ? 'Everyone'
        : (checkPrivacy.profile === 'contacts')
        ? 'Only Contacts'
        : (checkPrivacy.profile === 'contact_blacklist')
        ? 'Contacts Except'
        : (checkPrivacy.profile === 'none')
        ? 'Nobody'
        : 'Same as last seen'}

\`\`\`Reply a number to select:\`\`\`

----------------------------------------->

*1* 👤 All:
Iɴꜰᴏ➛ Everyone will able to see your profile picture.

----------------------------------------->

*2* 🎐 Contacts:
Iɴꜰᴏ➛ Only the users from your contact could see your profile picture.

----------------------------------------->

*3* 🧧 Contacts Except:
Iɴꜰᴏ➛ Only the contacts you selected before will able to see your profile picture.

----------------------------------------->

*4* 🎏 Nobody:
Iɴꜰᴏ➛ Nobody could see your profile picture.

_ID: QA10_`
   if (!args[0]) return pika.reply(message);
   let choice;
   switch (args[0]) {
     case 'all':
      choice = 'all';
     break;
     case 'contacts': case 'contact':
      choice = 'contacts';
     break;
     case 'contacts2': case 'contact2':
      choice = 'contact_blacklist';
     break;
     case 'nobody':
      choice = 'none';
     break;
     default:
       return pika.reply('*⚠️ Invalid option!*\n\n' + message);
     }
   if (checkPrivacy.profile == choice) return pika.reply("Already activated this privacy option, choose another.");
   await anyaV2.updateProfilePicturePrivacy(choice);
   await pika.react("✨");
   pika.reply(message.success);
   }
   
   

