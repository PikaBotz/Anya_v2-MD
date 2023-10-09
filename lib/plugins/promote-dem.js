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
    name: ['promote','demote'],
    alias: ['prom','dem'],
    category: "admin",
    desc: "Group promotion or demotion actions."
  };
}

exports.getCommand = async (args, botAdmin, userAdmin, userOwner, userSudo, text, groupMetadata, command, anyaV2, pika) => {
require('../../config');
 if (!botAdmin) return pika.reply(message.botAdmin);
  await pika.react("👥");
  if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);
  if (!text && !pika.quoted) return pika.reply("Provide me a number.");
  const user = (args[0] === 'numBut')
            ? args[1] + '@s.whatsapp.net'
            : pika.quoted
            ? pika.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    const participant = await groupMetadata.participants;
    const participants = groupMetadata.participants
                  .filter(item => item.admin === 'admin')
                  .map(item => item.id);
 switch (command) {
 case 'promote':
 case 'prom':
    if (participants.includes(user)) return pika.reply("Already a admin!");
    if (!participant.map((a) => a.id).includes(user)) return pika.reply("Doesn't exist in this group.");
    await anyaV2.groupParticipantsUpdate(pika.chat, [user], 'promote')
       .catch((err) => {
       return pika.reply(`Failed to promote this user in this group! ⚠️`);
      });
    pika.reply(message.success);
 break;
 case 'demote':
 case 'dem':
    if (!participants.includes(user)) return pika.reply("Already a member!");
    if (!participant.map((a) => a.id).includes(user)) return pika.reply("Doesn't exist in this group.");
    await anyaV2.groupParticipantsUpdate(pika.chat, [user], 'demote')
       .catch((err) => {
       return pika.reply(`Failed to demote this user in this group! ⚠️`);
      });
    pika.reply(message.success);
 break
 
     }
    }
      
      
      
