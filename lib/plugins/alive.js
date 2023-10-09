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

exports.cmdName = () => {
  return {
    name: ['alive'],
    alias: [],
    category: "general",
    desc: "Bot will send alive message to show that's running."
  };
}

exports.getCommand = async (userOwner, botNumber, prefix, anyaV2, pika) => {
require('../../config');
  await pika.react("👋🏻");
  const userq = {
      key: {
        participant: `0@s.whatsapp.net`,
        ...(pika.chat ? { remoteJid: `status@broadcast` } : {}),
      },
      message: {
        contactMessage: {
          displayName: pika.pushName,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${pika.pushName},;;;\nFN:${pika.pushName}\nitem1.TEL;waid=${
            pika.sender.split("@")[0]
          }:${pika.sender.split("@")[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
          jpegThumbnail: image_3, // Changes available 
          thumbnail: image_3, // Changes available 
          sendEphemeral: true,
        },
      },
    };
  const { get } = require('axios');
  const { runtime, /*editMsg, sleep*/ } = require('../lib/myfunc');
  const { tiny, fancy13 } = require('../lib/stylish-font');
  const oldVersion = require('../../package.json').version;
  const newVersion = await get('https://raw.githubusercontent.com/PikaBotz/Anya_v2-MD/master/package.json');
  const alive = (newVersion.data.version == oldVersion) ? `\`\`\`Hey, I'pika Alive! 👋🏻\`\`\`\n
🤖 *${tiny("Botname")} :* @${botNumber.split("@")[0]}
🎏 *${tiny("Version")} :* ${oldVersion}
👤 *${tiny("User")} :* @${pika.sender.split("@")[0]}
👑 *${tiny("Owner")} :* ${ownername}
🧧 *${tiny("Runtime")} :* ${runtime(process.uptime()).replace(' hours', 'h').replace(' minutes', 'm').replace(' seconds', 's')}\n
\`\`\`Reply a number:\`\`\`
 *1* for all commands list.
 *2* for categories list.\n
_ID: QA01_`
  : userOwner
  ? `${fancy13("⚠️ New changes available, please update your script to stay latest.")}`
  : `${fancy13("⚠️ Sir/Ma'am please tell the owner to update his/her script, new changes is now available of this bot please update.")}`;
  anyaV2.sendMessage(pika.chat, {
	    text: alive,
	     mentions: [pika.sender, botNumber]
           }, {quoted:pika
	      });	       
//  await editMsg(
//          `\`\`\`Hey, I'pika Alive! 👋🏻\`\`\``,
//         alive,
//          [pika.sender, botNumber],
//          anyaV2
//      );
}
