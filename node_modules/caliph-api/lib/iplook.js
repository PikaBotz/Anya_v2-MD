let node = require("node-fetch")

module.exports = async (query) => {
return new Promise(async (resolve, reject) => {
var res = await node("http://ip-api.com/json/"+query+"?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query")
let json = await res.json()
if (json.status !== 'success') return reject({ status: 404, message: 'Invalid query', query }) 
json.status = 200
resolve(json)

})
}
