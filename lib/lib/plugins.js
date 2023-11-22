const fs = require('fs');
const path = require('path');

module.exports = {
  pluginSize: () => {
  const pluginsPath = path.join(__dirname, '../plugins');
  const plugins = {};
  fs.readdirSync(pluginsPath)
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => {
      const pluginName = path.parse(file).name;
      plugins[pluginName] = require(path.join(pluginsPath, file));
    });
  let count = 0;
  for (const pluginGroupName in plugins) {
    const pluginGroup = plugins[pluginGroupName];
    count += pluginGroup.cmdName().name.length;
  } 
  return { size: count };
  }
}
