const Config = require('../../../config');

const welcome = `*@$user* joined this group today as $membersth member.\n
*👤 USER :* @$user
*🪩 STATUS :* $status
*🧩 GROUP :* $group
\n_$prefixdisable welcome to disable this message._`;

const left = `Ex-member *@$user* is no longer available in this group chat.\n
*🎀 USER :* @$user
*🪅 STATUS :* $status
*🧿 GROUP :* $group
\n_$prefix goodbye off to disable this message._`;

const alive = `\`\`\`
❖ ── ✦ ──『✙ Alive ✙』── ✦ ── ❖

📅 Dᴀᴛᴇ Tᴏᴅᴀʏ : $date
⌚ Tɪᴍᴇ Nᴏᴡ : $time

✦» 𝚄𝚜𝚎𝚛 : $username
✦» 𝙱𝚘𝚝 : $botname
✦» 𝙿𝚛𝚎𝚏𝚒𝚡 : $prefix
✦» 𝙾𝚠𝚗𝚎𝚛 : $owner
✦» 𝙼𝚘𝚍𝚎 : $mode
✦» 𝙿𝚕𝚞𝚐𝚒𝚗𝚜 : $plugins
✦» 𝚄𝚜𝚎𝚛𝚜 : $users
✦» 𝚂𝚙𝚎𝚎𝚍 : $speed ms
✦» 𝚄𝚙𝚝𝚒𝚖𝚎 : $runtime
✦» 𝙼𝚎𝚖 : $ram\`\`\`

☎️ *Cᴏɴᴛᴀᴄᴛ :* https://wa.me/${Config.ownernumber}?text=${encodeURIComponent('Owner of ' + Config.botname + ' 🥵🎀🎐')}
💻 *Sᴏᴜʀᴄᴇ Cᴏᴅᴇ :* https://github.com/PikaBotz/Anya_v2-MD
🎀 *YᴏᴜTᴜʙᴇ :* https://youtube.com/@Pika_Kunn
🔮 *Public Group :* https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX

*R𝚎𝚙𝚕𝚢 A N𝚞𝚖𝚋𝚎𝚛 T𝚘 G𝚎𝚝:*
   𝟭 𝗔𝗹𝗹𝗺𝗲𝗻𝘂
   𝟮 𝗟𝗶𝘀𝘁𝗺𝗲𝗻𝘂
`;
module.exports = {
   aliveMsg: alive,
   welcomeMsg: welcome,
   leftMsg: left
};
