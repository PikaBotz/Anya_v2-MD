exports.cmdName = () => ({
  name: ["bard"],
  alias: ["gai"],
  category: "ai",
  need: "query",
  react: "🤖",
  desc: "Bard, Google bard is a text based AI language-model."
});

exports.getCommand = async (text, pika, anyaV2) => {
 if (!text) return pika.reply("Tell me something, I'm ready to reply your queries.");
 const Config = require("../../config");
 const proceed = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
 const { get } = require("axios");
 get("https://vihangayt.me/tools/bard?q=" + text)
  .then(res => {
  if (!res.data.status) return pika.edit(Config.message.error, proceed.key);
  pika.edit("*🤖 Bard :* " + res.data.data.replace(/\n/g, '\n'), proceed.key);
  });
};
