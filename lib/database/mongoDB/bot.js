const Config = require('../../../config');
const { MongoClient } = require('mongodb');
const { urlFix } require('../../lib');
const client = new MongoClient(urlFix.fix(Config.mongoUrl), { useNewUrlParser: true, useUnifiedTopology: true });

(async () => {
  try {
   await client.connect();
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:');
  }
})();

const db = client.db('Queen_Anya_v2-DB');

/**
 * Represents a database.
 * @class
 */
class database {

    /**
     * Retrieves the bot configuration data from the database.
     * @returns {Object} The status of the operation.
     *                  - status: 200 if successful, 500 if there was an error.
     */
    static async get() {
      //  console.log(db)
        const collection = db.collection('bot');
        const data = await collection.findOne();
        return data;
    }

    /**
     * Sets the value of a field in the 'bot' collection.
     *
     * @param {string} field - The field to be updated.
     * @param {any} value - The new value for the field.
     * @returns {Object} - The status of the update operation.
     *                    - { status: 200 } if the update is successful.
     *                    - { status: 404 } if the field is invalid.
     *                    - { status: 500 } if there is an error during the update.
     */
    static async set(field, value) {
        const collection = db.collection('bot');
        const live = await collection.findOne({}, { [field]: 1, _id: 0 });
        if (live && live[field] === value) return { status: 208 };
        let update = {};
        update[field] = value;
        try {
            await collection.updateOne({}, update);
            return { status: 200 };
        } catch (err) {
            console.error(err);
            return { status: 500 };
        }
    }

    /**
     * Pushes data to a specified field in the 'bot' collection of the MongoDB database.
     * @param {string} field - The field to update in the 'bot' collection.
     * @param {any} data - The data to push to the specified field.
     * @param {string} action - The action to perform ('add' or 'del').
     * @returns {Promise<{ status: number }>} - The status of the operation (200 for success, 400 for invalid field, 500 for error).
     */
    static async push(field, data, action) {
    const collection = db.collection('bot');
    let update;
    switch (field) {
        case 'modlist':
            if (action === 'add') {
                update = { $push: { modlist: data } };
            } else if (action === 'del') {
                update = { $pull: { modlist: data } };
            }
            break;
        default:
            console.log('❌ Invalid field', field);
            return { status: 400 };
          }
    try {
        await collection.updateOne({}, update);
        return { status: 200 };
    } catch (err) {
        console.error(err);
        return { status: 500 };
       }
   }
}

module.exports = database;
