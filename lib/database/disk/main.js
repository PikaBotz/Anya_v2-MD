const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Bot, Cmd, Group, System, UI, User, Warn } = require('../../lib');

class ManageDB {
  static filePath = path.resolve(__dirname, 'database.json');
  static models = { Bot, Cmd, Group, System, UI, User, Warn };

  static async reload() {
    console.log(Bot)
    let allData = {};
    if (fs.existsSync(this.filePath)) {
      try {
        allData = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
      } catch (error) {
        return console.error('Error parsing the JSON file:', error);
      }
    }
    for (const [i, mod] of Object.entries(this.models)) {
      try {
        console.log(mod)
        const newData = await mod.find({});
        const existingData = allData[i] || [];
        const existingDataMap = new Map(existingData.map(doc => [doc._id, doc]));
        newData.forEach(doc => {
          const docObj = doc.toObject();
          if (existingDataMap.has(doc._id)) {
            existingDataMap.set(doc._id, { ...existingDataMap.get(doc._id), ...docObj });
          } else existingData.push(docObj);
        });
        allData[i] = Array.from(existingDataMap.values());
      } catch (error) {
        console.error(`Error processing model ${i}:`, error);
      }
    }
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(allData, null, 2), 'utf-8');
      //console.log(`Database successfully written to ${this.filePath}`);
    } catch (error) {
      console.error('Error writing to the JSON file:', error);
    }
  }
}

module.exports = ManageDB;
