const myfunc = require('./myfunc');
const { pluginSize } = require('./plugins');

module.exports = {
  isUrl: myfunc.isUrl,
  getBuffer: myfunc.getBuffer,
  pluginSize: pluginSize,
  formatRuntime: myfunc.formatRuntime,
  getMemoryInfo: myfunc.getMemoryInfo,
  dayToday: myfunc.dayToday
}
