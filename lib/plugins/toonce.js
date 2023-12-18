const { anya } = require('../lib');

anya({
  name: [
    "toonce"
  ],
  alias: [
    "toviewonce",
    "tonce"
  ],
  category: "convert",
  desc: "Convert media into once veiw message.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (mime, text, anyaV2, pika) => {
require('../../config');
    const { unlinkSync } = require('fs');
    const { sleep } = require('../lib/myfunc');
//    if (!) return pika.reply(`Reply or tag a image or video media.`);
    if (!pika.quoted || !/image/.test(mime) && !/video/.test(mime)) return pika.reply('Please tag a image or video media to proceed.');
    const isPromt = true; // true to send tip message | false to don't send tip message 
    const promtMessage = '*Promt:* You can put a message text with command to send in *once view* media.';
    const mediaMess = await anyaV2.downloadAndSaveMediaMessage(pika.quoted);
    const caption = text ? text : null;
    (text) ? null : pika.reply(promtMessage);
    (/image/.test(mime))
    ? await anyaV2.sendMessage(pika.chat, {
            caption: caption,
            image: { url: mediaMess },
            viewOnce: true
            }, { quoted: pika })
    : await anyaV2.sendMessage(pika.chat, {
            caption: caption,
            video: { url: mediaMess },
            viewOnce: true
            }, { quoted: pika });
    await sleep(1000);
    unlinkSync(mediaMess);
    });
