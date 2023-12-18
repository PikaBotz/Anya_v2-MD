const { anya } = require('../lib');

anya({
  name: [
    "owner"
  ],
  alias: [
    "mod",
    "creator"
  ],
  category: "general",
  desc: "See owner of this bot.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (anyaV2, pika, botNumber) => {
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
   )});
