const Config = require('../../../config');
const { MongoClient } = require('mongodb');
const client = new MongoClient(Config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

(async () => {
  try {
   await client.connect();
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:');
  }
})();

const db = client.db('Queen_Anya_v2-DB');

class database {

  /**
   * modList
   * return list of all mod users / co-owners
   * {@creator: https://github.com/PikaBotz}
   **/
   static modList = async () => {
   const collection = db.collection('modUsers');
   const data = await collection.distinct("value");
   return data;
   }
  
  /**
   * banUser
   * @param user to ban/unban
   * @param action to take as ban/unban
   * @param botnumber to detect ownership
   * {@creator: https://github.com/PikaBotz}
   **/
  static banUser = async (user, action, botnumber) => {
  const collection = db.collection('banUsers');
  const mods = await this.modList();
  const banned = await collection.findOne({ value: user });
  if (action === 'ban') {
    if ([botnumber, Config.ownernumber, ...mods].includes(user)) return { status: 403 };
    if (banned) return { status: 409 };
    return collection.insertOne({ value: user })
      .then(() => { return { status: 200 }})
      .catch((error) => {
        console.error(error);
        return { status: 500 };
      });
  } else if (action === 'unban') {
    if (!banned) return { status: 404 };
    return collection.deleteOne({ value: user })
      .then(() => { return { status: 200 }})
      .catch((error) => {
        console.error(error);
        return { status: 500 };
      });
   }
}

  /**
   * banChat
   * @param id of the group chat
   * @param action to take as ban/unban
   * {@creator: https://github.com/Pikabotz}
   **/
   static banChat = async (chat, action) => {
    const collection = db.collection('banChats');
    const banned = await collection.findOne({ value: chat });
    if (/unban/.test(action)) {
      if (!banned) return { status: 404 };
      return collection.deleteOne({ value: chat })
      .then(() => { return { status: 200 }})
      .catch((error) => {
        console.error(error);
        return { status: 500 };
      });
    } else if (/ban/.test(action)) {
      if (banned) return { status: 409 };
      return collection.insertOne({ value: chat })
      .then(() => { return { status: 200 }})
      .catch((error) => {
        console.error(error);
        return { status: 500 };
      });
    }
  }

}

module.exports = database;
