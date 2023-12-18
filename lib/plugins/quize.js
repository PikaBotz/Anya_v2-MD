const { anya } = require('../lib');

anya({
  name: [
    "quiz"
  ],
  alias: [
    "quize"
  ],
  category: "games",
  desc: "Test your mind here.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (args, pickRandom, prefix, text, command, anyaV2, pika) => {
  require('../../config');
  const { quizeData, isQuizeData, isQuizeID, isQuizeUserID, delQuizeUser } = require('../lib/mongoDB');
  const alreadyIn = await isQuizeData(pika.sender);
  const userData = await isQuizeUserID(pika.sender);
  if (args[0] === 'numBut') return await checkAnswer(args[1], args[2], text.replace(`${args[0]} `, '').replace(`${args[1]} `, '').replace(`${args[2]} `, ''));
  const starting = (alreadyIn)
                    ? await anyaV2.sendMessage(pika.chat, { text: '*✅ Surrendered Previous*', mentions: [pika.sender] }, { quoted: pika })
                    : await anyaV2.sendMessage(pika.chat, { text: 'Getting quize...', mentions: [pika.sender] }, { quoted: pika });
  const { get } = require('axios');
  const { sleep } = require('../lib/myfunc');
  const fetch = await get("https://the-trivia-api.com/v2/questions");
  const quize = await pickRandom(fetch.data);
  const correct = quize.correctAnswer;
  const incorrect = quize.incorrectAnswers;
  const allOptions = [correct, ...incorrect];
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }
  const mixOptions = allOptions.map((option, index) => `${index + 1}\uFE0F\u20E3 ${option}`).join('\n');
  const questionMsg = await anyaV2.sendMessage(pika.chat, { text: `_📌 Difficulty: ${quize.difficulty}_\n_📌 User: *@${pika.sender.split("@")[0]}*_\n\n*🌟 Question: ${quize.question.text}*\n\n\`\`\`Reply a number:\`\`\`\n${mixOptions}\n\n_ID: QA21_\n_UID: ${quize.id}_`, edit: starting.key, mentions: [pika.sender] });
  await sleep(500);
  const timingMsg = await anyaV2.sendMessage(pika.chat, { text: '🌈 You have only _*60*_ seconds', mentions: [pika.sender] }, { quoted: questionMsg });
  await quizeData(pika.sender, quize.id, correct, false, questionMsg.key, timingMsg.key);
  const countdownTime = quize.difficulty === 'easy' ? 30 : quize.difficulty === 'medium' ? 45 : quize.difficulty === 'hard' ? 60 : 30;

  async function countdownWithCondition() {
  try {
    for (let i = countdownTime; i >= 0; i--) {
      const alreadyIn = await isQuizeData(pika.sender);
      if (!alreadyIn) {
        break;
      }
      await anyaV2.sendMessage(pika.chat, { text: `🌈 You have only _*${i}*_ seconds`, edit: timingMsg.key, mentions: [pika.sender] });
      if (i === 0) {
        await handleTimeUp();
      }
      await new Promise(resolve => setTimeout(resolve, 900));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function handleTimeUp() {
  await anyaV2.sendMessage(pika.chat, { text: `*Time's Up! You Lost @${pika.sender.split("@")[0]}* ❌⏳`, edit: questionMsg.key, mentions: [pika.sender] });
  await anyaV2.sendMessage(pika.chat, { delete: timingMsg.key });
  await delQuizeUser(pika.sender);
}

countdownWithCondition();

function checkIdExists(dataArray, idToCheck) {
  for (const dataItem of dataArray) {
    for (const key in dataItem) {
      if (dataItem[key].id === idToCheck) {
        return true;
      }
    }
  }
  return false;
}

async function checkAnswer(user, id, answer) {
const userID = user;
const availableId = await isQuizeID();
const exists = await checkIdExists(availableId, id);
//const userData = await isQuizeUserID(user.split("@")[0]);
   if (!alreadyIn) return pika.reply('You didn\'t started any quize session yet.');
   if (!exists) return pika.reply('Question session already been expired.')
   if (alreadyIn && (userData.id !== id)) return pika.reply(`This question is not for you, type *${prefix + command}* to get new text quizzes`);
    if (alreadyIn && answer === userData.correct) {
 //   pika.reply('🎉 Correct!');
    anyaV2.sendMessage(pika.chat, { text: `*Correct! You Won @${user.split("@")[0]} 🎉🎊*`, edit: userData.question, mentions: [user], })
    .then((user) => { anyaV2.sendMessage(pika.chat, { delete: userData.timing }).then((id) => { return delQuizeUser(userID) }) });
    } else {
   anyaV2.sendMessage(pika.chat, { text: `*Wrong... You Lost @${user.split("@")[0]} 📉❌*`, edit: userData.question, mentions: [user], })
    .then((user) => { anyaV2.sendMessage(pika.chat, { delete: userData.timing }).then((user) => { return delQuizeUser(userID) }) });
        }
    }
});
