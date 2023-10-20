const Config = require("../../config");
const cooldownTime = Config.spamTimer * 1000;
const maxCommands = 3;

const userCooldowns = new Map();

/**
 * Under @PikaBotz
 * {*} Param - User jid
 * {*} Object element to send reaction [optional]
 **/

exports.antiSpam = async (userId, pika) => {
  const currentTime = Date.now();
  if (!userCooldowns.has(userId)) {
    userCooldowns.set(userId, { timestamp: currentTime, commandCount: 1 });
    return false;
  }

  const userData = userCooldowns.get(userId);
  const elapsedTime = currentTime - userData.timestamp;

  if (elapsedTime < cooldownTime) {
    if (userData.commandCount >= maxCommands) {
      const remainingTime = (cooldownTime - elapsedTime) / 1000;
      await pika.react("⭕");
      return {
        isSpam: true,
        message: `‼️Slow down! Try again after *${remainingTime.toFixed(0)} seconds* cooldown later.`
      };
    } else {
      userData.commandCount++;
      userCooldowns.set(userId, { timestamp: currentTime, commandCount: userData.commandCount });
      return false;
    }
  } else {
    userCooldowns.set(userId, { timestamp: currentTime, commandCount: 1 });
    return false;
  }
};
