exports.cmdName = () => {
  return {
    name: ['gcinfo'],
    alias: ['groupinfo','gcstalk'],
    category: "stalker",
    desc: "Get full information of a group by group chat invitation link."
  };
}

exports.getCommand = async (text, anyaV2, pika) => {
   const moment = require('moment-timezone');
   const { tiny } = require('../lib/stylish-font');
   const { getBuffer } = require('../lib/myfunc');
   if (!text) return pika.reply(`Provide me a gc link to exicute this command.`);
  try {
   const gcstalk = await anyaV2.groupGetInviteInfo(text.split("https://chat.whatsapp.com/")[1]);
     try {
   var groupp = await anyaV2.profilePictureUrl(gcstalk.id, 'image');
  } catch (e) {
   var groupp = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
  }
   let participantsList = "";
   for (let admins of gcstalk.participants.filter(v => v.admin !== null)) {
  participantsList += `👑 @${admins.id.split("@")[0]}\n`;
    }
  for (let mems of gcstalk.participants.filter(pika => pika.admin == null)) {
  participantsList += `👤 @${mems.id.split("@")[0]}\n`;
 }
  const description = `\n\`\`\`📍 Description:\`\`\`\n${gcstalk.desc}`;
  await anyaV2.sendMessage(pika.chat, {
       image: await getBuffer(groupp),
       caption: `*📌 ${tiny("Name")}:* ${gcstalk.subject}\n\n`
              + `*🎐 ${tiny("Owner")}:* @${gcstalk.owner ? gcstalk.owner.split("@")[0] : 'Not provided'}\n`
              + `*👥 ${tiny("Participants")}:* ${gcstalk.size}\n`
              + `*🧧 ${tiny("Created On")}:* ${gcstalk.creation ? moment(gcstalk.creation * 1000).tz(global.timezone).format('DD/MM/YYYY HH:mm:ss').split(" ")[0] : "not provided."}\n`
              + `*└─ ${tiny("Time")}:* ${gcstalk.creation ? moment(gcstalk.creation * 1000).tz(global.timezone).format('DD/MM/YYYY HH:mm:ss').split(" ")[1] : "not provided."}\n\n`
              + '-------------------------------------->\n\n'
              + `\`\`\`Some Participants:\`\`\`\n${participantsList}\n-------------------------------------->\n${description}`,
       headerType: 4,
       mentions: gcstalk.participants.map(a => a.id).concat([gcstalk.owner ? gcstalk.owner : '918811074852@s.whatsapp.net'])
      }, { quoted: pika }); 
    } catch {
     return pika.reply('Invalid link or the link has been expired.');
    }
  }



