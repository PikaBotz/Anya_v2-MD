exports.cmdName = () => ({
  name: ['gcinfo'],
  alias: ['groupinfo','gcstalk'],
  category: "stalker",
  desc: "Get full information of a group by group chat invitation link."
});

exports.getCommand = async (text, anyaV2, pika) => {
require("../../config");
const moment = require('moment-timezone');
const { tiny } = require('../lib/stylish-font');
const axios = require("axios");
  if (!text) return pika.reply(`Provide me a gc link to execute this command.`);
  if (!text.includes("https://chat.whatsapp.com/")) return pika.reply("Not a valid WhatsApp's group link.");
  await pika.react("🔯");
  const wait = await anyaV2.sendMessage(pika.chat, { text: message.wait }, { quoted: pika });
  try {
    const groupId = text.split("https://chat.whatsapp.com/")[1];
    const gcstalk = await anyaV2.groupGetInviteInfo(groupId);
    let groupp = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
    try {
      groupp = await anyaV2.profilePictureUrl(gcstalk.id, 'image');
    } catch (e) {
     await anyaV2.sendMessage(pika.chat, {
         text: "❌ Can't fetch this link.",
         edit: wait.key
        });
    }
    const adminList = gcstalk.participants.filter(v => v.admin !== null);
    const nonAdminList = gcstalk.participants.filter(pika => pika.admin == null);
    const adminParticipants = adminList.map(admin => `👑 @${admin.id.split("@")[0]}`).join('\n');
    const nonAdminParticipants = nonAdminList.map(mem => `👤 @${mem.id.split("@")[0]}`).join('\n');
    const participantsList = `\`\`\`You May Know:\`\`\`\n${adminParticipants}\n${nonAdminParticipants}`;
    const description = `\`\`\`📍 Description:\`\`\`\n${gcstalk.desc}`;
    const creationTime = gcstalk.creation ? moment(gcstalk.creation * 1000).tz(global.timezone).format('DD/MM/YYYY HH:mm:ss') : "not available.";
    const context  = {
      image: await getBuffer(groupp),
      caption: `*📌 ${tiny("Name")}:* ${gcstalk.subject}\n\n`
        + `*🎐 ${tiny("Owner")}:* ${gcstalk.owner ? "@" + gcstalk.owner.split("@")[0] : 'Not provided'}\n`
        + `*👥 ${tiny("Participants")}:* ${gcstalk.size}\n`
        + `*🧧 ${tiny("Created On")}:* ${creationTime.split(" ")[0]}\n`
        + `*└─ ${tiny("Time")}:* ${creationTime.split(" ")[1]}\n\n`
        + '-------------------------------------->\n\n'
        + `${gcstalk.participants.length !== 0 ? participantsList + '\n-------------------------------------->\n\n' : ""}`
        + description,
      headerType: 4,
      mentions: gcstalk.participants.map(a => a.id).concat([gcstalk.owner ? gcstalk.owner : '918811074852@s.whatsapp.net'])
    };
    await anyaV2.sendMessage(pika.chat, context, { quoted: pika });
  } catch {
    return anyaV2.sendMessage(pika.chat, {
     text: "❌ Invalid link or the link has been expired.",
     edit: wait.key
   });
  }
  async function getBuffer(url, options) {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
		    	},
	 		...options,
			responseType: 'arraybuffer'
    	})
   	return res.data
    	} catch (err) {
		return err
 	}
  }
}
