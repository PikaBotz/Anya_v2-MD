const { anya } = require('../lib');

anya({
  name: [
    "setbotpp"
  ],
  alias: [
    "setppbot",
    "botpp"
  ],
  category: "owner",
  desc: "Set bot number's profile picture.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (anyaV2, pika, prefix, command) => {
    require('../../config');
    const { unlinkSync } = require('fs');
    const quoted = pika.quoted ? pika.quoted : pika;
    const mime = quoted.msg ? quoted.msg : quoted.mimetype ? quoted.mimetype : quoted.mediaType || '';
    if (/image/g.test(mime) && !/webp/g.test(mime)) {
        try {
            const media = await quoted.download();
            const botnumber = await anyaV2.decodeJid(anyaV2.user.id);
            await anyaV2.updateProfilePicture(botnumber, media)
            .catch((err) => {
//                console.error(err);
                return pika.reply(message.error);
            }); 
            pika.reply(message.success);
//            await unlinkSync(media);
        } catch {
            pika.reply('An error occurred, try again.');
        }
    } else {
        pika.reply(`Send an image with caption *${prefix + command}* or tag an image to set as the bot's profile picture.`);
    }
});
