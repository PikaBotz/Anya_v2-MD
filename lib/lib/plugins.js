const fs = require('fs');
const path = require('path');
const plugins = {};
const { tiny } = require('./stylish-font');
const pluginsPath = path.join(__dirname, '../plugins');
const { totalAnyaUsers } = require('./myfunc');

class plugin {

  /**
   * syncPlugins
   * returns name and data of all files that ends with '.js' in plugin's folder
   * {@PikaBotz}
   **/
  static syncPlugins = () => {
   fs.readdirSync(pluginsPath)
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => {
      const pluginName = path.parse(file).name;
      plugins[pluginName] = require(path.join(pluginsPath, file));
    });
  }

  /**
   * pluginParams
   * returns the needed params of the plugin
   * {creator: https://github.com/Pikabotz}
   **/
  static pluginParams = (func) => {
    const fnStr = func.toString();
    return (
      fnStr
      .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
      .match(/([^\s,]+)/g) || []
    );
  }

  /**
   * isPlugin
   * @param command to check
   * return true if the command is in commands list else false
   * {@creator: https://github.com/PikaBotz}
   **/
   static isPlugin = (command) => {
   this.syncPlugins();
   for (const i in plugins) {
    const cmds = plugins[i];
    const data = cmds.cmdName();
    const cmd = [...data.name, ...data.alias];
    if (data.name.includes(command) || data.alias.includes(command)) {
      return true;
      }
    }
  return false;
}

  /**
   * pluginSize
   * returns the counting (length) of the plugins
   * {@creator: https://github.com/PikaBotz}
   **/
  static pluginSize = () => {
  this.syncPlugins();
  let count = 0;
  for (const pluginGroupName in plugins) {
    const pluginGroup = plugins[pluginGroupName];
    count += pluginGroup.cmdName().name.length;
  } 
  return { size: count };
  }

  /*
  * makeAllmenu
  * returns all categories section with their commands in it
  * {@creator: https://github.com/PikaBotz}
  **/
  static makeAllmenu = (prefix) => {
    const allCmd = {};
    this.syncPlugins(); 
    for (const i in plugins) {
      const pluginGroup = plugins[i];
      const cmdCate = pluginGroup.cmdName().category;
      if (!allCmd.hasOwnProperty(cmdCate)) {
        allCmd[cmdCate] = [];
      }
      const cmdName = pluginGroup.cmdName().name;
      if (Array.isArray(cmdName)) {
        allCmd[cmdCate].push(...cmdName);
      } else {
        allCmd[cmdCate].push(cmdName);
      }
    }
    let caption = '';
    for (const x in allCmd) {
      caption += `╭─────────────┄┄┈•\n┠───═❮ *${x}* ❯═─┈•\n│   ╭──┈•\n`;
      const commands = allCmd[x];
      for (let i = 0; i < commands.length; i += 1) {
        const cmd = commands.slice(i, i + 1);
        caption += `│   │➛ ${cmd.map(v => prefix + tiny(v)).join(', ')}\n`;
      }
      caption += `│   ╰───────────⦁\n╰────────────────❃\n\n`;
    }
    return caption.trim();
  }

  /**
   * getPluginInfo
   * @param command name that to stalk
   * {@creator: https://github.com/PikaBotz}
   **/
   static getPluginInfo = async (command) => {
   this.syncPlugins();  
   for (const i in plugins) {
    const cmds = plugins[i];
    const namesAndAliases = [...cmds.cmdName().name, ...cmds.cmdName().alias];    
    if (namesAndAliases.includes(command)) {
      return {
        name: command,
        alias: (!cmds.cmdName().alias.length > 0) ? cmds.cmdName().alias.join(", ") : false,
        category: cmds.cmdName().category,
        react: cmds.cmdName().react ? cmds.cmdName().react : false,
        need: cmds.cmdName().need ? cmds.cmdName().need : false,
        desc: cmds.cmdName().desc
      };
    }
  }
  return false;
   }

  /**
   * exicutePlugin
   * @param command to exicute
   * @param parameters of exicuting command
   * {@creator: https://github.com/PikaBotz}
   **/
  static exicutePlugin = async (command, parameters, pika) => {
  this.syncPlugins();
  for (const i in plugins) {
    const cmds = plugins[i];
    const data = cmds.cmdName();
    const cmd = [...data.name, ...data.alias];
    if (data.name.includes(command) || data.alias.includes(command)) {
      if (data.react) {
        await pika.react(data.react);
      }
    }
    if (cmd.includes(command)) {
      const paramNames = this.pluginParams(cmds.getCommand);
      const pik4kun = paramNames.map((param) => parameters[param] || null);
      await cmds.getCommand(...pik4kun);
      await totalAnyaUsers();
      return true;
      }
    }
  }
}

module.exports = plugin;
