/**
 * Fixes a MongoDB URI to ensure it contains the 'retryWrites' and 'w=majority' parameters, removes '<' and '>' characters if present, and updates the database name to 'anya_v2_database'.
 * @param {string} url - The MongoDB URI to be fixed.
 * @returns {Object} - An object containing status and, if applicable, the corrected MongoDB URI.
 * @property {number} status - The status code indicating the result of the operation.
 *    - 200: URL corrected successfully.
 *    - 401: Unauthorized - Password not entered.
 *    - 400: Bad Request - Invalid MongoDB URL provided.
 * @property {string} [url] - The corrected MongoDB URI. Only present if the status is 200.
 * @property {string} [message] - A message providing additional information about the result.
 * @example
 * const result = fix('mongodb+srv://pikabotzz:<password>@atlascluster.ytjwnhy.mongodb.net/?retryWrites=true&w=majority');
 * // result might be: { status: 401, message: 'Password not entered!' }
 * @example
 * const result = fix('mongodb+srv://pikabotzz:myPassword@atlascluster.ytjwnhy.mongodb.net/someDatabase');
 * // result might be: { status: 200, url: 'mongodb+srv://pikabotzz:myPassword@atlascluster.ytjwnhy.mongodb.net/anya_v2_database?retryWrites=true&w=majority', message: 'URL corrected successfully.' }
 * @creator https://github.com/PikaBotz
 */

module.exports = {
  fix: (url) => {
    if (url.includes('<password>')) {
      return { status: 401, message: 'Password not entered!' };
    }

    const nonApplicationDriverPattern = /^mongodb\+srv:\/\/[^\s@]+:[^\s@]+@[^\s@]+\.[^\s@]+\.mongodb\.net\/?.*$/;
    if (!nonApplicationDriverPattern.test(url)) {
      return { status: 400, message: 'Invalid application driver URL.' };
    }

    // Remove < and > if the password contains them
    const matchPassword = /mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)(\/?.*)$/;
    const match = url.match(matchPassword);
    if (match && match[2].includes('<') && match[2].includes('>')) {
      url = url.replace(match[2], match[2].replace(/<|>/g, ''));
    }

    // Remove existing database name if present and add `anya_v2_db`
    const baseUrl = url.split('/')[0];
    const correctedUrl = `${baseUrl}/anya_v2_db?retryWrites=true&w=majority&appName=anya_v2_db`;
console.log(correctedUrl)
    return { status: 200, url: correctedUrl, message: 'URL corrected successfully.' };
  },
};
