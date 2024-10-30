const Config = require('../../config');

const { anya, commands } = require(__dirname + '/plugins');
const { connectionMsg } = require(__dirname + '/connectionMsg');
const youtube = require(__dirname + '/ytdl-core');
const reactions = require(__dirname + '/../frameworks/reactionMedia');
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
  Plugins,
  installPlugins,
  deletePlugins,
  UI,
  System,
  Warn,
  addWarn,
  delWarn,
  clearWarn
} = require(__dirname + '/../database/mongodb');
const { PinterestDownloader } = require(__dirname + '/scraper/pinterest');
const { playStoreSearch } = require(__dirname + '/scraper/playstore');
const { SoundCloudeSearch } = require(__dirname + '/scraper/SoundCloud');
const { RingTone } = require(__dirname + '/scraper/ringtone');
const { SteamSearch } = require(__dirname + '/scraper/steam');
const { WattPad } = require(__dirname + '/scraper/wattpad');
const { trendingTwitter } = require(__dirname + '/scraper/trendingTwitter');
const { webtoons } = require(__dirname + '/scraper/WebToons');
const { happymodSearch } = require(__dirname + '/scraper/happymodSearch');
const { android1 } = require(__dirname + '/scraper/android1');
const { Wikipedia } = require(__dirname + '/scraper/wikipediaSearch');
const { konachanSearch } = require(__dirname + '/scraper/konaChanSearch');
const { google } = require(__dirname + '/scraper/google');
const { aiArtGenerator } = require(__dirname + '/ai/aiArt');
const { chatGpt4 } = require(__dirname + '/ai/gpt4v1');
const { bingChat } = require(__dirname + '/ai/bingChat');
const { brainShopAi } = require(__dirname + '/ai/brainShopAi');
const { blackbox } = require(__dirname + '/ai/blackboxAi');
const { cai } = require(__dirname + '/ai/cai');
const { gemini_ai } = require(__dirname + '/ai/gemini_ai');
const { igdl } = require(__dirname + "/download/igdl");
const { igs } = require(__dirname + "/download/igstory");
const { imageEditor } = require(__dirname + "/maker/imageEditor");
const { remini } = require(__dirname + "/maker/remini");
const { ttp } = require(__dirname + "/maker/ttp");
const { igstalk } = require(__dirname + "/stalker/igstalk");
const { ttstalk } = require(__dirname + "/stalker/ttstalk");
const {
  wikimedia,
  lyrics,
  hentaivid,
  gimg,
  telesticker
} = require(__dirname + '/scraper.js');
const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
  writeExif,
  addExif,
  audioToVideo,
  stickerToVideo,
  toAudio
} = require(__dirname + '/converter');
const { smsg } = require(__dirname + '/functions');
const { getPrefix } = require(__dirname + '/prefix');
const { fix } = require(__dirname + '/mongoUrlFix');
const { buttons } = require(__dirname + '/buttons');
const { api } = require(__dirname + '/../.dev');
const { similar } = require(__dirname + '/similar');
const { cooldown } = require(__dirname + '/cooldown');
const { greetTime } = require(__dirname + '/greeting');
const ManageDB = require(__dirname + '/../database/disk/main');
const { groupEventListener, groupChangesListener } = require(__dirname + '/events');
const {
  Quiz,
  Questions
} = require(__dirname + '/../database/games/quiz');
            
async function getAdmin(anyaV2, pika) {
    const group = await anyaV2.groupMetadata(pika.chat).catch(_=>{});
    return group.participants
    .filter(i => i.admin !== null)
    .map(i => i.id);
  }

module.exports = {
  anya,
  commands,
  greetTime,
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
  Plugins,
  installPlugins,
  deletePlugins,
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
  cooldown,
  pik4nya: buttons,
//  totalUsers: totalAnyaUsers,
//  webp2mp4File,
  aiArtGenerator,
  PinterestDownloader,
  playStoreSearch,
  SoundCloudeSearch,
  RingTone,
  SteamSearch,
  WattPad,
  trendingTwitter,
  webtoons,
  happymodSearch,
  android1,
  Wikipedia,
  konachanSearch,
  google,
  wikimedia,
  lyrics,
  hentaivid,
  gimg,
  telesticker,
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
  writeExif,
  addExif,
  audioToVideo,
  stickerToVideo,
  toAudio,
  fix,
  api,
  connectionMsg,
  groupEventListener,
  groupChangesListener,
  youtube,
  reactions,
  Quiz,
  Questions,
  ManageDB,
  chatGpt4,
  bingChat,
  brainShopAi,
  blackbox,
  cai,
  gemini_ai,
  imageEditor,
  remini,
  ttp,
  igdl,
  igs,
  igstalk,
  ttstalk,
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

/**
 * Checks if the user satisfies the required rule conditions.
 * @param {string} rule - The rule to check.
 * @param {Object} anyaV2 - The API instance for interactions.
 * @param {Object} pika - The message object containing information about the sender and chat.
 * @param {boolean} userOwner - Indicates if the user is the owner.
 * @returns {Object} - An object containing the result and message if any.
 */
 rule: async (rule, anyaV2, pika, userOwner) => {
    if (/1/.test(rule)) {
        if (!userOwner) {
            return { msg: pika.reply(Config.message.owner), status: false };
        }
        return { status: true };
    }

    if (/2|3|5|6/.test(rule)) {
        if (pika.isPrivate) {
            return { msg: pika.reply(Config.message.group), status: false };
        }

        const groupAdmins = await getAdmin(anyaV2, pika);
        const isAdmin = groupAdmins.includes(pika.sender);

        if (/2|3/.test(rule) && !userOwner && !isAdmin) {
            return { msg: pika.reply(Config.message.admin), status: false };
        }

        if (/3/.test(rule)) {
            const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
            const botAdmin = groupAdmins.includes(botNumber);
            if (!botAdmin) {
                return { msg: pika.reply(Config.message.botAdmin), status: false };
            }
        }

        if (/5/.test(rule)) {
            return { status: true };
        }

        if (/6/.test(rule) && !userOwner) {
            return { msg: pika.reply(Config.message.owner), status: false };
        }

        return { status: true };
    }

    if (/7/.test(rule)) {
        if (pika.isGroup) {
            return { msg: pika.reply(Config.message.private), status: false };
        }
        if (!userOwner) {
            return { msg: pika.reply(Config.message.owner), status: false };
        }
        return { status: true };
    }

    return { status: true };
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
