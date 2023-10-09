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
    name: ['bcaud'],
    alias: ['bcaudio','broadcastaudio','bcvn'],
    category: "owner",
    desc: "Broadcast music, audio or voice notes."
  };
}

exports.getCommand = async (text, mime, userOwner, userSudo, groupMetadata, anyaV2, pika, storage) => {
require('../../config');
   const { tiny } = require('../lib/stylish-font');
   const { getBuffer, sleep } = require('../lib/myfunc');
   if (!userOwner && !userSudo) return pika.reply(message.owner);
   if (!/audio/.test(mime)) return pika.reply(`Please tag or reply with a audio note to broadcast`);
   const broadCastTo = (!pika.isGroup)
                           ? storage.chats.all().filter(v => v.id.endsWith('.net') || v.id.endsWith('.us')).map(v => v.id)
                           : groupMetadata.participants.map(v => v.id);
   if (!pika.isGroup && broadCastTo.length < 3) return pika.reply(`Only *${broadCastTo.length}* users are using this bot, can't broadcast.`);
    const response = await anyaV2.sendMessage(pika.chat, {
          text: `\`\`\`Broadcasting in ${broadCastTo.length} chats...\`\`\``,
         }, { quoted: pika }); 
       const mediaToBroad = await anyaV2.downloadAndSaveMediaMessage(pika.quoted ? pika.quoted : pika);
       const broadLogo = await getBuffer('https://i.ibb.co/s92mHfj/2.png');
       const sendMedia = {
           audio: { url: mediaToBroad },
           mimetype: 'audio/mp4',
           ptt: false,
            contextInfo:{
            externalAdReply:{
            "title": `⌈ ${pika.pushName}'s Broadcast ⌋`,
            body: `✅ Audio broadcast done!`,
            "thumbnail": broadLogo,
            showAdAttribution: true,
            mediaType: 2,
            mediaUrl: 'https://instagram.com/8.08_only_mine',
            sourceUrl: 'https://instagram.com/8.08_only_mine'
                  }
                }
              };
         await sleep(1000);
   for (const broad of broadCastTo) {
    await anyaV2.sendMessage(broad, { ...sendMedia }, { quoted: pika });
    await sleep(500);
    }
      await anyaV2.sendMessage(pika.chat, {
      text: message.success,
      edit: response.key,
    });
    await sleep(100);
    fs.unlinkSync(mediaToBroad);
  }
  
  
  
  
  
 
