const { readFileSync } = require('fs')
require("dotenv").config();

let badWords = [
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

global.message = {
    success: "✅ 𝚂𝚞𝚌𝚌𝚎𝚜𝚜! 𝙾𝚙𝚛𝚊𝚝𝚒𝚘𝚗 𝙲𝚘𝚖𝚙𝚕𝚎𝚝𝚎𝚍.",
    admin: "*👤 A𝙳𝙼𝙸𝙽 N𝙴𝙴𝙳𝙴𝙳!*\n\n- Dear, this command is only for Admins. You have to be a admin in this group to use this command.",
    botAdmin: "*🤖 B𝙾𝚃 A𝙳𝙼𝙸𝙽 N𝙴𝙴𝙳𝙴𝙳!*\n\n- I'm not an Admin, so I can't execute this command in this group. Please make me an Admin.",
    owner: "*👑 O𝚆𝙽𝙴𝚁 N𝙴𝙴𝙴𝙳𝙴𝙳!*\n\n- Bruh, this command is only made for this bot's owner. So you can't use this command.",
    group: "*👥 G𝚛𝚘𝚞𝚙 N𝚎𝚎𝚍𝚎𝚍!*\n\n- This command can only be executed in a group chat.",
    private: 'This command is only for private chats.',
    wait: '🔄 Processing request...',
    link: 'I need a link to process this command.',
    error: "❌ Oops! An error occurred while processing your request. Please try again later.",
    ban: `You're banned from using this bot!`,
    nsfw: 'This group is not *NSFW* enabled.',
    banChat: 'This group is banned from using this bot, please contact owner to get unbanned.'
},

module.exports = {
  botname: process.env.BotName || "king shehzad", 
  author: process.env.Author || "@PikaBotz",
  packname: process.env.PackName || "Queen Anya v2 MD",
  socialLink: process.env.Web || "https://github.com/PikaBotz",
  footer: process.env.Footer || "© king shehzad Bot",
  prefa: process.env.Prefix || ['.'],
  themeemoji: process.env.ThemeEmoji || "🎐",
  ownername: process.env.Owner_Name || "shehzad",
  ownernumber: process.env.Owner_Number || "923312321649",
  instagramId: process.env.Insta || "8.08_only_mine",
  warns: process.env.Warns_Limits || 3,
  mongoUrl: process.env.MongoDB || "mongodb+srv://faltoyirdo:<M3mXuNooM0Pj8BC3>@cluster0.bmvd2iz.mongodb.net/?retryWrites=true&w=majority",
  welcome: process.env.Welcome_Msg || '*@$user* joined this group today as $membersth member.\n\n_$prefix welcome off to disable this message._',
  left: process.env.Left_Msg || 'Ex-member *@$user* is no longer available in this group chat.\n\n_$prefix goodbye off to disable this message._',
  promote: process.env.Promote_Msg || '*@$user* has been promoted as an admin in this group.\n\n_$prefix promotem off to disable this message._',
  demote: process.env.Demote_Msg || '*@$user* has been demoted to a member in this group.\n\n_$prefix demotem off to disable this message._',
  sessionId: process.env.SESSION_ID || "eyJub2lzZUtleSI6eyJwc_AN_YA_ml2YXRlIjp7InR5c_AN_YA_GUiOiJCdWZmZXIiLCJkYXRhIjoiK0dwNXhXNks0dFZpRnFzTlpYVVkrZkJ4YTREWFVFc_AN_YA_HBRdnpqZVRxRHZtZz0ifSwic_AN_YA_HVibGljIjp7InR5c_AN_YA_GUiOiJCdWZmZXIiLCJkYXRhIjoiYTM3Zm9nbzQ3bUJEUWRXOVdidkRhSjhrRzN5ZTVKVEx0aDF5b1NweFJCbz0ifX0sInBhaXJpbmdFc_AN_YA_GhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlc_AN_YA_iIsImRhdGEiOiJpTHVPamJsVXc_AN_YA_0VEp6MUF3Q2lSTjhaQlFxbmR2bFpRc_AN_YA_GxyQzQvT1pNRkhFPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlc_AN_YA_iIsImRhdGEiOiJrZWNXRkxCOTFyMXBJeXBlNzhPWWlONzFyNmdwRjd0THVVZkZhaEVVRm00PSJ9fSwic_AN_YA_2lnbmVkSWRlbnRpdHlLZXkiOnsic_AN_YA_HJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im1ONUQxc_AN_YA_y9jc_AN_YA_kRGSTV0WUhhbkxidDVKOVU5aFpIeTJ2VHo5YjZRWll6M1k9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkIzVGtYenlCRWkyOG1IdTZUMUlBTFBuQlJzMlc_AN_YA_xOXByaXA0anc_AN_YA_2c_AN_YA_1BWQ3c_AN_YA_9In19LCJzaWduZWRQc_AN_YA_mVLZXkiOnsia2V5UGFpc_AN_YA_iI6eyJwc_AN_YA_ml2YXRlIjp7InR5c_AN_YA_GUiOiJCdWZmZXIiLCJkYXRhIjoiR0MvQk16dTY0MGNTTDY3VWNhS0RmaFVTMmc_AN_YA_5VnpBMWo1RHVyNFVuMzZtTT0ifSwic_AN_YA_HVibGljIjp7InR5c_AN_YA_GUiOiJCdWZmZXIiLCJkYXRhIjoiVzhFeFUwZ3dSYzNxT0dzaVpsQ0oxZWtYc_AN_YA_Ux4RFhFY0k5bmZlY1c_AN_YA_xQWVFZz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ino1UU5WTmhwM1ZWdEZJNjRVR3RZTzR1endNLzlCdG5sUldYc_AN_YA_WRsb242OGZWbFFhK3pnZ241MGlFSnB5ZWhtQnFTc_AN_YA_1pCY2xjWTFjaHNJYTdYQjI2S2hRPT0ifSwia2V5SWQiOjF9LCJyZWdpc_AN_YA_3RyYXRpb25JZCI6MTYyLCJhZHZTZWNyZXRLZXkiOiIvRG92MjM0M2JPRjRBVDZFR1duK1pSUnlSMXBEN0l0NDd2TTdNNGlPa0ZBPSIsInByb2Nlc_AN_YA_3NlZEhpc_AN_YA_3Rvc_AN_YA_nlNZXNzYWdlc_AN_YA_yI6W10sIm5leHRQc_AN_YA_mVLZXlJZCI6MzEsImZpc_AN_YA_nN0VW51c_AN_YA_GxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hc_AN_YA_mNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJlaFVJWDR1NlNzYW05UWFPaEMzUjZ3Iiwic_AN_YA_GhvbmVJZCI6IjQwMTgxNjNmLTc_AN_YA_3NjEtNDNmYy1hYTc_AN_YA_xLTM5Mzg2YzNlMzk1YyIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlc_AN_YA_iIsImRhdGEiOiJOUFkvOTBJZytKd1laM21aZVFZSHQrdTR6bWs9In0sInJlZ2lzdGVyZWQiOmZhbHNlLCJiYWNrdXBUb2tlbiI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjQwUklqZ1hkdmRiZHlQRlZIdngvemVaaElCZz0ifSwic_AN_YA_mVnaXN0c_AN_YA_mF0aW9uIjp7fSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0lqVGtvWUhFTXF3c_AN_YA_jZ3R0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IlI2U2Z2Z2xCZmZ5M1BJWG8zSnZRL2x5QmNXWUZQRWVEb2tVT3RnZDNsR0k9IiwiYWNjb3VudFNpZ25hdHVyZSI6IjZ4VXhDTFZtTE40RHdxdDZlT3lPY1A1ak16ZTJ3c_AN_YA_GlmY1lTMDV5MVRWUCtYa21Na3JhbkJEZWhCbU1XSjNoKzU0TVMrTWRMTzlrOFJuZGpPZTdSd0FBPT0iLCJkZXZpY2VTaWduYXR1c_AN_YA_mUiOiJPMWR6L2lHT1lYb29Yc_AN_YA_ERPd1VhbkFpOE9sZWVqNlFMSTV5NjFydWsvNi9taytKZTdaQU96N2pmNmh3ZXBxZFpWOEZiSWUxSVhpTERIem41dmhPNjVpZz09In0sIm1lIjp7ImlkIjoiOTIzMzEyMzIxNjQ5OjZAc_AN_YA_y53aGF0c_AN_YA_2Fwc_AN_YA_C5uZXQiLCJuYW1lIjoifiBTaEVoekFkIn0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkyMzMxMjMyMTY0OTo2QHMud2hhdHNhc_AN_YA_HAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5c_AN_YA_GUiOiJCdWZmZXIiLCJkYXRhIjoiQlVla243NEpRWDM4dHp5RjZOeWIwUDVjZ1hGbUJUeEhnNkpGRHJZSGQ1UmkifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc_AN_YA_3RhbXAiOjE3MDM2NjM2OTMsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBSFZ6In0=", 
  image_1: readFileSync('./lib/Assets/image_1.jpg'), // Thumbnail for allmenu command
  image_2: readFileSync('./lib/Assets/image_2.jpg'), // null image
  image_3: readFileSync("./lib/Assets/image_3.jpg"), // Thumbnail for Dashboard
  aliveMedia: readFileSync("./lib/Assets/aliveMedia.mp4"),
  menuMedia: readFileSync('./lib/Assets/menuMedia.mp4'),
  badWords: badWords,
  message: {
    success: message.success,
    admin: message.admin,
    botAdmin: message.botAdmin,
    owner: message.owner,
    group: message.group,
    private: message.private,
    wait: message.wait,
    link: message.link,
    error: message.error,
    ban: message.ban,
    nsfw: message.nsfw,
    banChat: message.banChat
  },
}



// Ignore them 👇🏻
global.botname = process.env.BotName || "king shehzad" 
global.author = process.env.Author || "@PikaBotz" 
global.packname = process.env.PackName || "Queen Anya v2 MD" 
global.myweb = process.env.Web || "https://github.com/PikaBotz" 
global.footer = process.env.Footer || "© King shehzad Bot" 
global.prefa = process.env.Prefix || ['.'] 
global.themeemoji = process.env.ThemeEmoji || "🎐" 
global.ownername = process.env.Owner_Name || "Pika~Kun" 
global.ownernumber = process.env.Owner_Number || "923331232649" 
global.adress = process.env.Continent || "Asia, Pakistan, Balochistan" 
global.timezone = process.env.TimeZone || "Asia/Harnai" 
global.instagramId = process.env.Insta || "8.08_only_mine" 
global.email = process.env.Email_Id || "example@example.com" 
  
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

