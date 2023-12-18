const { anya } = require('../lib');

anya({
  name: [
    "getpp",
    "getbio"
  ],
  category: "group",
  alias: [
    "getdp",
    "getdesc"
  ],
  desc: "Get tagged/mentioned user's biography or profile picture.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (command, text, anyaV2, pika) => {
const errorReply = (pika, message) => {
  anyaV2.sendMessage(pika.chat, {
    text: `❌ ${message}`,
    edit: pika.key,
  });
};
  if (!pika.isGroup) return errorReply(pika, message.group);
  if (!text && !pika.quoted) return errorReply(pika, `Tag a user to get their ${command.split("get")[1]}`);
  await pika.react("☘️");
  const axios = require("axios");
  const user = pika.quoted ? pika.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  const process = await anyaV2.sendMessage(pika.chat, { text: message.wait, mentions: [user] }, { quoted: pika });
  switch (command) {
    case getbio:
    case getdesc:
      const userBio = await anyaV2.fetchStatus(user);
      anyaV2.sendMessage(pika.chat, {
        text: userBio.status ? `*🗯️ Bio:* ${userBio.status}` : "❌ I can't fetch this user's biography.",
        edit: process.key,
      });
      break;
    case getpp:
    case getdp:
      try {
        var pfp = await anyaV2.profilePictureUrl(user, "image");
      } catch (e) {
        errorReply(pika, "Sorry, I can't fetch this user's profile picture.");
        return;
      }
      const getBuffer = async (url, options = {}) => {
        try {
          const res = await axios({
            method: "get",
            url,
            headers: {
              'DNT': 1,
              'Upgrade-Insecure-Request': 1,
            },
            ...options,
            responseType: 'arraybuffer',
          });
          return res.data;
        } catch (err) {
          console.log(err);
        }
      };
      await anyaV2.sendMessage(pika.chat, {
        image: await getBuffer(pfp),
        caption: `_@${user.split("@")[0]}'s Profile picture_.`,
        mentions: [user],
      }, { quoted: pika });
      break;

    default:
      errorReply(pika, message.error);
  }
});
