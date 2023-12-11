/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Management: (@teamolduser)

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

exports.cmdName = () => {
  return {
    name: ['afk'],
    category: "general",
    alias: ['dnd','awayfromkeyboard'],
    desc: "Do not disturb mode for WhatsApp."
  };
}

exports.getCommand = async (text, command, anyaV2, pika) => {
require('../../config');
await pika.react("🫥");
const { MongoClient } = require('mongodb');
const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = client.db('Queen_Anya_v2-DB'); // ⚠️ Don't change this name
 if (command.split("|")[0] === 'checkUser') return await checkUserAfk(command.split("|")[1], command.split("|")[2]);
 await afkData(pika.sender, (text ? text : 'reasone not provided'));
 async function checkUserAfk(userId, checking) {
  try {
    const collection = db.collection('afk');
    const existingUser = await collection.findOne({ user: userId });
    if (existingUser) {
      const currentTime = new Date();
      const lastOfflineTime = new Date(existingUser.time);
      if (!isNaN(lastOfflineTime.getTime()) && !isNaN(currentTime.getTime())) {
        const timeDifference = calculateTimeDifference(lastOfflineTime, currentTime);
        if (checking) {
          anyaV2.sendMessage(pika.chat, {
            text: `*🖐🏻 Don't tag this user!* he/she is offline since *${timeDifference}*.\n\n*Reason:* _${existingUser.reason}_`,
            mentions: [userId]
          }, { quoted: pika });
        } else {
          return true;
        }
      } else {
        console.error('Invalid date objects:', existingUser.time, currentTime);
      }
    } else if (checking) {
      anyaV2.sendMessage(pika.chat, {
        text: 'This user is not AFK.',
        mentions: [userId]
      }, { quoted: pika });
    }
  } catch (err) {
    console.error('Error:', err);
  }
  return false;
}
function calculateTimeDifference(startTime, endTime) {
  const timeDifferenceMs = endTime - startTime;
  const seconds = Math.floor(timeDifferenceMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    return `${hours} hours, ${remainingMinutes} minutes, ${remainingSeconds} seconds`;
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes} minutes, ${remainingSeconds} seconds`;
  } else if (seconds > 0) {
    return `${seconds} seconds`;
  } else {
    return 'less than a second';
  }
}

async function afkData(userId, text) {
  try {
    const collection = db.collection('afk');
    const existingUser = await collection.findOne({ user: userId });
    if (existingUser) {
      const currentTime = new Date();
      const lastOfflineTime = new Date(existingUser.time);
      if (!isNaN(lastOfflineTime.getTime()) && !isNaN(currentTime.getTime())) {
        const timeDifference = calculateTimeDifference(lastOfflineTime, currentTime);
        await collection.deleteOne({ user: userId });
        anyaV2.sendMessage(pika.chat, {
          text: `☀️ *@${userId.split("@")[0]}* is now online, from the offline period *${timeDifference}.*`,
          mentions: [userId]
        }, { quoted: pika });
      } else {
        pika.reply(message.error);
      }
    } else {
      const currentTime = new Date();
      const currentTimeString = currentTime.toISOString();
      const userStatus = {
        user: userId,
        time: currentTimeString,
        reason: text,
      };
      await collection.insertOne(userStatus);
      anyaV2.sendMessage(pika.chat, {
        text: `🌙 Do Not Disturb Mode is on now, *@${userId.split("@")[0]}* is now separated.\n\n*Reason:* _${text}_`,
        mentions: [userId]
      }, { quoted: pika });
    }
  } catch (err) {
    pika.reply(message.error);
  }
}

function calculateTimeDifference(startTime, endTime) {
  const timeDifferenceMs = endTime - startTime;
  const seconds = Math.floor(timeDifferenceMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    return `${hours} hours, ${remainingMinutes} minutes, ${remainingSeconds} seconds`;
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes} minutes, ${remainingSeconds} seconds`;
  } else if (seconds > 0) {
    return `${seconds} seconds`;
  } else {
    return 'less than a second';
    }
  }
}




