/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Team: Tᴇᴄʜ Nɪɴᴊᴀ Cʏʙᴇʀ Sϙᴜᴀᴅꜱ (𝚻.𝚴.𝐂.𝐒) 🚀📌 (under @P.B.inc)

📜 GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

📌 Permission & Copyright:
If you're using any of these codes, please ask for permission or mention https://github.com/PikaBotz/Anya_v2-MD in your repository.

⚠️ Warning:
- This bot is not an officially certified WhatsApp bot.
- Report any bugs or glitches to the developer.
- Seek permission from the developer to use any of these codes.
- This bot does not store user's personal data.
- Certain files in this project are private and not publicly available for edit/read (encrypted).
- The repository does not contain any misleading content.
- The developer has not copied code from repositories they don't own. If you find matching code, please contact the developer.

Contact: alammdarif07@gmail.com (for reporting bugs & permission)
          https://wa.me/918811074852 (to contact on WhatsApp)

🚀 Thank you for using Queen Anya MD v2! 🚀
**/

exports.cmdName = () => {
  return {
    name: ['groupadd'],
    alias: ['setgroupadd','setgroupaddp'],
    category: "whatsapp",
    listMode: true,
    desc: "Change the group adding privacy."
  };
}

exports.getCommand = async (userSudo, userOwner, args, botNumber, anyaV2, pika) => {
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
   }
   
   
   
   
   
   