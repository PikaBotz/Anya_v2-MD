exports.cmdName = () => {
  return {
    name: ['quotes'],
    alias: ['quote','quot'],
    category: "search",
    desc: "Get Savage, Sad, Rage anime quotes."
  };
}

exports.getCommand = async (anyaV2, pika) => {
require('../../config');
    const response = await anyaV2.sendMessage(pika.chat, {
          text: message.wait,
         }, { quoted: pika });
    const { tiny } = require('../lib/stylish-font');
    const axios = require('axios');
    const get = await axios.get("https://kyoko.rei.my.id/api/quotes.php");
    const quotes = get.data.apiResult[0];
      await anyaV2.sendMessage(pika.chat, {
      text: `*👤 ${tiny("Character")} :* ${quotes.character}\n\n*📌 ${tiny("Words")} :* ${quotes.english}`,
      edit: response.key,
    });
  }
   
   
   
