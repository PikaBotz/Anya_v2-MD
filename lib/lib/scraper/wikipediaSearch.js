const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetches and scrapes search results from Wikipedia based on a query.
 * 
 * @param {string} query - The search term to query on Wikipedia.
 * @returns {Promise<Object[]>} A promise that resolves to an array of objects containing the search results, including the summary (wiki), thumbnail (thumb), and title (judul).
 * @throws Will throw an error if the request fails or the data cannot be fetched.
 *
 * @project: https://github.com/PikaBotz/Anya_v2-MD
 * @creator: @PikaBotz
 */
async function Wikipedia(query) {
  try {
    const res = await axios.get(`https://en.m.wikipedia.org/w/index.php?search=${query}`);
    const $ = cheerio.load(res.data);
    const results = [];
    let wiki = $("#mf-section-0").find("p").text().trim();
    let thumb = $("#mf-section-0").find("div > div > a > img").attr("src");
    thumb = thumb ? "https:" + thumb : "https://pngimg.com/uploads/wikipedia/wikipedia_PNG35.png";
    let title = $("h1").first().text().trim();
    results.push({
      wiki: wiki || "No information available.",
      thumb: thumb,
      title: title || "No title found."
    });
    return {
      status: true,
      creator: "@PikaBotz",
      results: results
    };
  } catch (error) {
    return {
      status: false,
      creator: "@PikaBotz",
      message: "Error fetching data: " + error.message
    };
  }
}

module.exports = { Wikipedia };
