/**
   * @all
   * @param userOwner, the user is owner? true : false
   * @param userSudo, the user is co-owner? true : false
   * @param userAdmin, the user is group admin? true : false
   * @param botAdmin, the bot is group admin? true : false
   * @param pika, chatUpdate or shortcut module of anyaV2 connection module
   * @param anyaV2 connection module
   * {@creator: https://github.com/PikaBotz}
   **/
module.exports = {
  antiLink: async (userOwner, userSudo, userAdmin, botAdmin, pika, anyaV2) => {
    if (!botAdmin) return pika.reply('```🔗 Antilink detected```\n_Bot is not an admin_');
    if (userOwner || userSudo || userAdmin) {
      pika.reply('```🔗 Antilink detected```\n_You\'re allowed to send links_');
      return false;
    }
    pika.deleteMsg(pika.key)
    .then(() => {
      pika.reply(`\`\`\`🔗 Antilink detected\`\`\`\n_Removed user @${pika.sender.split('@')[0]}_`, { mentions: [pika.sender] });
      anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove');
    }).catch((error) => console.error(error));
  },
  antiPicture: async (userOwner, userSudo, userAdmin, botAdmin, pika, anyaV2) => {
    if (!botAdmin) return pika.reply('```📸 Antipic detected```\n_Bot is not an admin_');
    if (userOwner || userSudo || userAdmin) {
      pika.reply('```📸 Antipic detected```\n_You\'re allowed to send pictures_');
      return false;
    }
    pika.deleteMsg(pika.key)
    .then(() => {
      pika.reply(`\`\`\`📸 Antipic detected\`\`\`\n_Removed user @${pika.sender.split('@')[0]}_`, { mentions: [pika.sender] });
      anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove');
    }).catch((error) => console.error(error));
  },
  antiVideo: async (userOwner, userSudo, userAdmin, botAdmin, pika, anyaV2) => {
    if (!botAdmin) return pika.reply('```🎥 Antivid detected```\n_Bot is not an admin_');
    if (userOwner || userSudo || userAdmin) {
      pika.reply('```🎥 Antivid detected```\n_You\'re allowed to send videos_');
      return false;
    }
    pika.deleteMsg(pika.key)
    .then(() => {
      pika.reply(`\`\`\`🎥 Antivid detected\`\`\`\n_Removed user @${pika.sender.split('@')[0]}_`, { mentions: [pika.sender] });
      anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove');
    }).catch((error) => console.error(error));
  },
  antiToxic: async (userOwner, userSudo, userAdmin, botAdmin, pika, anyaV2) => {
    if (!botAdmin) return pika.reply('```☣️ Abusement detected```\n_Bot is not an admin_');
    if (userOwner || userSudo || userAdmin) {
      pika.reply('```☣️ Abusement detected```\n_Watch your mouth baby_');
      return false;
    }
    pika.deleteMsg(pika.key)
    .then(() => {
      pika.reply(`\`\`\`☣️ Abusement detected\`\`\`\n_Removed user @${pika.sender.split('@')[0]}_`, { mentions: [pika.sender] });
      anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove');
    }).catch((error) => console.error(error));
  },
  antiCall: async (event, anyaV2, Config) => {
    const data = {};
    const callerId = event.content[0].attrs["call-creator"];
    if (data[callerId.split('@')[0]] && data[callerId.split('@')[0]].caller) return;
//    const vcard = await anyaV2.sendContact(callerId, [Config.ownernumber]);
    await anyaV2.sendMessage(callerId, { image: Config.image_2, caption: `\`\`\`Hey @${callerId.split('@')[0]}\`\`\`\n\nCalling on this number is not allowed, Please contact my owner @${Config.ownernumber} to get unblocked.\n\n*Tap here :* wa.me/${Config.ownernumber}`, mentions: [callerId, Config.ownernumber + '@s.whatsapp.net'] }, /*{ quoted: vcard }*/);
    setTimeout(async () => {
     await anyaV2.updateBlockStatus(callerId, 'block');
     setTimeout(async () => {
      await anyaV2.sendMessage(Config.ownernumber + '@s.whatsapp.net', { text: `I blocked @${callerId.split('@')[0]} because they were calling me!\n\n*Caller :* wa.me/${callerId.split('@')[0]}`, mentions: [callerId] });
     }, 1000);
    }, 5000);
   data[callerId.split('@')[0]] = { caller: true };
  }
}
