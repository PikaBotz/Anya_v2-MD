const fs = require('fs');
const path = require('path');

class QuizDatabase {
	static filePath = path.resolve(__dirname, '../database/games/quiz/database.json');

	static load() {
		try {
			const data = fs.readFileSync(this.filePath, 'utf-8');
			return JSON.parse(data);
		} catch {
			return {};
		}
	}

	static save(database) {
		fs.writeFileSync(this.filePath, JSON.stringify(database, null, 4), 'utf-8');
	}
	
	static insert({ id, qid, correct, timeInSeconds }) {
		if (
			!id ||
			!qid ||
			!correct ||
			!timeInSeconds
		) throw new Error('Proper parameter not found!');
		const database = this.load();
    const currentTime = Date.now();
    const lastTime = currentTime + timeInSeconds * 1000;
		if (database.hasOwnProperty(id)) {
			return {
				status: false,
				code: 403,
				message: "User Already Exist"
			}
		}
		database[id] = {
			qid: qid,
      correct: correct,
      timestamp: currentTime,
			timer: timeInSeconds,
      last_time: lastTime
    };
		this.save();
	}

	static check(id) {
		if (!id) throw new Error('Id not found!');
		const database = this.load();
		return {
			status: true,
			data: database[id] || null
		}
	}

	static hasTime(id) {
		const data = this.check(id);
		if (!data) {
			return {
				status: false,
				code: 404,
				message: "User not found"
			};
		};
		const currentTime = Date.now();
		return {
			status: true,
			hasTime: currentTime > data.last_time
		};
	}
	
}

module.exports = QuizDatabase;
