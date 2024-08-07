import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import cheerio from 'cheerio';

/**
 * Convert WebP file to MP4 using ezgif service.
 * @param {string} path - The path to the WebP file.
 * @returns {Promise<Object>} - A promise that resolves with the MP4 URL.
 */
function webp2mp4File(path) {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('new-image-url', '');
        form.append('new-image', fs.createReadStream(path));
        axios({
            method: 'post',
            url: 'https://s6.ezgif.com/webp-to-mp4',
            data: form,
            headers: {
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

export { webp2mp4File };
