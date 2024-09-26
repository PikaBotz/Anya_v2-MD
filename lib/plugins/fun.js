const Config = require('../../config');
const axios = require('axios');
const { anya, pickRandom } = require('../lib');

//༺─────────────────────────────────────༻

anya({
            name: "couple",
            react: "👩🏻‍❤️‍👨🏻",
            category: "fun",
            desc: "Find couples in groups",
            rule: 5,
            filename: __filename
     }, async (anyaV2, pika) => {
        const metadata = await anyaV2.groupMetadata(pika.chat);
        const participants = metadata.participants;
        if (participants.length <= 3) return pika.reply("*❎ More than 3 members needed*");
        const member1 = pickRandom(participants.map(v => v.id));
        const member2 = pickRandom(participants.filter(v => v.id !== member1).map(v => v.id));
        return pika.reply(`*Ehh, something's SUS~~👀❤️*\n\n*@${member1.split('@')[0]}*\n*- - - 👩🏼‍❤️‍👨🏼 - - -*\n*@${member2.split('@')[0]}*`, { mentions: [member1, member2] });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "fact",
            react: "🤔",
            category: "fun",
            desc: "Fun facts",
            filename: __filename
     }, async (anyaV2, pika) => {
        axios.get("https://nekos.life/api/v2/fact")
        .then(({data})=> pika.reply(`\`\`\`🚀 Fun Facts 🚀\`\`\`\n\n➠ ${data.fact}`))
        .catch(err=> {
            console.error(err);
            pika.reply(Config.message.error);
        });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "flirt",
            react: "😘",
            category: "fun",
            desc: "Pickup lines",
            filename: __filename
     }, async (anyaV2, pika) => {
        const lines = pickRandom(require('../database/json/pickupLines.json'));
        return pika.reply(`*🐤Aheem~:* ${lines.replace("@user", pika.pushName)}`);
     }
)

//༺─────────────────────────────────────

anya({
        name: "quote",
        alias: ['quotes'],
        react: "🗣️",
        category: "fun",
        desc: "Get quotes",
        filename: __filename
    },
    async (anyaV2, pika) => {
        const { data } = await axios.get("https://favqs.com/api/qotd");
        return pika.reply(`
*👤 ${data.quote.author}*

_"${data.quote.body}"_

> ${Config.footer}`.trim())
    }
)

//༺------------------------------------------------------------------------------------------------

const funCommands = [
    { name: "gaycheck", alias: false, react: "👨🏼‍❤️‍👨🏻" },
    { name: "cutecheck", alias: false, react: "🥺" },
    { name: "lesbicheck", alias: ['lesbiancheck'], react: "💄" },
    { name: "hornycheck", alias: false, react: "💦" },
    { name: "prettycheck", alias: false, react: "🦋" },
    { name: "lovelycheck", alias: false, react: "🌹" },
    { name: "uglycheck", alias: false, react: "🤢" },
    { name: "handsomecheck", alias: false, react: "🌟" },
    { name: "smartcheck", alias: false, react: "😼" },
    { name: "dumbcheck", alias: false, react: "🥴" },
    { name: "strongcheck", alias: false, react: "💪🏻" },
    { name: "weakcheck", alias: false, react: "😩" },
    { name: "perfectcheck", alias: false, react: "✨" },
    { name: "flirtycheck", alias: false, react: "😚" },
    { name: "simpcheck", alias: false, react: "🫠" },
    { name: "genzcheck", alias: false, react: "🤓" },
    { name: "sigmacheck", alias: false, react: "🔥" },
    { name: "rizzcheck", alias: ['rizcheck'], react: "😏" },
    { name: "maturecheck", alias: false, react: "❤️" },
    { name: "vibeycheck", alias: false, react: "🎶" },
    { name: "wholesomecheck", alias: false, react: "🥰" },
    { name: "toxiccheck", alias: false, react: "☠️" },
    { name: "dripcheck", alias: false, react: "💧" },
    { name: "savagecheck", alias: false, react: "😈" },
    { name: "cringecheck", alias: false, react: "😬" },
    { name: "edgycheck", alias: false, react: "🖤" },
    { name: "nerdcheck", alias: false, react: "🤓" },
    { name: "chadcheck", alias: false, react: "😎" },
    { name: "goblincheck", alias: false, react: "👹" },
    { name: "gigaChadcheck", alias: false, react: "💪" },
    { name: "sturdycheck", alias: false, react: "🕺" },
    { name: "wokecheck", alias: false, react: "🌍" },
    { name: "basiccheck", alias: false, react: "💁‍♀️" },
    { name: "suscheck", alias: false, react: "👀" },
    { name: "basedcheck", alias: false, react: "🧠" },
    { name: "kingcheck", alias: false, react: "👑" },
    { name: "queencheck", alias: false, react: "👸" },
    { name: "lgbtqcheck", alias: false, react: "🏳️‍🌈" },
    { name: "beautifulcheck", alias: ['beautycheck'], react: "😍" }
];
funCommands.forEach(fun => {
    anya(
        {
            ...fun,
            need: "user",
            desc: "Check user's " + fun.name.split("check")[0] + " possibility",
            category: "fun",
            rule: 5,
            filename: __filename
        },
        async (anyaV2, pika, { db, args, prefix, command }) => {
            const percentage = Math.floor(Math.random() * 101);
            const ui = db.UI?.[0] || await new UI({ id: "userInterface" }).save();
            if (args?.[0] === "--random") {
                const metadata = await anyaV2.groupMetadata(pika.chat);
                const participants = metadata.participants;                
                if (participants.length <= 2) return pika.reply("*❎ More than 2 members needed*");
                const member = pickRandom(participants.map(v => v.id));
                const caption = `
*${fun.react} ${fun.name.toUpperCase()} ${fun.react}*

\`\`\`Name : @${member.split("@")[0]}
Possibility : ${percentage}%\`\`\`
`.trim();
                if (ui.buttons) {
                    return anyaV2.sendButtonText(pika.chat, {
                        text: caption,
                        footer: Config.footer,
                        buttons: [{
                            name: "quick_reply", 
                            buttonParamsJson: `{"display_text":"Get Random","id":"${prefix + command} --random"}`
                        }],
                        contextInfo: { mentionedJid: [member] }
                    }, { quoted: pika });
                } else {
                    return pika.reply(caption + `\n\n> type _${prefix + command} --random_ for random tag`, { mentions: [member] });
                }
            } else if (args.length > 0 || pika.quoted) {
                const user = pika.quoted ? pika?.quoted.sender : args?.[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                const caption = `
*${fun.react} ${fun.name.toUpperCase()} ${fun.react}*

\`\`\`Name : @${user.split("@")[0]}
Possibility : ${percentage}%\`\`\`
`.trim();
                if (ui.buttons) {
                    return anyaV2.sendButtonText(pika.chat, {
                        text: caption,
                        footer: Config.footer,
                        buttons: [{
                            name: "quick_reply", 
                            buttonParamsJson: `{"display_text":"Get Random","id":"${prefix + command} --random"}`
                        }],
                        contextInfo: { mentionedJid: [user] }
                    }, { quoted: pika });
                } else {
                    return pika.reply(caption + `\n\n> type _${prefix + command} --random_ for random tag`, { mentions: [user] });
                }
            } else {
                return pika.reply("_Mention or tag someone_");
            }
        }
    );
});

//༺------------------------------------------------------------------------------------------------

anya(
        {
            name: "charactercheck",
            alias: ['characheck'],
            react: "😶‍🌫️",
            need: "user",
            category: "fun",
            desc: "Check user's character",
            rule: 5,
            filename: __filename
        },
        async (anyaV2, pika, { db, args, prefix, command }) => {
            const ui = db.UI?.[0] || await new UI({ id: "userInterface" }).save();
            const characters = [
                // Positive Traits
                "good", "helpful", "joyful", "kind", "brave", "friendly", "cheerful", 
                "ambitious", "energetic", "honest", "funny", "creative", "thoughtful", 
                "caring", "optimistic", "curious", "adventurous", "trustworthy", 
                "practical", "loyal", "patient", "sincere", "supportive", "generous", 
                "wise", "humble", "passionate", "perceptive", "resilient", "mature", 
                "sensitive", "tolerant", "modest", "open-minded", "empathetic", 
                "compassionate", "charming", "adaptable", "dedicated", "enthusiastic", 
                "gentle", "genuine", "hardworking", "humorous", "independent", 
                "insightful", "inspiring", "level-headed", "nurturing", "polite", 
                "positive", "responsible", "selfless", "sophisticated", "spontaneous", 
                "sympathetic", "understanding", "warm", "wise", "witty", "generous", 
                "diligent", "modest", "reliable", "tactful", "versatile", 
                "considerate", "optimistic", "faithful", "forgiving", "grateful", 
                "idealistic", "just", "lively", "persistent", "resourceful", "sociable", 
                "steadfast", "unselfish", "vigilant", "thoughtful",

                // Negative Traits
                "bad", "mean", "cowardly", "hostile", "gloomy", "lazy", "dishonest", 
                "serious", "impulsive", "selfish", "pessimistic", "indifferent", 
                "fearful", "untrustworthy", "dreamy", "disloyal", "impatient", 
                "insincere", "critical", "stingy", "foolish", "arrogant", "apathetic", 
                "oblivious", "fragile", "childish", "insensitive", "intolerant", 
                "antisocial", "showy", "aggressive", "bossy", "cold", "controlling", 
                "cynical", "defensive", "demanding", "disrespectful", "domineering", 
                "envious", "greedy", "harsh", "hateful", "ignorant", "imprudent", 
                "insecure", "jealous", "manipulative", "moody", "narcissistic", 
                "overbearing", "paranoid", "petty", "prejudiced", "reckless", 
                "rude", "self-centered", "spiteful", "stubborn", "superficial", 
                "unforgiving", "vain", "vindictive", "apathetic", "boastful", 
                "chaotic", "clumsy", "conceited", "deceitful", "defiant", 
                "dependent", "disorganized", "distant", "egotistical", "fearful", 
                "grumpy", "impatient", "inflexible", "inconsistent", "insensitive", 
                "lazy", "moody", "obsessive", "overconfident", "overcritical", 
                "overemotional", "overzealous", "passive-aggressive", "pompous", 
                "possessive", "resentful", "sarcastic", "secretive", "self-indulgent", 
                "short-tempered", "sneaky", "stingy", "ungrateful", "unstable", 
                "untrustworthy", "vague", "vengeful", "volatile", "withdrawn",

                // Neutral/Mixed Traits
                "serious", "emotional", "quiet", "introverted", "extroverted", 
                "observant", "reserved", "unpredictable", "practical", "idealistic", 
                "realistic", "skeptical", "logical", "dreamer", "philosophical", 
                "competitive", "ambitious", "spontaneous", "traditional", "free-spirited", 
                "eccentric", "detached", "indifferent", "melancholic", "stoic", 
                "neutral", "objective", "frugal", "shy", "bold", "analytical", 
                "balanced", "calm", "cautious", "careful", "charismatic", 
                "complicated", "conservative", "decisive", "diplomatic", "empathic", 
                "emotional", "imaginative", "intuitive", "judgmental", "laid-back", 
                "liberal", "minimalistic", "modest", "mysterious", "nervous", 
                "open", "pragmatic", "quiet", "rational", "reflective", 
                "reserved", "risk-taking", "sentimental", "skeptical", "straightforward", 
                "subtle", "unassuming", "unique", "unorthodox", "vulnerable", "zealous"
            ];
            if (args?.[0] === "--random") {
                const metadata = await anyaV2.groupMetadata(pika.chat);
                const participants = metadata.participants;                
                if (participants.length <= 2) return pika.reply("*❎ More than 2 members needed*");
                const member = pickRandom(participants.map(v => v.id));
                const random = pickRandom(characters);
                const caption = `
🇨 🇭 🇦 🇷 🇦 🇨 🇹 🇪 🇷

\`\`\`Name : @${member.split("@")[0]}
Character : ${random}\`\`\`
`.trim();
                if (ui.buttons) {
                    return anyaV2.sendButtonText(pika.chat, {
                        text: caption,
                        footer: Config.footer,
                        buttons: [{
                            name: "quick_reply", 
                            buttonParamsJson: `{"display_text":"Get Random","id":"${prefix + command} --random"}`
                        }],
                        contextInfo: { mentionedJid: [member] }
                    }, { quoted: pika });
                } else {
                    return pika.reply(caption + `\n\n> type _${prefix + command} --random_ for random tag`, { mentions: [member] });
                }
            } else if (args.length > 0 || pika.quoted) {
                const user = pika.quoted ? pika?.quoted.sender : args?.[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                const random = pickRandom(characters);
                const caption = `
🇨 🇭 🇦 🇷 🇦 🇨 🇹 🇪 🇷

\`\`\`Name : @${user.split("@")[0]}
Character : ${random}\`\`\`
`.trim();
                if (ui.buttons) {
                    return anyaV2.sendButtonText(pika.chat, {
                        text: caption,
                        footer: Config.footer,
                        buttons: [{
                            name: "quick_reply", 
                            buttonParamsJson: `{"display_text":"Get Random","id":"${prefix + command} --random"}`
                        }],
                        contextInfo: { mentionedJid: [user] }
                    }, { quoted: pika });
                } else {
                    return pika.reply(caption + `\n\n> type _${prefix + command} --random_ for random tag`, { mentions: [user] });
                }
            } else return pika.reply("_Mention or tag someone_");
        }
)
