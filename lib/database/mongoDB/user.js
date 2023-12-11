const Config = require('../../../config');
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient(Config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

(async () => {
  try {
   await client.connect();
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:');
  }
})();

const db = client.db('Queen_Anya_v2-DB');

/**
 * Represents a database class for user data in MongoDB.
 */
class database {

    /**
     * Retrieves user data from the database.
     * @param {string} user - The user identifier.
     * @returns {Promise<Object>} - The user data.
     */
    static async get(user) {
    const collection = db.collection('user');
    let data = await collection.findOne({ id: user.split('@')[0] });
    if (!data) {
        data = await this.New(user.split('@')[0]);
    } else if (data.version !== 1 || !data.version) {
        const newData = {};
        if (data.warn === undefined) {
            newData.warn = 0;
        }
        if (Object.keys(newData).length > 0) {
            await collection.updateOne({ id: user.split('@')[0] }, { $set: newData });
            data = { ...data, ...newData };
        }
    }
    return data;
}



    /**
     * Sets a field value for a user in the database.
     * @param {string} user - The user identifier.
     * @param {string} field - The field to set.
     * @param {any} value - The value to set for the field.
     * @returns {Promise<Object>} - The status of the operation.
     */
    static async set(user, field, value, options = {}) {
    const live = await this.get(user);
    if (live[field] === value) return { status: 208 };
    const collection = db.collection('user');
    let update;
    //const userData = await collection.findOne({ id: user.split('@')[0] });
    switch (field) {
        case 'ban':
            update = { $set: { ban: value } };
            break;
    }
    return collection.updateOne({ id: user.split('@')[0] }, update)
        .then(() => { return { status: 200 }; })
        .catch(() => { return { status: 500 }; });
}


    /**
     * Creates a new user entry in the database.
     * @param {string} user - The user identifier.
     * @returns {Promise<Object>} - The status of the operation.
     */
    static async New(user) {
    return new Promise((resolve, reject) => {
        const collection = db.collection('user');
        const data = {
            version: 1,
            ban: false,
            warn: 0
        };
        collection.insertOne({
            _id: new ObjectId(),
            id: user.split('@')[0],
            ...data
        })
        .then(() => resolve({ status: 200 }))
        .catch(() => reject({ status: 500 }));
    });
}

    /**
     * Performs an operation on a user's data based on the provided field and value.
     * @param {string} user - The user's identifier.
     * @param {string} field - The field to operate on.
     * @param {string} value - The value to use for the operation.
     * @returns {Promise<{status: number, warns: number}>} - The result of the operation, including the status code and the number of warns.
     */
    static async other (user, field, value) {
    await this.get(user);
    const collection = db.collection('user');
    const userData = await collection.findOne({ id: user.split('@')[0] });
   // console.log(userData)
    switch (field) {
    case 'warn':
    if (value === 'add') {
        if (userData.warn === Config.warns) return { status: 403, warns: userData.warn }; // Already exceeded warn limit
        return collection.updateOne({ id: user.split('@')[0] }, { $inc: { warn: 1 } })
        .then(async () => {
            const reCheck = await collection.findOne({ id: user.split('@')[0] });
            if (reCheck.warn === Config.warns) return { status: 429, warns: reCheck.warn }; // Warn limit exceeded after warning 
            return { status: 200, warns: reCheck.warn }; // successfully warned
        });
    } else if (value === 'del') {
    if (userData.warn === 0) return { status: 404, warns: userData.warn };
    return collection.updateOne({ id: user.split('@')[0] }, { $inc: { warn: -1 } })
        .then(async () => {
            const reCheck = await collection.findOne({ id: user.split('@')[0] });
            if (reCheck.warn === 0) return { status: 204, warns: reCheck.warn };
            return { status: 200, warns: reCheck.warn };
        });
    } else if (value === 'clear') {
       if (userData.warn === 0) return { status: 404, warns: userData.warn };
       return collection.updateOne({ id: user.split('@')[0] }, { $set: { warn: 0 } })
        .then(() => { return { status: 200, warns: 0 }; });
       }
      break;
    }
  }
}


module.exports = database;