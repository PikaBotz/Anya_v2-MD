const { anya } = require('../lib');

anya({
  name: [
    "pinterest"
  ],
  alias: [
    "pin"
  ],
  category: "search",
  desc: "Get HD pictures directly from Pinterest.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async function getCommand(text, react, pickRandom, anyaV2, pika){
require('../../config');
  const { pinterest } = require('api-dylux');
  if (!text) return pika.reply("Enter a search term to proceed!");
  pika.reply(message.wait);
  try {
  const pic = await pinterest(text);
  anyaV2.sendMessage(pika.chat, {
                        image: { url: pickRandom(pic) },
                        caption: `*Search Term :* ${text}`,
                        headerType: 4
                      },
                    { quoted: pika }
                  );
               } catch {
          pika.reply(message.error);
        }
  await pika.react("5️⃣");
});
