/**
 * Applies a cooldown period for a specific user after issuing a command.
 * 
 * @param {Object} pika - The submodule that provides functionality to interact with the user, such as sending replies.
 * @param {Object} options - An object containing the user ID and cooldown time.
 * @param {string} options.userId - The unique identifier of the user issuing the command.
 * @param {number} options.cooldownTime - The cooldown period in seconds.
 * @returns {Object} - An object containing the status code.
 * @creator: https://github.com/PikaBotz
 * @returns {Object} - An object containing the status code.
 * ⚠️ credit required if using!
 */
exports.cooldown = (pika, { userId, cooldownTime }) => {
    const cooldowns = require("../database/cooldown.json");
    const currentTime = Date.now();
    if (cooldowns[userId]) {
        const { startTime, cooldownDuration } = cooldowns[userId];
        const timeLeft = (startTime + cooldownDuration) - currentTime;
        if (timeLeft > 0) {            
            //pika.reply("*❄️ @" + userId + " cooldown!*\nTry again after _" + (timeLeft / 1000).toFixed(1) + " second(s)_", { mentions: [pika.sender] });             
            //pika.reply(`Woahh! Slow down _*@${userId}*_. You can use commands again in _*${(timeLeft / 1000).toFixed(1)}*_ seconds`, { mentions: [pika.sender] });
            pika.reply(`*\`COOLDOWN @${userId}\`*\n_❄️ Try again after ${(timeLeft / 1000).toFixed(1)} seconds_`, { mentions: [pika.sender] });
            return { status: 'COOLDOWN_ACTIVE' };
        } else {
            delete cooldowns[userId];
        }
    }
    cooldowns[userId] = {
        startTime: currentTime,
        cooldownDuration: cooldownTime * 1000
    };
    setTimeout(() => {
        delete cooldowns[userId];
    }, cooldownTime * 1000);
    return { status: 'COOLDOWN_SET' };
};
