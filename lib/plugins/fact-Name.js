exports.cmdName = () => {
  return {
    name: ['fact','name'],
    alias: ['facts','names'],
    category: "search",
    desc: "Get secret and unique names and facts."
  };
}

exports.getCommand = async (command, anyaV2, pika) => {
require('../../config');
  const response = await anyaV2.sendMessage(pika.chat, {
          text: message.wait,
         }, { quoted: pika });
  const axios = require('axios');
  const fact = await axios.get("https://nekos.life/api/v2/fact");
  const name = await axios.get("https://nekos.life/api/v2/name");
  await pika.react("😮");
  (command !== 'name')
  ? await anyaV2.sendMessage(pika.chat, {
      text: `\`\`\`🧧Fun Fact !!\`\`\`\n\n=> ${fact.data.fact}`,
      edit: response.key,
    }).catch(err => {
     return pika.reply(message.error);
       })
  : await anyaV2.sendMessage(pika.chat, {
      text: `\`\`\`🔖Random Unique Name :\`\`\`\n\n=> ${name.data.name}`,
      edit: response.key,
    }).catch(err => {
     return pika.reply(message.error);
       });
     }
   
      
