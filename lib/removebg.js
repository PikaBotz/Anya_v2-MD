const FormData = require('form-data');
const https = require('https')
const axios = require('axios');
axios.defaults.httpsAgent = new https.Agent({
   rejectUnauthorized: false,
   })
const chalk = require('chalk')
const fs = require('fs')
const SET = require('../config')
const { removeBackgroundFromImageBase64, removeBackgroundFromImageUrl, removeBackgroundFromImageFile } = require('remove.bg')

  exports.remove = async (input) => {
        try {
            const apis = SET.api.removebg
            const response = await removeBackgroundFromImageBase64({
                base64img: input.toString('base64'),
                apiKey: apis[Math.floor(Math.random() * apis.length)],
                size: 'auto',
                type: 'auto',
            })
                  return Buffer.from(response.base64img, 'base64')
        } catch (error) {
            console.log(error)
        }
    }  
    
exports.unscreen = async(input) => {
     
     const UNSCREEN_API_VIDEOS_URL = "https://api.unscreen.com/v1.0/videos";
     const apiss = SET.api.unscreen
     const API = apiss[Math.floor(Math.random() * apiss.length)]
     try{
     const form = new FormData();

 	var headers = form.getHeaders();
    headers['X-Api-Key'] = API;
		
			const data = await  axios({
				url: UNSCREEN_API_VIDEOS_URL,
				method: "POST",
				headers: {
					headers
				},
				data: input,
				'maxContentLength': Infinity,
                'maxBodyLength': Infinity,
			})
			.then(function (response) {
            // handle success
            console.log(response.data);
             })
		} catch (err) {
			console.log(err)
		}


}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.yellow(`New ${__filename}`))
	delete require.cache[file]
	require(file)
})