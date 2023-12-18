const Config = require('./config');
const chalk = require('chalk');
const path = require('path');
const { exec, execSync } = require('child_process');
const { default: makeWASocket, makeInMemoryStore, useMultiFileAuthState, jidDecode, downloadContentFromMessage, DisconnectReason, makeCacheableSignalKeyStore } = require('@queenanya/baileys');
const { myfunc, stylish, similar, grpEvent } = require('./lib/lib');
const { createQueenAnyaSession } = require("./lib/lib/session");
const { MakeSession } = require("./lib/lib/session2");
const PhoneNumber = require("awesome-phonenumber");
const { Boom } = require('@hapi/boom');
const axios = require('axios');
const fs = require('fs');
const express = require('express');
const app = express();
const FileType = import('file-type');
const pino = require("pino");
const MAIN_LOGGER = require('./lib/lib/logger');
const { setInterval } = require('timers/promises');
const logger = MAIN_LOGGER.child({})
logger.level = 'silent'

if (Config.mongoUrl === 'YOUR_MONGODB_URL') return console.log(chalk.bgRed('ERROR:'), chalk.red('Please set your MongoDB URL in config.js file'));
if (Config.sessionId === 'YOUR_SESSION_ID') return console.log(chalk.bgRed('ERROR:'), chalk.red('Please set your Session ID in config.js file'));

const sessionFolderPath = path.join(__dirname, '/lib/database/session_Queen-Anya');
const sessionPath = path.join(sessionFolderPath, '/creds.json'); 

/**
 * Attempting to create session folder
 * If the session file already exists, it will be deleted
 * If sessions already exists of users, it will be deleted
 */
exec('mkdir' + sessionFolderPath);
execSync('rm -rf ' + sessionPath);
exec('rm -r ' + sessionPath);

if (Config.sessionId.includes("_Queen-Anya_")) {
    MakeSession(Config.sessionId, sessionPath)
    .then(() => console.log(chalk.bgGreen('SUCCESS:'), chalk.green('Valid Pair Code ID Detected...')))
    .catch(err => console.log(err));
} else if (Config.sessionId.includes("_AN_YA_")) {
    createQueenAnyaSession();
    console.log(chalk.bgGreen('SUCCESS:'), chalk.green('Valid QR Code ID Detected...'));
} else {
    console.log(chalk.bgRed('ERROR;'), chalk.red('Invalid session ID, please get your session ID from original platform'))
}

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

store.readFromFile('./lib/database/store.json');
setTimeout(() => {

async function getMessage(key) {
  if (store) {
    const msg = await store.loadMessage(key.remoteJid, key.id);
    return msg ? msg.message : undefined;
  }
  return {};
}

const getVersionWaweb = () => {
        let version
        try {
            let a = fetchJson('https://web.whatsapp.com/check-update?version=1&platform=web')
            version = [a.currentVersion.replace(/[.]/g, ', ')]
        } catch {
            version = [2, 2204, 13]
        }
        return version
    }
async function connectToWhatsApp () {
    const { state, saveCreds } = await useMultiFileAuthState(sessionFolderPath);
    const anyaV2 = makeWASocket({
        printQRInTerminal: true,
        browser: [botname + ' (Queen Anya v2) ✅', 'safari', '1.0.0'],
        fireInitQueries: false,
        shouldSyncHistoryMessage: false,
        downloadHistory: false,
        syncFullHistory: false,
        generateHighQualityLinkPreview: true,
        auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, logger),
		},
        logger: pino({ level: 'silent' }),
        version: getVersionWaweb() || [2, 2242, 6],
        getMessage: async key => {
         if (store) {
         const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
         return msg.message || undefined;
         }
         return {
         conversation: 'An Error Occurred, Repeat Command!'
         }
        }
    })

store.bind(anyaV2.ev);
setInterval(() => {
    store.writeToFile('./lib/database/store.json');
}, 30 * 1000);

anyaV2.ws.on("CB:call", async (event) => {
  if (event.content[0].tag === "offer") return;
  const { Bot } = require('./lib/database/mongoDB');
  const bot = await Bot.get();
  if (!bot.anticall) return;
  const { antif } = require('./lib/System');
  await antif.antiCall(event, anyaV2, Config);
});

  // Handle error
  const unhandledRejections = new Map();
  process.on("unhandledRejection", (reason, promise) => { unhandledRejections.set(promise, reason); console.log("✅ Saved from crash, Unhandled Rejection at:", promise, "reason:", reason); });
  process.on("rejectionHandled", (promise) => { unhandledRejections.delete(promise); });
  process.on("Something went wrong", function (err) { console.log("✅ Saved from crash, Caught exception: ", err); });
  
  anyaV2.ev.process(async(events) => {

/*  if (events['contacts.update']) {
  for (const contact of events['contacts.update']) {
    if (typeof contact.imgUrl !== 'undefined') {
      const newUrl = contact.imgUrl === null
        ? null
        : await anyaV2.profilePictureUrl(contact.id).catch(() => null);
      console.log(
        `contact ${contact.id} has a new profile pic: ${newUrl}`
      );
    }
  }
} */

  if (events['creds.update']) {
     await saveCreds();
   };
			
  if (events['group-participants.update']) {
    const action = events['group-participants.update'];
    grpEvent.listners(action, anyaV2);
  }

/**
 * Handling incoming messages
 *
 */
if (events["messages.upsert"]) {
const chat = events["messages.upsert"];
if (chat.type !== 'notify') return;
const main = chat.messages[0];
if (!main.message) return;
const { db, Group, User } = require('./lib/database/mongoDB');
const bot = db.bot;
if (main.key) {
 if (main.key.remoteJid === 'status@broadcast' && bot.autoStatusRead) return await anyaV2.readMessages([main.key]);
 }
 
 const { Functions, userPrefix, antif } = require('./lib/System');
 const pika = await Functions.smsg(anyaV2, main, store);
 const { anya, commands } = require('./lib/lib/commands');
 let user = db.user[pika.sender];
 if (user === undefined) user = await User.get(pika.sender);
 let group = pika.isGroup ? db.group[pika.chat] : false;
 if (group === undefined) group = await Group.get(pika.sender);
 const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
 if (pika.sender === botNumber && pika.id.startsWith('BAE5')) return;
 if (bot.alwaysOnline) { await anyaV2.sendPresenceUpdate('available', pika.chat); }
 const bodyType = pika.body; 
 var body = /^\d/.test(bodyType) ? pika.quoted ? (pika.quoted.sender === botNumber) ? await myfunc.pik4nya(pika.quoted.text.includes("_ID: ") ? pika.quoted.text : null, bodyType.trim().split(/ +/).slice(0), bodyType) : false : bodyType : bodyType;
 if (body[1] && body[1] == " ") body = body[0] + body.slice(2);  
 if (body === 'invalid') return pika.reply('_🎀 Invalid option number_');
 const { prefix, isCmd, command } = await userPrefix.userPrefix(body, bot.prefix);
 if (bot.autoMsgRead) { await anyaV2.readMessages([main.key]); };
 if (bot.autoReactMsg) { await pika.react(pickRandom(require('./lib/database/emoji').emoji)); };
  async function userSudo() { return bot.modlist.includes(pika.sender); }
  async function groupMetadata() {
    if (!pika.isGroup) return null;
    //try {
        const metadata = await anyaV2.groupMetadata(pika.chat);
        return metadata;
    /*} catch (error) {
        console.error('❌ Error fetching group metadata:', error);
        return null;
    }*/
   }
  async function groupAdmins() {
    const groupData = await groupMetadata();
    if (!groupData || !Array.isArray(groupData.participants)) {
        return [];
    }
    const admins = groupData.participants
        .filter((participant) => participant.admin !== null)
        .map((admin) => admin.id);
    return admins;
  }
  function userOwner() { return [botNumber, Config.ownernumber + '@s.whatsapp.net'].includes(pika.sender); }
  async function userAdmin() { const admins = await groupAdmins(); return admins.includes(pika.sender); }
  async function botAdmin() { const admins = await groupAdmins(); return admins.includes(botNumber); }
 if (pika.isGroup) {
   if (group.antitoxic) {
     if (bot.badWords.includes(body.trim().split(/ +/)[0].toLowerCase())) {
       const stop = await antif.antiToxic(userOwner(), await userSudo(), await userAdmin(), await botAdmin(), pika, anyaV2);
       if (stop) return;
     }
 }
 if (group.antilink) {
   if (/http:\/\/|https:\/\//.test(body)) {
   const stop = await antif.antiLink(userOwner(), await userSudo(), await userAdmin(), await botAdmin(), pika, anyaV2);
   if (stop) return;
 }
 }
 if (group.antipicture) {
   if (/image/.test(pika.mtype)) {
   const stop = await antif.antiPicture(userOwner(), await userSudo(), await userAdmin(), await botAdmin(), pika, anyaV2);
   if (stop) return;
   }
 }
 if (group.antivideo) {
   if (/video/.test(pika.mtype)) {
       const stop = await antif.antiPicture(userOwner(), await userSudo(), await userAdmin(), await botAdmin(), pika, anyaV2);
       if (stop) return;
   }
   }
 }
 if (bot.worktype === 'self') { if (!userOwner() && !(await userSudo())) return; }
 else if (bot.worktype === 'public') {}
 else if (bot.worktype === 'onlyadmin') {
 if (!userOwner() && !(await userSudo()) && !(await userAdmin())) return;
   if (!pika.isGroup && !userOwner() && !(await userSudo())) return;
 }
 
 if (pika.isGroup) {
   if (!isCmd) return;
   if (bot.prefix === 'all') { if (!plugin.isPlugin(command)) return; };
   if (!group.enabled) {
     if (!userOwner() && !(await userSudo())) return pika.reply(`\`\`\`❌ Not Activated!!\`\`\`\n\nI'm not enabled in this group, tell owner to type *${(prefix == '') ? Config.prefa : prefix}activate* to activate me here.`);
   }
   if (group.ban) {
     if (!userOwner() && !(await userSudo())) {
       if (bot.prefix === 'all') { if (!plugin.isPlugin(command)) return; };
       return pika.react('⚠️').then(() => pika.reply(Config.message.banChat));
     }
   } 
 }
 
 if (!pika.isGroup) {
 if (bot.chatbot && !isCmd && pika.text) {
    if (!plugin.isPlugin(command)) {
    axios.get(`https://vihangayt.me/tools/chatgptv4?q=${encodeURIComponent(body)}`)
      .then((res) => pika.reply(res.data.data))
      .catch((error) => {
        console.log('❌ Unable to retrieve chatgptv4 API:', error);
        axios.get(`http://api.brainshop.ai/get?bid=172502&key=ru9fgDbOTtZOwTjc&uid=[uid]&msg=${encodeURIComponent(body)}`)
          .then((res) => pika.reply(res.data.cnt))
          .catch((err) => console.log('❌ Unable to retrieve BrainShop API:', err));
      });
    return;
      }
   }
 }
   
 if (user.ban && isCmd) {
   if (userOwner() || (await userSudo())) return pika.reply('⚠️ Maybe you changed the ownership or bot\'s number, please change the mongoDB url or make the previous user owner again.');
   if (bot.prefix === 'all') { if (!plugin.isPlugin(command)) return; }
   return pika.react('⚠️').then(() => pika.reply(Config.message.ban));
 }

 const args = pika.body ? body.trim().split(/ +/).slice(1) : null;
 let text;
 try {
     text = pika.body ? body.trim().split(/ +/).slice(1).join(" ") : null;
 } catch {
     text = false;
 }

 if (['sc', 'repository', 'script', 'repo'].includes(command)) {
  pika.react('💻');
     axios.get('https://api.github.com/repos/PikaBotz/Anya_v2-MD')
     .then(async (response) => {
         const anya = response.data;
         const caption = `
\`\`\`Hey ${pika.pushName} ❣️🎸\`\`\`

*🧩 About :* _Queen Anya v2: A WhatsApp bot with diverse plugins for tasks, games, and utilities. Boost your messaging experience with efficiency and entertainment in one user-friendly package._

╭─⌈ 𝙌𝙪𝙚𝙚𝙣 𝘼𝙣𝙮𝙖 𝙎𝙘𝙧𝙞𝙥𝙩 ⌋
⟪❒ » https://gitHub.com/PikaBotz/Anya_v2-MD ❒⟫

*🌟 Total stars :* _${anya.stargazers_count} stars_
*🍴 Total forks :* _${anya.forks_count} forks_
*🌈 Author : _github.com/PikaBotz_*

*Join This Group To Stay Updated!!*
-> https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX

*Don't forget to give a 🌟 to my hardwork on github!*
`;
const devname = await anyaV2.getName('918811074852@s.whatsapp.net');
const devcon = { key: { participant: '0@s.whatsapp.net', ...({ remoteJid: 'status@broadcast' }), }, message: { contactMessage: { displayName: devname, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${devname},;;;\nFN:${devname}\nitem1.TEL;waid=918811074852:918811074852\nitem1.X-ABLabel:Mobile\nEND:VCARD`, jpegThumbnail: Config.image_1, thumbnail: Config.image_1, sendEphemeral: true, }, }, };
await anyaV2.sendMessage(pika.chat, { image: Config.image_1, caption: caption }, { quoted: devcon });
});
return;
}
 if (isCmd) {/*
  const parameters = {
    bot: db.bot,
    group: group,
    user: user,
    prefix: (prefix == '') ? ' ' : prefix,
    anyaV2: anyaV2,
    pika: pika,
    userAdmin: await userAdmin(),
    userSudo: await userSudo(),
    userOwner: userOwner(),
    botAdmin: await botAdmin(),
    groupMetadata: await groupMetadata(),
    text: text,
    pickRandom: pickRandom,
    command: command,
    args: args,
    mime: mime,
    storage: store,
    botNumber: botNumber,
    startPing: performance.now(),
  }*/
 //const quoted = pika.quoted ? pika.quoted : pika;
 //const mime = (quoted.msg || quoted).mimetype || "";
      console.log(chalk.black(chalk.bgWhite(">>> Message 🦋")), chalk.black(chalk.bgBlue(pika.body)) + "\n" + chalk.magenta("=> Requested by"), chalk.green(pika.pushName ? stylish.fancy32(pika.pushName) : "Undefined"), chalk.yellow(pika.sender) + "\n" + chalk.blueBright("=> Woking in"), chalk.green(pika.isGroup ? groupMetadata.subject : "Private Chat", pika.chat));
      if (bot.autoTyping) { await anyaV2.sendPresenceUpdate('composing', pika.chat); };
      const { anya, commands } = require('./lib/lib/commands');
      const cmd = commands.find((cmd) => cmd.name === command || (cmd.alias && cmd.alias.includes(command)));
  
  const parameters = {
          bot: db.bot,
          group: group,
          user: user,
          prefix: (prefix == '') ? ' ' : prefix,
          anyaV2: anyaV2,
          pika: pika,
          userAdmin: await userAdmin(),
          userSudo: await userSudo(),
          userOwner: userOwner(),
          botAdmin: await botAdmin(),
          groupMetadata: await groupMetadata(),
          text: text,
          pickRandom: pickRandom,
          command: command,
          args: args,
          mime: mime,
          storage: store,
          botNumber: botNumber,
          startPing: performance.now(),
        }
            
      if (cmd) {
          if (cmd.react) citel.react(cmd.react);
  
          let text;
          try {
              text = body.trim().split(/ +/).slice(1).join(" ");
          } catch {
              text = false;
          }
  
          try {
              cmd.function(parameters);
          } catch (e) {
              console.error("[ERROR] ", e);
          }
      }
  
      commands.map(async (command) => {
          if (body && command.on === "body") {
              command.function(parameters);
          } else if (citel.text && command.on === "text") {
              command.function(parameters);
          } else if (
              (command.on === "image" || command.on === "photo") &&
              citel.mtype === "imageMessage"
          ) {
              command.function(parameters);
          } else if (
              command.on === "sticker" &&
              citel.mtype === "stickerMessage"
          ) {
              command.function(parameters);
          }
      });
  
   /* const cmd = commands.find(anya => { if (Array.isArray(anya.name)) { return anya.name.includes(command); } else if (typeof anya.name === 'string') { return anya.name === command; } return false; }) || commands.find(anya => anya.alias && anya.alias.includes(command));
    if (cmd) {
      if (cmd.react) citel.react(cmd.react);
      cmd.function(parameters);
    }
    commands.map(async(command) => {
      if (body && command.on === "body") {
          command.function(parameters);
      } else if (citel.text && command.on === "text") {
          command.function(parameters);
      } else if (
          (command.on === "image" || command.on === "photo") &&
          citel.mtype === "imageMessage"
      ) {
          command.function(parameters);
      } else if (
          command.on === "sticker" &&
          citel.mtype === "stickerMessage"
      ) {
          command.function(parameters);
      }
  });
   /* const commandsPath = "./lib/plugins/";
    const commands = {};
    fs.readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        const commandName = path.parse(file).name;
        commands[commandName] = require("./" + path.join(commandsPath, file));
      });

    function getParamNames(func) {
      const fnStr = func.toString();
      return (
        fnStr
          .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
          .match(/([^\s,]+)/g) || []
      );
    }
console.log(commands)

    async function handleCommand(command, commands) {
      for (const cmdGroupName in commands) {
        const cmdGroup = commands[cmdGroupName];
        const cmd = cmdGroup.cmdName().name.concat(cmdGroup.cmdName().alias);
        (cmdGroup.cmdName().name.includes(command) || cmdGroup.cmdName().alias.includes(command)) ? (cmdGroup.cmdName().react ? await pika.react(cmdGroup.cmdName().react) : null) : null;
        if (cmd.includes(command)) {
          const paramNames = getParamNames(cmdGroup.getCommand);
          const valueMap = {
        bot: bot,
        group: group,
        user: user,
        prefix: (prefix == '') ? ' ' : prefix,
        anyaV2: anyaV2,
        pika: pika,
        userAdmin: await userAdmin(),
        userSudo: await userSudo(),
        userOwner: userOwner(),
        botAdmin: await botAdmin(),
        groupMetadata: await groupMetadata(),
        text: text,
        pickRandom: pickRandom,
        command: command,
        args: args,
        mime: mime,
        storage: store,
        botNumber: botNumber,
        startPing: performance.now(),
          };
          const pik4kun = paramNames.map((param) => valueMap[param] || null);
          await cmdGroup.getCommand(...pik4kun)//, { anyaV2, pika, storage });
          return true;
        }
      }
    }
      const handled = await handleCommand(command, commands);
      if (handled) return;
      if (bot.prefix === 'all') { if (!plugin.isPlugin(command)) return; }
      await similar.similar(pika, prefix, command, bot); */
    } 
 }
 
 function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())];
 }
 
/**
 * Handling connection to WhatsApp
 * if connection is lost, but session is still valid, it will reconnect
 * if connection closed, it will turn of the process without throwing errors
 * if connected, it'll send a confirmation message
 * {@PikaBotz}
 */
 if (events['connection.update']) {
 const update = events['connection.update'];
  const { connection, lastDisconnect } = update;
  if (connection === 'close' && lastDisconnect) {
    const shouldReconnect = (lastDisconnect.error instanceof Boom) ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : false;
    console.log(chalk.bgYellow('WARNING:'), chalk.yellow('Connection closed, reconnecting...'));
    if (shouldReconnect) {
      await connectToWhatsApp();
    }
  } else if (connection === 'open') {
    console.clear();
    console.log('✅ Login successful!');
    console.log('📶 Requiring initial resources...');
    const { key } = await anyaV2.sendMessage(Config.ownernumber + '@s.whatsapp.net', { text: '🔄 𝘊𝘰𝘯𝘯𝘦𝘤𝘵𝘦𝘥, 𝘭𝘪𝘴𝘵𝘪𝘯𝘨 𝘳𝘦𝘴𝘰𝘶𝘳𝘤𝘦𝘴...' });
    const { insertMongoDBdata } = require("./lib/database/mongoDB/mongoCore");
    insertMongoDBdata();
    const version = await myfunc.isLatest();
    await anyaV2.sendMessage(Config.ownernumber + '@s.whatsapp.net', { text: version ? `_🎀 Connected to Queen Anya_\n*✍🏻 To Start Type :* ${Config.prefa}alive` : '*⚠️ New version available, please update your responsibility branch on GitHub.*', edit: key });
        }
    };
 });
    anyaV2.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid );
    } else return jid;
    };
  
    anyaV2.getName = (jid, withoutContact = false) => {
        const id = anyaV2.decodeJid(jid);
        withoutContact = anyaV2.withoutContact || withoutContact;
        let v;
        if (id.endsWith("@g.us")) {
            return new Promise(async (resolve) => {
                v = store.contacts[id] || {};
                if (!(v.name || v.subject)) {
                    v = anyaV2.groupMetadata(id) || {};
                }
                resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
            });
        } else {
            v = id === "0@s.whatsapp.net"
                ? {
                    id,
                    name: "WhatsApp",
                  }
                : id === anyaV2.decodeJid(anyaV2.user.id)
                ? anyaV2.user
                : store.contacts[id] || {};
        }
        return (
            (withoutContact ? "" : v.name) ||
            v.subject ||
            v.verifiedName ||
            PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international")
        );
    };

    anyaV2.sendContact = async (jid, contacts, quoted = "", opts = {}) => {
  let contactList = [];
  for (const contact of contacts) {
    contactList.push({
      displayName: await anyaV2.getName(contact + '@s.whatsapp.net'),
      vcard: `BEGIN:VCARD
VERSION:3.0
N:${await anyaV2.getName(contact + '@s.whatsapp.net')}
FN:${Config.ownername}
item1.TEL;waid=${contact}:${contact}
item1.X-ABLabel:Click here to chat with this bot's developer.
END:VCARD`
    });
  }
};

    
    anyaV2.setStatus = (status) => {
        anyaV2.query({
            tag: "iq",
            attrs: {
                to: "@s.whatsapp.net",
                type: "set",
                xmlns: "status",
            },
            content: [
                {
                    tag: "status",
                    attrs: {},
                    content: Buffer.from(status, "utf-8"),
                },
            ],
        });
        return status;
    };
      
  
  anyaV2.sendMedia = async (
    jid,
    path,
    fileName = "",
    caption = "",
    quoted = "",
    options = {},
  ) => {
    let types = await anyaV2.getFile(path, true);
    let { mime, ext, res, data, filename } = types;
    if ((res && res.status !== 200) || file.length <= 65536) {
      try {
        throw { json: JSON.parse(file.toString()) };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    let type = "",
      mimetype = mime,
      pathFile = filename;
    if (options.asDocument) type = "document";
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require("./lib/lib/exif");
      let media = { mimetype: mime, data };
      pathFile = await writeExif(media, {
        packname: options.packname ? options.packname : global.packname,
        author: options.author ? options.author : global.author,
        categories: options.categories ? options.categories : [],
      });
      await fs.promises.unlink(filename);
      type = "sticker";
      mimetype = "image/webp";
    } else if (/image/.test(mime)) type = "image";
    else if (/video/.test(mime)) type = "video";
    else if (/audio/.test(mime)) type = "audio";
    else type = "document";
    await anyaV2.sendMessage(
      jid,
      { [type]: { url: pathFile }, caption, mimetype, fileName, ...options },
      { quoted, ...options },
    );
    return fs.promises.unlink(pathFile);
  };
  /**
   *
   * @param {*} message
   * @param {*} filename
   * @param {*} attachExtension
   * @returns
   */
  anyaV2.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true,
  ) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    trueFileName = attachExtension ? filename + "." + type.ext : filename;
    // save to file
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  anyaV2.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
  };

  /**
   *
   * @param {*} jid
   * @param {*} message
   * @param {*} forceForward
   * @param {*} options
   * @returns
   */
  anyaV2.copyNForward = async (
    jid,
    message,
    forceForward = false,
    options = {},
  ) => {
    let vtype;
    if (options.readViewOnce) {
      message.message =
        message.message &&
        message.message.ephemeralMessage &&
        message.message.ephemeralMessage.message
          ? message.message.ephemeralMessage.message
          : message.message || undefined;
      vtype = Object.keys(message.message.viewOnceMessage.message)[0];
      delete (message.message && message.message.ignore
        ? message.message.ignore
        : message.message || undefined);
      delete message.message.viewOnceMessage.message[vtype].viewOnce;
      message.message = {
        ...message.message.viewOnceMessage.message,
      };
    }

    let mtype = Object.keys(message.message)[0];
    let content = await generateForwardMessageContent(message, forceForward);
    let ctype = Object.keys(content)[0];
    let context = {};
    if (mtype != "conversation") context = message.message[mtype].contextInfo;
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo,
    };
    const waMessage = await generateWAMessageFromContent(
      jid,
      content,
      options
        ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo
              ? {
                  contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo,
                  },
                }
              : {}),
          }
        : {},
    );
    await anyaV2.relayMessage(jid, waMessage.message, {
      messageId: waMessage.key.id,
    });
    return waMessage;
  };



  /**
   *
   * @param {*} path
   * @returns
   */
  anyaV2.getFile = async (PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
      ? Buffer.from(PATH.split`,`[1], "base64")
      : /^https?:\/\//.test(PATH)
      ? await (res = await getBuffer(PATH))
      : fs.existsSync(PATH)
      ? ((filename = PATH), fs.readFileSync(PATH))
      : typeof PATH === "string"
      ? PATH
      : Buffer.alloc(0);
    //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
    let type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    filename = path.join(
      __filename,
      "../src/" + new Date() * 1 + "." + type.ext,
    );
    if (data && save) fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data,
    };
  };

  return anyaV2
}

const Port = 8000;
app.get('/', (req, res) => {
  res.send('Hello, this is your bot running Queen Anya V2!');
});

app.listen(Port, () => {
  console.log(`✅ Connected to servers, running on port ${Port}...`);
});

function stayAlive() {
  setInterval(() => {
    axios.get(`http://localhost:${Port}`)
      //.then(() => console.log('✅ Uptime Verified!'))
      .catch((error) => {
        console.error('❌ Error:', error);
      });
  }, 15000);
}

function delCreds() {
  setInterval(() => {
    fs.readdirSync('./lib/database/session_Queen-Anya/').forEach(file => {
      if (file !== 'creds.json') {
        fs.unlinkSync(path.join('./lib/database/session_Queen-Anya/', file));
      }
    });
    //console.log('✅ Cleared Creds!');
  }, 180000)
}

stayAlive();
delCreds();
connectToWhatsApp().catch((err) => console.log(err));
}, 3000);