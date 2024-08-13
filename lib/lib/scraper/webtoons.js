const axios = require('axios');
const cheerio = require('cheerio');

async function webtoons(query) {
  try {
    const { data } = await axios.get(`https://www.webtoons.com/en/search?keyword=${query}`);
    const $ = cheerio.load(data);
    const titles = [];
    const genres = [];
    const authors = [];
    const links = [];
    const likes = [];
    const results = [];
    $("#content > div > ul > li > a > div > p.subj").each((i, el) => {
      titles.push($(el).text());
    });
    $("div > ul > li > a > span").each((i, el) => {
      genres.push($(el).text());
    });
    $("div > ul > li > a > div > p.author").each((i, el) => {
      authors.push($(el).text());
    });
    $("div > ul > li > a > div > p.grade_area > em").each((i, el) => {
      likes.push($(el).text());
    });
    $("#content > div > ul > li > a").each((i, el) => {
      links.push("https://www.webtoons.com" + $(el).attr("href"));
    });
    for (let i = 0; i < titles.length; i++) {
      results.push({
        title: titles[i],
        genre: genres[i],
        author: authors[i],
        likes: likes[i],
        link: links[i]
      });
    }
    if (results.length === 0) {
      return {
        status: false,
        creator: "@PikaBotz",
        message: `${query} could not be found or encountered an error.`
      };
    } else {
      return {
        status: true,
        creator: "@PikaBotz",
        results: results
      };
    }
  } catch (error) {
    console.error("Error fetching webtoons: ", error);
    return {
      status: false,
      creator: "@PikaBotz",
      message: "Failed to fetch webtoons data."
    };
  }
}

module.exports = {
  webtoons
};
