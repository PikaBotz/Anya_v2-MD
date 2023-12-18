const { anya } = require('../lib');

anya({
  name: [
    "bcaud"
  ],
  alias: [
    "bcaudio",
    "broadcastaudio",
    "bcvn"
  ],
  category: "owner",
  desc: "Broadcast music, audio or voice notes.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, mime, userOwner, userSudo, groupMetadata, anyaV2, pika, storage) => {
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
            title: `⌈ ${pika.pushName}'s Broadcast ⌋`,
            body: `✅ Audio broadcast done!`,
            thumbnail: broadLogo,
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
  });
