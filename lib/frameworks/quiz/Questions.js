const axios = require('axios');

class Questions {
    static baseUrl = "https://opentdb.com/api.php?";

    /**
     * Fetch questions from the Open Trivia Database API.
     * @param {Object} params - The parameters for the API request.
     * @param {number} params.length - The number of questions to fetch.
     * @param {number} params.category - The category ID for the questions.
     * @param {string} params.difficulty - The difficulty level (easy, medium, hard).
     * @param {string} params.type - The type of questions (multiple, boolean).
     * @returns {Promise<Object>} The API response status and results or error message.
     * 
     * @project https://github.com/PikaBotz/Anya_v2-MD
     * @creator @PikaBotz
     * ⚠️ credits needed! If you're using these codes!
     */
    static async get({ length = 1, category, difficulty, type }) {

        const queryParams = [
            `amount=${length}`,
            category ? `category=${category}` : "",
            difficulty ? `difficulty=${difficulty}` : "",
            type ? `type=${type}` : ""
        ].filter(Boolean).join("&");

        try {
            const { data } = await axios.get(this.baseUrl + queryParams);
            return {
                status: true,
                returns: data.results
            };
        } catch (err) {
            console.error("Error While Fetching API:", err);
            return {
                status: false,
                message: err.message
            };
        }
    }
}

module.exports = Questions;
