const { anya } = require('../lib');

anya({
  name: [
    "wiki"
  ],
  alias: [
    "wikipedia"
  ],
  category: "search",
  desc: "Search from Wikipedia.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, anyaV2) => {

    require('../../config');
    await pika.react("🌐");
    if (!text) return pika.reply("Enter something to search from Wikipedia.");
    const getting = await anyaV2.sendMessage(pika.chat, { text: message.wait }, { quoted: pika });
 try {
    const { get } = require('axios');
    const { load } = require('cheerio');
    const response = await get("https://en.wikipedia.org/wiki/" + text);
    const $ = load(response.data);
    const heading = $('#firstHeading').text().trim();
    const result = $('#mw-content-text > div.mw-parser-output').find('p').text().trim();
    anyaV2.sendMessage(pika.chat, {
      text: `*Topic:* ▶ \`\`\`${heading}\`\`\`\n\n${result}`,
      edit: getting.key
    });
  } catch (e) {
    anyaV2.sendMessage(pika.chat, {
       text: "An error occurred while fetching Wikipedia data.",
       edit: getting.key });
  }
});
