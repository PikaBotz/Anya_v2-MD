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
    name: ['amazon'],
    alias: ['amzn'],
    category: "search",
    desc: `Search anything on official Amazon.com .`
  }; 
}

exports.getCommand = async (text, anyaV2, pika) => {
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
}
