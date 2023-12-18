const { anya } = require('../lib');

anya({
  name: [
    "fancy"
  ],
  alias: [
    "fancy1",
    "fancy2",
    "fancy3",
    "fancy4",
    "fancy5",
    "fancy6",
    "fancy7",
    "fancy8",
    "fancy9",
    "fancy10",
    "fancy11",
    "fancy12",
    "fancy13",
    "fancy14",
    "fancy15",
    "fancy16",
    "fancy17",
    "fancy18",
    "fancy19",
    "fancy20",
    "fancy21",
    "fancy22",
    "fancy23",
    "fancy24",
    "fancy25",
    "fancy26",
    "fancy27",
    "fancy28",
    "fancy29",
    "fancy30",
    "fancy31",
    "fancy32",
    "fancy33",
    "fancy34",
    "fancy35",
    "fancy36",
    "fancy37",
    "fancy38",
    "fancy39",
    "fancy40",
    "fancy41",
    "fancy42",
    "fancy43",
    "fancy44",
    "fancy45",
    "fancy46",
    "fancy47",
    "fancy48",
    "fancy49",
    "fancy50",
    "fancy51",
    "fancy52",
    "fancy53",
    "fancy54",
    "fancy55",
    "fancy56",
    "fancy57",
    "fancy58",
    "fancy59"
  ],
  category: "tools",
  desc: "Make stylish fancy texts.",
  filename: "/workspaces/Anya_v2-MD/test.js"
}, 
async function getCommand(react, command, prefix, text, anyaV2, pika) {
  let count = 1;
  let styler = "";
  const { listall } = require('../lib/stylish-font');
     styler += `*🔰 Exmaple :* ${prefix}fancy32 ${text ? text : "Hentai"}\n\n`;
  for (let i of listall(text ? text : "Enter Text")){
     styler += `${count++}. ${i}\n`;
     }
  await pika.react("✨");
  (command == 'fancy')
  ? pika.reply(styler)
  : pika.reply(listall(text ? text : "Enter Text")[Number(command.split("ncy")[1]) - 1]);
  });
