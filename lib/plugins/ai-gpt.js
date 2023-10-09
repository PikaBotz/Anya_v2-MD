exports.cmdName = () => {
  return {
    name: ['gpt'],
    category: "ai",
    alias: ['chatgpt'],
    desc: "Official chatgpt 4 clouds based."
  };
}

exports.getCommand = async (text, anyaV2, command, pika) => {
require('../../config');
await pika.react("🗣️");
const { get } = require('axios');
  if (!text) return pika.reply(`Please provide some text or quote a message to get a response.`);
  try {
  const wait = await anyaV2.sendMessage(pika.chat, {
    text: `\`\`\`Getting response...\`\`\``,
   }, {quoted:pika});
/**
    const prompt = encodeURIComponent(text);
    const model = 'llama';
    // Credit: GURU;
    const endpoint = `https://gurugpt.cyclic.app/gpt4?prompt=${prompt}&model=${model}`;
**/
    const endpoint = `https://vihangayt.me/tools/chatgpt5?q=${text}`;
    await get(endpoint).then((response) => {
    anyaV2.sendMessage(pika.chat, {
    text: response.data.data,
    edit: wait.key
   });
  });
  } catch (error) {
    console.error('Error:', error);
    return pika.reply(message.error);
  }
}
