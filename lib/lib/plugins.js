const commands = [];
const Config = require('../../config');

function anya(info, logic) {
    var data = info;
    data.function = logic;
    if (!info.name) data.name = false;
    if (!info.alias) data.alias = false;
    if (!info.react) data.react = Config.themeemoji;
    if (!info.need) data.need = false;
    if (!info.category) data.category = "others";
    if (!info.desc) data.desc = false;
    if (!info.rule) data.rule = 0;
    if (!info.cooldown) data.cooldown = Config.cooldown;
    if (!info.filename) data.filename = false;
    if (!info.notCmd) data.notCmd = false;
    commands.push(data);
}

module.exports = { anya, commands };