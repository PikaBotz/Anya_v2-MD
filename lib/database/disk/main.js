const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Bot, Cmd, Group, System, UI, User, Warn } = require('../mongodb');

class ManageDB {
  static filePath = path.resolve(__dirname, 'database.json');
  static models = { Bot, Cmd, Group, System, UI, User, Warn };

  static async reload() {
    const allData = {};

    for (const [modelName, model] of Object.entries(this.models)) {
      try {
        console.log(`Fetching data for model: ${modelName}`);
        const newData = await model.find({}).lean(); // Use .lean() for plain JS objects
        allData[modelName] = newData;
        console.log(`Fetched and set data for ${modelName}:`, newData);
      } catch (error) {
        console.error(`Error processing model ${modelName}:`, error);
      }
    }

    try {
      fs.writeFileSync(this.filePath, JSON.stringify(allData, null, 2), 'utf-8');
      console.log(`Database successfully written to ${this.filePath}`);
    } catch (error) {
      console.error('Error writing to the JSON file:', error);
    }
  }
}

module.exports = ManageDB;
