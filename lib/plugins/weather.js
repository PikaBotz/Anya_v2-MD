const { anya } = require('../lib');

anya({
  name: [
    "weather"
  ],
  alias: [],
  category: "tools",
  desc: "Check the weather of mentioned place.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, anyaV2, pika) => {
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
  });
