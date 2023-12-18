const { anya } = require('../lib');

anya({
  name: [
    "ping"
  ],
  category: "general",
  alias: [
    "pong"
  ],
  desc: "Get bot internet latency.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (anyaV2, pika) => {
await pika.react("📍");
  const pingMsg = await anyaV2.sendMessage(pika.chat, {
     text: 'Pinging...'
     }, {quoted:pika});
  const timestamp = require('performance-now')();
  const { exec } = require('child_process');
  exec('neofetch --stdout', async (error, stdout) => {
    const latency = (require('performance-now')() - timestamp).toFixed(2);
  anyaV2.sendMessage(pika.chat, {
     text: `*Pong ${latency}ms...*`,
     edit: pingMsg.key
    });
  });
});
