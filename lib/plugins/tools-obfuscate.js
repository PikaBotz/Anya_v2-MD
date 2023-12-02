module.exports = {
  cmdName: () => ({
    name: ['enc'],
    alias: ['obfuscate'],
    need: 'doc/text',
    react: '🤫',
    category: 'tools',
    desc: 'Encrypt JavaScript code.'
  }),
  getCommand: async (pika, anyaV2, text) => {
    try {
      const dev = require('../.dev');
      const { myfunc } = require('../lib');
      const axios = require('axios');
      const fs = require('fs');
      const quoted = pika.quoted || pika;
      const mime = (quoted.msg || quoted).mimetype || '';
      const fileName = `${myfunc.dayToday().time.replace(/[:.]/g, '_')}${pika.sender.split('@')[0]}`;
      const filePath = `./.temp/${fileName}.js`;
      const Text = pika.quoted ? (pika.quoted.text.length > 1 ? pika.quoted.text : false) : (text ? text : false);
      if (/application/.test(mime)) {
      const filePath2 = `./.temp/${fileName}2.js`;
      const document = await quoted.download();
      const fileContent = document.toString('utf-8');
      fs.writeFileSync(filePath2, fileContent);
      const Code = fs.readFileSync(filePath2, 'utf-8');
        var code = Buffer.from(Code, 'utf-8').toString('base64');
       fs.unlinkSync(filePath2);
      } else if (Text) {
        var code = btoa(Text);
      } else {
      return pika.reply('Tag a javascript file or javascript code text to obfuscate _(encrypt)_');
      }
      const options = { code };
      const config = { headers: { 'Content-Type': 'application/json' } };
      const response = await axios.post(`${dev.api.apiHubRaw}/api/obfuscator.js?key=${dev.api.apiHubKey}`, options, config);
      const { results } = response.data;
      if (results.error) return pika.reply(`❌ There's a syntax error in your provided code, be sure the provided code is *javascript* only.\n\n🎀 ${results.message}`);
      fs.writeFileSync(filePath, results.code);
      anyaV2.sendMessage(pika.chat, {
        document: fs.readFileSync(filePath),
        caption: `✅ Your obfuscated _(encrypted)_ javascript file is ready!\n\n\`\`\`✦» 𝙳𝚊𝚝𝚎 𝚃𝚘𝚍𝚊𝚢 : ${myfunc.dayToday().date}\n✦» 𝚃𝚒𝚖𝚎 𝙽𝚘𝚠 : ${myfunc.dayToday().time}\n✦» 𝚄𝚜𝚎𝚛 : ${pika.pushName}\`\`\``,
        fileName: `🎀 Obfuscated_${myfunc.dayToday().time.replace(/[:.]/g, '_')}.js`,
        mimetype: "application/javascript",
      }, { quoted: pika });
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(error);
      pika.reply('An internal server error occurred, please try again later 🥲');
    }
  }
};
