const Config = require('../../config');
const chalk = require("chalk");
const { commands } = require(__dirname + '/plugins');
const { isLatest, getBuffer } = require(__dirname + '/myfunc');
const { Bot, UI } = require(__dirname + '/../database/mongodb');
const { fancy32 } = require(__dirname + '/stylish-font');

exports.connectionMsg = async (anyaV2, system) => {
    const bot = await Bot.findOne({ id: 'anyabot' }) || (await new Bot({ id: 'anyabot' }).save());
    if (!bot.worktype) return console.log(chalk.red("⚠️ Mongodb not connected successfully! please check did you whitelisted all Ips..?"));
    const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());
    const version = await isLatest();
    if (version) {
      await anyaV2.sendMessage(Config.ownernumber + "@s.whatsapp.net", {
            image: await getBuffer(Config.imageUrl),
            caption: `\`🍭 ${fancy32("Queen Anya Ver.2")} Connected..! 🍭\`

_Type *${Config.prefa}alive* to get started..!_
${String.fromCharCode(8206).repeat(4001)}
\`System Settings:\`
> Bot Name: ${Config.botname}
> Owner Name: ${Config.ownername}
> Owner Number: wa.me/${Config.ownernumber}
> Footer: ${Config.footer}
> Default Prefix: ${Config.prefa}
> Theme Emoji: ${Config.themeemoji}
> Insta ID: ${Config.instagramId}
> Sticker Author: ${Config.author}
> Sticker Packname: ${Config.packname}
> Social Profile: ${Config.socialLink}
> WA Group: ${Config.groupLink}
> Max Warns: ${Config.warns.toString()}
> Cooldown Sec.: ${Config.cooldown.toString()}

\`Database Settings:\`
> _Work Type: ${bot.worktype}_
> _Prefix Mode: ${bot.prefix}_
> _Plugins: ${commands.length}_
> _Mods Count: ${bot.modlist.length.toString()}_
> _Text Reply Type: ${ui.reply.toString()}_
> _Alive Msg Type: ${ui.alive.toString()}_
> _Menu Msg Type: ${ui.menu.toString()}_
> _Badwords Count: ${system.badWords.length.toString()}_
> _Fake Num. Count: ${system.fakelist.length.toString()}_
> _Anti Once: ${system.antionce ? "✅" : "❌"}_
> _Anti Delete: ${system.antidelete ? "✅" : "❌"}_
> _React Cmd: ${bot.react ? "✅" : "❌"}_
> _React Msg: ${system.autoReactMsg ? "✅" : "❌"}_
> _Auto Read Status: ${bot.autoStatusRead ? "✅" : "❌"}_
> _Anti Call: ${system.anticall ? "✅" : "❌"}_
> _Anti Fake Num.: ${system.antifake ? "✅" : "❌"}_
> _Antilink For All Gc.: ${system.antilinkall ? "✅" : "❌"}_
> _Anti PM: ${system.antipm ? "✅" : "❌"}_
> _Only PM: ${system.onlypm ? "✅" : "❌"}_
> _Auto Msg Read: ${system.autoMsgRead ? "✅" : "❌"}_
> _Auto Typing: ${system.autoTyping ? "✅" : "❌"}_
> _Auto Reply: ${system.autoReply ? "✅" : "❌"}_
> _Auto Block: ${system.autoBlock ? "✅" : "❌"}_
> _Auto Bio: ${system.autoBio ? "✅" : "❌"}_
> _Chatbot: ${system.chatbot ? "✅" : "❌"}_
> _Cooldown: ${system.cooldown ? "✅" : "❌"}_
> _Sticker Saver: ${system.stickerSaver ? "✅" : "❌"}_
> _Mention Reply: ${system.mentionReply ? "✅" : "❌"}_
> _Gc Welcome Msg: ${system.welcome ? "✅" : "❌"}_
> _Gc Goodbye Msg: ${system.goodbye ? "✅" : "❌"}_
> _Gc Promote Msg: ${system.pdm ? "✅" : "❌"}_
> _Gc Demote Msg: ${system.pdm ? "✅" : "❌"}_
`.trim() }, { quoted: Config.ownercon });
    } else await anyaV2.sendMessage(Config.ownernumber + "@s.whatsapp.net", {
            text: `*\`⚠️ Warning, new update available..!\`*\n\nPlease update your repository to avoid interrupted behaviour..!`
       }, { quoted: Config.ownercon });
}
