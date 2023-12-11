module.exports = {
  cmdName: () => ({
    name: ['admins'],
    alias: ['adminlist','admin'],
    category: 'group',
    react: '👥',
    need: 'text',
    desc: 'This plugins shows the list of admins in a group chat.'
  }),
  getCommand: async (anyaV2, pika, groupMetadata, prefix, command, text) => {
    const Config = require('../../config');
    if (!pika.isGroup) return pika.reply(Config.message.group);
    if (!text && !pika.quoted) return pika.reply(`Tell me a valid reasone to tag admins.\n\n*Example:* ${prefix + command} <reason>`);
    let media;
    const message = [];
    message.push(`*⛩️ Message :* ${pika.quoted ? (pika.quoted.text.length > 1 ? pika.quoted.text : 'Empty message') : (text ? text : 'Empty message')}\n\n*🎏 Announcer :* @${pika.sender.split('@')[0]}\n\n╭─⌈ 𝘼𝙙𝙢𝙞𝙣𝙨 ⌋`);
    for (let i of groupMetadata.participants.filter(v => v.admin !== null)) {
      message.push(`👑» @${i.id.split('@')[0]}`);
    }
    const contextInfo = {
      mentionedJid: groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id),
      externalAdReply: {
        title: groupMetadata.subject,
        body: Config.botname + ' is tagging admins',
        thumbnail: Config.image_2,
      }
    };
    const quoted = pika.quoted ? pika.quoted : '';
    const mime = (quoted && quoted.mimetype) ? quoted.mimetype : '';
    if (/image/.test(mime)) {
      await anyaV2.sendMessage(pika.chat, { image: await quoted.download(), caption: message.join('\n'), contextInfo: contextInfo }, { quoted: pika }); 
    } else if (/video/.test(mime)) {
      await anyaV2.sendMessage(pika.chat, { video: await quoted.download(), caption: message.join('\n'), contextInfo: contextInfo }, { quoted: pika });
    } else {
      await anyaV2.sendMessage(pika.chat, { text: message.join('\n'), contextInfo: contextInfo }, { quoted: pika });
    }
  }
}