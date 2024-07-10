const Config = require('../../config');
const axios = require('axios');
const { anya, getBuffer, createVidSticker } = require('../lib');

//༺─────────────────────────────────────༻

const reactions = [
      "awoo", "bonk", "bite", "blush", "cuddle", "cry", "cringe", "dance", "hug", "happy",
      "handhold", "highfive", "glomp", "kiss", "kill", "kick2", "lick", "nom", "pat", "ponk",
      "smug", "smile", "slap", "wave", "wink", "yeet"
    ];
reactions.forEach(reaction => {
    anya({
                name: reaction,
                react: "👻",
                category: "reaction",
                desc: "Get reaction stickers",
                filename: __filename
         }, async (anyaV2, pika, { command }) => {
              let cmd;
              if (/kick2/.test(command)) cmd = "kick";
              else cmd = command;
              axios.get(`https://api.waifu.pics/sfw/${cmd}`)
              .then(async ({data})=> {
                  const media = await getBuffer(data.url);
                  const buffer = await createVidSticker(media, { packname: Config.packname, author: Config.author });
                  return await anyaV2.sendMessage(pika.chat, {
                        sticker: buffer
                  }, { quoted: pika });
              })
              .catch(err=> {
                  console.error(err);
                  return pika.reply(Config.message.error);
              });
    });
});