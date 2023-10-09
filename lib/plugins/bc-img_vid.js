exports.cmdName = () => {
  return {
    name: ['bcimg','bcvid'],
    alias: ['bcimage','bcpic','bcvideo','broadcastvideo','broadcastimage'],
    category: "owner",
    desc: "Broadcast media like image and video."
  };
}

exports.getCommand = async (text, mime, userOwner, userSudo, groupMetadata, anyaV2, pika, storage) => {
require('../../config');
   const { tiny } = require('../lib/stylish-font');
   const { getBuffer, sleep } = require('../lib/myfunc');
   if (!userOwner && !userSudo) return pika.reply(message.owner);
   if (!/image/.test(mime) && !/video/.test(mime)) return pika.reply(`Please tag or reply with a image or video with a caption to broadcast`);
   const broadCastTo = (!pika.isGroup)
                           ? storage.chats.all().filter(v => v.id.endsWith('.net') || v.id.endsWith('.us')).map(v => v.id)
                           : groupMetadata.participants.map(v => v.id);
   if (!pika.isGroup && broadCastTo.length < 3) return pika.reply(`Only *${broadCastTo.length}* users are using this bot, can't broadcast.`);
    const response = await anyaV2.sendMessage(pika.chat, {
          text: `\`\`\`Broadcasting in ${broadCastTo.length} chats...\`\`\``,
         }, { quoted: pika }); 
       const broadCaption = `*🔖 Broadcast By:* @${pika.sender.split("@")[0]}\n
*✍🏻 Message:* ${pika.quoted ? (pika.quoted.text.length > 1 ? pika.quoted.text : 'Empty message') : (text ? text : 'Empty message')}\n
${tiny(footer)}`;
       const mediaToBroad = await anyaV2.downloadAndSaveMediaMessage(pika.quoted ? pika.quoted : pika);
       const broadLogo = await getBuffer('https://i.ibb.co/s92mHfj/2.png');
              if (/image/.test(mime)) {
               var sendMedia = {
                              image: { url: mediaToBroad },
                              caption: broadCaption,
                              headerType: 4,
                              mentions: [pika.sender],
                              contextInfo:{
                                mentionedJid: [pika.sender],
                                externalAdReply:{                              
                                           showAdAttribution: true,
                                           "title": `⌈ ${pika.pushName}'s Broadcast ⌋`,
                                           body: `✅ Picture broadcast done!`,
                                           "thumbnail": broadLogo,
                                           mediaType: 2,
                                           mediaUrl: `https://wa.me/${pika.sender.split("@")[0]}?text=Hello%20Senpai`,
                                           sourceUrl: `https://wa.me/${pika.sender.split("@")[0]}?text=Hello%20Senpai`
                                          }
                                       } 
                                    }
                                } else
 if (/video/.test(mime)) {
  var sendMedia = {
         video: { url: mediaToBroad },
         caption: broadCaption,
         headerType: 4,
         mentions: [pika.sender],
          contextInfo:{
           mentionedJid: [pika.sender],
               externalAdReply:{                              
               showAdAttribution: true,
               title: `⌈ ${pika.pushName}'s Broadcast ⌋`,
               body: `✅ Picture broadcast done!`,
               thumbnail: broadLogo,
               mediaType: 4,
               mediaUrl: `https://wa.me/${pika.sender.split("@")[0]}?text=Hello%20Senpai`,
               sourceUrl: `https://wa.me/${pika.sender.split("@")[0]}?text=Hello%20Senpai`
                                          }
                                       } 
                                    }
                                } else {
                                return pika.reply('Invalid media type.');
                              }
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







/*
*/