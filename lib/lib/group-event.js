const Config = require('../../config');
const myfunc = require('./myfunc');

exports.listners = async (group, anyaV2) => {
  /*
  const { Bot } = require('../database/mongoDB');
  const bot = await Bot.get();
  const users = group.participants[0];
  const username = await anyaV2.getName(users);
  const grpData = await anyaV2.groupMetadata(group.id);
  async function userpp(user) {
    try {
      var pic = await anyaV2.profilePictureUrl(user);
    } catch (err) {
      var pic = 'https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg';
    }
    return pic;
  }
  async function grouppp(id) {
    try {
      var pic = await anyaV2.profilePictureUrl(id);
    } catch (err) {
      var pic = 'https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg';
    }
    return pic;
  }
  const usercon = { key: { participant: '0@s.whatsapp.net', ...({ remoteJid: 'status@broadcast' }), }, message: { contactMessage: { displayName: username, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${username},;;;\nFN:${username}\nitem1.TEL;waid=${users.split('@')[0]}:${users.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`, jpegThumbnail: Config.image_3, thumbnail: Config.image_3, sendEphemeral: true, }, }, };

  if (group.action === 'add' && bot.welcome) {
//    await anyaV2.sendMessage(group.id, {
//      audio: fs.readFileSync('./lib/Assets/audio_1.mp3'),
//      mimetype: 'audio/mp4',
//      ptt: true,
//      contextInfo: {
//        externalAdReply: {
//          title: grpData.subject,
//          body: username,
//          thumbnail: Config.image_2,// await myfunc.getBuffer(await grouppp(users)),
//          showAdAttribution: false,
//          mediaType: 2,
//          mediaUrl: `https://instagram.com/${Config.instagramId}`,
//          sourceUrl: `https://Instagram.com/${Config.instagramId}`
//        }
//      }
//    }).then(async (audio) => {
     await anyaV2.sendMessage(group.id, {
      image: await myfunc.getBuffer(await grouppp(group.id)),
      caption: Config.welcome
                  .replace('/\$user/g', users.split("@")[0])
                  .replace('/\$prefix/g', prefa)
                  .replace('/\$group/g', grpData.subject)
                  .replace('/\$membersth/g', grpData.participants.length + 'th'),
      mentions: [users]
    }, { quoted: usercon });
//    }).catch((err) => console.log(err));
  }*/
}