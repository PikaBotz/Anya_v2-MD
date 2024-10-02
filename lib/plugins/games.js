const Config = require('../../config');
const axios = require('axios');
const TicTacToe = require('../lib/TicTacToe');
const parseMention = (text = "") => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}
const {
    anya,
    pickRandom,
    Questions,
    Quiz,
    UI,
    delay
} = require('../lib');

//༺─────────────────────────────────────༻

anya({
            name: "dare",
            react: "🎀",
            category: "games",
            desc: "Dares",
            cooldown: 8,
            filename: __filename
     }, async (anyaV2, pika) => {
            const random = pickRandom(require('../database/json/truthDare.json').dares);
            return pika.reply(`\`\`\`🎀 You Choosed Dare!\`\`\`\n\n➥ ${random}`);
     }
)

//༺─────────────────────────────────────༻

anya({
            name: "truth",
            react: "🍁",
            category: "games",
            desc: "Say The Truths",
            cooldown: 8,
            filename: __filename
     }, async (anyaV2, pika) => {
            const random = pickRandom(require('../database/json/truthDare.json').truths);
            return pika.reply(`\`\`\`🍁 You Choosed Truth!\`\`\`\n\n➥ ${random}`);
     }
)

//༺─────────────────────────────────────

anya(
	{
		name: "tictactoe",
		alias: ['ttt', 'ttc'],
		react: "❤️",
		category: "games",
		desc: "Play tictactoe with friends",
		filename: __filename
	},
	async (anyaV2, pika, { db, args, prefix, command }) => {
		if (Object.values(game.tictactoe).find(room => room.id.startsWith("tictactoe") && [room.game.playerX, room.game.playerO].includes(pika.sender))) return pika.reply("_You're still in the game!_\n\n> Type _" + prefix + "del" + command + "_ to delete this session");
		let room = Object.values(game.tictactoe).find(room => room.state === "WAITING" && (args.length > 0 ? room.name.toLowerCase() === args.join(" ") : true));
		const ui = db.UI?.[0] || await new UI({ id: "userInterface" }).save();
		if (room) {
			pika.reply("```🌟Partner found!```");
			await delay(1000);
			room.o = pika.chat;
			room.game.playerO = pika.sender;
			room.state = "PLAYING";			
			const __a = room.game.render().map(function(v) {
				return {
					X: "❌",
					O: "⭕",
					1: "1️⃣",
					2: "2️⃣",
					3: "3️⃣",
					4: "4️⃣",
					5: "5️⃣",
					6: "6️⃣",
					7: "7️⃣",
					8: "8️⃣",
					9: "9️⃣"
				}[v];
			});
			let __s = "```Room : " + room.id + "```\n\n";
			__s += __a.slice(0, 3).join("") + "\n" + __a.slice(3, 6).join("") + "\n" + __a.slice(6).join("") + "\n\n";
			__s += "_Waiting for *@" + room.game.currentTurn.split("@")[0] + "'s* turn_";
			const buttons = [{ "name": "quick_reply", "buttonParamsJson": `{"display_text":"Surrender🏳️","id":"surrender"}` }];
			if (room.x !== room.o) {
				//ui.buttons
				// ? await anyaV2.sendButtonText(room.o, {
				//	text: __s,
				//	footer: Config.footer,
				//	mentions: [room.game.currentTurn],
				//	buttons: buttons
				//}, { quoted: pika })
			        await anyaV2.sendMessage(room.o, {
				    text: __s + "\n\n> Type _surrender_ to give up",
				    mentions: parseMention(__s)
				}, { quoted: pika });
			}
			//ui.buttons
			//? await anyaV2.sendButtonText(room.x, {
			//	text: __s,
			//	footer: Config.footer,
			//	mentions: [room.game.currentTurn],
			//	buttons: buttons
			//}, { quoted: pika })
			await anyaV2.sendMessage(room.x, {
			    text: __s + "\n\n> Type _surrender_ to give up",
			    mentions: parseMention(__s)
			}, { quoted: pika });
		} else {
			const roomId = "tictactoe-" + Date.now();
			room = {
				id: roomId,
				x: pika.chat,
				o: "",
				game: new TicTacToe(pika.sender, "o"),
				state: "WAITING",
				time: setTimeout(function() {
					if (game.tictactoe[roomId]) pika.reply("_Time's up❗_\n> Session deleted!");
					delete game.tictactoe[roomId];
				}, 600000)
			};
			if (args.length > 0) room.name = args.join(" ").toLowerCase();
			const __s = "⌛ Waiting for partner" + (args.length > 0 ? " to type the following command!\n`" + prefix + command + " " + args.join(" ") + "`" : " randomly!");
			await anyaV2.sendMessage(room.x, {
				text: __s
			}, { quoted: pika });
			game.tictactoe[room.id] = room;
		}
	}
);

//༺------------------------------------------------------------------------------------------------

anya(
	{
		name: "detictactoe",
		alias: ['delttt', 'delttc'],
		react: "💖",
		category: "games",
		desc: "Delete your tic-tac-toe session",
		filename: __filename
	},
	async (anyaV2, pika) => {
	    const room = Object.values(game.tictactoe).find(room => [room.game.playerX, room.game.playerO].includes(pika.sender));
	    if (!room) return pika.reply("_❌You're not currently in any session!_");
	    delete game.tictactoe[room.id];
	    pika.reply("_Succefully deleted *@" + pika.sender.split("@")[0] + "'s* tic-tac-toe session!_", { mentions: [pika.sender] });
	}
)

//༺------------------------------------------------------------------------------------------------

anya(
    {
        usage: "text",
        notCmd: true
    },
    async (anyaV2, pika) => {
        let room = Object.values(game.tictactoe).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(pika.sender) && room.state == "PLAYING");
        if (room) {
            let status;
            let isWin = !1;
            let isTie = !1;
            let isSurrender = !1
            if (!/^([1-9]|(me)?giveup|surr?ender|off|skip)$/i.test(pika.text)) return;
            isSurrender = !/^[1-9]$/.test(pika.text);
            if (pika.sender !== room.game.currentTurn) {
                if (!isSurrender) return !0;
            }
            if (!isSurrender && 1 > (status = room.game.turn(pika.sender === room.game.playerO, parseInt(pika.text) - 1))) {
                pika.reply({
                    '-3': 'The game is over',
					'-2': 'Invalid',
					'-1': 'Invalid Position',
					0: 'Invalid Position',
                }[status]);
                return !0
            }
            if (pika.sender === room.game.winner) isWin = true;
            else if (room.game.board === 511) isTie = true;
            const __a = room.game.render().map(v => {
				return {
					X: '❌',
					O: '⭕',
					1: '1️⃣',
					2: '2️⃣',
					3: '3️⃣',
					4: '4️⃣',
					5: '5️⃣',
					6: '6️⃣',
					7: '7️⃣',
					8: '8️⃣',
					9: '9️⃣',
				}[v];
			});
			if (isSurrender) {
			    room.game._currentTurn = pika.sender === room.game.playerX;
			    isWin = true;
			}
			const winner = isSurrender ? room.game.currentTurn : room.game.winner;
			if (isWin) {
			    /**
			     * Just in case if i add leveling, I'll add xp here.
			    **/
			}
			const __s = `\`\`\`Room : ${room.id}\`\`\`\n\n${__a.slice(0, 3).join('')}\n${__a.slice(3, 6).join('')}\n${__a.slice(6).join('')}\n\n${isWin ? `*@${winner.split('@')[0]} Won! 🥳🍻*` : isTie ? `*Game over❗*` : `Turn ${['❌', '⭕'][1 * room.game._currentTurn]} *(@${room.game.currentTurn.split('@')[0]})*`}\n> ❌: _@${room.game.playerX.split('@')[0]}_\n> ⭕: _@${room.game.playerO.split('@')[0]}_\n\nType *surrender* to give up and admit defeat`;
			if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== pika.chat)
			room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = pika.chat;
			if (room.x !== room.o) await anyaV2.sendMessage(room.x, { text: __s, mentions: parseMention(__s) }, { quoted: pika });
			await anyaV2.sendMessage(room.o, { text: __s, mentions: parseMention(__s) }, { quoted: pika });
			if (isTie || isWin) {
				delete game.tictactoe[room.id]
			}
        }
    }
)
