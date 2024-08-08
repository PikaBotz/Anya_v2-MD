const axios = require('axios');
const FormData = require('form-data');
const cheerio = require('cheerio');
const {
    getRandom
} = require('../index');

/**
 * Convert WebP buffer to MP4 using ezgif service.
 * @param {Buffer} buffer - The WebP file buffer.
 * @returns {Promise<Object>} - A promise that resolves with the MP4 URL.
 */
function webp2mp4File(buffer) {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('new-image-url', '');
        form.append('new-image', buffer, { filename: getRandom(8) + '.webp' });
        axios({
            method: 'post',
            url: 'https://s6.ezgif.com/webp-to-mp4',
            data: form,
            headers: {
                ...form.getHeaders(),
                'Content-Type': `multipart/form-data; boundary=${form._boundary}`
            }
        }).then(({ data }) => {
            const formThen = new FormData();
            const $ = cheerio.load(data);
            const file = $('input[name="file"]').attr('value');
            formThen.append('file', file);
            formThen.append('convert', "Convert WebP to MP4!");
            axios({
                method: 'post',
                url: `https://ezgif.com/webp-to-mp4/${file}`,
                data: formThen,
                headers: {
                    ...formThen.getHeaders(),
                    'Content-Type': `multipart/form-data; boundary=${formThen._boundary}`
                }
            }).then(({ data }) => {
                const $ = cheerio.load(data);
                const result = 'https:' + $('div#output > p.outfile > video > source').attr('src');
                resolve({
                    status: true,
                    message: "Conversion successful!",
                    result: result
                });
            }).catch(reject);
        }).catch(reject);
    });
}

module.exports = webp2mp4File;
