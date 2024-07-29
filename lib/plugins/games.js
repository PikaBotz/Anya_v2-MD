const Config = require('../../config');
const axios = require('axios');
const { anya, pickRandom } = require('../lib');

//༺─────────────────────────────────────༻

anya({
            name: "dare",
            react: "🎀",
            category: "games",
            desc: "Dares",
            cooldown: 8,
            filename: __filename
     }, async (anyaV2, pika) => {
            const random = pickRandom(require('../database/json/truthDare.json').dares);
            return pika.reply(`\`\`\`🎀 You Choosed Dare!\`\`\`\n\n➥ ${random}`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "truth",
            react: "🍁",
            category: "games",
            desc: "Say The Truths",
            cooldown: 8,
            filename: __filename
     }, async (anyaV2, pika) => {
            const random = pickRandom(require('../database/json/truthDare.json').truths);
            return pika.reply(`\`\`\`🍁 You Choosed Truth!\`\`\`\n\n➥ ${random}`);
     }
)