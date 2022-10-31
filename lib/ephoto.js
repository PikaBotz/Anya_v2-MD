const SET = require('../config')
const axios = require('axios')
const chalk = require('chalk')
const fs = require('fs')
const FormData = require('form-data');
apiuser = '1255173112'
apisecret = 'JittEAduHuMFC7xixjBm'

exports.checkproperties = async(url) => {
axios.get('https://api.sightengine.com/1.0/check.json', {
  params: {
    'url': url,
    'models': 'properties',
    'api_user': '1255173112',
    'api_secret': 'JittEAduHuMFC7xixjBm',
  }
})
.then(function (response) {
  // on success: handle response
  console.log(response.data);
})
.catch(function (error) {
  // handle error
  if (error.response) console.log(error.response.data);
  else console.log(error.message);
});
}


exports.checkAudio = async(input) => {
data = new FormData();
data.append('media', fs.createReadStream('/path/to/file.mp4'));
// specify the models you want to apply
data.append('models', 'audio-profanity');
data.append('api_user', apiuset);
data.append('api_secret', apisecret);

axios({
  method: 'post',
  url:'https://api.sightengine.com/1.0/video/check-sync.json',
  data: data,
  headers: data.getHeaders()
})
.then(function (response) {
  // on success: handle response
  console.log(response.data);
})
.catch(function (error) {
  // handle error
  if (error.response) console.log(error.response.data);
  else console.log(error.message);
});
}

exports.imgSuper = async(url) => {
 return new Promise((resolve, reject) => {
 const apis = SET.api.imgsuper
  const API = apis[Math.floor(Math.random() * apis.length)]
 
data = {"upscale":8,"image":url}
const options = {
  method: 'POST',
  url: 'https://super-image1.p.rapidapi.com/run',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': API,
    'X-RapidAPI-Host': 'super-image1.p.rapidapi.com'
  },
  data: data
};

axios.request(options).then(function (response) {
	resolve(response.data)
}).catch(function (error) {
	console.error(error);
});
})
}

exports.SuperImage = async(path) => {
return new Promise((resolve, reject) => {
const apis = SET.api.imgsuper
const API = apis[Math.floor(Math.random() * apis.length)]
data = new FormData();
data.append("image", fs.createReadStream(path));
data.append("scale", "8");
data.append("output_type", "jpeg");
data.append("output_format", "base64");

const options = {
  method: 'POST',
  url: 'https://super-resolution.p.rapidapi.com/resolution',
  headers: {
    'X-RapidAPI-Key': '198f69d4b2msh0021bb0690669a6p1f3a80jsn9cab1ae485cc',
    'X-RapidAPI-Host': 'super-resolution.p.rapidapi.com',
    ...data.getHeaders()
  },
  data: data
};

axios.request(options).then(function (response) {
	resolve(response.data)
}).catch(function (error) {
	console.error(error);
});
})
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.yellow(`New ${__filename}`))
	delete require.cache[file]
	require(file)
})