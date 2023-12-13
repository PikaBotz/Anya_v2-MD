const P = require('pino');

function timestamp() {
  return `,"time":"${new Date().toJSON()}"`;
}

module.exports = P({ timestamp });
