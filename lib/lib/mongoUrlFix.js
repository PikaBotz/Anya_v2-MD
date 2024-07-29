/**
 * Fixes a MongoDB URI to ensure it contains the 'retryWrites', 'w=majority' parameters, 'appName', removes '<' and '>' characters if present, and updates the database name to 'anya_v2_database'.
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
 * // result might be: { status: 200, url: 'mongodb+srv://pikabotzz:myPassword@atlascluster.ytjwnhy.mongodb.net/anya_v2_database?retryWrites=true&w=majority&appName=myApp', message: 'URL corrected successfully.' }
 * @creator https://github.com/PikaBotz
 */
module.exports = {
  fix: (url) => {
    if (url.includes('<password>')) {
      return { status: 401, message: 'Password not entered!' };
    }

    const validUrlPattern = /^mongodb\+srv:\/\/([^\s@]+):([^\s@]+)@([^\s@]+\.[^\s@]+\.mongodb\.net)(\/?.*)$/;
    const match = url.match(validUrlPattern);

    if (!match) {
      return { status: 400, message: 'Invalid MongoDB URL provided.' };
    }

    const username = match[1];
    let password = match[2];
    const host = match[3];
    
    // Remove < and > from password if present
    if (password.includes('<') && password.includes('>')) {
      password = password.replace(/<|>/g, '');
    }

    // Construct the corrected URL with the database name 'anya_v2_database'
    const correctedUrl = `mongodb+srv://${username}:${password}@${host}/anya_v2_database?retryWrites=true&w=majority&appName=anya_v2_db`;

    return { status: 200, url: correctedUrl, message: 'URL corrected successfully.' };
  },
};
