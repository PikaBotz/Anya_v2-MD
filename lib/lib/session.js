const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const { get } = require('axios');
const fsExtra = require('fs-extra'); 
const Config = require('../../config');
const anyaSessionCode = Config.sessionId.replace(/_AN_YA_/g, "");

function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}

/**
 * Under Pikabotz inc.
 * Available for public use
 */
exports.createQueenAnyaSession = async () => {
  const sessionFolderPath = path.join(__dirname, '../database/session_Queen-Anya');
  const sessionPath = path.join(sessionFolderPath, '/creds.json');  
  // Ensure that the folder exists
  fsExtra.ensureDirSync(sessionFolderPath);

  // If the JSON file doesn't exist, fetch and create it
  if (!fs.existsSync(sessionPath)) {
    try {
      if (anyaSessionCode.length < 30) {
        const { data } = await get('https://paste.c-net.org/' + anyaSessionCode);
        await fs.promises.writeFile(sessionPath, atob(data));
        console.log('🌍 Entering Queen Anya Universe...'); // Log message
      } else {
        var anyaSessionFetch = atob(anyaSessionCode);
        await fs.promises.writeFile(sessionPath, anyaSessionFetch);
        console.log('🌍 Entering Queen Anya Universe...'); // Log message
      }
    } catch (error) {
      console.error('⚠️ Session not found!');
      console.log(chalk.redBright("Error Found in " + error));
    }
  }
};


/**


const fs = require('fs');
const chalk = require('chalk');
const { get } = require('axios');
const fsExtra = require('fs-extra');
const path = require('path');
const Config = require('../../config');
const anyaSessionCode = Config.sessionId.replace(/_AN_YA_/g, "");

function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}

/**
 * Under Pikabotz inc.
 * Available for public use
 
exports.createQueenAnyaSession = async () => {
  const sessionFolderPath = path.join(__dirname, '../../database/session_Queen-Anya');
  const sessionPath = path.join(sessionFolderPath, 'creds.json');  
  fsExtra.ensureDirSync(sessionFolderPath);

  if (!fs.existsSync(sessionPath)) {
    try {
      console.log('Fetching Anya session...');
      if (anyaSessionCode.length < 30) {
        console.log('Fetching using short code:', anyaSessionCode);
        const { data } = await get('https://paste.c-net.org/' + anyaSessionCode);
        console.log('Data fetched:', data);
        await fs.promises.writeFile(sessionPath, atob(data));
        console.log('🌍 Entering Queen Anya Universe...');
      } else {
        console.log('Fetching using long code:', anyaSessionCode);
        var anyaSessionFetch = atob(anyaSessionCode);
        console.log('Session data:', anyaSessionFetch);
        await fs.promises.writeFile(sessionPath, anyaSessionFetch);
        console.log('🌍 Entering Queen Anya Universe...');
      }
    } catch (error) {
      console.log(chalk.redBright("Error Found in " + error));
    }
  }
};
**/