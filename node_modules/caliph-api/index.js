const { version, author } = require('./package.json');
const binary = require('./lib/binary');
const iplookup = require('./lib/iplook');
const artinama = require('./lib/artinama');
const stress = require('./lib/stress');
const cuaca = require('./lib/cuaca');
const youtube = require("./lib/youtube");
const fakeua = require("./lib/fakeua");
const tiktok = require('./lib/tiktok');
const igstalk = require('./lib/igstalk');
const carigrup = require("./lib/grupwa");
const kusonime = require("./lib/kusonime");
const emojimix = require("./lib/emojimix");
const translate = require("./lib/translate");
const rangkum = require("./lib/rangkum");


module.exports = { version, 
                   author: author.name, 
                   binary, 
                   iplookup, 
                   artinama, 
                   stress, 
                   cuaca, 
                   downloader: { 
                   youtube, 
                   tiktok 
                   }, 
                   fakeua, 
                   igstalk, 
                   carigrup, 
                   kusonime, 
                   emojimix,
                   translate,
                   rangkum
                   }
