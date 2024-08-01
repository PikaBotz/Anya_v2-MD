const {
    anya,
    sendError
} = require('../lib');
const axios = require('axios');

//༺─────────────────────────────────────

anya(
        {
            name: "aipic",
            react: "✨",
            need: "text",
            category: "ai",
            desc: "Create images using artificial intelligence",
            cooldown: 8,
            filename: __filename
        },
    async (anyaV2, pika, { args }) => {
        if (!args[0]) return pika.reply("_❕Enter some texts to create!_");
        const { key } = await pika.keyMsg("```Creating...```");
        const text = args.join(" ");
        axios.get("https://sms-bomb.vercel.app/api/aipic.php?prompt=" + encodeURIComponent(text))
        .then(async ({data}) => {
            return await anyaV2.sendMessage(pika.chat, {
                image: await getBuffer(data),
                caption: "> " + Config.footer
            }, {quoted:pika})
            .then(() => pika.edit("> Created AI Image!", key));
        })
        .catch(async err => {
            console.error(err);
            await pika.deleteMsg(key);
            return await sendError(anyaV2, { message: Config.message.error });
        });
}); 
