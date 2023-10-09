exports.cmdName = () => {
  return {
    name: ['gimg','image'],
    alias: ['img','picture','pic','googleimg','googleimage','gimage'],
    category: "search",
    desc: "Search images directly from Google just by search terms."
  };
}

exports.getCommand = async (command, text, pickRandom, anyaV2, pika) => {
require('../../config');
 try {
   const { sleep } = require('../lib/myfunc');
   const { googleImage } = require('api-dylux');
   const isCmdImg = ['image','img','picture','pic'].includes(command);
   if (!text) return pika.reply((isCmdImg)
                            ? "Enter a term to get 5 HD images."
                            : "Enter a search term to get Google Image!");
   await react('✨'); 
   pika.reply((isCmdImg)
           ? "Here are *5* result(s) from the given query."
           : message.wait);
   function getRandomStrings(arr, count) {
    if (count > arr.length) {
        console.log("Requested count is greater than array length. Sending the rest of the array.");
        return arr.slice();
    }

    const shuffledArray = arr.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray.slice(0, count);
}

const inputArray = await googleImage(text)
let count = 1;
      for (const images of getRandomStrings(inputArray, 5)) {
          await anyaV2.sendMessage(pika.chat, {
              image: { url: images },
              caption: (isCmdImg)
                       ? `_Searched by ${botname}_`
                       : `${count++}`,
              headerType: 4 })
        await sleep(10)
        }
    } catch {
    return pika.reply('Unexpected error occurred, try again.')
   }
 }


