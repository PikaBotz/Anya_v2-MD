exports.cmdName = () => ({
  name: ["translate"],
  alias: ["trans","translation"],
  need: "query",
  category: "tools",
  desc: "This plugin translate automatically/manually to one language to another."
});
 
exports.getCommand = async (text, pika, anyaV2) => {
if (!pika.quoted && !text) return pika.reply("Enter a text to process translation.");
await pika.react("🌍");
const Config = require("../../config");
const fromLang = "auto";
const toLang = "en"; //~The default output language is "English" | You can change it
const proceed = await anyaV2.sendMessage(pika.chat, { text: Config.message.wait }, { quoted: pika });
translateText(pika.quoted ? ((pika.quoted.text.length !== 0) ? pika.quoted.text : (text ? text : false)) : (text ? text : false), fromLang, toLang)
  .then((translation) => {
  if (translation === "404") return pika.edit("❌ No texts found to translate.", proceed.key);
  if (translation === "204") return pika.edit("❌ No transaction found.", proceed.key);
  if (translation.text === text) return pika.edit("🔁 Please use different keywords, or add more words these texts are not enough maybe.", proceed.key);
  pika.edit(`*🌍 Translated To:* ${translation.from}\n\n*🍁 Translation:* ${translation.text}`, proceed.key);
   })
  .catch((error) => {
  pika.edit("❌ An Error occurred, contact the developer asap.", proceed.key);
  console.error(`Translation error: ${error}`);
 });
};

async function translateText(text, fromLang, toLang) {
if (!text) return "404";
const translate = require('translate-google');
  try {
    const translation = await translate(text, {
      from: fromLang,
      to: toLang,
    });
    return {
     text: translation,
     from: toLang,
    };
  } catch (error) {
    return "204";
  }
};
