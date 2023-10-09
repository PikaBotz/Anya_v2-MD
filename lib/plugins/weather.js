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

exports.cmdName = () => {
  return {
    name: ['weather'],
    alias: [],
    category: "tools",
    desc: "Check the weather of mentioned place."
  };
}

exports.getCommand = async (text, anyaV2, pika) => {
  const axios = require('axios');
  const { tiny } = require('../lib/stylish-font');
  if (!text) return pika.reply("Enter your location to search weather.");
  const get = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=e409825a497a0c894d2dd975542234b0&language=tr`);
  const weather = get.data;
    await pika.react("☔");
    await anyaV2.sendMessage(pika.chat, {
                    video: { url: 'https://media.tenor.com/bC57J4v11UcAAAPo/weather-sunny.mp4' },
                    gifPlayback: true,
                    caption: `*「 Weather Reporting 」*

*📍 ${tiny("Result Location")}:* ${weather.name}
*🗾 ${tiny("Country")}:* ${weather.sys.country}
*🌦️ ${tiny("Weather")}:* ${weather.weather[0].description}
*🌡️ ${tiny("Temprature")}:* ${weather.main.temp}°C
*❄️ ${tiny("Minimum Temp")}:* ${weather.main.temp_min}°C
*♨️ ${tiny("Maximum Temp")}:* ${weather.main.temp_max}°C
*💧 ${tiny("Humidity")}:* ${weather.main.humidity}%
*🎐 ${tiny("Wind")}:* ${weather.wind.speed} km/h`
        },
       { quoted: pika });
  }




