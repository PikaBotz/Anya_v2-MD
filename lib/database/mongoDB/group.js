const Config = require('../../../config');
const { MongoClient, ObjectId } = require('mongodb');
const { urlFix } = require('../../lib');
const uri = urlFix.fix(Config.mongoUrl);
const client = new MongoClient(uri.url, { useNewUrlParser: true, useUnifiedTopology: true });

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
     * Retrieves group data from the database.
     * If the data does not exist, creates a new entry for the group.
     * @param {string} chat - The ID of the group.
     * @returns {Promise<Object>} The group data.
     */
    static async get(chat) {
      const collection = db.collection('group');
      let data = await collection.findOne({ id: chat });        
      if (!data) {
        await this.New(chat);
        data = await collection.findOne({ id: chat });
      } else if (data.version !== 2) {
        const newData = {
          version: 2,
          nsfw: data.nsfw === undefined ? false : data.nsfw,
          antiBot: data.antiBot === undefined ? false : data.antiBot,
          antiFake: data.antiFake === undefined ? [] : data.antiFake,
          antiNsfwImg: data.antiNsfwImg === undefined ? false : data.antiNsfwImg
        };
        const needsUpdate = Object.keys(newData).some(key => data[key] !== newData[key]);
        if (needsUpdate) {
          await collection.updateOne({ id: chat }, { $set: newData });
          data = { ...data, ...newData };
         } 
      }
      return data;
   }

    /**
     * Updates a specific field of the group data in the database.
     * @param {string} chat - The ID of the group.
     * @param {string} field - The field to update.
     * @param {any} value - The new value for the field.
     * @returns {Promise<Object>} The status of the update operation.
     */
     static async set(chat, field, value) {
        await this.get(chat);
        const collection = db.collection('group');
        let update = {};
        update[field] = value;
        try {
            const live = await collection.findOne({ id: chat }, { [field]: 1, _id: 0 });
            if (live && live[field] === value) return { status: 208 };
            const res = await collection.updateOne({ id: chat }, { $set: update });
            if (res.modifiedCount > 0) {
                return { status: 200 };
            } else {
                return { status: 422 };
            }
            } catch (error) {
            console.error('❌ Error updating data:', error);
            return { status: 500 };
        }
    }

    /**
     * Creates a new entry for the group in the database.
     * @param {string} chat - The ID of the group.
     * @returns {Promise<Object>} The status of the creation operation.
     */
    static async New(chat) {
        const collection = db.collection('group');
        const data = {
            version: 2,
            enabled: false,
            nsfw: false,
            ban: false,
            antilink: false,
            antitoxic: false,
            antipicture: false,
            antivideo: false,
            antiBot: false,
            antiNsfwImg: false,
            antiFake: []
        };        
        try {
            await collection.insertOne({
                _id: new ObjectId(),
                id: chat,
                ...data
            });
            //console.log('✅ New group entry created.');
            return { status: 200 };
        } catch (error) {
            console.error('❌ Error creating new entry:', error);
            return { status: 500 };
        }
    }
}

module.exports = database;
