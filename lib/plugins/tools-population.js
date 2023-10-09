exports.cmdName = () => {
  return {
    name: ['pop'],
    category: "tools",
    alias: ['population','popu'],
    desc: "The total database or deaths and births."
  };
}

exports.getCommand = async (anyaV2, pika) => {
  require('../../config');
  await pika.react("🗓️");
  const getting = await anyaV2.sendMessage(pika.chat, { text: message.wait }, { quoted: pika });
  const { get } = require('axios');
  const { tiny } = require("../lib/stylish-font");
  function formatNumber(number) {
    if (number < 1e3) return number;
    if (number < 1e6) return (number / 1e3).toFixed(1) + 'K';
    if (number < 1e9) return (number / 1e6).toFixed(1) + 'M';
    return (number / 1e9).toFixed(1) + 'B';
  }
  await get("https://vihangayt.me/details/population")
    .then((eject, error) => {
      if (error) return pika.reply(mess.error);
      const response = eject.data.data;
      const totalPopulation = Number(response.current.total.replace(/,/g, ''));
      const malePopulation = Number(response.current.male.replace(/,/g, ''));
      const femalePopulation = Number(response.current.female.replace(/,/g, ''));
      const birthsThisYear = Number(response.this_year.births.replace(/,/g, ''));
      const deathsThisYear = Number(response.this_year.deaths.replace(/,/g, ''));
      const birthsToday = Number(response.today.births.replace(/,/g, ''));
      const deathsToday = Number(response.today.deaths.replace(/,/g, ''));
      let fetch = `┌─⌈ *POPULATION CALENDAR* ⌋\n`;
      fetch += `*🎐 ${tiny("Total")}:* ${formatNumber(totalPopulation)} _alive_\n`;
      fetch += `*🧑🏻‍🎤 ${tiny("Male")}:* ${formatNumber(malePopulation)} _alive_\n`;
      fetch += `*👩🏼‍⚕️ ${tiny("Female")}:* ${formatNumber(femalePopulation)} _alive_\n\n`;
      fetch += `┌─⌈ *THIS YEAR* ⌋\n` ;
      fetch += `*🎂 ${tiny("Births")}:* ${formatNumber(birthsThisYear)} _born_\n`;
      fetch += `*🕯️ ${tiny("Deaths")}:* ${formatNumber(deathsThisYear)} _died_\n\n`;
      fetch += `┌─⌈ *TODAY* ⌋\n`;
      fetch += `*🎉 ${tiny("Births")}:* ${formatNumber(birthsToday)} _born today_\n`;
      fetch += `*🪦 ${tiny("Deaths")}:* ${formatNumber(deathsToday)} _died today_\n`;
      anyaV2.sendMessage(pika.chat, {
        text: fetch,
        edit: getting.key,
     });
    });
}
