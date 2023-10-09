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
    name: ['owner'],
    alias: ['mod', 'creator'],
    category: "general",
    desc: "See owner of this bot."
  };
}

exports.getCommand = async (anyaV2, pika, botNumber) => {
require('../../config');
await pika.react("👑");
  const botq = {
      key: {
        participant: `0@s.whatsapp.net`,
        ...(pika.chat ? { remoteJid: `status@broadcast` } : {}),
      },
      message: {
        contactMessage: {
          displayName: anyaV2.user.name,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${
            anyaV2.user.name
          },;;;\nFN:${anyaV2.user.name}\nitem1.TEL;waid=${
            botNumber.split("@")[0]
          }:${botNumber.split("@")[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
          jpegThumbnail: global.image_3,
          thumbnail: global.image_3,
          sendEphemeral: true,
        },
      },
    };
 anyaV2.sendContact = async (jid, contacts, quoted = '', opts = {}) => {
  const contactList = [];
  for (const contactNumber of contacts) {
    const displayName = await anyaV2.getName(contactNumber + '@s.whatsapp.net');
    const vCard = `BEGIN:VCARD
VERSION:3.0
N:${await anyaV2.getName(contactNumber + '@s.whatsapp.net')}
FN:${global.ownername}
item1.TEL;waid=${contactNumber}:${contactNumber}
item1.X-ABLabel:Click here to chat to this bot's dev.
item2.EMAIL;type=INTERNET:${global.email}
item2.X-ABLabel:${global.ownername}'s Email
item3.URL:${global.myweb}
item3.X-ABLabel:${global.ownername}'s Email
item4.ADR:;;${global.adress};;;;
item4.X-ABLabel:${global.ownername}'s Location
END:VCARD`;
    contactList.push({
      displayName: displayName,
      vcard: vCard,
    });
  }
  anyaV2.sendMessage(jid, {
    contacts: {
      displayName: `${contactList.length} Contact${contactList.length > 1 ? 's' : ''} in this bot.`,
      contacts: contactList,
    },
    ...opts
  }, { quoted });
};
anyaV2.sendContact(
  pika.chat, 
  [ownernumber], // List of contact numbers
  botq // Quoted message
   )};