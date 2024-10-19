const { aiArtGenerator } = require(__dirname + '/aiArt');
const { chatGpt4 } = require(__dirname + '/gpt4v1');
const { bingChat } = require(__dirname + '/bingChat');
const { brainShopAi } = require(__dirname + '/brainShopAi');
const { blackbox } = require(__dirname + '/blackboxAi');
const { cai } = require(__dirname + '/cai');

module.exports = {
  aiArtGenerator,
  chatGpt4,
  bingChat,
  brainShopAi,
  blackbox,
  cai
};
