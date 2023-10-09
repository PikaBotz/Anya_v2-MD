exports.cmdName = () => {
  return {
    name: ['sai'],
    category: "ai",
    alias: ['saipic','saiimg'],
    desc: "\"Search AI Images\" This command search images from text prompts made by an ai."
  };
}

exports.getCommand = async (text, anyaV2, pika) => {
  require('../../config');
  const { get } = require('axios');
  const { tiny } = require("../lib/stylish-font");
  if (!text) return pika.reply(`Please enter a query that you want to search an image from the art collection of AI.`);
  await pika.react("🤖");
  try {
    pika.reply(message.wait);
    const response = await get(`https://vihangayt.me/tools/lexicaart?q=${text}`);
    if (response.data.data.length === 0) return pika.reply("No results found");
    function random(list) {
    if (list.length === 0) {
    return undefined;
   }
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
   }
    const img1_cap = random(response.data.data);
    const img1_img = random(img1_cap.images);
    const img2_cap = random(response.data.data);
    const img2_img = random(img2_cap.images);
    function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
    await anyaV2.sendMessage(pika.chat, {
        image: { url: img1_img.url },
        caption: `*🌟 ${tiny("Title")}:* ${img1_cap.prompt}\n` +
                 `*🗓️ ${tiny("Uploaded On")}:* ${formatDate(img1_cap.timestamp)}`,
        }, { quoted:pika });
    await anyaV2.sendMessage(pika.chat, {
        image: { url: img2_img.url },
        caption: `*🌟 ${tiny("Title")}:* ${img2_cap.prompt}\n` +
                 `*🗓️ ${tiny("Uploaded On")}:* ${formatDate(img2_cap.timestamp)}`,
        }, { quoted:pika });
  } catch (error) {
    console.log(error);
    return pika.reply(message.error);
  }
}
