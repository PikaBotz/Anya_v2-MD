
 
const fs = require('fs')
const chalk = require('chalk')


// pika info 
global.socialMediaPika = "𝗜𝗻𝘀𝘁𝗮: 3.69_pika"
global.locationdPika = "India, Assam, Dibrugarh"
global.pikaYt = "Pika404"
global.vcardowner2 = ['918811074852']

// olduser info
global.olduserName = "𝙊𝙇𝘿𝙐𝙎𝙀𝙍"
global.socialMediaOldUser = "𝗜𝗻𝘀𝘁𝗮: Olduser.gq"
global.locationdOldUser = "Milkyway, Earth, India"
global.OldUserYt = "Pika404"
global.vcardowner3 = ['918602239106']

// Internal data
global.isDevs = ['918811074852','917355622763','918602239106']
global.qrCode = "https://anyaqr.jetus-hack.repl.co/"
global.supportGcLink = "https://chat.whatsapp.com/K3gECAzzVDx3zmRqMKyq8g"
global.announcementGcLink = "https://chat.whatsapp.com/JJQiMoAjjkp9DcDdh4mIsA" 
global.link = [ 
    "https://youtu.be/jEwjrdzrpWE",
 "https://youtu.be/nQRy96da2jw",
"https://youtu.be/CdczZBjf7z0"
]
global.header = "WhatsApp Bot"
global.devYt = pikaYt
global.socialmdev = socialMediaPika
global.locationdev = locationdPika
global.ntilinkytvid = []
global.ntilinkytch = []
global.ntilinkig = []
global.ntilinkfb = []
global.ntilinktg = []
global.ntilinktt = []
global.ntilinktwt = []
global.ntilinkall = []
global.nticall = []
global.ntwame = []
global.nttoxic = []
global.ntnsfw = []
global.ntvirtex = []
global.rkyt = []
global.wlcm = []
global.gcrevoke = []
global.autorep = []
global.ntpicture = []
global.ntvideo = []
global.grpsafety = []
global.ntilink = []
global.footernull= '' // null footer for clear space if we need //
global.sessionName = 'session'
global.antitags = true
symb1 = '-'
symb2 = '.'
symb3 = ','
symb4 = '!'
symb5 = '+'
symb6 = '#'
symb7 = '_'
symb8 = '%'
symb9 = '$'
symb10 = ''
global.doc1 = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
global.doc2 = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
global.doc3 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
global.doc4 = 'application/zip'
global.doc5 = 'application/pdf'
global.doc6 = 'application/vnd.android.package-archive'
global.APIs = {
zenz: 'https://zenzapis.xyz',
}
global.APIKeys = {
'https://zenzapis.xyz': '44eff1531fb0',
}
global.sp = '⭔'
    global.userLimit = {
    premium: "Infinity",
    free: 12,
}
   global.rpg = {
   darahawal: 100,
   besiawal: 15,
   goldawal: 10,
   emeraldawal: 5,
   umpanawal: 5,
   potionawal: 1
}

global.limitawal = {
monayAwal: "0"
}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
