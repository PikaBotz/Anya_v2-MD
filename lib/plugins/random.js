const { anya } = require('../lib');

anya({
  name: [
    "gchina",
    "ghijaber",
    "gindonesia",
    "gjapan",
    "gkorea",
    "gmalaysia",
    "gpies",
    "gpies2",
    "grandom",
    "gthailand",
    "gvietnam"
  ],
  alias: [],
  category: "random",
  desc: "Bot will scrape and send HD pictures of given region girl names.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (pickRandom, command, anyaV2, pika) => {
require('../../config');
   if (!pika.isGroup) return pika.reply(message.group);
   pika.reply(message.wait);
   await pika.react("🎐");
    const axios = require('axios');
    const extractContent = command.split("g")[1];
    const getContent = await axios.get(`https://raw.githubusercontent.com/shizothetechie/ShizoApi-Scrapper/main/pies/${extractContent}.json`);
    const takeItPervert = await pickRandom(getContent.data);
        await anyaV2.sendMessage(
                      pika.chat, {
                      image: { url: takeItPervert.url },
                      caption: `✨ Reply with *1* for next "${command}" girl picture.\n\n_ID: QA06_`,
                      headerType: 4
                     }, { quoted: pika })
                       .catch((err) => pika.reply(message.error))
                   });
