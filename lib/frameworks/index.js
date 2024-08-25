const reactions = require(__dirname + '/reactionMedia');
const { createGoodbyeThumb } = require(__dirname + '/goodbyeTemplate');
const Template = require(__dirname + '/knights');
const QuizDatabase = require(__dirname + '/quiz/Quiz');

module.exports = {
    reactions,
    Template,
    createGoodbyeThumb,
    Quiz: QuizDatabase
};
