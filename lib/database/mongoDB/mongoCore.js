/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Team: Tᴇᴄʜ Nɪɴᴊᴀ Cʏʙᴇʀ Sϙᴜᴀᴅꜱ (𝚻.𝚴.𝐂.𝐒) 🚀📌 (under @P.B.inc)

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

const { MongoClient } = require('mongodb');
const Config = require("../../../config");
const dbName = 'Queen_Anya_v2-DB';
const Default = require('./default');
const { urlFix } = require('../../lib');
const chalk = require('chalk');

/*===================================*/
const badWords = [
  "vagina",
  "dick",
  "mdrchod",
  "mdrchod",
  "chutiya",
  "lodu",
  "whore",
  "hore",
  "hoe",
  "hoes",
  "lode",
  "cum",
  "idiot",
  "bastard",
  "cunt",
  "butt",
  "pussy",
  "chut",
  "suck",
  "scum",
  "scumbag",
  "niggr",
  "nigga",
  "chod",
  "bhenchod",
  "bc",
  "bhodike",
  "bsdk","randi",
  "gandu",
  "stfu",
  "ass",
  "asshole",
  "madarchod",
  "fuck",
  "motherfucker",
  "mother fucker",
  "mf",
  "mfs",
  "fk",
  "fck",
  "gand",
  "laund",
  "loda",
  "gulambi"];
/*===================================*/
async function connectMongoDB() {
  const response = urlFix.fix(Config.mongoUrl);
  //console.log(response)
  if (response.status === 401) return console.log(chalk.bgRed('[ WARNING ]'), chalk.red(response.message));
  if (response.status === 400) return console.log(chalk.bgRed('[ ERROR ]'), chalk.red(response.message));
  if (response.status === 200) {
     console.log(response.message);
  }
  const uri = response.url;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    return null;
  }
}


async function insertInitialData(db) {
  try {
    const collection = db.collection('bot');
    const currentState = await collection.findOne({});
    const data = {
      version: 3,
      react: true,
      prefix: 'multi',
      worktype: 'public',
      chatbot: true,
      anticall: true,
      welcome: false,
      goodbye: false,
      promoteMsg: false,
      demoteMsg: false,
      enabled: true,
      autoStatusRead: true,
      alwaysOnline: false,
      autoMsgRead: true,
      autoTyping: false,
      autoReactMsg: false,
      autoReply: true,
      autoVoice: true,
      autoBlockPM: false,
      antiDeleteMsg: true,
      badWords: badWords,
      modlist: [],
      autoReplyText: []
    } 
    if (!currentState) {
      await collection.insertOne(data);
      console.log('👤 Initial data inserted');
    } else  {
      const newData = {
        version: 3,
        autoTyping: currentState.autoTyping === undefined ? false : currentState.autoTyping,
        autoMsgRead: currentState.autoMsgRead === undefined ? true : currentState.autoMsgRead,
        alwaysOnline: currentState.alwaysOnline === undefined ? false : currentState.alwaysOnline,
        autoStatusRead: currentState.autoStatusRead === undefined ? true : currentState.autoStatusRead,
        autoReactMsg: currentState.autoReactMsg === undefined ? false : currentState.autoReactMsg,
        autoReply: currentState.autoReply === undefined ? true : currentState.autoReply,
        autoVoice: currentState.autoVoice === undefined ? true : currentState.autoVoice,
        autoBlockPM: currentState.autoBlockPM === undefined ? false : currentState.autoBlockPM,
        antiDeleteMsg: currentState.antiDeleteMsg === undefined ? true : currentState.antiDeleteMsg,
        welcomeMsg: currentState.welcomeMsg === undefined ? Default.welcomeMsg : currentState.welcomeMsg,
        leftMsg: currentState.leftMsg === undefined ? Default.leftMsg : currentState.leftMsg,
        aliveMsg: currentState.aliveMsg === undefined ? Default.aliveMsg : currentState.aliveMsg,
        badWords: currentState.badWords === undefined ? badWords : currentState.badWords,
        autoReplyText: currentState.autoReplyText === undefined ? [] : currentState.autoReplyText
      };
      const needsUpdate = Object.keys(newData).some(key => currentState[key] !== newData[key]);
      if (needsUpdate) {
        await collection.updateOne({}, { $set: newData });
        console.log('👤 Initial data updated');
      } else {
        console.log('✅ Data already updated!');
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function insertMongoDBdata() {
  try {
    const db = await connectMongoDB();
    console.log(`✅ Connected to mongoDB successfully.`);
    await insertInitialData(db);
  } catch (error) {
    console.error(error);
  }
}


module.exports = {
                   insertMongoDBdata,
                   connectMongoDB
                   };
