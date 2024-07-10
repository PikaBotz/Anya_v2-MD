const axios = require('axios');
const Config = require('../../config');
const { anya, pickRandom, getBuffer, formatDate } = require('../lib');

//༺─────────────────────────────────────༻

anya({
        name: "blackbox",
        alias: ['bbox'],
        react: "🤖",
        category: "ai",
        need: "query",
        desc: "Chat with Blackbox AI",
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`Example: ${prefix + command} Help me in coding`);
        const { key } = await pika.keyMsg("💭 Typing...");
        axios.get("https://vihangayt.me/tools/blackbox?q=" + encodeURIComponent(args.join(" ")))
        .then((response) => {
            if (!response.data.status) return pika.edit(Config.message.error, key);
            pika.edit(`*💬 Blackbox :* ${response.data.data.split("![blackbox-video-link]")[0]}`, key);
        });
    }
)

//༺─────────────────────────────────────༻

anya({
        name: "ai",
        alias: ['gpt', 'chatgpt'],
        react: "🤖",
        category: "ai",
        need: "query",
        desc: "Chat with chatGPT v4 AI",
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command}) => {
        if (args.length < 1) return pika.reply(`Example: ${prefix + command} How to make a bomb`);
        const { key } = await pika.keyMsg("💭 Typing...");
        const url = pickRandom([
            'https://vihangayt.me/tools/chatgptv4?q=',
            'https://vihangayt.me/tools/chatgpt?q=',
            'https://vihangayt.me/tools/chatgpt2?q=',
            'https://vihangayt.me/tools/chatgpt3?q=',
            'https://vihangayt.me/tools/chatgpt4?q='
        ]);
        axios.get(url + encodeURIComponent(args.join(" ")))
        .then((response) => {
            if (!response.data.status) return pika.edit(Config.message.error, key);
            pika.edit(`*💬 chatGPT v4 :* ${response.data.data}`, key);
        });
    }
)

//༺─────────────────────────────────────༻

anya({
        name: "dalle",
        alias: ['aiimg'],
        react: "🤖",
        category: "ai",
        need: "query",
        desc: "Artificial intelligence image generator",
        cooldown: 10,
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command}) => {
        if (args.length < 1) return pika.reply(`Example: ${prefix + command} Barbie in hell`);
        const { key } = await pika.keyMsg(`\`\`\`🧩 Generating image...\`\`\``);
        axios.get("https://vihangayt.me/tools/photoleap?q=" + encodeURIComponent(args.join(" ")))
        .then(async (response) => {
            if (!response.data.status) return pika.edit(response.data.err, key);
            const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
            await anyaV2.sendMessage(pika.chat,
                {
                    image: await getBuffer(response.data.data),
                    caption: `\`\`\`Genrated '${args.join(" ")}' using Dall•E by @${botNumber.split("@")[0]}\`\`\`\n\n${Config.footer}`,
                    mentions: [botNumber]
                },
                {
                    quoted: pika
                })
                .then(() => pika.deleteMsg(key))
                .catch((err) => {
                    console.error(err);
                    pika.edit(Config.message.error, key);
            })
        })
    }
)

//༺─────────────────────────────────────༻

anya({
        name: "sai",
        alias: ['saimg'],
        react: "🤖",
        need: "query",
        category: "ai",
        desc: "Search from AI image collection",
        cooldown: 10,
        filename: __filename
    },
    async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`Example: ${prefix + command} Yellow taxi`);
        const { key } = await pika.keyMsg(Config.message.wait);
        axios.get("https://vihangayt.me/tools/lexicaart?q=" + encodeURIComponent(args.join(" ")))
        .then(async (response) => {
            if (response.data.data.length < 1) return pika.edit(`_❌ No results found for ${args.join(" ")}_`);
            const one = pickRandom(response.data.data);
            const two = pickRandom(response.data.data);
            const three = pickRandom(response.data.data);
            for (const picture of [one, two, three]) {
                await anyaV2.sendMessage(pika.chat,
                    {
                        image: await getBuffer(pickRandom(picture.images).url),
                        caption: `*🧿 Tɪᴛʟᴇ :* _${picture.prompt}_\n\n*📆 Uᴘʟᴏᴀᴅᴇᴅ Oɴ :* _${formatDate(picture.timestamp).date}_\n\n${Config.footer}`
                    },
                    {
                        quoted: pika
                    })
                .then(() => pika.deleteMsg(key))
                .catch((err) => {
                    console.error(err);
                    pika.edit(Config.message.error, key);
                })
            }
        })
    }
)