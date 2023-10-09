exports.cmdName = () => {
  return {
    name: ['ttdl'],
    alias: ['tiktokdl'],
    category: "download",
    desc: "Download high quality TikTok video/audio using video url."
  };
}


exports.getCommand = async (args, text, anyaV2, pika) => {
  try {
    if (!text || !text.includes("tiktok.com")) return pika.reply("Enter a valid tiktok video post link!");
    const { tiktok, ttStalk } = require('api-dylux');
    const { getBuffer } = require('../lib/myfunc');

    pika.reply(message.wait);
    await pika.react("🌟");
    const links = (args[0] === 'audio' || args[0] === 'video') ? args[1] : args[0];
    const result = await tiktok(links);

    const sendResults = async () => {
      const caption = `*🦋 Username :* ${result.unique_id}
*👤 Name :* ${result.nickname}
*⏱️ Duration :* ${result.duration} minute

\`\`\`Reply a number:\`\`\`
    *1 Download video*
    *2 Download audio*

_ID: QA15_

*🔗 Link:* ${links}`;
      
      await anyaV2.sendMessage(pika.chat, { image: await getBuffer('https://i.ibb.co/CH438vb/pngwing-com.png'), caption: caption, headerType: 4 }, { quoted: pika })
        .catch((error) => { return pika.reply('Unexpected error occurred!'); });
    };

    const sendMediaDl = async () => {
      const profile = await ttStalk(result.unique_id);
      if (args[0] !== 'audio') {
        await anyaV2.sendMessage(pika.chat, {
          video: { url: result.hdplay },
          caption: `*🦋 Username :* @${result.unique_id}
*👤 Name :* ${result.nickname}
*↙️ Downloads :* ${result.download_count}
*⏱️ Duration :* ${result.duration} minute
*⚜️ Desc :* ${result.description}`,
          headerType: 4
        }, { quoted: pika })
        .catch((error) => { return pika.reply('Unexpected error occurred!'); });
      } else {
        await anyaV2.sendMessage(pika.chat, {
          audio: { url: result.music },
          mimetype: 'audio/mp4',
          ptt: false,
          contextInfo: {
            externalAdReply: {
              title: `🦋 Username: @${result.unique_id} / ${result.nickname}\n`,
              body: `${result.description}.mp3`,
              thumbnail: await getBuffer(profile.profile),
              mediaType: 2,
              mediaUrl: result.music,
              sourceUrl: result.music
            }
          }
        }, { quoted: pika })
        .catch((error) => { return pika.reply('Unexpected error occurred!'); });
      }
    };

    // Main part 〽️
    if (args[0] === 'audio' || args[0] === 'video') {
      await sendMediaDl();
    } else {
      await sendResults();
    }
  } catch (error) {
    console.error('An error occurred:', error);
    pika.reply('An unexpected error occurred!');
  } 
};




