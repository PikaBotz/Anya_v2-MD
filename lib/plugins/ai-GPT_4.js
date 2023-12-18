const { anya } = require('../lib');

anya({
  name: [
    "gpt2"
  ],
  alias: [
    "ai2",
    "openai2",
    "chatgpt2"
  ],
  category: "ai",
  need: "query",
  react: "🧠",
  desc: "Openai's most advanceded, intelligent and trustable artificial intelligence chatGPT-4 available to use.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, pika, anyaV2) => {
 if (!text) return pika.reply("💭 Tell me something more, i wanna hear you moreee.");
 const Config = require("../../config");
 const proceed = await anyaV2.sendMessage(pika.chat, { text: "🗣️ Generating responses..." }, { quoted: pika });
 const { get } = require("axios");
 get("https://vihangayt.me/tools/azuregpt?q=" + encodeURIComponent(text))
  .then(res => {
  if (!res.data.status) return pika.edit(Config.message.error, proceed.key);
  pika.edit("*🤖 GPT-4:* " + res.data.data.choices[0].message.content, proceed.key);
  });
});
