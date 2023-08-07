/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Management: (@teamolduser)

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

function cmdName() {
  return ['chatbot'];
}

// Enc code of Anticall command
(function(_0x88e2b,_0x4288a5){const _0x3ca168=_0x422b,_0xdb1db5=_0x88e2b();while(!![]){try{const _0x1e4c4e=parseInt(_0x3ca168(0x75))/0x1*(-parseInt(_0x3ca168(0x77))/0x2)+-parseInt(_0x3ca168(0x6f))/0x3+parseInt(_0x3ca168(0x6b))/0x4*(-parseInt(_0x3ca168(0x7b))/0x5)+-parseInt(_0x3ca168(0x7c))/0x6+-parseInt(_0x3ca168(0x6d))/0x7*(-parseInt(_0x3ca168(0x7a))/0x8)+-parseInt(_0x3ca168(0x6e))/0x9*(parseInt(_0x3ca168(0x78))/0xa)+parseInt(_0x3ca168(0x71))/0xb;if(_0x1e4c4e===_0x4288a5)break;else _0xdb1db5['push'](_0xdb1db5['shift']());}catch(_0x5a87e6){_0xdb1db5['push'](_0xdb1db5['shift']());}}}(_0x2a7d,0xf0a51));function _0x422b(_0x5ef8d3,_0x3f4435){const _0x2a7df3=_0x2a7d();return _0x422b=function(_0x422b7c,_0x2af524){_0x422b7c=_0x422b7c-0x68;let _0x3b5f8e=_0x2a7df3[_0x422b7c];return _0x3b5f8e;},_0x422b(_0x5ef8d3,_0x3f4435);}function _0x2a7d(){const _0x3c6ce4=['84714RLKgqT','46179ofNCaK','2328417fokkYl','writeFileSync','52928370sbxxJB','Already\x20On!','off','reply','1549391acoJXx','Type\x20*','2AkuNpJ','2290HTbwNM','owner','680swaAGI','12795eXOLEU','6266946wWpXmm','_settings','path','chatbot','success','stringify','\x20on/off*','Already\x20Off!','484DPRRkS','database'];_0x2a7d=function(){return _0x3c6ce4;};return _0x2a7d();}async function getCommand(_0x2a9997,_0x35e6c3,_0x388b13,_0x3fbc8d,_0x2793ee,_0x4a0d46){const _0xe294f3=_0x422b,_0x2491f3=!![],_0xef9e=require('fs'),_0x5d1536=require(_0xe294f3(0x7e)),_0x18436c=_0x5d1536['join'](__dirname,'..',_0xe294f3(0x6c),'_system.json');if(!_0x2a9997&&!_0x35e6c3)return m[_0xe294f3(0x74)](mess[_0xe294f3(0x79)]);let _0x42fa4b=require(_0x18436c);const _0x39e0b4=_0x42fa4b[0x0][_0xe294f3(0x7d)];if(_0x388b13[0x0]==='on'){if(_0x39e0b4[_0xe294f3(0x7f)])return m[_0xe294f3(0x74)](_0xe294f3(0x72));_0x39e0b4[_0xe294f3(0x7f)]=!![];}else{if(_0x388b13[0x0]===_0xe294f3(0x73)){if(!_0x39e0b4[_0xe294f3(0x7f)])return m[_0xe294f3(0x74)](_0xe294f3(0x6a));_0x39e0b4['chatbot']=![];}else{m[_0xe294f3(0x74)](_0xe294f3(0x76)+(_0x3fbc8d+_0x2793ee)+_0xe294f3(0x69));return;}}m['reply'](mess[_0xe294f3(0x80)]),_0xef9e[_0xe294f3(0x70)](_0x18436c,JSON[_0xe294f3(0x68)](_0x42fa4b)),_0x2491f3?_0x4a0d46('✅'):null;}

async function funcChatBot(budy, isCmd) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, '..', 'database', '_system.json');
  const _system = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const axios = require('axios');
  if (!_system[0]._prefix.allPrefix && !isCmd && !m.isGroup) {
    try {
      const chatBot = await axios.get(`http://api.brainshop.ai/get?bid=172502&key=ru9fgDbOTtZOwTjc&uid=[uid]&msg=${encodeURIComponent(budy)}`);
      m.reply(chatBot.data.cnt);
    } catch (err) {
      console.error('Error calling the chatbot API:', err);
    }
  }
}

module.exports = { cmdName, getCommand, funcChatBot };
