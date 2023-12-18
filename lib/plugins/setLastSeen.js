const { anya } = require('../lib');

anya({
  name: [
    "setlast"
  ],
  alias: [
    "setlastp",
    "setlastseen",
    "lastseen"
  ],
  category: "whatsapp",
  listMode: true,
  desc: "Change the last seen privacy.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (userSudo, userOwner, args, botNumber, anyaV2, pika) => {
require('../../config');
   if (userSudo) {
   if (!userOwner) return pika.reply("Sorry, i know you're the sudo of this bot but i can't provide you this private data.");
     }
   if (!userOwner) return pika.reply(message.owner);
   const checkPrivacy = await anyaV2.fetchPrivacySettings(anyaV2.user.id);
   const message = `*🔖 Current setting:* ${(checkPrivacy.last === 'all')
        ? 'Everyone'
        : (checkPrivacy.last === 'contacts')
        ? 'Only Contacts'
        : (checkPrivacy.last === 'contact_blacklist')
        ? 'Contacts Except'
        : (checkPrivacy.last === 'none')
        ? 'Nobody'
        : 'Unknown'}

\`\`\`Reply a number to select:\`\`\`

----------------------------------------->

*1* 👤 All:
Iɴꜰᴏ➛ Everyone will able to see when you went offline.

----------------------------------------->

*2* 🎐 Contacts:
Iɴꜰᴏ➛ Only the users from your contact could see your last offline time.

----------------------------------------->

*3* 🧧 Contacts Except:
Iɴꜰᴏ➛ Only the contacts you selected before will able to see your last seen.

----------------------------------------->

*4* 🎏 Nobody:
Iɴꜰᴏ➛ Nobody could see your offline seen.

_ID: QA08_`
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
   if (checkPrivacy.last == choice) return pika.reply("Already activated this privacy option, choose another.");
   await anyaV2.updateLastSeenPrivacy(choice);
   await pika.react("✨");
   pika.reply(message.success);
   });
