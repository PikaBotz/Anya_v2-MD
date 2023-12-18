const { anya } = require('../lib');

anya({
  name: [
    "system"
  ],
  alias: [
    "information",
    "info",
    "stats"
  ],
  category: "core",
  react: "💻",
  desc: "Get real time stats of the bot.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (pika) => {
        pika.reply('😢 This command is currently shutted down for a reason.');
     });
