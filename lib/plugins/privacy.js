exports.cmdName = () => {
  return {
    name: ['privacy'],
    alias: [],
    category: "whatsapp",
    listMode: true,
    desc: "Stalk the bot's number's realtime privacy status."
  };
}

exports.getCommand = async (userSudo, userOwner, botNumber, anyaV2, pika) => {
require('../../config');
   if (!userSudo) {
   if (!pika.sender.includes(botNumber)) return pika.reply("Sorry, i know you're the sudo of this bot but i can't provide you this private data.");
     }
   if (!userOwner) return pika.reply(message.owner);
   const { fancy32, tiny } = require('../lib/stylish-font');
   const checkPrivacy = await anyaV2.fetchPrivacySettings(anyaV2.user.id);
   await pika.react("🔑");
   pika.reply(`*「 Bot Privacy Info 」*\n\n\`\`\`🔖 Reply a number to make changes:\`\`\`\n
*1* ☑️ Read Tick:
➛ ${tiny((checkPrivacy.readreceipts === 'all')
        ? 'Everyone'
        : (checkPrivacy.readreceipts === 'contacts')
        ? 'Only Contacts'
        : (checkPrivacy.readreceipts === 'contact_blacklist')
        ? 'Selected Contacts'
        : (checkPrivacy.readreceipts === 'none')
        ? 'Nobody'
        : 'Unknown')}

*2* 👤 Profile pic:
➛ ${tiny((checkPrivacy.profile === 'all')
        ? 'Everyone'
        : (checkPrivacy.profile === 'contacts')
        ? 'Only Contacts'
        : (checkPrivacy.profile === 'contact_blacklist')
        ? 'Selected Contacts'
        : (checkPrivacy.profile === 'none')
        ? 'Nobody' 
        : 'Unknown')}

*3* 🎏 User Bio:
➛  ${tiny((checkPrivacy.status === 'all')
        ? 'Everyone'
        : (checkPrivacy.status === 'contacts')
        ? 'Only Contacts'
        : (checkPrivacy.status === 'contact_blacklist')
        ? 'Selected Contacts'
        : (checkPrivacy.status === 'none')
        ? 'Nobody'
        : 'Unknown')}

*4* 🌟 Online Seen:
➛ ${tiny((checkPrivacy.online === 'all')
        ? 'Everyone'
        : (checkPrivacy.online === 'contacts')
        ? 'Only Contacts'
        : (checkPrivacy.online === 'contact_blacklist')
        ? 'Selected Contacts'
        : (checkPrivacy.online === 'none')
        ? 'Nobody'
        : 'Unknown')}

*5* ✨ Last Seen:
➛ ${tiny((checkPrivacy.last === 'all')
        ? 'Everyone'
        : (checkPrivacy.last === 'contacts')
        ? 'Only Contacts'
        : (checkPrivacy.last === 'contact_blacklist')
        ? 'Selected Contacts'
        : (checkPrivacy.last === 'none')
        ? 'Nobody'
        : 'Unknown')}

*6* 🎐 Group adding:
➛ ${tiny((checkPrivacy.groupadd === 'all')
        ? 'Everyone'
        : (checkPrivacy.groupadd === 'contacts')
        ? 'Only Contacts'
        : (checkPrivacy.groupadd === 'contact_blacklist')
        ? 'Selected Contacts'
        : (checkPrivacy.groupadd === 'none')
        ? 'Nobody'
        : 'Unknown')}

*7* 🧧 Caller Allowed:
➛ ${tiny((checkPrivacy.calladd === 'all')
        ? 'Everyone'
        : (checkPrivacy.calladd === 'contacts')
        ? 'Only Contacts'
        : (checkPrivacy.calladd === 'contact_blacklist')
        ? 'Selected Contacts'
        : (checkPrivacy.calladd === 'none')
        ? 'Nobody'
        : 'Unknown')}
        
_ID: QA07_`);
    }
    
    
    
 
