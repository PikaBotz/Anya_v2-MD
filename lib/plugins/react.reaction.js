module.exports = {
  cmdName: () => ({
    name: [
   "awoo",
   "bonk",
   "bite",
   "blush",
   "cuddle",
   "cry",
   "cringe",
   "dance",
   "hug",
   "happy",
   "handhold",
   "highfive",
   "glomp",
   "kiss",
   "kill",
   "kick",
   "lick",
   "nom",
   "pat",
   "ponk",
   "smug",
   "smile",
   "slap",
   "wave",
   "wink",
   "yeet",
  ],
    alias: [],
    category: "reaction",
    react: "👻",
    desc: "React with emotion! Use the 'reaction' command to share feelings instantly with fun stickers."
  }),
  
getCommand: async (pika, anyaV2, command) => {
  const Config = require("../../config");
  const { get } = require("axios");
  const { Sticker, StickerTypes } = require("wa-sticker-formatter");
  const fetch = await get(`https://api.waifu.pics/sfw/${command}`);

  const media = await getBuffer(fetch.data.url);
  const sticker = new Sticker(media, {
         pack: Config.packname,
         author: Config.author,
         type: /*text.includes("--crop" || '-c') ? StickerTypes.CROPPED :*/ StickerTypes.FULL,
         categories: ["🤩", "🎉"],
         id: "QAVer2",
         quality: 75,
         background: "transparent",
       });
  const buffer = await sticker.toBuffer();
  anyaV2.sendMessage(pika.chat, { sticker: buffer }, { quoted: pika })
  .catch((err) => {
    console.log(err);
    pika.reply(Config.message.error);
     });                                                                                                                                                      
   }
};
 
    async function getBuffer(url) {
       const axios = require("axios");

        try {
          const response = await axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer', // This indicates that the response should be treated as binary data
          });

          const buffer = Buffer.from(response.data, 'binary');
          return buffer;
        } catch (error) {
          console.error('Error fetching buffer:', error.message);
          throw error;
        }
      };
  /*
   .then((reaction) => anyaV2.sendVideoAsSticker(pika.chat, reaction.url, pika, {
     packname: Config.packname,
     author: Config.author
    }))




  };*/
  