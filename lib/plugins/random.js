const Config = require('../../config');
const { anya, getBuffer, pickRandom } = require('../lib');

//༺─────────────────────────────────────༻

const pies = ['chinagirl', 'hijabergirl', 'indonesiagirl', 'japangirl', 'koreagirl', 'malaysiagirl', 'piesgirl', 'pies2girl', 'randomgirl', 'thailandgirl', 'vietnamgirl'];
pies.forEach(girl => {
    anya({
                name: girl,
                react: "🌬️",
                category: "random",
                desc: "Get random global girls pictures",
                filename: __filename
          }, async (anyaV2, pika, { command }) => {
              let cmd;
              cmd = command.split("girl")[0]
              const json = require(`../database/json/${cmd}.json`);
              const random = pickRandom(json);
              return await anyaV2.sendMessage(pika.chat, {
                        image: await getBuffer(random.url),
                        caption: `_Type 1 for random "${cmd} girl"_\n_ID: QA23_`
              }, { quoted:pika })
              .catch(err=> {
                    console.error(err);
                    return pika.reply("*❌ Try Again*");
              });
          }
    )
});