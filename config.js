const { readFileSync } = require('fs')
require('dotenv').config({path: './mongo.env'});
require('dotenv').config({path: './owner.env'});
require('dotenv').config({path: './session.env'});
require('dotenv').config({path: './bot.env'});

module.exports = {
    /**
     * bot details and parameters
     */
    botname: process.env.BotName || " 𓆩𝐋𝐔𝐅𝐅𝐘-𝚩𝚯𝚻𓆪",
    footer: process.env.Footer || "©  𓆩𝐋𝐔𝐅𝐅𝐘-𝚩𝚯𝚻𓆪",
    prefa: process.env.Prefix || ".",
    themeemoji: process.env.ThemeEmoji || "🎐",

    /**
     * owner details and parameters
     */
    ownername: process.env.Owner_Name || "𓆩𝞖𝞓𝞛𝙕𝞓𓆪 ",
    ownernumber: process.env.Owner_Number || "923214525530",
    instagramId: process.env.Insta || "phonetastic_finds",

    /**
     * other details and parameters
     */
    author: process.env.Author || "@𓆩𝞖𝞓𝞛𝙕𝞓𓆪 ",
    packname: process.env.PackName ||  "𓆩𝐋𝐔𝐅𝐅𝐘-𝚩𝚯𝚻𓆪",
    socialLink: process.env.Web || "https://github.com/luffy-gear909",
    groupLink: process.env.GcLink || "https://chat.whatsapp.com/E490r0wSpSr89XkCWeGtnX",
    warns: Number(process.env.Warn_Limits) || 3,
    cooldown: 5, // default cooldown time per command in seconds
    mongoUrl: process.env.MongoDB || "mongodb+srv://hamzashahid1152901:yTrVsAF5uJIy2HTx@luffymd.9s2en15.mongodb.net/?retryWrites=true&w=majority&appName=LUFFYMD",
    sessionId: process.env.SESSION_ID || "dV_Queen-Anya_V_Queen-Anya_oWFNDSWIjc3QwYzc5Tm1OV_Queen-Anya_XFzMzB2V_Queen-Anya_TFvV_Queen-Anya_HV_Queen-Anya_kc2xBeUpIV_Queen-Anya_WxZcV_Queen-Anya_9Jc3paRGV_Queen-Anya_TQUNHQQ==",

    /**
     * thumbnails and medias
     */
    image_1: readFileSync('./lib/Assets/image_1.jpg'), // primary image
    image_2: readFileSync('./lib/Assets/image_2.jpg'), // secondry image
    imageUrl: "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg", // image url, to replace to your url upload your image to https://imgbb.com
    imageMentionUrl: "https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg", // image for mention reply audio media
    aliveMedia: readFileSync("./lib/Assets/aliveMedia.mp4"),
    menuMedia: readFileSync('./lib/Assets/menuMedia.mp4'),
    ownerMentionMp3: readFileSync('./lib/Assets/ownerMentionMp3.mp3'),  // audio for mention reply audio media

    /**
     * core parameters and values
     */
    ownercon: { key: { fromMe: false, participant: '0@s.whatsapp.net', ...({ remoteJid: 'status@broadcast' }), }, message: { contactMessage: { displayName: this.ownername, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${this.ownername},;;;\nFN:${this.ownername}\nitem1.TEL;waid=${this.ownernumber}:${this.ownernumber}\nitem1.X-ABLabel:Mobile\nEND:VCARD`, jpegThumbnail: this.image_2, thumbnail: this.image_2, sendEphemeral: true } } },
    fakeshop: { key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" }, message: { orderMessage: { itemCount: 1234, status: 200, thumbnail: this.image_1, surface: 200, message: this.botname, orderTitle: this.ownername, sellerJid: '0@s.whatsapp.net'}}, contextInfo: { forwardingScore: 999, isForwarded: true}, sendEphemeral: true },
    message: {
        success: "✅ 𝚂𝚞𝚌𝚌𝚎𝚜𝚜! 𝙾𝚙𝚛𝚊𝚝𝚒𝚘𝚗 𝙲𝚘𝚖𝚙𝚕𝚎𝚝𝚎𝚍.",
        admin: "*👤 A𝙳𝙼𝙸𝙽 N𝙴𝙴𝙳𝙴𝙳!*\n\n- Dear, this command is only for Admins. You have to be a admin in this group to use this command.",
        botAdmin: "*🤖 B𝙾𝚃 A𝙳𝙼𝙸𝙽 N𝙴𝙴𝙳𝙴𝙳!*\n\n- I'm not an Admin, so I can't execute this command in this group. Please make me an Admin.",
        owner: "*👑 O𝚆𝙽𝙴𝚁 N𝙴𝙴𝙴𝙳𝙴𝙳!*\n\n- Bruh, this command is only made for this bot's owner. So you can't use this command.",
        group: "*👥 G𝚛𝚘𝚞𝚙 N𝚎𝚎𝚍𝚎𝚍!*\n\n- This command can only be executed in a group chat.",
        private: 'This command is only for private chats.',
        wait: '🔄 Processing request...',
        error: "❌ Oops! An error occurred while processing your request. Please try again later.",
        ban: `You're banned from using this bot!`,
        nsfw: 'This group is not *NSFW* enabled.',
        banChat: 'This group is banned from using this bot, please contact owner to get unbanned.'
    }
}
