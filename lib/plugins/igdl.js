const { anya } = require('../lib');

anya({
  name: [
    "igdl"
  ],
  alias: [
    "instadl"
  ],
  category: "download",
  desc: "Download Insta video posts in HD.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async function getCommand(text, anyaV2, pika){
require('../../config');
  const axios = require('axios');
  if (!text) return pika.reply('I needed a insta video link.');
  if (!text.includes("instagram.com/")) return pika.reply("Please enter a valid insta video url!");
  try {
  let get = await axios.get("https://inrl-web.onrender.com/api/insta?url=" + text);
  let res = get.data;
  pika.reply(message.wait);
  await pika.react("↙️");
  await anyaV2.sendMessage(pika.chat, {
                video: { url: res.result[0] },
                caption: `*${themeemoji} Url : _${text}_*`,
                headerType: 4
              },
            { quoted: pika }
           );
         } catch {
      pika.reply(message.error);
     }
  });
