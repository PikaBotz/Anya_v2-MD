// Q U E E N - A N Y A - M D  #v2

// • # Made by @PikaBotz [ GitHub.com/PikaBotz ]
// • # The script is Encrypted because users are not allowed to commit any changes without permission!
// • # To buy non enc version of Anya-pika-MD-v2 please contact wa.me/918811074852 [ $5 - $8 ]

// • T H A N K S - TO
// @NexusAt12
// @xeon
// @teamolduser

const fs = require('fs')
const chalk = require('chalk')
require('./lib/config')

global.zApiKey = {// if this API key get expired then please go to https://www.fxacb-api.my.id and get a new api key.
       one: "zenzkey_998568986d"
}
global.lApiKey = {// if this API key get expired then please go to https://api.lannn.me and get a new api key.
      one: 'uMSPCuLU',
      two: 'IOGaHu5S'
}


global.botname = "Queen Rias" 
global.author = "BELZARD"  
global.packname = "𝙌𝙐𝙀𝙀𝙉✯RIAS✯𝘽𝙊𝙏"  
global.myweb = "https://github.com/dashboard"
global.footer = "©\t" + "❤Crimson-Haired Ruin Princess❤"
global.prefa = ['-'] // single prefix
global.themeemoji = "🎐"
global.socialText = `*⪧⪢ Please join this group for by bot's announcement.*`
global.socialLink = `*⪧⪢ https://chat.whatsapp.com/CDcyXyvF9YTJmP6r9LbgzZ 💝*`


global.ownername = "Belzard Montmorency"    
global.ownernumber = ["+224 620 78 08 51"]
global.ytname = "YT: Enter Your Channel Name Here"
global.continent = "Asia" // your continent name 
global.region = "JAPAN"
global.state = "TOKYO/KYOTO" // your state name
global.timezone = "Africa/Lome" // search on google if you don't know the timezone of your country //
global.instagramId = "Belzard"
global.email = "curzonoderneisse@gmail.com"


// Greeting messages
global.greet1 = "Good morning ☀️" // after 3 AM
global.greet2 = "Good afternoon 🏜️" // after 12 PM
global.greet3 = "Good evening 🌆" // after 4 PM
global.greet4 = "Good night 😴" // after 8:30 PM


//--------------- Tip ----------------\\
global.tip1 = `Type *${prefa}info* for more information....`
global.tip2 = `Type *${prefa}settings* to commit changes in the bot.`
global.tip3 = `If you got a bug or error, then please report to developer asap by *${prefa}report* command.`

//--------------- Menu images ----------------\\
global.nullImage = fs.readFileSync('./AnyaPikaMedia/Anyatestpic.jpg')
global.Menuimage = fs.readFileSync("./AnyaPikaMedia/Menuimg.jpg") // Thumbnail for Dashboard
global.thumnnaiIs = fs.readFileSync("./AnyaPikaMedia/Menuimg2.jpeg")
global.allmenuImg = fs.readFileSync('./AnyaPikaMedia/Allmenu.jpg') // Thumbnail for Allmenu command 

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
}


/*𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹 DANGER ZONE ⚠️👇 𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹𝗹*/
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
