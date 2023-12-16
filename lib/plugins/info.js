module.exports = {
    cmdName: () => ({
       name: ['system'],
       alias: ['information','info','stats'],
       category: 'core',
       react: '💻',
       desc: "Get real time stats of the bot."
    }),
     getCommand: async (pika) => {
        pika.reply('😢 This command is currently shutted down for a reason.');
     }
}

/*
exports.cmdName = () => {
  return {
    name: ['system'],
    alias: ['information','info','stats'],
    category: "general",
    desc: "Get real time stats of the bot."
  };
}

exports.getCommand = async (userOwner, userSudo, userAdmin, anyaV2, pika) => {
require('../../config');
  const os = require('os');
  const speed = require('performance-now');
  const latensi = speed() - speed();
  const _system = require('../database/_system.json');
  const _groupData = pika.isGroup ? require('../database/groups/' + pika.chat + '.json') : null;
  const { formatp, runtime, sleep, loadMsg_1 } = require('../lib/myfunc.js');
  const botVersion = require('../../package.json').version;
  let txt = "*>>> 👤 _USER INFO_*\n";
  txt += `*🎀 Name :* ${pika.pushName}\n`;
  txt += `*🔮 Num :* @${pika.sender.split('@')[0]}\n`;
  txt += `*🎐 Owner? :* ${userOwner? "Yes":"Nope"}\n`;
  txt += `*📍 Sudo? :* ${userSudo? "Yes":"Nope"}\n`;
  txt += !pika.isGroup ? "*🎗️ Role :* Private Chat\n\n" : `*🎗️ Role :* ${userAdmin? "Admin 👑️":"Member 👤"}\n\n`;
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
  if (!pika.isGroup) {
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
  await pika.react("💻");
  await loadMsg_1(
                  anyaV2,
                  `🚫 \`\`\`Getting...\`\`\``, // Loading start msg
                  '```Investigating...```', // Running msg
                  '✅ Ready!', // Load done msg
                  txt,
                  sleep
                 );
               }
  
  
  await editMsg(
          '🔄 Investing...',
          true,
          2000,
          txt,
          [pika.sender],
          anyaV2,
          sleep
      );
  }*/



