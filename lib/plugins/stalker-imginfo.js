/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Team: Tᴇᴄʜ Nɪɴᴊᴀ Cʏʙᴇʀ Sϙᴜᴀᴅꜱ (𝚻.𝚴.𝐂.𝐒) 🚀📌 (under @P.B.inc)

📜 GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

📌 Permission & Copyright:
If you're using any of these codes, please ask for permission or mention https://github.com/PikaBotz/Anya_v2-MD in your repository.

⚠️ Warning:
- This bot is not an officially certified WhatsApp bot.
- Report any bugs or glitches to the developer.
- Seek permission from the developer to use any of these codes.
- This bot does not store user's personal data.
- Certain files in this project are private and not publicly available for edit/read (encrypted).
- The repository does not contain any misleading content.
- The developer has not copied code from repositories they don't own. If you find matching code, please contact the developer.

Contact: alammdarif07@gmail.com (for reporting bugs & permission)
          https://wa.me/918811074852 (to contact on WhatsApp)

🚀 Thank you for using Queen Anya MD v2! 🚀
**/

exports.cmdName = () => ({
  name: ['imginfo'],
  alias: ['imageinfo','picinfo'],
  category: "stalker",
  desc: "This command provides detailed information about images, including metadata and technical details."
});

/**
 * ⚠️ Strictly under copyright by @PikaBotz
 **/
exports.getCommand = async (anyaV2, args, pika, prefix, command) => {
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
};

async function fetchImage(imageBuffer) {
  const exifr = require('exifr');
  try {
    return await exifr.parse(imageBuffer);
  } catch (error) {
    console.error('Error parsing image metadata:', error);
    return null;
  }
}

async function mkCaption(metadata) {
let meta = `*💻 Device Information*\n`;
   meta += metadata.Make ? `*- Device:* ${metadata.Make ? metadata.Make : "unknown"}\n` : "";
   meta += metadata.Model ? `*- Model:* ${metadata.Model ? metadata.Model : "unknown"}\n` : "";
   meta += metadata.Software ? `*- Software:* ${metadata.Software ? metadata.Software : "unknown"}\n` : "";
   meta += `\n*🌌 Media Information*\n`;
   meta += metadata.ImageWidth ? `*- Dimensions:* ${metadata.ImageWidth ? metadata.ImageWidth : 'unknown'} x ${metadata.ImageHeight ? metadata.ImageHeight + " px" : 'unknown'}\n` : "";
   meta += metadata.Orientation ? `*- Fliped:* ${metadata.Orientation ? (metadata.Orientation === 0) ? "No" : metadata.Orientation + "°" : "no"}\n` : "";
   meta += metadata.ColorSpace ? `*- Colour Type:* ${metadata.ColorSpace ? metadata.ColorSpace : "not resistered"}\n` : "";
   meta += metadata.CreateDate ? `*- Clicked Date:* ${metadata.CreateDate ? getTime(metadata.CreateDate).date : "not provided"}\n` : "";
   meta += metadata.CreateDate ? `*- Clicked Time:* ${metadata.CreateDate ? getTime(metadata.CreateDate).time : "not provided"}\n` : "";
   meta += metadata.ModifyDate ? `*- Edited On:* ${(metadata.ModifyDate !== metadata.CreateDate) ? getTime(metadata.ModifyDate).date + " at " + getTime(metadata.ModifyDate).time : "not edited"}\n` : "";
   meta += metadata.ImageDescription ? `*- Description:* ${metadata.ImageDescription ? metadata.ImageDescription : "no description"}\n` : "";
   meta += (!metadata.latitude || !metadata.longitude) ? "" : `*- Location:* ${await convertGPSToLocation({ latitude: metadata.latitude, longitude: metadata.longitude })}\n`;   meta += `\n*⚙️ Image Parameters*\n`;
   meta += metadata.FNumber ? `*- F:* ${metadata.FNumber ? "ƒ/" + metadata.FNumber : "- - -"}\n` : "";
   meta += metadata.WhiteBalance ? `*- WhiteBalance Mode:* ${metadata.WhiteBalance ? metadata.WhiteBalance : "- - -"}\n` : "";
   meta += metadata.ExposureMode ? `*- Exposure Mode:* ${metadata.ExposureMode}\n` : "";
   meta += metadata.ExposureTime ? `*- Exposure Time:* ${metadata.ExposureTime}s\n` : "";
   meta += metadata.ISO ? `*- ISO:* ${metadata.ISO}\n` : "";
   meta += metadata.FocalLength ? `*- Focal Length:* ${metadata.FocalLength}mm\n` : "";
   meta += metadata.Flash ? `*- Flash:* ${metadata.Flash}\n` : "";
   meta += metadata.LightSource ? `*- Light Source:* ${metadata.LightSource}\n` : "";
   meta += metadata.MaxApertureValue ? `*- Aperture:* ${metadata.MaxApertureValue}\n` : "";
   meta += metadata.BrightnessValue ? `*- Brightness:* ${metadata.BrightnessValue}\n` : "";
   meta += metadata.ShutterSpeedValue ? `*- Shutter Speed:* ${metadata.ShutterSpeedValue}\n` : "";
   meta += metadata.SensingMethod ? `*- Sensor Type:* ${metadata.SensingMethod}\n` : "";
  return meta;
  };

function getTime(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.toLocaleDateString('en-US', { month: '2-digit' });
  const day = date.toLocaleDateString('en-US', { day: '2-digit' });
  const hours = date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false }); //~ hour12: true [if you want 12 hours time format]
  const minutes = date.toLocaleTimeString('en-US', { minute: '2-digit' });
  const seconds = date.toLocaleTimeString('en-US', { second: '2-digit' });
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return { date: formattedDate, time: formattedTime };
};

async function convertGPSToLocation(data) {
  const opencage = require('opencage-api-client');
  const { latitude, longitude } = data;
  try {
    const response = await opencage.geocode({ q: `${latitude}, ${longitude}`, key: "2359b43766ce49ada3fdfa825951cc3e" });
    if (response.status.code === 200 && response.results.length > 0) {
      const firstResult = response.results[0];
      const {
        country,
        state,
        city,
        postcode,
        road,
      } = firstResult.components;
      return `${postcode ? postcode + ', ' : ''}${road ? road + ', ' : ''}${city ? city + ', ' : ''}${state ? state + ', ' : ''}${country ? country + ', ' : ''}`;
    } else {
      return 'Location not found.';
    }
  } catch (error) {
    console.error('Error geocoding:', error);
  }
};
