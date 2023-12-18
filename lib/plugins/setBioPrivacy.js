const { anya } = require('../lib');

anya({
  name: [
    "setbiop"
  ],
  alias: [
    "setstatusp"
  ],
  category: "whatsapp",
  listMode: true,
  desc: "Change the biography privacy.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userSudo, userOwner, args, botNumber, anyaV2, pika) => {
require('../../config');
   if (userSudo) {
   if (!userOwner) return pika.reply("Sorry, i know you're the sudo of this bot but i can't provide you this private data.");
     }
   if (!userOwner) return pika.reply(message.owner);
   const checkPrivacy = await anyaV2.fetchPrivacySettings(anyaV2.user.id);
   const message = `*🔖 Current setting:* ${(checkPrivacy.status === 'all')
        ? 'Everyone'
        : (checkPrivacy.status === 'contacts')
        ? 'Only Contacts'
        : (checkPrivacy.status === 'contact_blacklist')
        ? 'Contacts Except'
        : (checkPrivacy.status === 'none')
        ? 'Nobody'
        : 'Unknown'}

\`\`\`Reply a number to select:\`\`\`

----------------------------------------->

*1* 👤 All:
Iɴꜰᴏ➛ Everyone will able to see your profile biography.

----------------------------------------->

*2* 🎐 Contacts:
Iɴꜰᴏ➛ Only the users from your contact could see your profile biography.

----------------------------------------->

*3* 🧧 Contacts Except:
Iɴꜰᴏ➛ Only the contacts you selected before will able to see your profile biography.

----------------------------------------->

*4* 🎏 Nobody:
Iɴꜰᴏ➛ Nobody could see your profile biography.

_ID: QA11_`
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
   if (checkPrivacy.status == choice) return pika.reply("Already activated this privacy option, choose another.");
   await anyaV2.updateStatusPrivacy(choice);
   await pika.react("✨");
   pika.reply(message.success);
   });
