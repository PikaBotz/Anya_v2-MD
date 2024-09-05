const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Bot, Cmd, Group, System, UI, User, Warn } = require('../mongodb');

class ManageDB {
  static filePath = path.resolve(__dirname, 'database.json');
  static models = { Bot, Cmd, Group, System, UI, User, Warn };

  static async reload() {
    let allData = {};
    if (fs.existsSync(this.filePath)) {
      try {
        allData = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
      } catch (error) {
        console.error('Error parsing the JSON file:', error);
        return;
      }
    }
    for (const [modelName, model] of Object.entries(this.models)) {
      try {
        // console.log(`Fetching data for model: ${modelName}`);
        const newData = await model.findOne({});
        // console.log(`New Data for ${modelName}:`, newData);
        const existingData = allData[modelName] || [];
        const existingDataMap = new Map(existingData.map(doc => [doc._id.toString(), doc])); 
        newData.forEach(doc => {
          const docObj = doc.toObject();
          const docId = doc._id.toString();
          if (existingDataMap.has(docId)) {
            existingDataMap.set(docId, { ...existingDataMap.get(docId), ...docObj });
          } else {
            existingData.push(docObj);
          }
        });
        allData[modelName] = Array.from(existingDataMap.values());
        console.log(`Updated Data for ${modelName}:`, allData[modelName]);
      } catch (error) {
        console.error(`Error processing model ${modelName}:`, error);
      }
    }
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(allData, null, 2), 'utf-8');
      // console.log(`Database successfully written to ${this.filePath}`);
    } catch (error) {
      console.error('Error writing to the JSON file:', error);
    }
  }
}

module.exports = ManageDB;
