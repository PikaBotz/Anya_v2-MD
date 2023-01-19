const fs = require('fs')
const chalk = require('chalk')

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
global.messEn = {
    success: 'Processing done ✅️',
    admin: "Hey dear user,\nYou are not an admin, so you can't use this command.", // i used "\n" for change the line 
    botAdmin: "I am not an admin, so i can't process this action.",
    owner: "This command is only made for my owner.",
    group: "Huh... I can't use this command in a private chat!!",
    private: "Uff... I can't take this action in a private chat...",
    bot: "This Feature Is Only For 𝗕𝗼𝘁... and you're not a 𝗕𝗼𝘁.",
    wait: "*Processing started....*",
    linkm: 'I need a link to process this command for you...',
    error: 'Process stopped!!...i got an error',
    sudo: "*Hey User 👋....*\nYou can't use this command because this command is only for my co-owner.",
    endLimit: 'Your Daily Limit Has Expired, The Limit Will Be Reset Every 12 Hours',
    ban: "*You can't use this Bot anymore*\nBecause you got banned by the owner.",
    nsfw: 'This command stay off as default...because this action contains nudity and pornographical activity.',
    banChat: "This group got banned by my owner.\nContact my owner if you want to unban this groupchat."
}

global.messHn = {
    success: 'Kaam ho gaya ✅️',
    admin: "*Ye command sirf group admins ke liye hai...*\nisiliye tum is command ka istemal nahi kar sakte.",
    botAdmin: "Me bina *Admin* bane is command ko nahi chala sakti.",
    owner: "Ye command sirf mere owner istemal kar sakte hai.. Aur aap mere owner nahi ho!!",
    group: "Aap is command ka istemal group chat mein nahi kar sakte.",
    private: 'Aap is command ka istemal kisi private chat mein nahi kar sakte ho.',
    bot: "This Feature Is Only For 𝗕𝗼𝘁... and you're not a 𝗕𝗼𝘁.",
    wait: "Processing....",
    linkm: 'Mujhe is command ke liye ek link chahiye.',
    error: '*404Error*',
    sudo: "*Hey User 👋....*\nYou can't use this command because this command is only for my co-owner.",
    endLimit: 'Your Daily Limit Has Expired, The Limit Will Be Reset Every 12 Hours',
    ban: "Tumhe mujhe istemal karne se rok diya gaya hai!!",
    nsfw: 'The nsfw feature has not been activated, Bc padhai likhai karo 𝗜𝗔𝗦 - 𝗬𝗔𝗦 bano lekin nhii tumhe to nudity dekhni hai 👏',
    banChat: "*Is group ko mujhe command dene se ban kar diya gaya hai!!!*"
}

global.messAr = {
    success: '* تم المعالجة !! * ✅️',
    admin: "عزيزي المستخدم ، لا يمكنني متابعة هذا الأمر نيابة عنك. لأنك لست مشرفًا. ",
    botAdmin: "لا يمكنني متابعة هذا الأمر دون أن أكون مسؤولاً",
    owner: "لا يمكنك استعمال هذا الامر، هذا مخصص فقط للمالك.",
    group: "لا يمكنك استخدام هذا الأمر في مجموعة",
    private: 'أنت مثل هذا الأحمق لأنه كيف يمكنك استخدام هذا الأمر في محادثة خاصة',
    bot: "This Feature Is Only For 𝗕𝗼𝘁... and you're not a 𝗕𝗼𝘁.",
    wait: "أنا أقوم بمعالجة الأمر الخاص بك ، يرجى الانتظار ",
    linkm: 'أحتاج رابط',
    error: 'لدي خطأ!',
    sudo: "*Hey User 👋....*\nYou can't use this command because this command is only for my co-owner.",
    endLimit: 'Your Daily Limit Has Expired, The Limit Will Be Reset Every 12 Hours',
    ban: "لقد تم حظرك من استخدام هذا البوت.",
    nsfw: 'لم يتم تنشيط ميزة NSFW في هذه المجموعة ',
    banChat: "لقد تم حظر هذه المجموعة من استخدام هذا البوت."
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
