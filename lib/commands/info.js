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
  return [
         'information',
         'info'
  ];
}

async function getCommand(reply, isCreator, isSudo, isAdmins) {
require('../../config');
  const os = require('os');
  const speed = require('performance-now');
  const latensi = speed() - speed();
  const _system = require('../database/_system.json');
  const _groupData = m.isGroup ? require('../database/groups/' + m.chat + '.json') : null;
  const { formatp, runtime } = require('../lib/myfunc.js');
  const botVersion = require('../../package.json').version;
  let txt = "*>>> 👤 _USER INFO_*\n";
  txt += `*🎀 Name :* ${m.pushName}\n`;
  txt += `*🔮 Num :* @${m.sender.split('@')[0]}\n`;
  txt += `*🎐 Owner? :* ${isCreator? "Yes":"Nope"}\n`;
  txt += `*📍 Sudo? :* ${isSudo? "Yes":"Nope"}\n`;
  txt += !m.isGroup ? "*🎗️ Role :* Private Chat\n\n" : `*🎗️ Role :* ${isAdmins? "Admin 👑️":"Member 👤"}\n\n`;
  txt += "*>>> 🤖 _BOT INFO_*\n";
  txt += `❲❒❳ *Name :* ${botname}\n`;
  txt += `❲❒❳ *Version :* ${botVersion}\n`;
  const botMode = _system[0]._mode.self ? "Self" : _system[0]._mode.only_admin ? "Only Admin ✓" : "Public ✓✓";
  txt += `❲❒❳ *Mode :* ${botMode}\n`;
  txt += `❲❒❳ *RAM :* _${formatp(os.totalmem() - os.freemem())}/${formatp(os.totalmem())}_\n`;
  txt += `❲❒❳ *Speed : _${latensi.toFixed(4)}sec_*\n`;
  txt += `❲❒❳ *Runtime :* _${runtime(process.uptime())}_\n`;
  txt += `❲❒❳ *Platform :* ${os.platform()}.com\n`;
  txt += `❲❒❳ *Platform ID :* ${os.hostname()}\n\n`;
  txt += "*>>> ⚜️ _GROUP DATA_*\n";
  if (!m.isGroup) {
    txt += "⚠️ Group data not found in a private chat!\n";
  } else {
    const groupData = _groupData[0].data;
    const links = _groupData[0].links;
    txt += `*» NSFW : ${groupData.is_Nsfw ? '✅' : '❌'}*\n`;
    txt += `*» Anti Virus : ${groupData.anti_Virtex ? '✅' : '❌'}*\n`;
    txt += `*» Anti Toxic : ${groupData.anti_Toxic ? '✅' : '❌'}*\n`;
    txt += `*» Anti Video : ${groupData.anti_Video ? '✅' : '❌'}*\n`;
    txt += `*» Anti Pic : ${groupData.anti_Picture ? '✅' : '❌'}*\n`;
    txt += `*» Anti Link All : ${links.anti_LinkAll ? '✅' : '❌'}*\n`;
  }
reply(txt);
return txt;
}
module.exports = { getCommand, cmdName };
