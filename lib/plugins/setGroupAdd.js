const { anya } = require('../lib');

anya({
  name: [
    "groupadd"
  ],
  alias: [
    "setgroupadd",
    "setgroupaddp"
  ],
  category: "whatsapp",
  listMode: true,
  desc: "Change the group adding privacy.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userSudo, userOwner, args, botNumber, anyaV2, pika) => {
require('../../config');
   if (userSudo) {
   if (!userOwner) return pika.reply("Sorry, i know you're the sudo of this bot but i can't provide you this private data.");
     }
   if (!userOwner) return pika.reply(message.owner);
   const checkPrivacy = await anyaV2.fetchPrivacySettings(anyaV2.user.id);
   const message = `*🔖 Current setting:* ${(checkPrivacy.groupadd === 'all')
        ? 'Everyone'
        : (checkPrivacy.groupadd === 'contacts')
        ? 'Only Contacts'
        : (checkPrivacy.groupadd === 'contact_blacklist')
        ? 'Contacts Except'
        : (checkPrivacy.groupadd === 'none')
        ? 'Nobody'
        : 'Unknown'}

\`\`\`Reply a number to select:\`\`\`

----------------------------------------->

*1* 👤 All:
Iɴꜰᴏ➛ Anyone can add this bot to his group.

----------------------------------------->

*2* 🎐 Contacts:
Iɴꜰᴏ➛ Only the contacts that saved this bot number could add this bot to his group.

_ID: QA12_`
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
   if (checkPrivacy.groupadd == choice) return pika.reply("Already activated this privacy option, choose another.");
   await anyaV2.updateGroupsAddPrivacy(choice);
   await pika.react("✨");
   pika.reply(message.success);
   });
