const Config = require('../../config');

const { anya, commands } = require(__dirname + '/plugins');
const {
  listall,
  tiny,
  fancy10,
  fancy11,
  fancy13,
  fancy32
} = require(__dirname + '/stylish-font');
const {
  dayToday,
  totalAnyaUsers,
  formatRuntime,
  getMemoryInfo,
  isLatest,
  getBuffer,
  pickRandom,
  formatDate,
  formatNumber,
  getStream,
  delay,
  TelegraPh,
  UploadFileUgu,
  getObjArray,
  getRandom,
  registerTimer,
  numberToDate
} = require(__dirname + '/myfunc');
const {
  Bot,
  Cmd,
  User,
  Group,
  UI,
  System,
  Warn,
  addWarn,
  delWarn,
  clearWarn
} = require(__dirname + '/../database/mongodb');
const {
  pinterest,
  tiktok,
  twitter,
  wikimedia,
  lyrics,
  wallpaper,
  hentaivid,
  telesticker,
  mediafireDl,
  photooxy,
  ttdl,
  gimg
} = require(__dirname + '/scraper');
const {
  writeExifInVid,
  createVidSticker,
  audioToVideo
} = require(__dirname + '/converter');
const { smsg } = require(__dirname + '/functions');
const { getPrefix } = require(__dirname + '/prefix');
const { fix } = require(__dirname + '/mongoUrlFix');
const { buttons } = require(__dirname + '/buttons');
const { api } = require(__dirname + '/../.dev');
const { similar } = require(__dirname + '/similar');
const { groupEventListener, groupChangesListener } = require(__dirname + '/events');

async function getAdmin(anyaV2, pika) {
    const group = await anyaV2.groupMetadata(pika.chat).catch(_=>{});
    return group.participants
    .filter(i => i.admin !== null)
    .map(i => i.id);
  }

module.exports = {
  anya,
  commands,
  listall,
  tiny,
  fancy10,
  fancy11,
  fancy13,
  fancy32,
  dayToday,
  formatRuntime,
  getMemoryInfo,
  formatNumber,
  isLatest,
  Bot,
  Cmd,
  User,
  Group,
  UI,
  System,
  Warn,
  addWarn,
  delWarn,
  clearWarn,
  smsg,
  getPrefix,
  getBuffer,
  pickRandom,
  formatDate,
  getStream,
  numberToDate,
  delay,
  registerTimer,
  UploadFileUgu,
  TelegraPh,
  getObjArray,
  getRandom,
  similar,
  pik4nya: buttons,
  totalUsers: totalAnyaUsers,
  pinterest,
  tiktok,
  twitter,
  wikimedia,
  lyrics,
  wallpaper,
  hentaivid,
  telesticker,
  mediafireDl,
  photooxy,
  ttdl,
  gimg,
  writeExifInVid,
  createVidSticker,
  audioToVideo,
  fix,
  api,
  groupEventListener,
  groupChangesListener,
  warning: async (anyaV2, pika, header, { chat, reason }) => {
    const res = await addWarn(pika.sender.split("@")[0], { chat: chat, reason: reason});
    if (res.status === 201 || res.status === 200) {
        pika.reply(`════════════════════════\n  ${header}\n════════════════════════\n\n_👤 Warned @${pika.sender.split("@")[0]}_\n└ _current warns : ${res.warn}/${Config.warns}_\n└ _reason : ${reason}_`, { mentions: [pika.sender] });
        if (res.warn === Config.warns) return pika.reply(`*⚠️ Be careful @${pika.sender.split("@")[0]}, it's your last warning*`, { mentions: [pika.sender] });
    } else if (res.status === 429) {
        pika.reply(`════════════════════════\n  ${header}\n════════════════════════\n\n_👤 Warned @${pika.sender.split("@")[0]}_\n└ _current warns : exceeded_\n└ _reason : ${reason}_`, { mentions: [pika.sender] });
        pika.reply(`_✅ Kicked *@${pika.sender.split("@")[0]}*_`, { mentions: [pika.sender] });
        await delay(2000);
        return anyaV2.groupParticipantsUpdate(pika.chat, [pika.sender], 'remove')
        .catch((error) => console.error(error));
    }
  },
  pikaApi: {
    get: async (folder, file, query) => await api.apiHub(folder, file, query).then((response) => { return response })
  },
  isButton: (args) => /anyaButtonMessage/.test(args.join(" ")),
  getAdmin: getAdmin,
  announce: async (anyaV2, pika, { header, message }) => {
    const metadata = await anyaV2.groupMetadata(pika.chat);
    pika.reply(`\`\`\`${header ? header : "⚠️ Attention!!"}\`\`\`\n\n${message}`, { mentions: metadata.participants.map(v => v.id) });
  },
  rule: async (rule, anyaV2, pika, userOwner) => {
    //༺─────────────────────────────────────
    if (/1/.test(rule)) {
        if (!userOwner) return {
            msg: pika.reply(Config.message.owner),
            status: false
        }
        return { status: true };
    //༺─────────────────────────────────────
    } else if (/2/.test(rule)) {
        if (!pika.isGroup) return {
            msg: pika.reply(Config.message.group),
            status: false
        }
        const groupAdmins = await getAdmin(anyaV2, pika);
        const isAdmins = pika.isGroup ? groupAdmins.includes(pika.sender) : false;
        if (!userOwner && !isAdmins) return {
            msg: pika.reply(Config.message.admin),
            status: false
        }
        return { status: true };
    //༺─────────────────────────────────────
    } else if (/3/.test(rule)) {
        if (!pika.isGroup) return {
            msg: pika.reply(Config.message.group),
            status: false
        }
        const groupAdmins = await getAdmin(anyaV2, pika);
        const isAdmins = pika.isGroup ? groupAdmins.includes(pika.sender) : false;
        const botNumber = await anyaV2.decodeJid(anyaV2.user.id)
        const botAdmin = pika.isGroup ? groupAdmins.includes(botNumber) : false;
        if (!botAdmin) return {
            msg: pika.reply(Config.message.botAdmin),
            status: false
        }
        if (!userOwner && !isAdmins) return {
            msg: pika.reply(Config.message.admin),
            status: false
        }
        return { status: true };
    //༺─────────────────────────────────────
    } else if (/5/.test(rule)) {
        if (!pika.isGroup) return {
            msg: pika.reply(Config.message.group),
            status: false
        }
        return { status: true };
    //༺─────────────────────────────────────
    } else if (/6/.test(rule)) {
        if (!pika.isGroup) return {
            msg: pika.reply(Config.message.group),
            status: false
        }
        if (!userOwner) return {
            msg: pika.reply(Config.message.owner),
            status: false
        }
        return { status: true };
    //༺─────────────────────────────────────
    } else if (/7/.test(rule)) {
        if (pika.isGroup) return {
            msg: pika.reply(Config.message.private),
            status: false
        }
        if (!userOwner) return {
            msg: pika.reply(Config.message.owner),
            status: false
        }
        return { status: true };
    //༺─────────────────────────────────────
    } else return { status: true }
  },
  rules: (rule) => {
    let owner;
    let admin;
    let bot;
    let gc;
    let pc;
        switch (rule) {
        
            /**
             * Anyone anywhere can use this command
             */
            case 0:
                owner = null;
                admin = null;
                bot = null;
                gc = null;
                pc = null;
                break;
            
            /**
             * Only bot owner can use this command anywhere
             */
            case 1:
                owner = true;
                admin = false;
                bot = true;
                gc = true;
                pc = true;
                break;
                
            /**
             * Only bot, bot owner and Admins can use this command in grou chat
             */
            case 2:
                owner = true;
                admin = true;
                bot = null;
                gc = true;
                pc = false;
                break;
                
            /**
             * Only bot, bot owner and admins can use this command
               in group chat when the bot is the admin too
             */
            case 3:
                owner = true;
                admin = true;
                bot = true;
                gc = true;
                pc = false;
                break;
            
            /**
             * Anyone can use this command but only in private chat
             */
            case 4:
                owner = null;
                admin = false
                bot = false;
                gc = false;
                pc = true;
                break;
                
            /**
             * Anyone can use this command but only in group chat
             */
            case 5:
                owner = null;
                admin = null;
                bot = null;
                gc = true;
                pc = false;
                break;
                
            /**
             * Only bot and bot owner can use this command in private chat
             */
            case 6:
                owner = true;
                admin = false;
                bot = false;
                gc = false;
                pc = true;
                break;
                
            /**
             * Only bot owner can use this command in group chat
             */
            case 7:
                owner = true;
                admin = false;
                bot = false;
                gc = true;
                pc = false;
                break;
        }
      return {
        owner: (owner !== null) ? owner ? "✅" : "❌" : "Not required",
        admin: (admin !== null) ? admin ? "✅" : "❌" : "Not required",
        botAdmin: (bot !== null) ? bot ? "✅" : "❌" : "Not required",
        group: (gc !== null) ? gc ? "✅" : "❌" : "Not required",
        pc: (pc !== null) ? pc ? "✅" : "❌" : "Not required"
      }
    }
}
