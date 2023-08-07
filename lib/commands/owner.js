/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Management: (@teamolduser)

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

function cmdName() {
  return ['owner',
         'mod',
         'creator'];
}

async function getCommand(botq, react, AnyaPika) {
require('../../config');
  const doReact = false;
  AnyaPika.sendContact = async (jid, contact, quoted = '', opts = {}) => {
  const contacts = []
  for (const i of contact) {
	    contacts.push({
	    	displayName: await AnyaPika.getName(i + '@s.whatsapp.net'),
	    	vcard: "BEGIN:VCARD\nVERSION:3.0\nN:" + await AnyaPika.getName(i + '@s.whatsapp.net') + "\nFN:" + global.ownername + "\nitem1.TEL;waid=" + i + ":" + i + "\nitem1.X-ABLabel:Click here to chat to this bot's dev.\nitem2.EMAIL;type=INTERNET:" + global.email + "\nitem2.X-ABLabel:" + ownername + "'s Email\nitem3.URL:" + global.myweb + "\nitem3.X-ABLabel:" + ownername + "'s Email\nitem4.ADR:;;" + global.state + ",\t" + global.region + ",\t" + global.continent + ";;;;\nitem4.X-ABLabel:" + ownername + "'s Location\nEND:VCARD"
   	      }
 	   );
    }
  AnyaPika.sendMessage(jid, { contacts: { displayName: `${contacts.length} Contact in this bot.`, contacts: contacts }, ...opts }, { quoted })
    }
  m.isGroup // use "/*" from here.
  ? m.reply(`\`\`\`Check my private chat.\`\`\``)
  : null; // to here with "*/" or cut these lines to remove this function.
  AnyaPika.sendContact(
                 m.sender, // m.chat: for every inbox.
                 ownernumber,
                 botq
              );
  doReact ? react("👑") : null;
           }
module.exports = { cmdName, getCommand }
