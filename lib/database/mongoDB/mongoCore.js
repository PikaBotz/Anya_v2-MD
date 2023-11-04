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
const dbName = 'Queen_Anya_v2-DB'

async function connectMongoDB(mongoUrl, dbName) {
  const client = new MongoClient(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
  });

  try {
    await client.connect();
    const database = client.db(dbName);
    return database;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    await insertMongoDBdata();
  }
}

async function insertInitialData(db) {
  try {
    const collection = db.collection('WORKTYPE');
    const collection_2 = db.collection('SWITCH');
    const collection_3 = db.collection('PREFIX');
    const currentState = await collection.findOne({});
    const currentState_2 = await collection_2.findOne({});
    const currentState_3 = await collection_3.findOne({});
    if (!currentState) {
      await collection.insertOne({ self: false, public: true, onlyadmins: false });
    }
    if (!currentState_2) {
      await collection_2.insertOne({ single: false, all: false });
    }
    if (!currentState_3) {
      await collection_3.insertOne({
        anticall: true,
        chatbot: true,
        welcome: false,
        goodbye: false,
        promote: false,
        demote: false,
        events: false,
      });
    }
    console.log('👤 Initial data inserted');
  } catch (error) {
    console.error(error);
  }
}

async function insertMongoDBdata() {
  const mongoDBUrl = Config.mongoUrl;
  try {
    const db = await connectMongoDB(mongoDBUrl, dbName);
    console.log(`✅ Connected to mongoDB successfully.`);
    await insertInitialData(db);
  } catch (error) {
    console.error(error);
  }
}


module.exports = {
                   insertMongoDBdata
//                   backupMongoDB
                   };
