const myfunc = require('./myfunc');
const plugin = require('./plugins');

module.exports = {
  isUrl: myfunc.isUrl,
  getBuffer: myfunc.getBuffer,
  plugin: plugin,
  formatRuntime: myfunc.formatRuntime,
  getMemoryInfo: myfunc.getMemoryInfo,
  ping: myfunc.ping,
  dayToday: myfunc.dayToday
}
