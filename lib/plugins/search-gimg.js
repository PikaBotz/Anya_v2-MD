const { anya } = require('../lib');

anya({
  name: [
    "gimg"
  ],
  alias: [
    "googleimg",
    "googleimage",
    "gimage"
  ],
  category: "search",
  desc: "Search images directly from Google just by search terms.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (command, text, pickRandom, anyaV2, pika) => {
    require('../../config');
    try {
        const { sleep } = require('../lib/myfunc');
        const fetch = require('node-fetch');
        const cheerio = require('cheerio');
        if (!text) return pika.reply("Enter a search term to get Google Image!");
        await pika.react('✨');
        pika.reply(message.wait);
        async function googleImage(query) {
            const data = await fetch(`https://www.google.com/search?q=${query}&tbm=isch`, {
                headers: {
                    accept:
                        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-US,en;q=0.9,id;q=0.8',
                    'user-agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36',
                },
            }).then((response) => response.text());
            const $ = cheerio.load(data);
            const pattern =
                /\[1,\[0,"(?<id>[\d\w\-_]+)",\["https?:\/\/(?:[^"]+)",\d+,\d+\]\s?,\["(?<url>https?:\/\/(?:[^"]+))",\d+,\d+\]/gm;
            const matches = [...$.html().matchAll(pattern)];
            const decodeUrl = (url) => decodeURIComponent(JSON.parse(`"${url}"`));

            return matches
                .map(({ groups }) => decodeUrl(groups?.url))
                .filter((v) => /.*\.jpe?g|png$/gi.test(v));
        }
        const inputArray = await googleImage(text);
        const maxResults = 3; // Maximum number of results to send
        for (let count = 1; count <= Math.min(maxResults, inputArray.length); count++) {
            const image = inputArray[count - 1];
            await anyaV2.sendMessage(pika.chat, {
                image: { url: image },
                caption: `${count}`,
                headerType: 4
            });
            await sleep(10);
        }
    } catch {
        return pika.reply('Unexpected error occurred, try again.');
    }
});
