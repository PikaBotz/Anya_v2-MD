exports.cmdName = () => ({
  name: ['alive'],
  alias: [],
  category: "general",
  desc: "Bot will send alive message to show that's running."
});

exports.getCommand = async (userOwner, prefix, anyaV2, pika) => {
  require('../../config');
  await pika.react("👋🏻");
  const userq = {
    key: {
      participant: `0@s.whatsapp.net`,
      ...(pika.chat ? { remoteJid: `status@broadcast` } : {}),
    },
    message: {
      contactMessage: {
        displayName: pika.pushName,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${pika.pushName},;;;\nFN:${pika.pushName}\nitem1.TEL;waid=${pika.sender.split("@")[0]}:${pika.sender.split("@")[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
        jpegThumbnail: image_3, // Changes available
        thumbnail: image_3, // Changes available
        sendEphemeral: true,
      },
    },
  };
  const axios = require('axios');
  const { promisify } = require('util');
  const getVersion = promisify(getVersionFromGitHub);
  const botNumber = await anyaV2.decodeJid(anyaV2.user.id);
  const { tiny, fancy13 } = require('../lib/stylish-font');
  const oldVersion = require('../../package.json').version;
  const newVersion = await getVersion();
  const alive = (newVersion == oldVersion)
    ? `\`\`\`Hey, I'm alive! 👋🏻\`\`\`\n
      🤖 *${tiny("Botname")} :* @${botNumber.split("@")[0]}
      🎏 *${tiny("Version")} :* ${oldVersion}
      👤 *${tiny("User")} :* @${pika.sender.split("@")[0]}
      👑 *${tiny("Owner")} :* ${ownername}
      🧧 *${tiny("Runtime")} :* ${runtime(process.uptime()).replace(' hours', 'h').replace(' minutes', 'm').replace(' seconds', 's')}\n
      \`\`\`Reply a number:\`\`\`
      *1* for all commands list.
      *2* for categories list.\n
      _ID: QA01_`
    : (userOwner)
    ? `${fancy13("⚠️ New changes available, please update your script to stay latest.")}`
    : `${fancy13("⚠️ Sir/Ma'am please tell the owner to update his/her script, new changes are now available for this bot. Please update."}`;

  anyaV2.sendMessage(pika.chat, {
    text: alive,
    mentions: [pika.sender, botNumber]
  }, { quoted: pika });
};

async function getVersionFromGitHub() {
  try {
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

function runtime(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
  var pika = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = pika > 0 ? pika + (pika == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}
