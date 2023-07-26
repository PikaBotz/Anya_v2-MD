worker: npm i -g forever && forever Anyaindex.js
web: pm2 start Anyaindex.js --deep-monitoring --attach
