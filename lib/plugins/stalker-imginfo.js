const { anya } = require('../lib');

anya({
  name: [
    "imginfo"
  ],
  alias: [
    "imageinfo",
    "picinfo"
  ],
  category: "stalker",
  desc: "This command provides detailed information about images, including metadata and technical details.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (anyaV2, args, pika, prefix, command) => {
  const notUrl = `\`\`\`Image URL needed❕\`\`\`\n\nWhatsApp doesn't share images with their metadata, so you have to upload an external image manually.\n\n1. Get that image in your device storage (not from WhatsApp, Facebook, or Instagram)\n\n2. Follow this video https://youtu.be/0K5VRRUqBQs?si=why6ZA2tbo9myNLZ\n\n3. Use this command again with that image's direct URL. *(Example: ${prefix + command} https://i.ibb.co/5sDddzs/IMG-20231023-154646.jpg)*\n\n☑️ If you already have an image direct link, you can use it`;
  if (!args[0]) return pika.reply(notUrl);
  if (!args[0].startsWith("https://") && !args[0].startsWith("http://")) return pika.reply("❌ Not a valid link.");
  await pika.react("🔎");
  const Config = require("../../config");
  const axios = require('axios');
  const quoted = pika.quoted || pika;
  const mime = (quoted.msg || quoted).mimetype || "";
  const proceed = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
  const imageUrl = args[0];  
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);
    const metadata = await fetchImage(imageBuffer);    
    if (metadata) {
      const meta = await mkCaption(metadata);
      pika.delete(proceed.key);
      anyaV2.sendMessage(pika.chat, { image: imageBuffer, caption: meta }, { quoted: pika });
    } else {
      pika.edit('❌ No metadata found in the image.', proceed.key);
    }
  } catch (error) {
//    console.error('Error downloading or parsing image metadata:', error);
    pika.edit("❌ Failed to retrieve image metadata.", proceed.key);
  }
});
