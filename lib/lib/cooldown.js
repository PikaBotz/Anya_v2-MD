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

    // Check if the user is currently in a cooldown period
    if (cooldowns[userId]) {
        const { startTime, cooldownDuration } = cooldowns[userId];
        const timeLeft = (startTime + cooldownDuration) - currentTime;

        // If still within the cooldown period, notify the user
        if (timeLeft > 0) {
            pika.reply("*❄️ @" + userId + " cooldown!*\nTry again after _" + (timeLeft / 1000).toFixed(1) + " second(s)_", { mentions: [pika.sender] });
            return { status: 'COOLDOWN_ACTIVE' }; // Cooldown active status code
        } else {
            // Cooldown period is over, delete the old cooldown data
            delete cooldowns[userId];
        }
    }

    // Set new cooldown for the user
    cooldowns[userId] = {
        startTime: currentTime,
        cooldownDuration: cooldownTime * 1000
    };

    // Schedule cleanup of the cooldown data after the cooldown period ends
    setTimeout(() => {
        delete cooldowns[userId];
        // Optional: log when the cooldown period ends
        // console.log(`Cooldown ended for user ${userId}.`);
    }, cooldownTime * 1000);

    return { status: 'COOLDOWN_SET' }; // Cooldown set status code
};
