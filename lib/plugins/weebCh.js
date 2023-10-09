exports.cmdName = () => {
  return {
    name: ['elaina',
           'hinata',
           'kakashi',
           'miku',
           'naruto',
           'onepiece',
           'akira',
           'akiyama',
           'ana',
           'asuna',
           'ayuzawa',
           'boruto',
           'chitanda',
           'chitoge',
           'deidara',
           'doraemon',
           'emilia',
           'erza',
           'gremory',
           'hestia',
           'husbu',
           'inori',
           'isuzu',
           'itachi',
           'itori',
           'kaga',
           'kagura',
           'kaori',
           'kaneki',
           'kosaki',
           'kotori',
           'kuriyama',
           'kuroha',
           'kurumi',
           'madara',
           'mikasa',
           'minato',
           'natsukawa',
           'nekonime',
           'nezuko',
           'nishimiya',
           'pokemone',
           'rem',
           'rize',
           'sagiri',
           'sakura',
           'shina',
           'shinka',
           'shizuka',
           'shota',
           'tomori',
           'toukachan',
           'tsunade',
           'yuki'],
    alias: [],
    category: "anime",
    desc: "Bot will scrape and send HD pictures of given anime character names."
  };
}

exports.getCommand = async (pickRandom, command, anyaV2, pika) => {
require('../../config');
try {
  const axios = require('axios');
    pika.reply(message.wait);  
  const get = (command !== 'kakashi')
                ? await axios.get("https://raw.githubusercontent.com/shizothetechie/ShizoApi-Scrapper/main/anime/" + command + ".json")
                : await axios.get("https://raw.githubusercontent.com/shizothetechie/ShizoApi-Scrapper/main/anime/kakasih.json");
    await pika.react("❤️");
     anyaV2.sendMessage(pika.chat, {
        image: { url: pickRandom(get.data).url },
        caption: `✨ Reply with *1* for next "${command}" picture.\n\n_ID: QA06_`,
        headerType: 4
    }, { quoted: pika })
     } catch {
     return pika.reply(message.error);
     }
   }
     
