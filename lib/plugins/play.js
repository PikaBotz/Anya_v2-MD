const { anya } = require('../lib');

anya({
  name: [
    "play"
  ],
  alias: [
    "yt",
    "yts",
    "ytsearch",
    "youtube"
  ],
  category: "search",
  desc: "Search for high quality videos and audios of YouTube by search term.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (pickRandom, text, prefix, command, anyaV2, pika) => {
require('../../config');
  if (!text) return pika.reply(`Example : ${prefix + command} < your query >`);
  pika.reply(message.wait);
  const { tiny, fancy10, fancy13 } = require('../lib/stylish-font');
  const { getBuffer, formatNumber } = require('../lib/myfunc');
  const yts = require("@queenanya/ytsearch");
  const get = await yts(text);
  function getRandomNumber() {
  return Math.floor(Math.random() * 11); // Generates a random integer between 0 and 10 (inclusive)
 }
  const search = get.all[getRandomNumber()];
  await anyaV2.sendMessage(pika.chat,{
//            image: { url: search.thumbnail },
              text: 
`*🎐 ${tiny("Duration")}:* ${search.timestamp} minute
*🎏 ${tiny("Views")}:* ${formatNumber(search.views)}
*✨ ${tiny("Uploaded")}:* ${search.ago}
*🔗 ${tiny("Link")}:* ${search.url}

\`\`\`Reply a number:\`\`\`
  *1 Download Audio*
  *2 Download Video*

_ID: QA14_`,
            contextInfo:{
            externalAdReply:{
            title: search.title,
            body: `© ${fancy10('author')}: ${fancy13(search.author.name)}`,
            thumbnail: await getBuffer(search.thumbnail),
            mediaType: 2,
            mediaUrl: search.url,
            sourceUrl: search.url
                }
             },
          },
       { quoted: pika });
    });
