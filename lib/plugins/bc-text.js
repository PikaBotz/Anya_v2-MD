exports.cmdName = () => {
  return {
    name: ['bctext'],
    alias: ['broadcasttext','bctxt'],
    category: "owner",
    desc: "Broadcast text message."
  };
}

exports.getCommand = async (text, userOwner, userSudo, groupMetadata, anyaV2, pika, storage) => {
require('../../config');
   const { tiny } = require('../lib/stylish-font');
   const { getBuffer, sleep } = require('../lib/myfunc');
   if (!userOwner && !userSudo) return pika.reply(message.owner);
   if (!text) return pika.reply('Please enter a text to broadcast.');
   const broadCastTo = (!pika.isGroup)
                           ? storage.chats.all().filter(v => v.id.endsWith('.net') || v.id.endsWith('.us')).map(v => v.id)
                           : groupMetadata.participants.map(v => v.id);
   if (!pika.isGroup && broadCastTo.length < 3) return pika.reply(`Only *${broadCastTo.length}* users are using this bot, can't broadcast.`);
    const response = await anyaV2.sendMessage(pika.chat, {
          text: `\`\`\`Broadcasting in ${broadCastTo.length} chats...\`\`\``,
         }, { quoted: pika }); 
       const broadCaption = `*🔖 Broadcast By:* @${pika.sender.split("@")[0]}\n
*✍🏻 Message:* ${text}\n
${tiny(footer)}`;
       const broadLogo = await getBuffer('https://i.ibb.co/s92mHfj/2.png');
               var sendMedia = {
                              text: broadCaption,
                              mentions: [pika.sender],
                              contextInfo:{
                                mentionedJid: [pika.sender],
                                externalAdReply:{                              
                                           showAdAttribution: true,
                                           "title": `⌈ ${pika.pushName}'s Broadcast ⌋`,
                                           body: `✅ Text broadcast done!`,
                                           "thumbnail": broadLogo,
                                           mediaType: 2,
                                           mediaUrl: `https://wa.me/${pika.sender.split("@")[0]}?text=Hello%20Senpai`,
                                           sourceUrl: `https://wa.me/${pika.sender.split("@")[0]}?text=Hello%20Senpai`
                                          }
                                       } 
                                    }
   for (const broad of broadCastTo) {
    await anyaV2.sendMessage(broad, { ...sendMedia }, { quoted: pika });
    await sleep(500);
    }
      await anyaV2.sendMessage(pika.chat, {
      text: message.success,
      edit: response.key,
    });
   }






