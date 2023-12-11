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
    name: ['chatbot'],
    category: "owner",
    alias: ['chatbotstart'],
    desc: "To chat to an AI based chatbot."
  };
}

exports.getCommand = async (prefix, command, userOwner, userSudo, args, budy, anyaV2, pika) => {
require('../../config');
if (command === 'chatbotstart') return await funcChatBot(budy);
    if (!userOwner && !userSudo) return pika.reply(message.owner);
    await pika.react("🤖");
    const { updateSwitch } = require('../lib/mongoDB');
    switch (args[0]) {
      case 'on':
        await updateSwitch('chatbot', true);
        break;
      case 'off':
        await updateSwitch('chatbot', false);
        break;
      default:
        pika.reply(`Type *${command} on/off*`);
        break;
    }
   }

async function funcChatBot(budy) {
 const { getPREFIX, getWORKTYPE } = require('../lib/mongoDB');
 const { get } = require('axios');
  if ((!(await getPREFIX()).all) && (!(await getWORKTYPE()).self)) {
    try {
      const chatBot = await get(`http://api.brainshop.ai/get?bid=172502&key=ru9fgDbOTtZOwTjc&uid=[uid]&msg=${encodeURIComponent(budy)}`);
      pika.reply(chatBot.data.cnt);
    } catch (err) {
      console.error('Error calling the chatbot API:', err);
    }
  }
}

