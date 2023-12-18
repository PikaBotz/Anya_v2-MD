const { anya } = require('../lib');

anya({
  name: [
    "setread"
  ],
  alias: [
    "readreceipts",
    "setreadp"
  ],
  category: "whatsapp",
  listMode: true,
  desc: "Change the read receipt privacy.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userSudo, userOwner, args, botNumber, anyaV2, pika) => {
require('../../config');
   if (userSudo) {
   if (!userOwner) return pika.reply("Sorry, i know you're the sudo of this bot but i can't provide you this private data.");
     }
   if (!userOwner) return pika.reply(message.owner);
   const checkPrivacy = await anyaV2.fetchPrivacySettings(anyaV2.user.id);
   const message = `*🔖 Current setting:* ${(checkPrivacy.readreceipts === 'all')
        ? 'Everyone'
        : (checkPrivacy.readreceipts === 'contacts')
        ? 'Only Contacts'
        : (checkPrivacy.readreceipts === 'contact_blacklist')
        ? 'Contacts Except'
        : (checkPrivacy.readreceipts === 'none')
        ? 'Nobody'
        : 'Unknown'}

\`\`\`Reply a number to select:\`\`\`

----------------------------------------->

*1* 👤 All:
Iɴꜰᴏ➛ The bot will receive or send read receipts.

----------------------------------------->

*2* 🎐 Nobody:
Iɴꜰᴏ➛ The bot won't receive or send read receipts.

_ID: QA13_`
   if (!args[0]) return pika.reply(message);
   let choice;
   switch (args[0]) {
     case 'all':
      choice = 'all';
     break;
     case 'nobody':
      choice = 'none';
     break;
     default:
       return pika.reply('*⚠️ Invalid option!*\n\n' + message);
     }
   if (checkPrivacy.readreceipts == choice) return pika.reply("Already activated this privacy option, choose another.");
   await anyaV2.updateReadReceiptsPrivacy(choice);
   await pika.react("✨");
   pika.reply(message.success);
   });
