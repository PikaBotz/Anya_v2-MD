exports.cmdName = () => ({
  name: ["webgen"],
  alias: [],
  category: "ai",
  need: "query",
  react: "💻",
  desc: "This AI-powered engine generates custom code for websites, allowing you to effortlessly create and design web applications tailored to your specific needs."
});

exports.getCommand = async (text, pika, anyaV2) => {
 if (!text) return pika.reply("💻 Tell me which website you wanna create, I'll write codes!");
 const Config = require("../../config");
 const proceed = await anyaV2.sendMessage(pika.chat, { text: "🌐 Writing elements..." }, { quoted: pika });
 const { get } = require("axios");
 const { fancy32 } = require("../lib/stylish-font");
 get("https://vihangayt.me/tools/genwebsite?q=" + encodeURIComponent(text))
  .then(res => {
  if (!res.data.status) return pika.edit(Config.message.error, proceed.key);
  if (res.data.data.error !== null) return pika.edit("❌ I'm facing errors while processing these codes... please use another terms.", proceed.key);
  const elements = res.data.data;
  const codes = elements.extra_info;
  let web = `〤─── ${fancy32("Web Generator AI")} ───〤\n\n`;
    web += `*💭 Code For:* ${elements.data.code ? elements.data.code : "Unknown Code"}\n\n`;
    web += `*_PLEASE COPY THE CODE AND PASTE & CHECK SOMEWHERE ELSE FOR BETTER UNDERSTANDINGS._*\n\n⟡- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -⟡\n\n`;
    web += codes.css ? `*🎨 CSS:* \`\`\`${codes.css}\`\`\`\n\n⟡- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -⟡\n\n` : "";
    web += codes.html ? `*🌐 HTML:* ${codes.html}\n\n⟡- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -⟡\n\n` : "";
    web += codes.js ? `*💻 Javascript (JS):* \`\`\`${codes.js}\`\`\`\n\n` : "";
    web += `⟡- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -⟡\n\n${Config.footer}`;
  pika.edit(web, proceed.key);
  });
};
