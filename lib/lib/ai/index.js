const { aiArtGenerator } = require(__dirname + '/aiArt');
const { chatGpt4 } = require(__dirname + '/gpt4v1');
const { bingChat } = require(__dirname + '/bingChat');
  
module.exports = {
  aiArtGenerator,
  chatGpt4,
  bingChat
};
