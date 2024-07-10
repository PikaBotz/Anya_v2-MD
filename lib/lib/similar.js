/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Github: https://github.com/PikaBotz
🔗 Project: https://github.com/PikaBotz/Anya_v2-MD

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

const Config = require('../../config');
const { commands } = require('./plugins');
const { tiny } = require('./stylish-font');

exports.similar = async (anyaV2, pika, prefix, command, bot) => {
  if (!command) {
  bot.react ? await pika.react("❔") : null;
  return await anyaV2.sendMessage(pika.chat,
    {
       image: Config.image_1,
       caption: `🐤 Do you need any help *@${pika.sender.split("@")[0]}* baka~❔\nType _*${prefix}help*_ for my commands list`,
       mentions: [pika.sender]
    },
    {
       quoted:pika
    });
  };
  const cmdAlias = commands.filter(command => command.alias && command.alias.length > 0).map(cmd => cmd.alias);
  const cmdName = commands.filter(command => !command.notCmd).map(cmd => cmd.name);
  const mostSimilar = findSimilarCmd(command, [...cmdName, ...cmdAlias].flat(), 1);
  if (mostSimilar.length < 1) {
    return await anyaV2.sendMessage(pika.chat,
     {
        image: Config.image_1,
        caption: `❌ No such command found with *${prefix+command}*\n\nType _*${prefix}help*_ for my commands list`,
     },
     {
        quoted:pika
     });
  } else {
    bot.react ? await pika.react("❌") : null;
    const output = formatOr(mostSimilar, prefix);
    return pika.reply(`🎃 No such command found! Do you mean ${output}?`);
  }
};

function findSimilarCmd(a, b, threshold) {
  const similarWords = [];
  for (const word of b) {
    const lenA = a.length;
    const lenB = word.length;
    const matrix = Array.from({ length: lenB + 1 }, (_, i) => [i]);
    for (let i = 0; i <= lenA; i++) {
      matrix[0][i] = i;
    }
    for (let i = 1; i <= lenB; i++) {
      for (let j = 1; j <= lenA; j++) {
        const cost = a[j - 1] === word[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
        if (
          i > 1 &&
          j > 1 &&
          a[j - 1] === word[i - 2] &&
          a[j - 2] === word[i - 1]
        ) {
          matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + cost);
        }
        if (
          i > 1 &&
          j > 1 &&
          a[j - 1] === a[j - 2] &&
          word[i - 1] === word[i - 2]
        ) {
          matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
        }
      }
    }
    const distance = matrix[lenB][lenA];
    if (distance <= threshold) {
      similarWords.push(word);
    }
  }
  return similarWords;
}

function formatOr(similarWords, prefix) {
  const length = similarWords.length;
  if (length === 1) {
    return `*${prefix + similarWords[0]}*`;
  } else if (length === 2) {
    return `*${prefix + similarWords[0]}* or *${prefix + similarWords[1]}*`;
  } else if (length >= 3) {
    const limitedWords = similarWords.slice(0, 3);
    const lastWord = limitedWords.pop();
    return `*${prefix}${limitedWords.join('*, *' + prefix)}* or *${prefix + lastWord}*`;
  }
}
