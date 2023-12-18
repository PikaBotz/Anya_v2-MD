const commands = [];

function anya(info, logic) {
    const data = info;
    data.function = logic;
    data.delist = data.delist || false;
    data.desc = data.desc || 404; // Change default desc value here
    // data.fromMe = data.fromMe || false; // Commented out as it wasn't present in the original
    data.category = data.category || 404; // Change default category value here
    data.filename = data.filename || 404; // Change default filename value here
    commands.push(data);
    return data;
}


module.exports = { anya, AddCommand: anya, Function: anya, Module: anya, commands };