const { anya } = require('../lib');

anya({
  name: [
    "gitclone"
  ],
  alias: [
    "githubclone",
    "gityes"
  ],
  category: "download",
  desc: "Clone the repository from GitHub.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, args, prefix, command, anyaV2, pika) => {
  require('../../config');
  if (args[0] === "no") return pika.reply("✅ Aborted!");
  const { get } = require('axios');
  const fs = require('fs');
  const { join } = require('path');
  const { ssweb } = require('../lib/scraper');
  const { fancy10 } = require('../lib/stylish-font');
  if (!text) return pika.reply("Please enter a GitHub repository link to download");
  if (!text.includes('github.com/')) return pika.reply("Invalid link given.");
  const urlParts = args[0].split("github.com/");
  if (urlParts.length !== 2) {
    return pika.reply("Invalid GitHub repository link");
  }
  const [username, repository] = urlParts[1].split("/").filter(part => part !== "");
  const url = `https://github.com/${username}/${repository}/zipball/main`;
  const data = await get(`https://api.github.com/repos/${username}/${repository}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching repository data:', error);
      return "";
    });
 if ((data.size > 10000) && !(command === "gityes")) return pika.reply(`The file size is *${data.size / 1000}MB* long, Continue downloading?\n\n\`\`\`Reply a number:\`\`\`\n  *1* Yes\n  *2* No\n\n_ID: QA28_\n_Link: ${args[0]}_`);
  pika.reply(message.wait);
  const image = await ssweb(`https://github.com/${username}/${repository}`);
  const folder = './anyaV2Media';
  const downloadRepository = async () => {
    const fileName = `${username}_${repository}.zip`;
    const fullPath = join(folder, fileName);
    try {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
      const response = await get(url, {
        responseType: 'arraybuffer',
      });
      fs.writeFileSync(fullPath, response.data);
  function formatDate(dateString) {
  const dateObject = new Date(dateString);
  const month = dateObject.getMonth() + 1;
  const day = dateObject.getDate();
  const year = dateObject.getFullYear() % 100;
  return `${month}/${day}/${year}`;
}

      await anyaV2.sendMessage(pika.chat, {
        caption: `*🔮 Name:* ${data.full_name.split("/")[1]}\n` +
                 `*👤 Owner:* ${data.full_name.split("/")[0]}\n` +
                 `*🔀 isForked:* ${data.fork ? 'Yes' : 'No'}\n` +
                 `*🗣️ Language:* ${data.language}\n` +
                 `*🍽️ Forks:* ${data.forks}\n` +
                 `*🗓️ Created On:* ${formatDate(data.created_at)}\n` +
                 `*🍂 Desc:* ${(data.description !== null) ? data.description : "No desc"}\n`,
        document: fs.readFileSync(fullPath),
        fileName: fileName,
        mimetype: "application/zip",
        contextInfo: {
          externalAdReply: {
            title: `© ${fancy10(fileName)}`,
            body: data.description,
            thumbnail: image,
            showAdAttribution: true,
            mediaType: 2,
            mediaUrl: args[0],
            sourceUrl: args[0],
          },
        },
      }, { quoted: pika });
   fs.unlinkSync(fullPath);
    } catch (error) {
    return pika.reply(message.error + '\n\nMaybe the file is toooooooooo bigggggg');
    }
  };
  downloadRepository();
});
