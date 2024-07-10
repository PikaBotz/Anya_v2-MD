const Config = require('../../config');
const axios = require('axios');
const { anya, listall, writeExifInVid, createVidSticker, api } = require('../lib');
const numFancyAliases = 59; /* How many copies needed for "fancy" plugin alias (eg: fancy1, fancy2... fancy59) */

//༺─────────────────────────────────────༻

const screenshot = ['ss', 'ss2', 'ss3'];
screenshot.forEach(ss => {
   anya({
    	 name: ss,
         alias: ['screenshot'],
         react: "📸",
         need: "url",
         category: "tools",
         desc: "Take a screenshot of various websites",
         cooldown: 8,
         filename: __filename
  },
  async (anyaV2, pika, { args, prefix, command }) => {
    if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* https://github.com/PikaBotz/`);
    if (!/http|https/.test(args.join(" ").toLowerCase())) return pika.reply("❎ Invalid Url, enter a valid url");
    const {key} = await pika.keyMsg(Config.message.wait);
    let dimensions;
    //-----------------------
    if (/2/.test(command)) {
        dimensions = "768x1024";
    } else if (/3/.test(command)) {
        dimensions = "360x720";
    } else dimensions = "1920x1080";
    //-----------------------
    axios.get(`https://api.screenshotmachine.com?key=81d99b&url=${args[0]}&dimension=${dimensions}&format=jpg&cacheLimit=0&delay=2000&zoom=200`, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
        "cookie": "mid=XBXl1AALAAEbFoAEfNjZlMMG9dwX; ig_did=91E66A48-5AA2-445D-BFE6-84DC4456DE8F; fbm_124024574287414=base_domain=.instagram.com; ig_nrcb=1; shbid=\"12737\0544008624962\0541656157971:01f72a5102dc07af6845adf923ca70eb86e81ab95fa9dbfdaf157c9eef0e82fd1f10fe23\"; shbts=\"1624621971\0544008624962\0541656157971:01f74841fba8e77a0066b47ea891dec8fba6fdf9216c0816f9fb3532292f769828800ae2\"; fbsr_124024574287414=86D8femzH4_KFW4hd3Z6XFdowU6lG-uXsXRQDNl44VM.eyJ1c2VyX2lkIjoiMTAwMDA0Njc2MDc4Nzg5IiwiY29kZSI6IkFRQngzXzVOejdwVnBwby1LRGRUdEYxUFlzcUdDQXJjcmJfb05HaWFvYkNvOGtLN2paam50bHpvMTNOakFnTzVKOHQ5M0V3U3dvNkRtZ0RiY1l1Z3dQSTIybnExOUxLd3lpZTVfZll0bkNXZXBuM1hoYWFLX0w2R0pZaUpzaDBOTDBhb3pmTVBkRTVQRC12X3FnbUgxLXZYdGVmcHhfaFU0aUZNZVMxNHhFUk5OblJyMmxYTUpDa2RFYTdISXNCR2swdHhaaGF0NUt4UDR3cWZTamRwcVFfQ19sa1RUek5fU0taUTYtMjlzTkdnLUVWb3oxMUZWc3Q2OEx2ZnlIY0V0eFp0ZUxacXpiWmh6MzZrVl83VmFGd0FqVnVkTGFQN2VzT3ZRcmlTQ2pLUE5XbVcyNWhudzIzejJBSnVURW00YWR1cmN6a3ZLWU1icTd2SnN0SVdJV09RIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUJBZmJuQ3haQzZMd3h4MDFJV2MyZ3dsQ3k3Qmp0b05UNUY0WDY2NHBrUzRQeERNVXRsdmhWWkI3SXE0MGsyZ2hJQm55RHRPcW5iVjlPbUNiWGhyTFBaQUhBQjFzVFpBdHF6RFEzVTROUkhOU1V6MFVXWkNtTEdLcDNNWDRoazVIOURLbERHN0QwUlhZNHY4dHBCdVNNYjN4dnBTRGtQcHdYRlBXVU82VCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjI0NjIxOTgxfQ; fbsr_124024574287414=86D8femzH4_KFW4hd3Z6XFdowU6lG-uXsXRQDNl44VM.eyJ1c2VyX2lkIjoiMTAwMDA0Njc2MDc4Nzg5IiwiY29kZSI6IkFRQngzXzVOejdwVnBwby1LRGRUdEYxUFlzcUdDQXJjcmJfb05HaWFvYkNvOGtLN2paam50bHpvMTNOakFnTzVKOHQ5M0V3U3dvNkRtZ0RiY1l1Z3dQSTIybnExOUxLd3lpZTVfZll0bkNXZXBuM1hoYWFLX0w2R0pZaUpzaDBOTDBhb3pmTVBkRTVQRC12X3FnbUgxLXZYdGVmcHhfaFU0aUZNZVMxNHhFUk5OblJyMmxYTUpDa2RFYTdISXNCR2swdHhaaGF0NUt4UDR3cWZTamRwcVFfQ19sa1RUek5fU0taUTYtMjlzTkdnLUVWb3oxMUZWc3Q2OEx2ZnlIY0V0eFp0ZUxacXpiWmh6MzZrVl83VmFGd0FqVnVkTGFQN2VzT3ZRcmlTQ2pLUE5XbVcyNWhudzIzejJBSnVURW00YWR1cmN6a3ZLWU1icTd2SnN0SVdJV09RIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUJBZmJuQ3haQzZMd3h4MDFJV2MyZ3dsQ3k3Qmp0b05UNUY0WDY2NHBrUzRQeERNVXRsdmhWWkI3SXE0MGsyZ2hJQm55RHRPcW5iVjlPbUNiWGhyTFBaQUhBQjFzVFpBdHF6RFEzVTROUkhOU1V6MFVXWkNtTEdLcDNNWDRoazVIOURLbERHN0QwUlhZNHY4dHBCdVNNYjN4dnBTRGtQcHdYRlBXVU82VCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjI0NjIxOTgxfQ; csrftoken=PpiPMEl0R2pAwThsw4NXynO6cVIXHZDo; ds_user_id=38316792800; sessionid=38316792800:rQj5Tr3g5zkg7b:4; rur=\"RVA\05438316792800\0541656158332:01f759cf624bef147397144805bb4c26f6c8b36a232e0f5738c570ee492f6b629f84f6e5\""
      },
      responseType: 'arraybuffer'
    })
    .then(async res=> {
      return await anyaV2.sendMessage(pika.chat, {
        image: res.data,
        caption: `*🔗𝚄𝚛𝚕:* ${args[0]}\n\n> ${Config.footer}`
      },
      {
        quoted:pika
      })
      .then(()=> pika.deleteMsg(key))
      .catch((err)=> {
        console.error(err);
        pika.edit(Config.message.error, key);
         });
       });
    });
  }
)

//༺─────────────────────────────────────༻

anya({
        name: "take",
        alias: ['stealsticker', 'steal'],
        react: "💫",
        need: "media",
        category: "tools",
        desc: "Steal stickers",
        filename: __filename
    }, async (anyaV2, pika, { args, prefix, command }) => {
        const text = args.join(" ");
        const packname = args.length > 0 ? text.split('|').map(item => item.trim())[0] : Config.packname;
        const author = args.length > 0 ? text.split('|').map(item => item.trim()).slice(1).join('|') || '@pikanull' : Config.author;
        const quoted = pika.quoted ? pika.quoted : '';
        const mime = (quoted && quoted.mimetype) ? quoted.mimetype : '';
        const path = `./.temp/${pika.sender.split('@')[0] + Math.random().toString(36).substr(2, 5)}`;
        if (/webp/.test(mime)) {
            const fs = require('fs');
            const media = await quoted.download();
            fs.writeFileSync(path + '.webp', media);
            await writeExifInVid(path + '.webp', { packname: packname, author: (author === '@pikanull') ? null : author })
            .then(async res=> {
                await anyaV2.sendMessage(pika.chat, { sticker: fs.readFileSync(res) }, { quoted: pika });
                fs.unlinkSync(res);
            })
            .catch(err=> {
                console.error(err);
                pika.reply(Config.message.error + '\n\n' + err);
            })
        } else if (/video/.test(mime)) {
            const video = await quoted.download();
            const buffer = await createVidSticker(video, { packname: packname, author: (author === '@pikanull') ? null : author });
            await anyaV2.sendMessage(pika.chat, { sticker: buffer }, { quoted: pika });
        } else if (/image/.test(mime)) {
            const image = await quoted.download();
            axios.post(api.apiHubRaw + `/api/sticker?key=${api.apiHubKey}&packname=${packname}&author=${author}`, { media: image.toString('base64') }, {
                  headers: {
                    'content-type': 'application/json'
                  }
            })
            .then((res) => res.data)
            .then(async res=> { await anyaV2.sendMessage(pika.chat, { sticker: Buffer.from(res.results.sticker, 'base64') }, { quoted: pika }); })
            .catch(err=> {
                console.error(err);
                pika.reply(Config.message.error);
            })
        } else pika.reply(`Reply or tag a media/sticker with caption ${prefix + command} to rename/make sticker`)
    }
)

//༺─────────────────────────────────────༻

anya({
            name: "tinyurl",
            alias: ['tiny'],
            react: "🤏🏻",
            need: "url",
            category: "tools",
            desc: "Shorten urls",
            cooldown: 15,
            filename: __filename
     },
     async (anyaV2, pika, { args, prefix, command }) => {
        if (args.length < 1) return pika.reply(`*${Config.themeemoji} Example:* ${prefix + command} https://github.com/PikaBotz/Anya_v2-MD`);
        if (!/^https?:\/\//i.test(args[0].toLowerCase())) return pika.reply("❎ Invalid url!");
        axios.get(`https://tinyurl.com/api-create.php?url=${args[0].toLowerCase()}`)
        .then(({ data })=> pika.reply(`*✅ Successfully made your link tiny:-* ${data}`))
        .catch(err=> {
            console.error(err);
            pika.reply(Config.message.error);
        });
     }
)

//༺─────────────────────────────────────༻

anya({
  name: "fancy",
  alias: Array.from({ length: numFancyAliases }, (_, i) => `fancy${i + 1}`),
  react: "💖",
  need: "text",
  category: "tools",
  desc: "Stylish texts",
  filename: __filename
}, async (anyaV2, pika, { args, prefix, command }) => {
  let c = 1;
  let styler = `
═════════════════════════
            ░▒▓ \`Sexy Text\` ▓▒░
═════════════════════════\n\n`;
  styler += `*${Config.themeemoji}Example:* ${prefix}fancy58 ${args.length > 0 ? args.join(" ") : "Hentai"}\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n`;
  for (const i of listall(args.length > 0 ? args.join(" ") : "Preview Text")) {
    styler += `${c++}. ${i}\n`;
  }
  styler += `\n> ${Config.footer}`;
  if (command === "fancy") return pika.reply(styler.trim());
  else return pika.reply(listall(args.length > 0 ? args.join(" ") : "Enter Some Texts")[Number(command.split("fancy")[1]) - 1]);
});
