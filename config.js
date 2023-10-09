const { readFileSync, watchFile, unwatchFile } = require('fs')
const { redBright } = require('chalk')
require('./lib/config')
require("dotenv").config();

global.zApiKey = {// if this API key get expired then please go to https://www.fxacb-api.my.id and get a new api key.
       one: "zenzkey_998568986d"
}


global.botname = process.env.BotName || "Queen Anya" // ✅ 
global.author = process.env.Author || "@PikaBotz" // ✅ 📌
global.packname = process.env.PackName || "Queen Anya v2 MD" // ✅ 📌
global.myweb = process.env.Web || "https://github.com/PikaBotz" // ✅
global.footer = process.env.Footer || "© Queen Anya Bot" // ✅
global.prefa = process.env.Prefix || ['-'] // ✅
global.themeemoji = process.env.ThemeEmoji || "🎐" // ✅
global.ownername = process.env.Owner_Name || "Pika~Kun" // ✅ 📌
global.ownernumber = process.env.Owner_Number || "916900904828" // ✅ 📌
global.adress = process.env.Continent || "Asia, India, Assam" //✅
global.timezone = process.env.TimeZone || "Asia/Kolkata" //✅ 📌
global.instagramId = process.env.Insta || "8.08_only_mine" //✅
global.email = process.env.Email_Id || "example@example.com" //✅
global.welcome = process.env.Welcome_Msg || '*@$user* joined this group today as $membersth member.\n\n_$prefix welcome off to disable this message._'; // ✅
global.left = process.env.Left_Msg || 'Ex-member *@$user* is no longer available in this group chat.\n\n_$prefix goodbye off to disable this message._'; // ✅
global.promote = process.env.Promote_Msg || '*@$user* has been promoted as an admin in this group.\n\n_$prefix promotem off to disable this message._'; // ✅
global.demote = process.env.Demote_Msg || '*@$user* has been demoted to a member in this group.\n\n_$prefix demotem off to disable this message._'; // ✅

global.mongoUrl = process.env.MongoDB || "mongodb+srv://teamolduser:Jetushack2@teamolduser.mzsnt1b.mongodb.net/?retryWrites=true&w=majority"; // ✅📌

global.warns = process.env.Warns_Limits || 3; // ✅

global.badWords = [
  "vagina",
  "dick",
  "mdrchod",
  "mdrchod",
  "chutiya",
  "lodu",
  "whore",
  "hore",
  "hoe",
  "hoes",
  "lode",
  "cum",
  "idiot",
  "bastard",
  "cunt",
  "butt",
  "pussy",
  "chut",
  "suck",
  "scum",
  "scumbag",
  "niggr",
  "nigga",
  "chod",
  "bhenchod",
  "bc",
  "bhodike",
  "bsdk","randi",
  "gandu",
  "stfu",
  "ass",
  "asshole",
  "madarchod",
  "fuck",
  "motherfucker",
  "mother fucker",
  "mf",
  "mfs",
  "fk",
  "fck",
  "gand",
  "laund",
  "loda",
  "gulambi"];
  
//--------------- Tip ----------------\\
global.Tips = [
`Type *$prefix info* for more information....`,
`Type *$prefix settings* to commit changes in the bot.`,
`If you got a bug or error, then please report to developer asap by *$prefix report* command.`
]

//--------------- Menu images ----------------\\
global.image_1 = readFileSync('./lib/Assets/image_1.jpg') // Thumbnail for allmenu command
global.image_2 = readFileSync('./lib/Assets/image_2.jpg') // null image
global.image_3 = readFileSync("./lib/Assets/image_3.jpg") // Thumbnail for Dashboard
global.menu_pic = "https://i.ibb.co/PhDcZTM/Thumbnail.png";

global.mess = {
    success: 'Done ✅',
    admin: 'You must be an admin to use this command.',
    botAdmin: 'The bot needs to be an admin to process this command.',
    owner: 'You are not the owner of this bot so you cannot use this command.',
    group: 'This command is only made for group chats.',
    private: 'This command is only for private chats.',
    wait: '```「▰▰▰▱▱▱▱▱▱▱」Loading...```',
    link: 'I need a link to process this command.',
    error: '```404 Error```',
    ban: `You're banned from using this bot!`,
    nsfw: 'This group is not *NSFW* enabled.',
    banChat: 'This group is banned from using this bot, please contact owner to get unbanned.'
},

global.message = {
    success: 'Done ✅',
    admin: 'You must be an admin to use this command.',
    botAdmin: 'The bot needs to be an admin to process this command.',
    owner: 'You are not the owner of this bot so you cannot use this command.',
    group: 'This command is only made for group chats.',
    private: 'This command is only for private chats.',
    wait: '```「▰▰▰▱▱▱▱▱▱▱」Loading...```',
    link: 'I need a link to process this command.',
    error: '```404 Error```',
    ban: `You're banned from using this bot!`,
    nsfw: 'This group is not *NSFW* enabled.',
    banChat: 'This group is banned from using this bot, please contact owner to get unbanned.'
},

module.exports = {

  sessionId:  process.env.SESSION_ID || "Queen Anya",  
  auto_read_status :  process.env.AUTO_READ_STATUS || "true",
  alwaysonline:  process.env.ALWAYS_ONLINE || "true",  
  readmessage:  process.env.READ_MESSAGE || "true",  
  auto_status_saver: process.env.AUTO_STATUS_SAVER || "true",
  
}
