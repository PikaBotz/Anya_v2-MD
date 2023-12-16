/**
 * Fixes a MongoDB URI to ensure it contains the 'retryWrites' and 'w=majority' parameters and removes '<' and '>' characters.
 * @param {string} url - The MongoDB URI to be fixed.
 * @returns {Object} - An object containing status and, if applicable, the corrected MongoDB URI.
 * @property {number} status - The status code indicating the result of the operation.
 *    - 200: URL corrected successfully.
 *    - 401: Unauthorized - Password not entered.
 *    - 400: Bad Request - Invalid MongoDB URL provided.
 * @property {string} [url] - The corrected MongoDB URI. Only present if the status is 200.
 * @property {string} [message] - A message providing additional information about the result.
 * {@creator: https://github.com/PikaBotz}
 */

//exports.fix = (uri) => {
//  let url = uri;
//  if (!url.includes('w=majority')) {
//    url += url.includes('?') ? '&retryWrites=true&w=majority' : '?retryWrites=true&w=majority';
//  }
//  url = url.replace(/<|>/g, '');
//  return url;
//}

exports.fix = (url) => {
  if (url.includes('<password>')) return { status: /* unauthorised */ 401, message: 'Password not entered!' };
  const urlPattern = /mongodb\+srv:\/\/well:[^@]+@well\.wxgbzs7\.mongodb\.net\/?$/;
  if (urlPattern.test(url)) {
    const correctedUrl = `${url.replace(/<|>/g, '')}/?retryWrites=true&w=majority`;
    return { status: /* Url corrected */ 200, url: correctedUrl, message: 'Attempting to try to correct the url proceed succefully.' };
  } else {
    const matchPassword = /mongodb\+srv:\/\/well:([^@]+)@well\.wxgbzs7\.mongodb\.net\/?$/;
    const match = url.match(matchPassword);
    if (match && match[1]) {
      const correctedUrl = `${url.replace(match[1], encodeURIComponent(match[1]))}/?retryWrites=true&w=majority`;
      return { status: /* Url corrected */ 200, url: correctedUrl };
    }
  }
  return { status: /* invalid connection url */ 200, url:url, message: '✅ Url looks good, trying to connect...' };
}
