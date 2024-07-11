const Config = require('../../config');

/**
 * Create commands strings like buttons, using numbers.
 * @param {String} the text of the quoted message sent by bot
 * @param {String} number choosed and sent by the user
 * @param {String} meta data of the message and quoted message
 */
const buttons = async (quotedText, num, body) => {// console.log()

// quoted message text extracter
let message;
if (body.quoted.mtype === "requestPaymentMessage") message = body.quoted.noteMessage.extendedTextMessage.text;
else message = quotedText;

if (num === null) return;
const number = Number(num[0]);
    function getId() {
        let regex;
        if (num === 99999999) regex = regex = /_AID: ([A-Za-z0-9]+)_/;
        else regex = /_ID: ([A-Za-z0-9]+)_/;
        const match = message.match(regex);
        return match ? match[1] : null;
    }
    let cmd;
    const prefix = Config.prefa;
    const _id = getId();
    const id = _id.toLowerCase().split("qa")[1];

    /**
     * return the desired value of cmd ('body' in index)
     * return _404 {String} as invalid number
     */
    switch (id) {

        /**
         * @alive;
         */
        case '01':
            if (/1/.test(number)) {
                cmd = `${prefix}allmenu`;
            } else if (/2/.test(number)) {
                cmd = `${prefix}listmenu`;
            } else cmd = `_404`;
            break;

        /**
         * @animewall
         */
        case '02':
            cmd = `${prefix}animewall`;
            break;

        /**
         * @avatar
         */
        case '03':
            cmd = `${prefix}avatar`;
            break;
            
        /**
         * @song
         * @song2
         */
        case '04': {
        function getVid() {
            const regex = /VID: ([\w-]+)/g;
            const match = regex.exec(message);
            return match ? match[1] : null;
        }
            if (/1/.test(number)) {
                cmd = `${prefix}yta2 https://www.youtube.com/watch?v=${getVid()} selectedMediaType`;
            } else if (/2/.test(number)) {
                cmd = `${prefix}yta2 https://www.youtube.com/watch?v=${getVid()} selectedMediaType inDocumentFormate`;
            } else if (/3/.test(number)) {
                cmd = `${prefix}yta2 https://www.youtube.com/watch?v=${getVid()} selectedMediaType inVoiceNoteFormate`;
            } else cmd = `_404`;
            }
            break;
        
        /**
         * @video
         * @video2
         */
        case '05': {
        function getVid() {
            const regex = /VID: ([\w-]+)/g;
            const match = regex.exec(message);
            return match ? match[1] : null;
        }
            const regex = /• (\d+p)(?: \| (document))?/g;
            const matches = message.matchAll(regex);
            const options = [];
            for (const match of matches) {
                const quality = match[1];
                const hasDocument = match[2];
                if (hasDocument) {
                    options.push(`${quality}document`);
                } else {
                    options.push(quality);
                    }
                }
            const isDocument = /document/.test(options[number - 1]);
            const option = options[number - 1];
            if (option === undefined) {
                cmd = `_404`;  
            } else if (!isDocument) {
                cmd = `${prefix}ytv2 https://www.youtube.com/watch?v=${getVid()} selectedMediaType selectedQualityIs${option}`;
            } else {
                cmd = `${prefix}ytv2 https://www.youtube.com/watch?v=${getVid()} selectedMediaType selectedQualityIs${option.split("document")[0]} inDocumentFormate`;
                }
            }
            break;
            
            /**
             * @play
             */
            case '06': {
                if (/^\d+(\.\d+)$/.test(number)) {
                const num1 = body.text.split(".")[0];
                const num2 = body.text.split(".")[1];
                if (Number(num2) < 3) {
                const pattern = /VID: ([\w-]+)/g;
                const matches = [...message.matchAll(pattern)];
                const result = matches.map(match => match[1]); 
                cmd = `${prefix}${Number(num2) === 1 ? 'song2' : 'video2'} https://www.youtube.com/watch?v=${result[Number(num1) - 1]}`;
                } else cmd = `_404`;
                } else cmd = `_404`;
            }
            break;
            
            /**
             * @xnxx
             * @xvid
             */
            case '07': case '08': {
                const regex = /🔗 (https?:\/\/\S+?)_?(?= |\n|$)/g;
                const urls = [];
                let match;
                while ((match = regex.exec(message)) !== null) {
                  const url = match[1].replace(/_$/, '');
                  urls.push(url);
                }
                const link = urls[number -1];
                if (link !== undefined) {
                    cmd = `${prefix}${id === '07' ? 'xnxxdl' : 'xviddl'} ${link}`;
                } else cmd = `_404`;
            }
            break;
            
            /**
             * @waifu
             */
            case '09':
                cmd = `${prefix}waifu`;
                break;
                
            /**
             * @neko
             */
            case '10':
                cmd = `${prefix}neko`;
                break;
                
            /**
             * @shinobu
             */
            case '11':
                cmd = `${prefix}shinobu`;
                break;
            
            /**
             * @hneko
             */
            case '12':
                cmd = `${prefix}hneko`;
                break;
                
            /**
             * @hwaifu
             */
            case '13':
                cmd = `${prefix}hwaifu`;
                break;

            /**
             * @gasm
             */
            case '14':
                cmd = `${prefix}gasm`;
                break;
                                
            /**
             * @smug
             */
            case '15':
                cmd = `${prefix}smug`;
                break;

            /**
             * @twitter
             */
            case '16': {
                const regex = /🔗 URI: (https?:\/\/[\w./?=#&]+)/;
                const link = message.match(regex)[1];
                const uri = `${prefix}twitter ${link} selectedMediaType`;
                if (/1/.test(number)) {
                    cmd = `${uri} inVideoFormate`;
                } else if (/2/.test(number)) {
                    cmd = `${uri} inVideoFormate inDocumentFormate`;
                } else if (/3/.test(number)) {
                    cmd = `${uri} inAudioFormate`;
                } else if (/4/.test(number)) {
                    cmd = `${uri} inAudioFormate inDocumentFormate`;
                } else if (/5/.test(number)) {
                    cmd = `${uri} inAudioFormate inVoiceNoteFormate`;
                } else cmd = `_404`;
            }
            break;
            
            /**
             * fbdl
             */
            case '17': {
                const regex = /🔗 URI: (https?:\/\/[\w./?=#&]+)/;
                const link = message.match(regex)[1];
                const uri = `${prefix}fbdl ${link} selectedMediaType`;
                if (/1/.test(number)) {
                    cmd = uri;
                } else if (/2/.test(number)) {
                    cmd = `${uri} inDocumentFormate`;
                } else cmd = `_404`;
            }
            break;
            
            /**
             * setmenu
             */
             case '18':
                if (number <= 12) {
                    cmd = `${Config.prefa}setmenu ${number}`;
                } else {
                    cmd = `_404`;
                }
             break;

            /**
             * @modlist
             */
            case '19': {
                const regex = /•\s_@(\d+)_/g;
                const numbers = [];
                let match;
                while ((match = regex.exec(message)) !== null) {
                  numbers.push(match[1]);
                }
                if (/0/.test(number)) {
                    cmd = `${prefix}delmod selectedButtonMsg ${numbers.join(", ")}`;
                } else {
                    const selectedNum = numbers[number - 1];
                    if (selectedNum !== undefined) {
                        cmd = `${prefix}delmod selectedButtonMsg ${selectedNum}`;
                    } else cmd = `_404`;
                }
            }
            break;
            
            /**
             * @listmenu
             */
            case '20': {
                const regex = /┌─ \d+\..*?(\w+).*$/gm;
                const categories = [];
                let match;
                while ((match = regex.exec(message)) !== null) {
                    categories.push(match[1].toLowerCase());
                }
                const matched = categories[number - 1];
                cmd = (matched !== undefined) ? `${prefix}list ${matched}` : `_404`;
            }
            break;
            
            /**
             * @nsfw (fantox api)
             */
            case '21': {
                const matches = message.match(/"([^"]*)"/);
                const command = matches && matches[1];
                cmd = `${prefix + command}`;
            }
            break;
            
            /*
             * @husbu
             */
            case '22':
                cmd = `${prefix}waifu2`;
                break;
            
            case '23': {
                const match = message.match(/"([^"]*) girl"/);
                if (match && match[1]) {
                    const girl = match[1];
                    cmd = `${prefix+girl}girl`
                } else {
                    cmd = `_404`;
                }
            }
            break;
            
            case '24': 
                cmd = `${prefix}newrn ${body.body}`;
            break;
            
            case '25': 
                cmd = `${prefix}newrs ${body.body}`;
            break;
            
            case '26':
                cmd = `${prefix}setresname ${body.body}`;
            break;
            
            case '27':
                cmd = `${prefix}setresstate ${body.body}`;
            break;
            
            /**
             * setalive
             */
             case '28':
                if (number <= 12) {
                    cmd = `${Config.prefa}setalive ${number}`;
                } else {
                    cmd = `_404`;
                }
             break;
             
            /**
             * setreply
             */
             case '29':
                if (number <= 5) {
                    cmd = `${Config.prefa}setreply ${number}`;
                } else {
                    cmd = `_404`;
                }
             break;
             
             /**
              * listcmd
              */
              case '30': {
                const regex = /\*.*?Hash \(\d+\):\* `?([0-9,]+)`?/g;
                let hashes = [];
                let match;
                while ((match = regex.exec(message)) !== null) {
                    hashes.push(match[1]);
                }
                if (number === 0) cmd = `${Config.prefa}delcmdhash ${hashes.join(" ")}`;
                else if (number > hashes.length) cmd = `_404`;
                else cmd = `${Config.prefa}delcmdhash ${hashes[number - 1]}`;
              }
              break;
              
             /**
              * grouprequest
              */
              case '31': {
                const mentions = body.quoted.contextInfo.mentionedJid;
                if (number > mentions.length) cmd = `_404`;
                else if (number === 0) cmd = `${Config.prefa}declineeverygrouprequest ${mentions.join(" ")}`;
                else if (number === 00) cmd = `${Config.prefa}accepteverygrouprequest ${mentions.join(" ")}`;
                else cmd = `${Config.prefa}accepteverygrouprequest ${mentions[number - 1]}`;
              }
              break;
             
        /**
         * if the id (eg: QA69) is invalid
         * return __404 {String} as invalid id
         */
        default:
            cmd = `__404`;
            break;

    }
    return cmd;
}

module.exports = { buttons };
