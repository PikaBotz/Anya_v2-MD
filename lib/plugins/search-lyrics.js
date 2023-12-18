const { anya } = require('../lib');

anya({
  name: [
    "lyrics"
  ],
  alias: [
    "lyric",
    "liric"
  ],
  react: "🎼",
  need: "query",
  category: "search",
  desc: "You can download lyrics of any latest song you want.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (text, pika, anyaV2) => {
    if (!text) return pika.reply('🎶 Tell me a song name you want to get!');
    const axios = require('axios');
    axios.get(`https://lyrist.vercel.app/api/${text}`)
     .then(async (response) => {
       const { data } = response;
       const { tiny } = require('../lib/stylish-font');
       const { getBuffer } = require('../lib/myfunc');
       const caption = `
▁ ▂ ▅ ▇ █ L Y R I C S █ ▇ ▅ ▂ ▁\n
🎃 *${tiny('Title')}:* ${data.title ? data.title : 'No Title'}
🎸 *${tiny('Artist')}:* ${data.artist ? data.artist : 'Unknown'}
🌊 *${tiny('Lyrics')}:*\n\n${data.lyrics}\n
━─━─────༺ - ༻─────━─━
`;
      await anyaV2.sendMessage(pika.chat, { image: await getBuffer(data.image ? data.image : 'https://i.ibb.co/KzMpxyj/Picsart-23-11-20-18-29-20-073.jpg'), caption: caption }, { quoted: pika });
     }).catch((error) => {
       console.log(error);
       pika.reply('🙁 I\'m sorry, I\'m having error while extracting the lyrics...');
   });
  });
