const Config = require('../../config');
const axios = require('axios');
const { anya, pikaApi, tiny, getBuffer, wikimedia, lyrics, wallpaper, gimg, formatDate, formatRuntime, getObjArray } = require('../lib');
const wikimedaLimit = 5;
const wallpaperLimit = 5;
const googleImageLimit = 5;

//༺─────────────────────────────────────༻

anya({
            name: "wikimedia",
            react: "📑",
            need: "query",
            category: "search",
            desc: `Search and get ${wikimedaLimit} images from Wikipedia media`,
            cooldown: 8,
            filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} Anime Origin`);
        const {key} = await pika.keyMsg(Config.message.wait);
        wikimedia(encodeURIComponent(args.join(" ")))
        .then(async res=> {
            let min = 1;
            for (const i of res) {
                if (min > wikimedaLimit) break;
                min++
                await anyaV2.sendMessage(pika.chat, {
                    image: await getBuffer(i.image),
                    caption: `*💠 𝚃𝚒𝚝𝚕𝚎 :* ${i.title}\n*🍜 𝚂𝚘𝚞𝚛𝚌𝚎 :* ${i.source}`
                },
                {
                    quoted:pika
                });
            }
        })
        .then(()=> pika.deleteMsg(key))
        .catch(err=> {
            console.error(err);
            pika.edit(Config.message.error, key);
        })
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "lyrics",
            alias: ['lyric'],
            react: "🎼",
            need: "query",
            category: "search",
            desc: "Search song lyrics",
            cooldown: 8,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} Dandelions by ruth B`);
        lyrics(encodeURIComponent(args.join(" ")))
        .then(async res=> {
            return anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(res.thumb),
                caption: res.lyrics
            },
            {
                quoted:pika
            });
        })
        .catch(err=> {
            console.error(err);
            axios.get(`https://lyrist.vercel.app/api/${encodeURIComponent(args.join(" "))}`)
            .then(async ({data})=> {
                return anyaV2.sendMessage(pika.chat, {
                        image: await getBuffer(data.image),
                        caption: `*${Config.themeemoji}Title:* ${data.title}\n*${Config.themeemoji}Lyrics:*\n\n${data.lyrics}`
                }, { quoted:pika });
            })
            .catch(err=> {
                console.error(err);
                pika.reply("*Not Found! Please Use Different Keywords!*");
            });
        });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "wallpaper",
            alias: ['wall'],
            react: "⛩️",
            need: "query",
            category: "search",
            desc: `Search ${wallpaperLimit} wallpapers from www.wallpaperflare.com`,
            cooldown: 8,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} Sunset View`);
        wallpaper(encodeURIComponent(args.join(" ")))
        .then(async res=> {
            let min = 1;
            for (const i of res) {
                if (min > wallpaperLimit) break;
                    min++
                    await anyaV2.sendMessage(pika.chat, {
                            image: await getBuffer(i),
                            caption: `> _Searched by ${Config.botname}_`
                    },
                    {
                            quoted:pika
                    });
            }
        })
        .catch(err=> {
            console.error(err);
            pika.reply(Config.message.error);
        });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "npm",
            react: "📦",
            need: "query",
            category: "search",
            desc: "Search module info from NPM",
            cooldown: 10,
            filename: __filename
    }, async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} chalk`);
    axios.get(`https://api.npms.io/v2/search?q=${encodeURIComponent(args[0].toLowerCase())}`)
        .then(async response => {
            const { data } = response;
            const matchingPackages = data.results.filter(pkg => pkg.package.name === args[0].toLowerCase());
            if (matchingPackages.length < 1) return pika.reply("❎ No Results Found!");
            const pkg = matchingPackages[0].package;
            const uploaded = formatDate(pkg.date);
            let links = '';
            for (const i of getObjArray(pkg.links)) {
                links += `\n> *${tiny(i.key.charAt(0).toUpperCase() + i.key.slice(1))}:* ${i.url}`;
            }
            let maintainers = '';
            for (const i of pkg.maintainers) {
                maintainers += `\n> *Usᴇʀɴᴀᴍᴇ:* @${i.username}\n  - *Eᴍᴀɪʟ:* ${i.email}\n`;
            }
            const readmore = String.fromCharCode(8206).repeat(4001);
            return await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer("https://i.ibb.co/zNPdJr5/npm.png"),
                caption: `
*>>> 🇳 🇵 🇲  • 🇨 🇭 🇪 🇨 🇰 <<<*

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
▢ *Nᴀᴍᴇ:* ${pkg.name}
▢ *Sᴄᴏᴘᴇ:* ${pkg.scope}
▢ *Vᴇʀsɪᴏɴ:* v${pkg.version}
▢ *Uᴘʟᴏᴀᴅᴇᴅ Oɴ:* ${uploaded.date}
▢ *Oᴡɴᴇʀ Nᴀᴍᴇ:* @${pkg.publisher.username}
▢ *Oᴡɴᴇʀ Eᴍᴀɪʟ:* ${pkg.publisher.email}
${readmore}┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
▢ *Kᴇʏᴡᴏʀᴅs:* ${(pkg?.keywords?.length > 0) ? pkg.keywords.join(", ") : 'No Keywords' || "N/A"}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
▢ *Lɪɴᴋs:*${links}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
▢ *Mᴀɪɴᴛᴀɪɴᴇʀs:*\n${maintainers}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
▢ *Sᴄᴏʀᴇs:*
    - *Fɪɴᴀʟ:* ${(matchingPackages[0].score.final * 10).toFixed(0)}/10
    - *Qᴜᴀʟɪᴛʏ:* ${(matchingPackages[0].score.detail.quality * 10).toFixed(0)}/10
    - *Pᴏᴘᴜʟᴀʀɪᴛʏ:* ${(matchingPackages[0].score.detail.popularity* 10).toFixed(0)}/10
    - *Mᴀɪɴᴛᴇɴᴀɴᴄᴇ:* ${(matchingPackages[0].score.detail.maintenance * 10).toFixed(0)}/10
    - *Sᴇᴀʀᴄʜᴇᴅ:* ${(matchingPackages[0].searchScore / 10000).toFixed(0)}/10
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

> ${Config.footer}
`.trim()
            },
            {
                quoted:pika
            });
        })
        .catch(err => {
            console.error(err);
            return pika.reply("❎ Too much traffic!! try again in 15 secs");
        });
    }
)

//༺─────────────────────────────────────༻

anya({
            name: "imdb",
            alias: ['movie', 'film'],
            react: "🍿",
            need: "query",
            category: "search",
            desc: "Find latest movie details from IMDB.com",
            cooldown: 15,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} Game Of Thrones`);
        axios.get(`https://www.omdbapi.com/?apikey=d05b607e&t=${encodeURIComponent(args.join(" "))}&plot=full`)
        .then(async response=> {
            const {data} = response;
            if (data.Response === 'False') return pika.reply("❎ " + data.Error);
            return await anyaV2.sendMessage(pika.chat,
                    {
                        image: await getBuffer(data.Poster),
                        caption: `
═══════════════════════
        ░▒▓ \`\`\`IMDB ENGINE\`\`\` ▓▒░
═══════════════════════

*🎬Title :* ${data.Title}
*💬Type :* ${data.Type}
*🌤️Seasons :* ${data.totalSeasons !== undefined ? data.totalSeasons : 'N/A'}
*📅Year :* ${data.Year}
*⭐Rated :* ${data.Rated}
*📆Released :* ${data.Released}
*⏳Runtime :* ${data.Runtime !== 'N/A' ? formatRuntime(parseInt(data.Runtime) * 60) : 'N/A'}
*🌀Genre :* ${data.Genre}
*🌐Language :* ${data.Language}
*🌍Country :* ${data.Country}
*🎖️Awards :* ${data.Awards}
*📦BoxOffice :* ${data.BoxOffice !== undefined ? data.BoxOffice : 'N/A'}
*🏙️Production :* ${data.Production !== undefined ? data.Production : 'N/A'}
*🌟imdbRating :* ${data.imdbRating}
*🗳️imdbVotes :* ${data.imdbVotes}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*👨🏻‍💻Director :* ${data.Director}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*✍🏻Writer :* ${data.Writer}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*🧑🏻‍💼Actors :* ${data.Actors}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*📃Plot :* ${data.Plot}

> ${Config.footer}
`.trim()
                    },
                    {
                        quoted:pika
                    });
        })
        .catch(err=> {
            console.error(err);
            pika.reply(Config.message.error);
        });
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "weather",
            react: "🌁",
            need: "query",
            category: "search",
            desc: "Get live weather reports of a specific city",
            cooldown: 10,
            filename: __filename
      }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} Assam`);
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(args.join(" "))}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`)
        .then(async res=> {
            const {data} = res;
            if (data.cod === 404) return pika.reply(`❎ City ${args.join(" ")} not found!`);
            return await anyaV2.sendMessage(pika.chat, {
                    video: await getBuffer("https://media.tenor.com/bC57J4v11UcAAAPo/weather-sunny.mp4"),
                    gifPlayback: true,
                    caption: `
\`\`\`🌦️ Weather Reporting ${data.name}\`\`\`

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*🌐 Coord:-*
    - 🌍 longitude : ${data.coord.lon}
    - 🌏 latitude : ${data.coord.lat}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*☁️ Weather:-*
    - id : ${data.weather[0].id}
    - main : ${data.weather[0].main}
    - desc : ${data.weather[0].description}
    - icon : ${String.fromCodePoint(parseInt('0x' + data.weather[0].icon))}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*🌡️ Main:-*
    - 🌡️ temp : ${data.main.temp}°C
    - 👣 feels Like : ${data.main.feels_like}°C
    - 🥶 temp. Min. : ${data.main.temp_min}°C
    - 🥵 temp. Max. : ${data.main.temp_max}°C
    - 🌬️ pressure : ${data.main.pressure}hPa
    - 💧 humidity : ${data.main.humidity}%
    - 🌊 sea level : ${data.main.sea_level !== undefined ? data.main.sea_level + 'hPa' : 'N/A'}
    - 🌎 ground level : ${data.main.grnd_level !== undefined ? data.main.grnd_level + 'hPa' : 'N/A'}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*💨 wind:-*
    - 💫 speed : ${data.wind.speed}m/s
    - 🧭 direction : ${data.wind.deg}°
    - 💨 gust : ${data.wind.gust !== undefined ? data.wind.gust + 'm/s' : 'N/A'}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*🌞 Sys:*
    - 🌍 country : ${data.sys.country}
    - 🌅 sunrise : ${(new Date(data.sys.sunrise * 1000)).toLocaleString().split(", ")[1]}
    - 🌇 sunset : ${(new Date(data.sys.sunset * 1000)).toLocaleString().split(", ")[1]}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*☁️ Clouds:-* ${data.clouds.all}%
*📆 Update Date:-* ${(new Date(data.dt * 1000)).toLocaleString().split(", ")[0]}
*🕒 Update Time:-* ${(new Date(data.dt * 1000)).toLocaleString().split(", ")[1]}
*👁️ Visibility:-* ${data.visibility / 1000}km
*🏢 Source:-* ${data.base}
*🏙️ City:-* ${data.name}

> ${Config.footer}
`.trim()
                    }, { quoted: pika });
        })
        .catch(err=> {
            console.error(err);
            pika.reply("❎ Error, please check the city name again or try again later.");
        });
      }
)

//༺─────────────────────────────────────༻

anya({
            name: "search",
            alias: ['google'],
            react: "🌐",
            need: "query",
            category: "search",
            desc: "Search from Google website",
            cooldown: 15,
            filename: __filename
     }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} Corona Virus Symptoms`);
        pikaApi.get("api", "google", `q=${encodeURIComponent(args.join(" "))}`)
        .then(async ({results})=> {
            if (results < 1) return pika.reply("❎ No results found!");
            let caption = `\`\`\`🌐 Google Search Engine\`\`\`

❒ *Results For :* ${args.join(" ")}
❒ *Results Found :* ${results.length}
❒ *Sesrch Engine :* www.google.com

════════════════════════
`;
            for (const i of results) {
                caption += `\n❖ *Title:* ${i.title}\n`;
                caption += `> ❖ *Link:* ${i.link}\n`;
                caption += `> ❖ *About:* ${i.snippet}\n`;
//                caption += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
            }
            caption += `\n${Config.footer}`;
            pika.reply(caption);
        })
        .catch(err=> {
            console.error(err);
            pika.reply(Config.message.error);
        });
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "gimg",
            alias: ['googleimage', 'image'],
            react: "🌌",
            need: "query",
            category: "search",
            desc: `Search ${googleImageLimit} images from Google`,
            filename: __filename
    }, async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix+command} 2 mug 1 girl`);
        const {key} = await pika.keyMsg(Config.message.wait);
        let min = 1;
        gimg(args.join(" "))
        .then(async response=> {
            if (response.length < 1) return pika.edit("*❎ No Results Found!*", key);
            for (const i of response) {
                if (min > googleImageLimit) break;
                min++
                await anyaV2.sendMessage(pika.chat, {
                        image: await getBuffer(i),
                        caption: tiny("Searched By " + Config.botname)
                }, {quoted:pika});
            }
            return pika.deleteMsg(key);
        })
        .catch(err=> {
            console.error(err);
            pika.edit(Config.message.error, key);
        });
    }
)