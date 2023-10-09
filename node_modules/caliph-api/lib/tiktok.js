const axios = require("axios");
const cheerio = require("cheerio");

const clean = (data) => {
	let regex = /(<([^>]+)>)/ig;
	data = data.replace(/(<br?\s?\/>)/ig, ' \n');
	return data.replace(regex, '');
};

async function shortener(url) {
	html = (await axios('https://clph.pw/short', { method: 'POST', data: new URLSearchParams(Object.entries({ url })) })).data
	$ = cheerio.load(html)
	return $('#app-6 > input').attr('value');
};


module.exports = async function (query) {
	let response = await axios("https://lovetik.com/api/ajax/search", {
		method: "POST",
		data: new URLSearchParams(Object.entries({ query }))
	})

	result = {};
        
        result.creator = "Caliph";
	result.title = clean(response.data.desc);
	result.author = clean(response.data.author);
	result.nowm = await shortener(response.data.links[0].a);
	result.watermark = await shortener(response.data.links[1].a);
	result.audio = await shortener(response.data.links[2].a);
	result.thumbnail = await shortener(response.data.cover);
	return result
} 
