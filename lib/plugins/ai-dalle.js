const axios = require("axios");
module.exports = {
  cmdName: () => ({
    name: ["dalle"],
    alias: [],
    react: "🤖",
    need: "query",
    category: "ai",
    desc: "DALL·E: OpenAI's image generation wizard—turns text into imaginative pictures, showcasing AI's creativity in a nutshell."
  }),
  getCommand: async (text, pika, anyaV2) => {
    try {
      if (!text) return pika.reply("Tell me what you wanna see? I can create any of your imagination ✨, just explain to me.");
      const Config = require("../../config");
      const proceed = await anyaV2.sendMessage(pika.chat, { text: "✨ Creating ai image..." }, { quoted: pika });
      const response = await axios.get(`https://vihangayt.me/tools/photoleap?q=${encodeURIComponent(text)}`);      
      if (!response.status) return pika.edit("```The API isn't responding... 📶```", proceed.key);
      const { getBuffer } = require("../lib/myfunc");
      const botnumber = await anyaV2.decodeJid(anyaV2.user.id);
      anyaV2.sendMessage(pika.chat, {
        image: await getBuffer(response.data.data),
        caption: `\`\`\`Genrated '${text}' using Dall•E by @${botnumber.split("@")[0]}\`\`\`\n\n${Config.footer}`,
        mentions: [botnumber]
      }, { quoted: pika });
      pika.edit("✨ 𝐈𝐦𝐚𝐠𝐞 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐨𝐧 𝐒𝐮𝐜𝐜𝐞𝐞𝐝!", proceed.key);
    } catch (error) {
      console.error('Error in getCommand:', error.message);
      pika.reply('An error occurred while processing your request.');
    }
  }
};
