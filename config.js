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
  botname: process.env.BotName || "Dark shehzad", 
  author: process.env.Author || "@Shehzad",
  packname: process.env.PackName || "Dark shehzad v2 MD",
  socialLink: process.env.Web || "https://github.com/PikaBotz",
  footer: process.env.Footer || "© Dark shehzad Bot",
  prefa: process.env.Prefix || ['.'],
  themeemoji: process.env.ThemeEmoji || "🎐",
  ownername: process.env.Owner_Name || "Shehzad",
  ownernumber: process.env.Owner_Number || "923312321649",
  instagramId: process.env.Insta || "8.08_only_mine",
  warns: process.env.Warns_Limits || 3,
  mongoUrl: process.env.MongoDB || "YOUR_MONGODB_URL",
  welcome: process.env.Welcome_Msg || '*@$user* joined this group today as $membersth member.\n\n_$prefix welcome off to disable this message._',
  left: process.env.Left_Msg || 'Ex-member *@$user* is no longer available in this group chat.\n\n_$prefix goodbye off to disable this message._',
  promote: process.env.Promote_Msg || '*@$user* has been promoted as an admin in this group.\n\n_$prefix promotem off to disable this message._',
  demote: process.env.Demote_Msg || '*@$user* has been demoted to a member in this group.\n\n_$prefix demotem off to disable this message._',
  sessionId: process.env.SESSION_ID || "eyJub2lzZUtleSI6eyJwc_AN_YA_ml2YXRlIjp7InR5c_AN_YA_GUiOiJCdWZmZXIiLCJkYXRhIjoieUsxc_AN_YA_1NlZ0hVTndYL255aTJXb2FrOHVrSU1Zc_AN_YA_HhCejlaNk91NVB0N2drZz0ifSwic_AN_YA_HVibGljIjp7InR5c_AN_YA_GUiOiJCdWZmZXIiLCJkYXRhIjoiQ1U2d0RBK0xCV0VRTEpUN0p1eXR4WWpUUUNYajMzc_AN_YA_WZ4S3hOZnVGc_AN_YA_lFHOD0ifX0sInBhaXJpbmdFc_AN_YA_GhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlc_AN_YA_iIsImRhdGEiOiJZTlJKYXBxampxTDJHQXFRN3g2Wmt4R2Q3dCtHL2t0TU45RXRlNjNFVEhZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlc_AN_YA_iIsImRhdGEiOiJ4WW9aei90M1llQ3RXbE9OWm9aNnhkT0xKSnp4Q3hmc_AN_YA_zdDYktLYUM5OWt3PSJ9fSwic_AN_YA_2lnbmVkSWRlbnRpdHlLZXkiOnsic_AN_YA_HJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhQQ3VIUXFqc_AN_YA_1lMZ0hXbEFKVGVNbWswQkMva3ZOdHA4OXI3VXZmSmxXRWs9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImR1T1p0aTJpZytNa1A5Vm5zMHJlM1M4eFk0bHdKVG5RSlRRUGd1em8weVE9In19LCJzaWduZWRQc_AN_YA_mVLZXkiOnsia2V5UGFpc_AN_YA_iI6eyJwc_AN_YA_ml2YXRlIjp7InR5c_AN_YA_GUiOiJCdWZmZXIiLCJkYXRhIjoiaUw3bmUzNHZZTGN2Znl6UXkzeXpoc_AN_YA_kpSMDh2Q05MTnR3QUJTTEhCazkyST0ifSwic_AN_YA_HVibGljIjp7InR5c_AN_YA_GUiOiJCdWZmZXIiLCJkYXRhIjoiUEtHdWdMVGdndVAwUDJTK3JwdHBTYmVvQWtwZjdST2Rtb1dyTzNKc_AN_YA_FJFaz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InRQNThLRGlNc_AN_YA_GlYajNEWWpEQTZzZWZEZWV0Uk5NbzNCR0h0ekZOa3M4eS9VZDJ2RjdlZ2hhQ2xxVDl2dE91b0M4emVyU3d1WlNzaGdpTlhqaDh0empBPT0ifSwia2V5SWQiOjF9LCJyZWdpc_AN_YA_3RyYXRpb25JZCI6MjA5LCJhZHZTZWNyZXRLZXkiOiJvMnRTc_AN_YA_GhwRHZRZ2hUaHlwQmwyYzBsSEJFdVNLYTVnYUdNWmFoMGRXQzUwPSIsInByb2Nlc_AN_YA_3NlZEhpc_AN_YA_3Rvc_AN_YA_nlNZXNzYWdlc_AN_YA_yI6W10sIm5leHRQc_AN_YA_mVLZXlJZCI6MzEsImZpc_AN_YA_nN0VW51c_AN_YA_GxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hc_AN_YA_mNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJXVFJRS0tCRlNBLWp6XzNWazJjQW9nIiwic_AN_YA_GhvbmVJZCI6ImMxZWVmZTRkLTFlMWUtNDQ5Ny05ZTEyLTFlYWVlZjM4NDc_AN_YA_2NiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlc_AN_YA_iIsImRhdGEiOiJZRDFuZy8zemRHc_AN_YA_TV0dDViS0o3bDc_AN_YA_renJtSGM9In0sInJlZ2lzdGVyZWQiOmZhbHNlLCJiYWNrdXBUb2tlbiI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik0rblNkQVJ6bTRlYnJCYTRIc_AN_YA_EphVjJwVzlZND0ifSwic_AN_YA_mVnaXN0c_AN_YA_mF0aW9uIjp7fSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0liVGtvWUhFSktnbjZ3R0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IlI2U2Z2Z2xCZmZ5M1BJWG8zSnZRL2x5QmNXWUZQRWVEb2tVT3RnZDNsR0k9IiwiYWNjb3VudFNpZ25hdHVyZSI6ImR1c_AN_YA_mpUM05mQzZVek02TWZqVktkRTRmMkFweThDUkFOc_AN_YA_2JwYllJRnlBK2RzMWUzTko4bkxMZjJNdDBZQXh0emN0dWh5TzdFRTd1ZmpTOGRzc_AN_YA_zQ2WUFnPT0iLCJkZXZpY2VTaWduYXR1c_AN_YA_mUiOiIxVGMwU201T1lCNHF2c_AN_YA_3lMZUZDYWVCaVRkakNWUnVXRW5Ic_AN_YA_XNHSmt6N0lOb0JoaCtEMzFtMGh6TkZXYmxmUmZvUjRlbHhSVEVVMlJNd3o5OGpPc_AN_YA_nRnQT09In0sIm1lIjp7ImlkIjoiOTIzMzEyMzIxNjQ5OjRAc_AN_YA_y53aGF0c_AN_YA_2Fwc_AN_YA_C5uZXQiLCJuYW1lIjoifiBTaEVoekFkIn0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkyMzMxMjMyMTY0OTo0QHMud2hhdHNhc_AN_YA_HAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5c_AN_YA_GUiOiJCdWZmZXIiLCJkYXRhIjoiQlVla243NEpRWDM4dHp5RjZOeWIwUDVjZ1hGbUJUeEhnNkpGRHJZSGQ1UmkifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc_AN_YA_3RhbXAiOjE3MDMzOTk0NDV9", 
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
global.botname = process.env.BotName || "Dark shehzad" 
global.author = process.env.Author || "@Shehzad" 
global.packname = process.env.PackName || "Queen Anya v2 MD" 
global.myweb = process.env.Web || "https://github.com/PikaBotz" 
global.footer = process.env.Footer || "© Dark shehzad Bot" 
global.prefa = process.env.Prefix || ['.'] 
global.themeemoji = process.env.ThemeEmoji || "🎐" 
global.ownername = process.env.Owner_Name || "shehzad" 
global.ownernumber = process.env.Owner_Number || "923312321649" 
global.adress = process.env.Continent || "Asia, Pakistan, Balochistan" 
global.timezone = process.env.TimeZone || "Asia/Columbia" 
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

