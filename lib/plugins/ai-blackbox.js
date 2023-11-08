exports.cmdName = () => ({
  name: ["bbox"],
  alias: [],
  category: "ai",
  need: "query",
  react: "🤖",
  desc: "Blackbox ai, a text based language model commonly used for coding tasks."
});

exports.getCommand = async (text, pika, anyaV2) => {
 if (!text) return pika.reply("🗣️ Tell me something, i wanna hear you.");
 const Config = require("../../config");
 const proceed = await anyaV2.sendMessage(pika.chat, { text: "🌀 Generating reply..." }, { quoted: pika });
 const { get } = require("axios");
 get("https://vihangayt.me/tools/blackbox?q=" + encodeURIComponent(text))
  .then(res => {
  if (!res.data.status) return pika.edit(Config.message.error, proceed.key);
  pika.edit("*🤖 Blackbox:* " + res.data.data, proceed.key);
  });
};
