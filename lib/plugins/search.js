const { anya } = require('../lib');

anya({
  name: [
    "search"
  ],
  alias: [
    "google",
    "g"
  ],
  category: "search",
  desc: "Searching anything on Google.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, anyaV2, pika) => {
  require('../../config');
  const google = require("google-it");
  const processing = await anyaV2.sendMessage(pika.chat, {
            text: message.wait
          }, { quoted: pika });
  google({ query: text }).then((res) => {
            let result = `「 *Google Search Engine* 」\n\n\n\`\`\`✨ Reply a number for web screenshot\`\`\`\n\n\n`//\n\n*Search term:* ${text}\n\n\n`;
            let count = 1;
            for (let g of res) {
              result += `*${count++} Title :* ${g.title}\n`;
              result += `*🔗 Link :* ${g.link}\n\n\n`;
          //    result += `*Description :* _${g.snippet}_\n\n\n`;
             }
              result += '_ID: QA23_\n' + global.footer;
 anyaV2.sendMessage(pika.chat, {
      text: result,
      edit: processing.key, });
          });
});
