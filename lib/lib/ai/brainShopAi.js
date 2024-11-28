const axios = require("axios");

/**
 * Fetches a response from the BrainShop AI API based on the provided user ID and prompt.
 * 
 * @param {string} userId - The unique identifier for the user interacting with the AI.
 * @param {string} prompt - The message or query to send to the BrainShop AI.
 * @returns {Promise<object>} - An object containing the response status and message from the API.
 * 
 * @throws {Error} - Throws an error if no prompt is provided or the API call fails.
 */
exports.brainShopAi = async (userId, prompt) => {
    if (!prompt) throw "Prompt needed";
    try {
        // ⚠️ If you're using this code! use your own API! Get it from brainshop website
        const response = await axios.get("http://api.brainshop.ai/get?bid=172502&key=ru9fgDbOTtZOwTjc&uid=" + userId + "&msg=" + encodeURIComponent(prompt));
        return {
            status: true,
            message: response.data.cnt
        };
    } catch (err) {
        console.error(err);
        return {
            status: false,
            message: err.message
        };
    }
};
