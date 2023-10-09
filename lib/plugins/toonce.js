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
    name: ['toonce'],
    alias: ['toviewonce','tonce'],
    category: "convert",
    desc: `Convert media into once veiw message.`
  };
}

exports.getCommand = async (mime, text, anyaV2, pika) => {
require('../../config');
    const { unlinkSync } = require('fs');
    const { sleep } = require('../lib/myfunc');
//    if (!) return pika.reply(`Reply or tag a image or video media.`);
    if (!pika.quoted || !/image/.test(mime) && !/video/.test(mime)) return pika.reply('Please tag a image or video media to proceed.');
    const isPromt = true; // true to send tip message | false to don't send tip message 
    const promtMessage = '*Promt:* You can put a message text with command to send in *once view* media.';
    const mediaMess = await anyaV2.downloadAndSaveMediaMessage(pika.quoted);
    const caption = text ? text : null;
    (text) ? null : pika.reply(promtMessage);
    (/image/.test(mime))
    ? await anyaV2.sendMessage(pika.chat, {
            caption: caption,
            image: { url: mediaMess },
            viewOnce: true
            }, { quoted: pika })
    : await anyaV2.sendMessage(pika.chat, {
            caption: caption,
            video: { url: mediaMess },
            viewOnce: true
            }, { quoted: pika });
    await sleep(1000);
    unlinkSync(mediaMess);
    }


 