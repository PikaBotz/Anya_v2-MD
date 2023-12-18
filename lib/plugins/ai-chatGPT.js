const { anya } = require('../lib');

anya({
  name: [
    "gpt"
  ],
  alias: [
    "ai",
    "openai",
    "chatgpt"
  ],
  category: "ai",
  need: "query",
  react: "🤖",
  desc: "World's most advanceded, intelligent and kind of trustable artificial intelligence glimp available by team OpenAI.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, pika, anyaV2) => {
 if (!text) return pika.reply("💭 Tell me something about your thoughts, I'm curious to answer.");
 const Config = require("../../config");
 const proceed = await anyaV2.sendMessage(pika.chat, { text: "🗣️ Generating response..." }, { quoted: pika });
 const { get } = require("axios");
 get("https://vihangayt.me/tools/chatgpt?q=" + encodeURIComponent(text))
  .then(res => {
  if (!res.data.status) return pika.edit(Config.message.error, proceed.key);
  pika.edit("*🤖 chatGPT :* " + res.data.data, proceed.key);
  });
});
