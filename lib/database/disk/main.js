/**
 * Manages the database and JSON file synchronization by loading data from MongoDB collections
 * and writing it to a JSON file.
 * 
 * @author @PikaBotz
 * @see https://github.com/PikaBotz/Anya_v2-MD
 * ⚠️ credits needed! If you're using these codes!
 */

const fs = require('fs');
const path = require('path');
const { Bot, Cmd, Group, System, UI, User, Warn } = require('../mongodb');

class ManageDB {
  // Path to the database JSON file
  static filePath = path.resolve(__dirname, 'database.json');

  // Models mapped to MongoDB collections
  static models = { Bot, Cmd, Group, System, UI, User, Warn };

  /**
   * Reloads the MongoDB collections and updates the database.json file with the data.
   * @returns {Promise<void>} - Resolves when the data has been written to the JSON file.
   */
  static async reload() {
    const allData = {};
    for (const [modelName, model] of Object.entries(this.models)) {
      try {
        const newData = await model.find({}).lean();
        allData[modelName] = newData;
      } catch (error) {
        console.error(error);
      }
    }
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(allData, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to the JSON file:', error);
    }
  }
}

module.exports = ManageDB;
