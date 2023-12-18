const { anya } = require('../lib');

anya({
  name: [
    "setdesc",
    "setgcpp",
    "setgcname"
  ],
  alias: [
    "setdescription",
    "setgrouppp",
    "setsubject"
  ],
  category: "admin",
  desc: "Change group chat's informations.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async (command, botAdmin, userSudo, userOwner, userAdmin, mime, prefix, text, anyaV2, pika) => {
  require('../../config');
  const fs = require('fs');
  if (!pika.isGroup) return pika.reply(message.group);
  if (!botAdmin) return pika.reply(message.botAdmin);
  if (!userAdmin && !userOwner && !userSudo) return pika.reply(message.admin);
    switch (command) {
     case 'setdesc': case 'setdescription':
     if (!text) return pika.reply("Please enter a description to set as this group chat's description");
     await anyaV2.groupUpdateDescription(pika.chat, text)
        .catch((err) => {
          pika.reply(message.error);
         });
     pika.reply(message.success);
     break;
     case 'setgrouppp': case 'setgcpp':
     if (!/image/.test(mime) || /webp/.test(mime)) return pika.reply(`Please reply with an image and include a caption *${prefix + command}*`);
     const profilePic= await anyaV2.downloadAndSaveMediaMessage(pika.quoted);
     await anyaV2.updateProfilePicture(pika.chat, { url: profilePic }).then((err) => { fs.unlinkSync(profilePic)
    });
//    fs.unlinkSync(profilePic);
    pika.reply(message.success);
    break;
    case 'setgcname': case 'setsubject':
     if (!text) return pika.reply("Please enter a text to set as this group chat's name");
     await anyaV2.groupUpdateSubject(pika.chat, text);
     pika.reply(message.success);
    break;
    }
});
