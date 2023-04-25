const fs = require('fs')
const chalk = require('chalk')
global.mess = {
    success: 'Fait ✅',
    admin: 'Vous devez être administrateur pour utiliser cette commande.', 
    botAdmin: 'Ce bot doit être un administrateur pour utiliser cette commande.',
    owner: `Vous n'êtes pas le propriétaire de ce bot, vous ne pouvez donc pas utiliser cette commande.`,
    group: `Cette commande n'est faite que pour les discussions de groupe.`,
    private: 'Cette commande est uniquement pour les chats privés.',
    wait: '```「▰▰▰▱▱▱▱▱▱▱」Loading...```',
    link: 'J'ai besoin d'un lien pour traiter cette commande.',
    error: '```404 Error```',
    ban: `Vous êtes interdit d'utiliser ce bot!`,
    nsfw: `Ce groupe n'est pas *NSFW* activé.`,
    banChat: `Ce groupe n'est pas autorisé à utiliser ce bot, veuillez contacter le propriétaire pour être débanni.`,
    set: 'french',
    restart: 'Les changements auront lieu après un redémarrage, veuillez patienter 30 secondes...'
}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
