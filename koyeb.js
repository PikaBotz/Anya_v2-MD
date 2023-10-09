const forever = require("forever-monitor");

const boot = new forever.Monitor("Anyaindex.js", {
  silent: false,
});

boot.start();
