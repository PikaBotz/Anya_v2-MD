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
    name: ['setgroup'],
    alias: ['groupset'],
    category: "admin",
    desc: "To make group public and private."
  };
}

exports.getCommand = async (args, prefix, command, botAdmin, userAdmin, userOwner, userSudo, anyaV2, pika) => {
  try {
    if (!pika.isGroup) return pika.reply(message.group);
    if (!botAdmin) return pika.reply(message.botAdmin);
    if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);
    if (args[0] === "off" || args[0] === "close") {
      await anyaV2.groupSettingUpdate(pika.chat, "announcement");
      pika.reply("✅ Successfully closed this group.");
    } else if (args[0] === "on" || args[0] === "open") {
      await anyaV2.groupSettingUpdate(pika.chat, "not_announcement");
      pika.reply("☑️ Successfully opened this group.");
    } else {
      pika.reply("Please type *" + prefix + command + " open/close*");
    }
  } catch (err) {
    pika.reply(message.error); 
  }
}
    
                    


