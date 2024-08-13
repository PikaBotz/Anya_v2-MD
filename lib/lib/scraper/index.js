const { PinterestDownloader } = require(__dirname + '/pinterest');
const { playStoreSearch } = require(__dirname + '/playstore');
const { SoundCloudeSearch } = require(__dirname + '/SoundCloud');
const { RingTone } = require(__dirname + '/ringtone');
const { SteamSearch } = require(__dirname + '/steam');
const { WattPad } = require(__dirname + '/wattpad');

module.exports = {
  PinterestDownloader,
  playStoreSearch,
  SoundCloudeSearch,
  RingTone,
  SteamSearch,
  WattPad,
  trendingTwitter
};
