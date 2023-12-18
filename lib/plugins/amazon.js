const { anya } = require('../lib');

anya({
  name: [
    "amazon"
  ],
  alias: [
    "amzn"
  ],
  category: "search",
  desc: "Search anything on official Amazon.com .",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, anyaV2, pika) => {
  if (!text) return pika.reply("Please enter something to search.");
  pika.react("🅰️");
  const { get } = require('axios');
  const { load } = require('cheerio');
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(text)}`;
  try {
    const response = await get(url);
    if (response.status === 200) {
      const html = response.data;
      const $ = load(html);
      const results = [];
      const title = $('title').text();
      $('.s-result-item').each((index, element) => {
        const productTitle = $(element).find('h2 span').text().trim();
        const productPrice = $(element).find('.a-price .a-offscreen').text().trim();
        const productImage = $(element).find('.s-image').attr('src');
        const productRating = $(element).find('.a-icon-star-small .a-icon-alt').text().trim();
        if (productTitle && productPrice) {
          results.push({
            rank: index + 1,
            title: productTitle,
            price: productPrice,
            rating: productRating,
            image_url: productImage,
          });
        }
      });
      if (results.length === 0) {
        pika.reply('No results found.');
      } else {
        const item = results[5];
        pika.reply(message.wait);
        
      // ⚠️ Kindly give credits if you're copying cause it could lead you to delete your files if i sue.
        anyaV2.sendMessage(pika.chat, {
          image: { url: item.image_url },
          caption: `▶️ \`\`\`${title}\`\`\`\n\n` +
            `*🔮 Title:* ${item.title}\n\n` +
            `*💵 Price:* ${item.price}\n` +
            `*🌟 Ratings:* ${item.rating}\n\n` +
            `*💫 Rank:* ${item.rank}\n\n` +
            `*🍂 Search Term:* ${text}\n\n` +
            `_(!) Results maybe incorrect due to BETA build._`,
          headerType: 4
        }, { quoted: pika });
      }
    } else {
      pika.reply('Error fetching the page.');
    }
  } catch (error) {
    pika.reply('Error fetching the page.');
  }
});
