/**
 * Returns a greeting based on the current time of day and specified language.
 * 
 * @param {number} language - The language parameter to select the greeting:
 *    1: English
 *    2: Japanese
 *    3: Mexican Spanish
 *    4: Korean
 *    5: Hindi
 *    6: French
 *    7: Arabic
 *    8: Nigerian Pidgin
 * @param {Boolean} change the font? (get from ./stylish-font.js)
 * @param {number} array location of the font
 * @returns {Object} An object containing:
 *    - greeting: The greeting text in the selected language.
 *    - emoji: The emoji associated with the greeting.
 *    - greetingWithEmoji: The greeting text combined with the emoji.
 * @throws {Error} Throws an error if the language parameter is invalid.
 * @creator: https://github.com/PikaBotz
 * ⚠️ Credit required if using!
 */
exports.greetTime = (language, font = false, fontType = 42) => {
    // Define time of day
    const hours = new Date().getHours();
    let timeOfDay;

    if (hours < 6) {
        timeOfDay = 'night';
    } else if (hours < 12) {
        timeOfDay = 'morning';
    } else if (hours < 14) {
        timeOfDay = 'noon';
    } else if (hours < 18) {
        timeOfDay = 'afternoon';
    } else if (hours < 22) {
        timeOfDay = 'evening';
    } else {
        timeOfDay = 'night';
    }

    // Define greetings in different languages
    const greetings = {
        1: { // English
            morning: { greeting: 'Good morning', emoji: '🌅' },
            noon: { greeting: 'Good noon', emoji: '🌞' },
            afternoon: { greeting: 'Good afternoon', emoji: '☀️' },
            evening: { greeting: 'Good evening', emoji: '🌆' },
            night: { greeting: 'Good night', emoji: '🌙' }
        },
        2: { // Japanese
            morning: { greeting: 'おはようございます', emoji: '🌅' },
            noon: { greeting: 'こんにちは', emoji: '🌞' },
            afternoon: { greeting: 'こんにちは', emoji: '☀️' },
            evening: { greeting: 'こんばんは', emoji: '🌆' },
            night: { greeting: 'おやすみなさい', emoji: '🌙' }
        },
        3: { // Mexican Spanish
            morning: { greeting: 'Buenos días', emoji: '🌅' },
            noon: { greeting: 'Buenas tardes', emoji: '🌞' },
            afternoon: { greeting: 'Buenas tardes', emoji: '☀️' },
            evening: { greeting: 'Buenas noches', emoji: '🌆' },
            night: { greeting: 'Buenas noches', emoji: '🌙' }
        },
        4: { // Korean
            morning: { greeting: '좋은 아침', emoji: '🌅' },
            noon: { greeting: '안녕하세요', emoji: '🌞' },
            afternoon: { greeting: '안녕하세요', emoji: '☀️' },
            evening: { greeting: '안녕하세요', emoji: '🌆' },
            night: { greeting: '안녕히 주무세요', emoji: '🌙' }
        },
        5: { // Hindi
            morning: { greeting: 'सुप्रभात', emoji: '🌅' },
            noon: { greeting: 'नमस्ते', emoji: '🌞' },
            afternoon: { greeting: 'नमस्ते', emoji: '☀️' },
            evening: { greeting: 'शुभ संध्या', emoji: '🌆' },
            night: { greeting: 'शुभ रात्रि', emoji: '🌙' }
        },
        6: { // French
            morning: { greeting: 'Bonjour', emoji: '🌅' },
            noon: { greeting: 'Bon après-midi', emoji: '🌞' },
            afternoon: { greeting: 'Bon après-midi', emoji: '☀️' },
            evening: { greeting: 'Bonsoir', emoji: '🌆' },
            night: { greeting: 'Bonne nuit', emoji: '🌙' }
        },
        7: { // Arabic
            morning: { greeting: 'صباح الخير', emoji: '🌅' },
            noon: { greeting: 'مساء الخير', emoji: '🌞' },
            afternoon: { greeting: 'مساء الخير', emoji: '☀️' },
            evening: { greeting: 'مساء الخير', emoji: '🌆' },
            night: { greeting: 'تصبح على خير', emoji: '🌙' }
        },
        8: { // Nigerian Pidgin
            morning: { greeting: 'Good morning', emoji: '🌅' },
            noon: { greeting: 'Good afternoon', emoji: '🌞' },
            afternoon: { greeting: 'Good afternoon', emoji: '☀️' },
            evening: { greeting: 'Good evening', emoji: '🌆' },
            night: { greeting: 'Good night', emoji: '🌙' }
        }
    };

    // Return greeting based on the language parameter
    const selectedGreeting = greetings[language];
    if (selectedGreeting) {
        const greeting = selectedGreeting[timeOfDay];
        const { listall } = require('./stylish-font');
        return {
            greeting: font ? listall(greeting.greeting)[fontType] : greeting.greeting,
            emoji: greeting.emoji,
            greetingWithEmoji: font ? listall(greeting.greeting)[fontType] : `${greeting.greeting} ${greeting.emoji}`
        };
    } else {
        throw new Error('Language parameter is invalid');
    }
}
