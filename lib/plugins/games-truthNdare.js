exports.cmdName = () => ({
  name: ['truth','dare'],
  alias: [],
  category: "games",
  desc: "Play truth and dare!."
});

exports.getCommand = async (command, anyaV2, pika) => {
   const Config = require('../../config');
   await pika.react(Config.themeemoji);
   const { get } = require('axios');
   const response = await get("https://bitbucket.org/my-raw/my_raw/raw/a7ccf9bf4cd8eac3ebf8dce3c86fbac2b02777ae/truth_dare.json");
   const data = response.data;
   const dare = pickRandom(data.dares);
   const truth = pickRandom(data.truths);
   const choose = command === "dare" ? dare : truth;
    anyaV2.sendMessage(pika.chat, {
      text: `${Config.themeemoji} Senpai *@${pika.sender.split("@")[0]}* your *${command}* is:\n\n${choose}`,
      mentions: [pika.sender]
   }, { quoted: pika });
};

function pickRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};
