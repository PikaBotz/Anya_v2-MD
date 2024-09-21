const fs = require('fs');
const path = require('path');

class QuizDatabase {
    static filePath = path.resolve(__dirname, '../database/games/quiz/database.json');

    /**
     * Load the quiz database from the JSON file.
     * @returns {Object} The parsed JSON object representing the quiz database.
     * 
     * @project https://github.com/PikaBotz/Anya_v2-MD
     * @creator @PikaBotz
     * ⚠️ credits needed! If you're using these codes!
     */
    static load() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to load database:', error);
            return {};
        }
    }

    /**
     * Save the quiz database to the JSON file.
     * @param {Object} database - The database object to be saved.
     * 
     * @project https://github.com/PikaBotz/Anya_v2-MD
     * @creator @PikaBotz
     * ⚠️ credits needed! If you're using these codes!
     */
    static save(database) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(database, null, 4), 'utf-8');
        } catch (error) {
            console.error('Failed to save database:', error);
        }
    }

    /**
     * Insert a new quiz entry into the database.
     * @param {Object} params - The parameters for the quiz entry.
     * @param {string} params.id - The user ID.
     * @param {string} params.qid - The quiz ID.
     * @param {boolean} params.correct - Whether the user answered correctly.
     * @param {number} params.timeInSeconds - The time allowed for the quiz in seconds.
     * @returns {Object} Status and message of the operation.
     * 
     * @throws {Error} If the required parameters are missing.
     * 
     * @project https://github.com/PikaBotz/Anya_v2-MD
     * @creator @PikaBotz
     * ⚠️ credits needed! If you're using these codes!
     */
    static insert({ id, qid, correct, timeInSeconds }) {
        if (!id || !qid || correct === undefined || !timeInSeconds) {
            throw new Error('Proper parameter not found!');
        }
        const database = this.load();
        const currentTime = Date.now();
        const lastTime = currentTime + timeInSeconds * 1000;

        if (database.hasOwnProperty(id)) {
            return {
                status: false,
                code: 403,
                message: "User Already Exists"
            };
        }

        database[id] = {
            qid: qid,
            correct: correct,
            timestamp: currentTime,
            timer: timeInSeconds,
            last_time: lastTime
        };
        this.save(database);

		return {
			status: true,
			code: 200,
			message: "Successfully uploaded"
		}
    }

    /**
     * Check the database for a specific user by ID.
     * @param {string} id - The user ID.
     * @returns {Object} The status and user data if found.
     * 
     * @throws {Error} If the ID parameter is missing.
     * 
     * @project https://github.com/PikaBotz/Anya_v2-MD
     * @creator @PikaBotz
     * ⚠️ credits needed! If you're using these codes!
     */
    static check(id) {
        if (!id) throw new Error('Id not found!');
        const database = this.load();
        return {
            status: true,
            data: database[id] || null
        };
    }

    /**
     * Check if the user still has time left on the quiz.
     * @param {string} id - The user ID.
     * @returns {Object} The status and whether the user has time left.
     * 
     * @project https://github.com/PikaBotz/Anya_v2-MD
     * @creator @PikaBotz
     * ⚠️ credits needed! If you're using these codes!
     */
    static hasTime(id) {
        const { data } = this.check(id);

        if (!data) {
            return {
                status: false,
                code: 404,
                message: "User not found"
            };
        }

        const currentTime = Date.now();
        return {
            status: true,
            hasTime: currentTime <= data.last_time
        };
    }
	
	/**
     * Delete a user from the database.
     * @param {string} id - The user ID to be deleted.
     * @returns {Object} Status and message of the deletion operation.
     * 
     * @throws {Error} If the ID parameter is missing.
     * 
     * @project https://github.com/PikaBotz/Anya_v2-MD
     * @creator @PikaBotz
     * ⚠️ credits needed! If you're using these codes!
     */
    static delete(id) {
        if (!id) throw new Error('Id not found!');
        const database = this.load();
        
        if (!database.hasOwnProperty(id)) {
            return {
                status: false,
                code: 404,
                message: "User not found"
            };
        }
        
        delete database[id];
        this.save(database);
        
        return {
            status: true,
			code: 200,
            message: "User successfully deleted"
        };
	}
}

module.exports = QuizDatabase;
