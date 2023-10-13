exports.cmdName = () => ({
  name: ['invite', 'add', 'remove'],
  alias: [],
  category: "admin",
  desc: "Group promotion actions."
});

exports.getCommand = async (args, botAdmin, userAdmin, userOwner, userSudo, text, groupMetadata, command, anyaV2, pika) => {
  require('../../config');
  if (!pika.isGroup) return pika.reply(message.group);
  if (!botAdmin) return pika.reply(message.botAdmin);
  if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);
  if (!text && !pika.quoted) return pika.reply("Provide me a number.");
  await pika.react("👥");
  const user = (args[0] === 'numBut')
    ? args[1] + '@s.whatsapp.net'
    : pika.quoted
      ? pika.quoted.sender
      : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
switch (command) {
 case 'invite':
  if (groupMetadata.participants.map((a) => a.id).includes(user)) return pika.reply('This user is already been added in this group.');
  const getLink = await anyaV2.groupInviteCode(pika.chat);
  try {
  var groupp = await anyaV2.profilePictureUrl(pika.chat, 'image');
  } catch (e) {
  var groupp = "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg";
  }  
  await anyaV2.sendMessage(user, {
      text: `\`\`\`🎉🎊 Group Invitation\`\`\`\n   *- By @${pika.sender.split("@")[0]}*`,
      mentions: [pika.sender],
      contextInfo:{
      mentionedJid: [pika.sender],
        "externalAdReply": {
        "showAdAttribution": false,
        "title": groupMetadata.subject, 
        "containsAutoReply": false,
        "mediaType": 1, 
        "thumbnail": await getBuffer(groupp),
        "mediaUrl": `https://chat.whatsapp.com/${getLink}`,
        "sourceUrl": `https://chat.whatsapp.com/${getLink}`
        }
     }
   },
  { quoted: pika }
 );
  anyaV2.sendMessage(pika.chat, {
         text: `✅ Sent invitation to *@${user.split("@")[0]}*`,
         mentions: [user] },
         { quoted: pika });
 break;
 case 'add':
  if (groupMetadata.participants.map((a) => a.id).includes(user)) return pika.reply('This user is already been added in this group.');
  await anyaV2.groupParticipantsUpdate(pika.chat, [user], 'add')           
      .catch((err) => pika.reply(`⚠️ Cannot add this user in this group!`));
   anyaV2.sendMessage(pika.chat, {
         text: `Added *@${user.split("@")[0]}* by *@${pika.sender.split("@")[0]}*`,
         mentions: [user, pika.sender] },
         { quoted: pika });
  break;
  case 'remove':
   if (!groupMetadata.participants.map((a) => a.id).includes(user)) return pika.reply('User not found in this group chat.');
  await anyaV2.groupParticipantsUpdate(pika.chat, [user], 'remove')           
      .catch((err) => pika.reply(`⚠️ Cannot remove this user in this group!`));
   anyaV2.sendMessage(pika.chat, {
         text: `Removed *@${user.split("@")[0]}* by *@${pika.sender.split("@")[0]}*`,
         mentions: [user, pika.sender] },
         { quoted: pika });
  break;
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
