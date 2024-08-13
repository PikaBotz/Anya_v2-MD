const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetch trending Twitter hashtags and tweet counts for a specified country.
 *
 * @param {string} country - The country code to fetch trending Twitter topics for.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the trending hashtags and tweet counts, 
 *                              along with status, country, creator, and results/message fields.
 * @project https://github.com/PikaBotz/Anya_v2-MD
 * @author @PikaBotz
 */
async function trendingTwitter(country) {
  try {
    const { data } = await axios.get(`https://getdaytrends.com/${country}/`);
    const $ = cheerio.load(data);
    const hashtags = [];
    const tweets = [];
    const results = [];
    $("#trends > table.table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr > td.main > a").each((i, el) => {
      hashtags.push($(el).text());
    });
    $("#trends > table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr > td.main > div > span").each((i, el) => {
      tweets.push($(el).text());
    });
    for (let i = 0; i < hashtags.length; i++) {
      results.push({
        rank: i + 1,
        hashtag: hashtags[i],
        tweet: tweets[i]
      });
    }
    return {
      status: true,
      country: country,
      creator: "@PikaBotz",
      results: results
    };
  } catch (error) {
    console.error("Error fetching trending topics: ", error);
    return {
      status: false,
      creator: "@PikaBotz",
      message: "Failed to fetch trending hashtags."
    };
  }
}

module.exports = {
  trendingTwitter
};
