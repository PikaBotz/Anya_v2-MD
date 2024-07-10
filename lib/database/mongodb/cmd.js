const mongoose = require('mongoose');

const cmStructure = new mongoose.Schema({
  locked: { type: Boolean, required: true },
  command: { type: String, required: true },
  type: { type: String, required: true },
  creator: { type: String, required: true },
  mentions: [{ type: String, required: true }] // Array of strings
});

const Schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  setcmd: { type: Map, of: cmStructure, default: {} }
});

const Cmd = mongoose.model('cmd', Schema);
module.exports = { Cmd };
