const Config = require('../../config');
const { anya, getBuffer, pickRandom } = require('../lib');

//༺─────────────────────────────────────༻

anya({
            name: "islamicwall",
            react: "☪️",
            category: "religious",
            desc: "Get islamic wallpapers randomly",
            filename: __filename
     }, async (anyaV2, pika) => {
        const json = require("../database/json/islamicWall.json");
        const random = pickRandom(json);
        return await anyaV2.sendMessage(pika.chat,
                {
                     image: await getBuffer(random),
                     caption: "> " + Config.footer
                },
                {
                     quoted:pika
                })
                .catch(err=> {
                    console.error(err);
                    pika.reply(Config.message.error);
                });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "ganpatiwall",
            react: "🐘",
            category: "religious",
            desc: "Get ganpati wallpapers",
            filename: __filename
     }, async (anyaV2, pika) => {
        const json = require("../database/json/ganpati.json");
        const random = pickRandom(json);
        return await anyaV2.sendMessage(pika.chat,
                {
                     image: await getBuffer(random.url),
                     caption: "> " + Config.footer
                },
                {
                     quoted:pika
                })
                .catch(err=> {
                    console.error(err);
                    pika.reply(Config.message.error);
                });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "shreeram",
            alias: ['shriram'],
            react: "🌌",
            category: "religious",
            desc: "Get shreeram wallpapers",
            filename: __filename
     }, async (anyaV2, pika) => {
        const json = require("../database/json/shreeram.json");
        const random = pickRandom(json);
        return await anyaV2.sendMessage(pika.chat,
                {
                     image: await getBuffer(random.url),
                     caption: "> " + Config.footer
                },
                {
                     quoted:pika
                })
                .catch(err=> {
                    console.error(err);
                    pika.reply(Config.message.error);
                });
     }
)