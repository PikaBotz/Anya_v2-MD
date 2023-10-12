const fs = require('fs');
const { MongoClient } = require('mongodb');
const path = require('path');
const { exec } = require('child_process');
const mongoose = require('mongoose');
const Config = require("../../../config");
const dbName = 'Queen_Anya_v2-DB'

mongoose.set('strictQuery', false);

async function connectMongoDB(mongoUrl, dbName) {
  mongoose.connect(`${mongoUrl}${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, '❌ Connection error:'));
  db.once('open', function() {
    console.log('✅ Connected to MongoDB successfully.');
    // [BETA logic]
  });
}

/**
function makeUrl(connectionURL, dbName) {
  const parts = connectionURL.match(/^(mongodb\+srv:\/\/)([^:]+):([^@]+)@([^/]+)\/([^?]+)(.*)$/);
  if (!parts) throw new Error('Invalid MongoDB connection URL format.');
  const [, protocol, username, password, clusterUrl, , options] = parts;
  return `${protocol}${username}:${password}@${clusterUrl}/${dbName}${options}`;
}
**/

//const outputDir = path.join(__dirname, 'lib', 'database', 'mongoDB');
const outputFile = path.join(__dirname, 'database.json');

async function backupMongoDB() {
  const client = new MongoClient(Config.mongoUrl);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    const data = {};
    for (const collection of collections) {
      const collectionName = collection.name;
      const collectionData = await db.collection(collectionName).find().toArray();
      data[collectionName] = collectionData;
    }
//    if (!fs.existsSync(outputDir)) {
//      fs.mkdirSync(outputDir, { recursive: true });
//    }
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    console.log(`✅ Data backup done!`);
  } catch (error) {
    console.error('❌ Error exporting database:', error);
  }
}


const workTypeSchema = new mongoose.Schema({
  self: Boolean,
  public: Boolean,
  onlyadmins: Boolean,
});
const switchSchema = new mongoose.Schema({
  single: Boolean,
  all: Boolean,
});
const prefixSchema = new mongoose.Schema({
  anticall: Boolean,
  chatbot: Boolean,
  welcome: Boolean,
  goodbye: Boolean,
  promote: Boolean,
  demote: Boolean,
  events: Boolean,
});
const WorkType = mongoose.model('WorkType', workTypeSchema);
const Switch = mongoose.model('Switch', switchSchema);
const Prefix = mongoose.model('Prefix', prefixSchema);


async function insertMongoDBdata() {
  try {
    connectMongoDB(Config.mongoUrl, dbName);
    const currentState = await WorkType.findOne();
    const currentState_2 = await Switch.findOne();
    const currentState_3 = await Prefix.findOne();
    if (!currentState) {
      await WorkType.create({ self: false, public: true, onlyadmins: false });
    }
    if (!currentState_2) {
      await Switch.create({ single: false, all: false });
    }
    if (!currentState_3) {
      await Prefix.create({
        anticall: true,
        chatbot: true,
        welcome: true,
        goodbye: true,
        promote: true,
        demote: true,
        events: true,
      });
    }
    console.log("👤 Initial data inserted successfully.");
/**
    await backupMongoDB();
    setInterval(async () => {
      await backupMongoDB();
    }, 60000);
**/
  } catch (error) {
    console.error('❌ Connection to MongoDB failed:', error);
  }
}

module.exports = {
                   insertMongoDBdata,
                   backupMongoDB
                   };
