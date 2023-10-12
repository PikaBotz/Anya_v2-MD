/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Team: Tᴇᴄʜ Nɪɴᴊᴀ Cʏʙᴇʀ Sϙᴜᴀᴅꜱ (𝚻.𝚴.𝐂.𝐒) 🚀📌 (under @P.B.inc)

📜 GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

📌 Permission & Copyright:
If you're using any of these codes, please ask for permission or mention https://github.com/PikaBotz/Anya_v2-MD in your repository.

⚠️ Warning:
- This bot is not an officially certified WhatsApp bot.
- Report any bugs or glitches to the developer.
- Seek permission from the developer to use any of these codes.
- This bot does not store user's personal data.
- Certain files in this project are private and not publicly available for edit/read (encrypted).
- The repository does not contain any misleading content.
- The developer has not copied code from repositories they don't own. If you find matching code, please contact the developer.

Contact: alammdarif07@gmail.com (for reporting bugs & permission)
          https://wa.me/918811074852 (to contact on WhatsApp)

🚀 Thank you for using Queen Anya MD v2! 🚀
**/

const fs = require('fs');
const path = require('path');
const pluginsPath = path.join(__dirname, '../plugins/');
const plugins = {};
const allCmd = {};

function getDistance(a, b) {
  const lenA = a.length;
  const lenB = b.length;
  const matrix = Array.from({ length: lenB + 1 }, (_, i) => [i]);
  for (let i = 0; i <= lenA; i++) {
  matrix[0][i] = i;
  }
  for (let i = 1; i <= lenB; i++) {
    for (let j = 1; j <= lenA; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
      matrix[i - 1][j] + 1,
      matrix[i][j - 1] + 1,
      matrix[i - 1][j - 1] + cost
      );
      if (i > 1 && j > 1 && a[j - 1] === b[i - 2] && a[j - 2] === b[i - 1]) {
      matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + cost);
      }
      if (i > 1 && j > 1 && a[j - 1] === a[j - 2] && b[i - 1] === b[i - 2]) {
      matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
       }
     }
   }
  return matrix[lenB][lenA];
}

// Load plugins
fs.readdirSync(pluginsPath)
  .filter((file) => file.endsWith('.js'))
  .forEach((file) => {
    const pluginName = path.parse(file).name;
    plugins[pluginName] = require(path.join(pluginsPath, file));
  });

for (const pluginGroupName in plugins) {
  const pluginGroup = plugins[pluginGroupName];
  const { category } = pluginGroup.cmdName();
  allCmd[category] = allCmd[category] || [];
  const commandName = pluginGroup.cmdName().name.concat(pluginGroup.cmdName().alias);
  allCmd[category].push(...(Array.isArray(commandName) ? commandName : [commandName]));
}

/**
 * Made by @PikaBotz
 */
exports.similar = async (pika, prefix, command) => {
  const correctCmd = Object.values(allCmd).reduce((acc, val) => acc.concat(val), []);
  const mostSimilar = findSimilarCmd(command, correctCmd);
  if (!mostSimilar) {
  return pika.reply(`_The command *${prefix + command}* is unavailable._`);
  } else {
  await pika.react("❌");
  return pika.reply(`❌ No command found, Do you mean *${prefix + mostSimilar}*?`);
  }
};

// Function to find the most similar command
function findSimilarCmd(command, correctCmd) {
  let similarCmd = '';
  let minDistance = Number.MAX_VALUE;
  for (const word of correctCmd) {
    const distance = getDistance(command, word);
    if (distance === 0) {
    return word; };
    if (distance < minDistance) {
      minDistance = distance;
      similarCmd = word;
      }
    }
   return minDistance <= 2 ? similarCmd : false;
 }