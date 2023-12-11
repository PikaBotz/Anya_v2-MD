const Config = require('./config');
const chalk = require('chalk');
const path = require('path');
const { exec, execSync } = require('child_process');
const { default: makeWASocket, makeInMemoryStore, useMultiFileAuthState, jidDecode, downloadContentFromMessage } = require('@queenanya/baileys');
const { myfunc, plugin, similar } = require('./lib/lib');
const { MakeSession } = require("./lib/lib/session2");
const PhoneNumber = require("awesome-phonenumber");
const { Boom } = require('@hapi/boom');
const axios = require('axios');
const fs = require('fs');
const express = require('express');
const app = express();
const FileType = import('file-type');
const pino = require("pino");

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
    .then(() => console.log(chalk.bgGreen('SUCCESS:'), chalk.green('Session created, starting Anya...')))
    .catch(err => console.log(err));
} else {
    console.log(chalk.bgRed('ERROR;'), chalk.red('Invalid session ID, please get your session ID from original platform'))
}

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});
store.readFromFile('./lib/database/store.json');
setTimeout(() => {
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
        auth: state,
        logger: pino({ level: 'fatal' }),
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

anyaV2.ev.on ('creds.update', saveCreds);

anyaV2.ev.on('chats.set', () => {
    console.log('got chats', store.chats.all());
});

anyaV2.ev.on('contacts.set', () => {
    console.log('got contacts', Object.values(store.contacts));
})


anyaV2.ev.on('contacts.upsert', (contacts) => {
    const contactsUpsert = (newContacts) => {
        for (const contact of newContacts) {
            if (store.contacts[contact.id]) {
                Object.assign(store.contacts[contact.id], contact);
            } else {
                store.contacts[contact.id] = contact;
            }
        }
        return;
    };
    contactsUpsert(contacts);
})

anyaV2.ev.on("contacts.update", (update) => {
    for (let contact of update) {
      let id = anyaV2.decodeJid(contact.id);
      if (store && store.contacts)
        store.contacts[id] = { id, name: contact.notify };
    }
  });

anyaV2.ws.on("CB:call", async (json) => {
  const { db } = require('./lib/database/mongoDB');
  if (json.content[0].tag === "offer") {
    const callerId = json.content[0].attrs["call-creator"];
    const isAntiCall = await findSwitch();
    if (isAntiCall.anticall) {
      const vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + `FN:${Config.ownername}\n` + 'ORG: Pikabotz inc;\n' + `TEL;type=CELL;type=VOICE;waid=${Config.ownernumber}:+${Config.ownernumber}\n` + 'END:VCARD';
      anyaV2.sendMessage(callerId, { displayName: Config.ownername, contacts: [{ vcard }]})
      .then((owner) => anyaV2.sendMessage(callerId, { text: `_🎀 Calling bot is not allowed, ask to my owner to get unblocked_` }, { quoted: owner }))
      .catch((err) => console.log(err));
      setTimeout(async () => {
        await anyaV2.updateBlockStatus(callerId, "block");
        setTimeout(async () => {
          await anyaV2.sendMessage(Config.ownernumber + '@s.whatsapp.net', { text: `\`\`\`✨ Master...\`\`\`\n\nI just recently blocked @${callerId.split("@")[0]} because that user was calling me...`, mentions: [callerId] });
        }, 1000);
      }, 5000);
    }
  }
});

/**
 * Handling incoming messages
 *
 */

anyaV2.ev.on("messages.upsert", async (chat) => {
  const main = chat.messages[0];
  if (!main.message) return;
  if (main.message.viewOnceMessageV2) return;
  main.message = (Object.keys(main.message)[0] === 'ephemeralMessage') ? main.message.ephemeralMessage.message : main.message;
  if (main.key && main.key.remoteJid === 'status@broadcast' && Config.auto_read_status === 'true') return await anyaV2.readMessages([main.key]);
  if (main.key && main.key.remoteJid === 'status@broadcast') return;
  const { Functions, userPrefix, antif } = require('./lib/System');
  const pika = await Functions.smsg(anyaV2, JSON.parse(JSON.stringify(main)), store);
  const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
  if (!pika.message || (pika.sender === botNumber && pika.id.startsWith('BAE5'))) return;
  if (pika.chat.endsWith("broadcast")) return;
  if (Config.alwaysonline === 'true') {
    anyaV2.sendPresenceUpdate('available', pika.chat);
  }
  const bodyType = pika.body;
  var body = /^\d/.test(bodyType) ? pika.quoted ? (pika.quoted.sender === botNumber) ? await myfunc.pik4nya(pika.quoted.text.includes("_ID: ") ? pika.quoted.text : null, bodyType.trim().split(/ +/).slice(0), bodyType) : false : bodyType : bodyType;
  //const budy = typeof pika.text == "string" ? pika.text : false;
  if (body[1] && body[1] == " ") body = body[0] + body.slice(2);
  const { Bot, User, Group } = require('./lib/database/mongoDB');
  const bot = await Bot.get();
  const user = await User.get(pika.sender);
  const group = pika.isGroup ? await Group.get(pika.chat) : false;
  if (body === 'invalid') return pika.reply('_🎀 Invalid option number_');
  const { prefix, isCmd, command } = await userPrefix.userPrefix(body, bot.prefix);

  async function userSudo() { return bot.modlist.includes(pika.sender); }
  async function groupMetadata() {
    if (!pika.isGroup) return null;
    try {
        const metadata = await anyaV2.groupMetadata(pika.chat);
        return metadata;
    } catch (error) {
        console.error('❌ Error fetching group metadata:', error);
        return null;
    }
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

  if (group.antitoxic) {
    const toxicText = body.trim().split(/ +/)[0].toLowerCase();
    if (Config.badWords.includes(toxicText)) {
      const stop = await antif.antiToxic(userOwner(), await userSudo(), await userAdmin(), await botAdmin(), pika, anyaV2);
      if (stop) return;
    }
  }
  if (group.antilink && (body.toLowerCase().includes("https://") || body.includes("http://"))) {
    const stop = await antif.antiLink(userOwner(), await userSudo(), await userAdmin(), await botAdmin(), pika, anyaV2);
    if (stop) return;
  }
  if (group.antipicture && pika.mtype === "imageMessage" && !(pika.mtype === "stickerMessage")) {
    const stop = await antif.antiPicture(userOwner(), await userSudo(), await userAdmin(), await botAdmin(), pika, anyaV2);
    if (stop) return;
  }
  if (group.antivideo && pika.mtype === "videoMessage" && !(pika.mtype === "stickerMessage")) {
    const stop = await antif.antiVideo(userOwner(), await userSudo(), await userAdmin(), await botAdmin(), pika, anyaV2);
    if (stop) return;
  }
  if (!group.enabled && pika.isGroup) {
    if (!userOwner() && !(await userSudo()) && isCmd) return pika.reply(`\`\`\`❌ Not Activated!!\`\`\`\n\nI'm not enabled in this group, tell owner to type *${prefix}activate* to activate me here.`);
  }

  if (isCmd) {
    if (bot.worktype === 'self') { if (!userOwner() && !(await userSudo())) return; }
    if (bot.worktype === 'public') {}
    if (bot.worktype === 'onlyadmin') {
        if (!userOwner() && !(await userSudo()) && !(await userAdmin())) return;
        if (!pika.isGroup && !userOwner() && !(await userSudo())) return;
      }
  }
    
    if (user.ban && isCmd) {
      if (userOwner() || (await userSudo())) return pika.reply('⚠️ Maybe you changed the ownership or bot\'s number, please change the mongoDB url or make the previous user owner again.');
      if (bot.prefix === 'all' && !plugin.isPlugin(command)) return;
      return pika.react('⚠️').then(() => pika.reply(Config.message.ban));
    }
    if (group.ban && !userOwner() && !(await userSudo()) && isCmd) {
      if (bot.prefix === 'all' && !plugin.isPlugin(command)) return;
      return pika.react('⚠️').then(() => pika.reply(Config.message.banChat));
    }

    if (bot.chatbot && !isCmd && !pika.isGroup && pika.text) {
      if (!plugin.isPlugin(command)) {
        try {
          axios.get(`https://vihangayt.me/tools/chatgptv4?q=${encodeURIComponent(body)}`)
            .then((res) => pika.reply(res.data.data))
        } catch (e) {
          console.log('❌ Unable to retrieve chatgpt api.');
          axios.get(`http://api.brainshop.ai/get?bid=172502&key=ru9fgDbOTtZOwTjc&uid=[uid]&msg=${encodeURIComponent(body)}`)
            .then((res) => pika.reply(res.data.cnt))
            .catch((e) => console.log(e));
        }
        return;
      }
    }
    const args = pika.body ? body.trim().split(/ +/).slice(1) : null;
    let text;
    try {
      text = pika.body ? body.trim().split(/ +/).slice(1).join(" ") : null;
    } catch {
      text = false;
    }
    const quoted = pika.quoted ? pika.quoted : pika;
    const mime = (quoted.msg || quoted).mimetype || "";
    if (isCmd) {
      const { antiSpam } = require('./lib/lib/antispam');
      const isSpam = await antiSpam(pika.sender.split("@")[0], pika);
      if (isSpam.isSpam) {
        await anyaV2.sendMessage(pika.chat, { text: isSpam.message }, { quoted: pika });
        return;
      }
      const parameters = {
        Bot: Bot,
        Group: Group,
        User, User,
        bot: bot,
        group: group,
        prefix: prefix,
        anyaV2: anyaV2,
        pika: pika,
        userAdmin: await userAdmin(),
        userSudo: await userSudo(),
        userOwner: userOwner(),
        botAdmin: await botAdmin(),
        groupMetadata: await groupMetadata(),
        text: text,
        pickRandom: function pickRandom(list) { return list[Math.floor(list.length * Math.random())]; },
        command: command,
        args: args,
        mime: mime,
        storage: store,
        botNumber: botNumber,
        startPing: performance.now(),
      }
      const handled = await plugin.exicutePlugin(command, parameters, pika, bot);
      if (handled) return;
      await similar.similar(pika, prefix, command, bot);
    }
});

/**
 * Handling connection to WhatsApp
 * if connection is lost, but session is still valid, it will reconnect
 * if connection closed, it will turn of the process without throwing errors
 * if connected, it'll send a confirmation message
 * {@PikaBotz}
 */
anyaV2.ev.on('connection.update', async (update) => {
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
    await anyaV2.sendMessage(Config.ownernumber + '@s.whatsapp.net', { text: '_🎀 Running WA Bot_', edit: key });
  }
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

    anyaV2.sendContact = async (jid, conta, quoted = "", opts = {}) => {
        let list = [];
        for (const i of conta) {
            list.push({
                displayName: await anyaV2.getName(i + '@s.whatsapp.net'),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await anyaV2.getName(i + '@s.whatsapp.net')}\nFN:${global.ownername}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat to this bot's dev.\nitem2.EMAIL;type=INTERNET:${global.email}\nitem2.X-ABLabel:${ownername}'s Email\nitem3.URL:${global.myweb}\nitem3.X-ABLabel:${ownername}'s Email\nitem4.ADR:;;${global.adress};;;;\nitem4.X-ABLabel:${ownername}'s Location\nEND:VCARD`
            });
        }
        anyaV2.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts, }, { quoted });
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
  console.log(`Server running on port ${Port}...`);
});

connectToWhatsApp().catch((err) => console.log(err));
}, 3000);
