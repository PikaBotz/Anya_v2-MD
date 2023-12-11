module.exports = {
  cmdName: () => ({
    name: ['mods'],
    alias: ['modlist'],
    category: 'general',
    react: '👥',
    desc: 'List of mods'
  }),
  getCommand: async (pika,anyaV2, bot) => {
    const Config = require('../../config');
    if (bot.modlist.length === 0) return pika.reply(`_No mods yet!_`);
    let text = `\`\`\`⌈ Mod Users List ⌋\`\`\`\n\n_*REPLY A NUMBER TO REMOVE*_\n\n*>>>* _👑 @${Config.ownernumber}_\n`;
    let i = 1;
    for (const mod of bot.modlist) {
      text += `_${i}. @${mod.split('@')[0]}_\n`;
      i++;
    }
    text += `\n${Config.footer}\n_ID: QA19_`;
    anyaV2.sendMessage(pika.chat, {
      text: text,
      contextInfo: {
       mentionedJid: [...bot.modlist, Config.ownernumber + '@s.whatsapp.net'],
        externalAdReply: {
          title: Config.botname,
          body: Config.ownername,
          thumbnail: Config.image_2,
         // sourceUrl: 'https://github.com/PikaBotz/Anya_v2-MD',
         // mediaUrl: 'https://github.com/PikaBotz/Anya_v2-MD'
        }
      }
    }, { quoted: pika });
  }
}
