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
    if (userOwner || userSudo || userAdmin) return pika.reply('```🔗 Antilink detected```\n_You\'re allowed to send links_');
    pika.deleteMsg(pika.key)
    .then(() => {
      pika.reply(`\`\`\`🔗 Antilink detected\`\`\`\n_Removed user @${pika.sender.split('@')[0]}_`, { mentions: [pika.sender] });
      anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove');
    }).catch((error) => console.error(error));
  },
  antiPicture: async (userOwner, userSudo, userAdmin, botAdmin, pika, anyaV2) => {
    if (!botAdmin) return pika.reply('```📸 Antipic detected```\n_Bot is not an admin_');
    if (userOwner || userSudo || userAdmin) return pika.reply('```📸 Antipic detected```\n_You\'re allowed to send pictures_');
    pika.deleteMsg(pika.key)
    .then(() => {
      pika.reply(`\`\`\`📸 Antipic detected\`\`\`\n_Removed user @${pika.sender.split('@')[0]}_`, { mentions: [pika.sender] });
      anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove');
    }).catch((error) => console.error(error));
  },
  antiVideo: async (userOwner, userSudo, userAdmin, botAdmin, pika, anyaV2) => {
    if (!botAdmin) return pika.reply('```🎥 Antivid detected```\n_Bot is not an admin_');
    if (userOwner || userSudo || userAdmin) return pika.reply('```🎥 Antivid detected```\n_You\'re allowed to send videos_');
    pika.deleteMsg(pika.key)
    .then(() => {
      pika.reply(`\`\`\`🎥 Antivid detected\`\`\`\n_Removed user @${pika.sender.split('@')[0]}_`, { mentions: [pika.sender] });
      anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove');
    }).catch((error) => console.error(error));
  },
  antiToxic: async (userOwner, userSudo, userAdmin, botAdmin, pika, anyaV2) => {
    if (!botAdmin) return pika.reply('```☣️ Abusement detected```\n_Bot is not an admin_');
    if (userOwner || userSudo || userAdmin) return pika.reply('```☣️ Abusement detected```\n_Watch your mouth baby_');
    pika.deleteMsg(pika.key)
    .then(() => {
      pika.reply(`\`\`\`☣️ Abusement detected\`\`\`\n_Removed user @${pika.sender.split('@')[0]}_`, { mentions: [pika.sender] });
      anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove');
    }).catch((error) => console.error(error));
  }
}
