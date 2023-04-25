const fs = require('fs')
const chalk = require('chalk')
global.mess = {
    success: 'انتهى العمل',
    admin: 'يجب أن تكون مسؤولاً لاستخدام هذا الأمر', 
    botAdmin: 'يحتاج الروبوت إلى أن يكون مسؤولاً لاستخدام هذا الأمر',
    owner: 'يجب أن تكون مالك القارب لاستخدام هذا الأمر',
    group: 'هذا الأمر للمجموعة فقط',
    private: 'هذا الأمر هو فقط للدردشة الخاصة',
    wait: 'انتظر... ',
    link: 'أحتاج الارتباط',
    error: 'وجدت خطأ ',
    ban: 'أنت ممنوع من استخدام هذا الأمر ',
    nsfw: 'هذه المجموعة ليست ممكّنة NSFW',
    banChat: 'هذه المجموعة ممنوعة من استخدامي',
    set: 'set up this command [arabuc]',
    restart: 'ستحدث التغييرات بعد إعادة التشغيل ، يرجى الانتظار لمدة 10 ثوانٍ ...'

}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
