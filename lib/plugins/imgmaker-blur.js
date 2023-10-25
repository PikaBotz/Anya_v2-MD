exports.cmdName = () => ({
  name: ['blur'],
  alias: ['blury'],
  category: "imgmaker",
  desc: "Make any image to a blury image."
});

exports.getCommand = async (anyaV2, pika, prefix, command) => {
  const Config = require("../../config");
 try {
  const Jimp = require('jimp');
  const { get } = require('axios');
  const path = require('path');
  const fs = require('fs');
  const blurRadius = 10; // Adjust this value for the desired blur intensity
  const saturation = 5; // Adjust this value for saturation
  const quoted = pika.quoted ? pika.quoted : pika;
  const mime = (quoted.msg || quoted).mimetype || "";
  if (!/image/.test(mime)) return pika.reply(`Please tag an image or send an image with caption *${prefix + command}*`);
  const proceed = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
  const imageUrl = await quoted.download(getRandomName(4));
  const imageName = getRandomName(5);

async function getBlur(imageURL, blurRadius, saturation) {
  try {
    const image = await Jimp.read(imageURL);
    image.blur(blurRadius);
    image.color([{ apply: 'saturate', params: [saturation] }]);
    const imageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    return imageBuffer;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

function saveImage(imageBuffer, imageName) {
  const folderPath = path.join(__dirname, '../database/trash');
  const imagePath = path.join(folderPath, imageName + '.jpg');
  fs.writeFileSync(imagePath, imageBuffer);
  anyaV2.sendMessage(pika.chat, {
    image: fs.readFileSync(imagePath),
    caption: `*🪷 - ${blurRadius}% blurred\n*🍁 - ${saturation}% saturated`
  }, { quoted: pika });
  pika.delete(proceed.key);
  fs.unlinkSync(imagePath);
}

  getBlur(imageUrl, blurRadius, saturation)
    .then((imageBuffer) => {
      if (imageBuffer) {
        saveImage(imageBuffer, imageName);
      } else {
     pika.edit("❌ Failed to create blur effect in this media.", proceed.key);
      }
    });
   } catch {
   pika.reply(Config.message.error);
  }
};

function getRandomName(length) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let name = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    name += alphabet[randomIndex];
  }
  return name;
}
