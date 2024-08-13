const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetches Wattpad stories based on a given title search query.
 * @param {string} title - The title or keywords to search for on Wattpad.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the search results or an error message.
 * 
 * @param {boolean} status - Indicates the success or failure of the search operation.
 * @param {string} creator - The identifier of the script's creator.
 * @param {Array<Object>} results - An array of story objects containing details such as title, thumbnail, description, reads, votes, chapters, and link.
 * @param {string} [message] - An optional message that contains the error message if the search fails.
 * 
 * @project https://github.com/PikaBotz/Anya_v2-MD
 * @author <🌟 All Credit Goes To Real Owner Of This Code>
 */
async function WattPad(title) {
  return new Promise(async (resolve) => {
    try {
      const { data } = await axios.get("https://www.wattpad.com/search/" + title, {
        headers: {
          cookie: 'wp_id=d92aecaa-7822-4f56-b189-f8c4cc32825c; sn__time=j%3Anull; fs__exp=1; adMetrics=0; _pbkvid05_=0; _pbeb_=0; _nrta50_=0; lang=1; locale=en_US; ff=1; dpr=1; tz=-8; te_session_id=1681636962513; _ga_FNDTZ0MZDQ=GS1.1.1681636962.1.1.1681637905.0.0.0; _ga=GA1.1.1642362362.1681636963; signupFrom=search; g_state={"i_p":1681644176441,"i_l":1}; RT=r=https%3A%2F%2Fwww.wattpad.com%2Fsearch%2Fanime&ul=1681637915624',
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0"
        }
      });
      const $ = cheerio.load(data);
      const baseLink = "https://www.wattpad.com";
      const results = [];
      $(".story-card-container > ul.list-group.new-list-group > li.list-group-item").each(function(i, u) {
        let link = baseLink + $(u).find("a").attr("href");
        let storyTitle = $(u).find("a > div > div.story-info > div.title").text().trim();
        let img = $(u).find("a > div > div.cover > img").attr("src");
        let desc = $(u).find("a > div > div.story-info > .description").text().replace(/\s+/g, " ");
        let stats = [];
        $(u).find("a > div > div.story-info > .new-story-stats > .stats-item").each((u, i) => {
          stats.push($(i).find(".icon-container > .tool-tip > .sr-only").text());
        });
        results.push({
          title: storyTitle,
          thumb: img,
          desc: desc,
          reads: stats[0],
          vote: stats[1],
          chapter: stats[2],
          link: link
        });
      });
      resolve({
        status: true,
        results: results,
      });
    } catch (err) {
      resolve({
        status: false,
        message: err.message,
      });
    }
  });
}

module.exports = { WattPad };
