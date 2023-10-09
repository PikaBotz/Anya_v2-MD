/**
👑 Q U E E N - A N Y A - M D - #v2

🔗 Dev: https://wa.me/918811074852 (@PikaBotz)
🔗 Team: Tᴇᴄʜ Nɪɴᴊᴀ Cʏʙᴇʀ Sϙᴜᴀᴅꜱ (𝚻.𝚴.𝐂.𝐒) 🚀📌 (under @P.B.inc)

📜 GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

📌 Permission & Copyright:
If you're using any of these codes, please ask for permission or mention https://github.com/PikaBotz/Anya_v2-MD in your repository.

⚠️ Warning:
- This bot is not an officially certified WhatsApp bot.
- Report any bugs or glitches to the developer.
- Seek permission from the developer to use any of these codes.
- This bot does not store user's personal data.
- Certain files in this project are private and not publicly available for edit/read (encrypted).
- The repository does not contain any misleading content.
- The developer has not copied code from repositories they don't own. If you find matching code, please contact the developer.

Contact: alammdarif07@gmail.com (for reporting bugs & permission)
          https://wa.me/918811074852 (to contact on WhatsApp)

🚀 Thank you for using Queen Anya MD v2! 🚀
**/

exports.cmdName = () => {
  return {
    name: ['pussy',
      'spreadpussy',
      'genshin',
      'squirt',
      'swimsuit',
      'schoolswimsuit',
      'holoLive',
      'ass',
      'underwear',
      'nipples',
      'uncensored',
      'sex',
      'sex2',
      'sex3',
      'blonde',
      'twintails',
      'breasts',
      'thighhighs',
      'skirt',
      'gamecg',
      'animalears',
      'foxgirl',
      'dress',
      'schooluniform',
      'twogirls',
      'gloves',
      'vocaloid',
      'touhou',
      'weapon',
      'withflowers',
      'pinkhair',
      'cloudview',
      'white',
      'animal',
      'tail',
      'nude',
      'ponyTail',
      'bed',
      'whitehair',
      'ribbons',
      'japaneasecloths',
      'hatsunemiku',
      'bikini',
      'barefoot',
      'nobra',
      'food',
      'wings',
      'pantyhouse',
      'openshirt',
      'headband',
      'penis',
      'close',
      'wet',
      'catgirl',
      'wolfgirl',
      'loli2',
      'spreadlegs',
      'bra',
      'fateseries',
      'tree',
      'elbowgloves',
      'greenhair',
      'horns',
      'withpetals',
      'drunk',
      'cum',
      'headdress',
      'tie',
      'shorts',
      'maid',
      'headphones',
      'anusview',
      'idol',
      'gun',
      'stockings',
      'tears',
      'breasthold',
      'neckplace',
      'seethrought',
      'bunnyears',
      'bunnygirl',
      'topless',
      'beach',
      'erectnipples',
      'yuri',
      'vampire',
      'shirt',
      'pantypull',
      'torncloths',
      'bondage',
      'demon',
      'bell',
      'shirtlift',
      'tattoo',
      'chain',
      'flatchest',
      'fingering'],
    alias: [],
    category: "nsfw",
    desc: "Search for high quality (4k, 8k) naked pictures of anime waifus."
  };
}

exports.getCommand = async (command, anyaV2, pika) => {
require('../../config');
    const { isCaseEnabled } = require('../lib/mongoDB');
    if (!pika.isGroup) return pika.reply(message.group);
    const isEnabled = await isCaseEnabled("nsfw");
    if (!isEnabled.includes(pika.chat)) return pika.reply(message.nsfw);
    await pika.react("🤤");
    const { get } = require('axios');
    const fetch = await get("https://fantox-apis.vercel.app/" + command);
    const picture = fetch.data;
    pika.reply(message.wait);
    await anyaV2.sendMessage(pika.chat, {
         caption: `🥵 Reply with *1* for next "${command}" picture.\n\n_ID: QA06_`,
         image: { url: picture.url },
         headerType: 4
        }, {quoted:pika});
      }



