const mongoose = require('mongoose');
const axios = require('axios');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    url: { type: String }
});

const Plugins = mongoose.model('plugins', Schema);

//༺─────────────────────────────────────

const installPlugins = async (rawUrl) => {
    try {
        const response = await axios.get(rawUrl);
       // const rawData = response.data;
        if (/pikabotz/.test(rawUrl.toLowerCase())) {
            const plugin = new Plugins({ id: rawUrl.split("/").pop(), url: rawUrl });
            await plugin.save();
            return { status: 200, message: "Valid plugin saved." };
        } else {
            return { status: 401, message: "Unauthorized, this plugin does not belong to `PikaBotz`." };
        }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return { status: 404, message: "Plugin Url not found." };
        }
        console.log("Plugin Url Fetching error", err);
        return { status: 500, message: "Internal Server Error" };
    }
}

//༺─────────────────────────────────────

const deletePlugins = async (idOrUrl) => {
    try {
        let result;        
        if (/^https:\/\/gist\.githubusercontent\.com\/pikabotz\//.test(idOrUrl.toLowerCase())) {
            result = await Plugins.findOneAndDelete({ url: idOrUrl });
        } else {
            result = await Plugins.findOneAndDelete({ id: idOrUrl });
        }        
        if (result) {
            return { status: 200, message: "Plugin successfully deleted." };
        } else {
            return { status: 404, message: "Plugin not found." };
        }
    } catch (err) {
        console.log("Plugin Deletion error", err);
        return { status: 500, message: "Internal Server Error" };
    }
}

module.exports = { Plugins, installPlugins, deletePlugins };
