/**
 * Fixes a MongoDB URI to ensure it contains the 'retryWrites' and 'w=majority' parameters and removes '<' and '>' characters.
 * @param {string} uri - The MongoDB URI to be fixed.
 * @returns {string} - The fixed MongoDB URI.
 * {@creator: https://github.com/PikaBotz}
 */
exports.fix = (uri) => {
  let url = uri;
  if (!url.includes('w=majority')) {
    url += url.includes('?') ? '&retryWrites=true&w=majority' : '?retryWrites=true&w=majority';
  }
  url = url.replace(/<|>/g, '');
  return url;
}
