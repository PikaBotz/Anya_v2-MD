module.exports = {
  antiLink: async (userOwner, userSudo, userAdmin, botAdmin, pika, anyaV2) => {
    if (!botAdmin) return pika.reply('```🔗 Antilink detected```\n_Bot is not an admin_');
    if (userOwner || userSudo || userAdmin) return pika.edit('```🔗 Antilink detected```\n_You\'re allowed to send links_');
    pika.deleteMsg(pika.key)
    .then(() => {
      pika.reply(`\`\`\`🔗 Antilink detected\`\`\`\n_Removed user @${pika.sender.split('@')[0]}_`, { mentions: [pika.sender] });
      await anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove');
    });
  },
  antiPicture: async (userOwner, userSudo, userAdmin, botAdmin, pika, anyaV2) => {
    if (!botAdmin) return pika.reply('```📸 Antipic detected```\n_Bot is not an admin_');
    if (userOwner || userSudo || userAdmin) return pika.edit('```📸 Antipic detected```\n_You\'re allowed to send pictures_');
    pika.deleteMsg(pika.key)
    .then(() => {
      pika.reply(`\`\`\`📸 Antipic detected\`\`\`\n_Removed user @${pika.sender.split('@')[0]}_`, { mentions: [pika.sender] });
      await anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove');
    });
  },
  antiVideo: async (userOwner, userSudo, userAdmin, botAdmin, pika, anyaV2) => {
    if (!botAdmin) return pika.reply('```🎥 Antivid detected```\n_Bot is not an admin_');
    if (userOwner || userSudo || userAdmin) return pika.edit('```🎥 Antivid detected```\n_You\'re allowed to send videos_');
    pika.deleteMsg(pika.key)
    .then(() => {
      pika.reply(`\`\`\`🎥 Antivid detected\`\`\`\n_Removed user @${pika.sender.split('@')[0]}_`, { mentions: [pika.sender] });
      await anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove');
    });
  },
  antiToxic: async (userOwner, userSudo, userAdmin, botAdmin, pika, anyaV2) => {
    if (!botAdmin) return pika.reply('```☣️ Abusement detected```\n_Bot is not an admin_');
    if (userOwner || userSudo || userAdmin) return pika.edit('```☣️ Abusement detected```\n_Watch your mouth baby_');
    pika.deleteMsg(pika.key)
    .then(() => {
      pika.reply(`\`\`\`☣️ Abusement detected\`\`\`\n_Removed user @${pika.sender.split('@')[0]}_`, { mentions: [pika.sender] });
      await anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove');
    });
  }
}
