exports.cmdName = () => ({
  name: ['alive'],
  alias: [],
  category: "general",
  desc: "Bot will send alive message to show that's running."
});

exports.getCommand = async (userOwner, prefix, anyaV2, pika) => {
  const Config = require('../../config');
  const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
  const { tiny, fancy13 } = require('../lib/stylish-font');
  const oldVersion = require('../../package.json').version;
  const newVersion = await getVersion();
  const alive = (newVersion == oldVersion) ? `\`\`\`Hey, I'm Alive! 👋🏻\`\`\`\n
🤖 *${tiny("Botname")} :* @${botNumber.split("@")[0]}
🎏 *${tiny("Version")} :* ${oldVersion}
👤 *${tiny("User")} :* @${pika.sender.split("@")[0]}
👑 *${tiny("Owner")} :* ${Config.ownername}
🧧 *${tiny("Runtime")} :* ${formatRuntime(process.uptime()).replace(' hours', 'h').replace(' minute', 'm').replace(' minutes', 'm').replace(' seconds', 's')}\n
\`\`\`Reply a number:\`\`\`
 *1* for all commands list.
 *2* for categories list.\n
_ID: QA01_`
  : (userOwner)
  ? `${fancy13("⚠️ New changes available, please update your script to stay latest.")}`
  : `${fancy13("⚠️ Sir/Ma'am please tell the owner to update his/her script, new changes is now available of this bot please update.")}`;
  
  anyaV2.sendMessage(pika.chat, {
    text: alive,
    mentions: [pika.sender, botNumber],
   }, { quoted: pika });
 }

 async function getVersion() {
  try {
    const axios = require('axios');
    const response = await axios.get("https://api.github.com/repos/Pikabotz/Anya_v2-MD/contents/package.json");
    if (response.status !== 200) {
      throw new Error("There's a file response error in the main repository file, please report it to the developer.");
    }
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    const packageJson = JSON.parse(content);
    if (packageJson.version) {
      return packageJson.version;
    } else {
      throw new Error("Version not found to render the message, contact the developer as soon as possible.");
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

function formatRuntime(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var pika = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var runtime = '';
  if (d > 0) runtime += d + (d === 1 ? ' day, ' : ' days, ');
  if (h > 0) runtime += h + (h === 1 ? ' hour, ' : ' hours, ');
  if (pika > 0) runtime += pika + (pika === 1 ? ' minute, ' : ' minutes, ');
  if (s > 0) runtime += s + (s === 1 ? ' second' : ' seconds');
  return runtime;
 };
