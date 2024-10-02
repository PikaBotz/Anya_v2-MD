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

if (num === null || message === null) return;
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
            cmd = `${prefix}avatar button`;
            break;
            
        /**
         * @song
         */
        case '04': {
                function extractVID(message) {
                    const vidMatch = message.match(/> VID: ([\w-]+)/);
                    return vidMatch ? vidMatch[1] : null;
                }
                const vid = extractVID(message);
                if (/1/.test(number)) cmd = `${prefix}yta2 https://youtube.com/watch?v=${vid} mp3`;
                else if (/2/.test(number)) cmd = `${prefix}ytadoc https://youtube.com/watch?v=${vid}`;
                else cmd = `_404`;
        }
        break;
        
        /**
         * @video
         */
        case '05': {
                function extractVID(message) {
                    const vidMatch = message.match(/> VID: ([\w-]+)/);
                    return vidMatch ? vidMatch[1] : null;
                }
                const vid = extractVID(message);
                if (/1/.test(number)) cmd = `${prefix}ytv2 https://youtube.com/watch?v=${vid} 360p`;
                else if (/2/.test(number)) cmd = `${prefix}ytvdoc https://youtube.com/watch?v=${vid}`;
                else cmd = `_404`;
            }
            break;
            
            /**
             * @play
             */
            case '06': {
                function extractUrls(message) {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const urls = message.match(urlRegex);
                    return urls || [];
                }
                const urls = extractUrls(message);
                const link = urls[number -1];
                if (link !== undefined) cmd = `${prefix}ytsqualityandformateselector ${link}`;
                else cmd = `_404`;
            }
            break;
            
            /**
             * @xnxx
             * @xvid
             */
            case '07': case '08': {
                function extractUrls(message) {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const urls = message.match(urlRegex);
                    return urls || [];
                }
                const urls = extractUrls(message);
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
            //⚠️ Empty 
            }
            break;
            
            /**
             * fbdl
             */
            case '17': {
            //⚠️ Empty
            }
            break;
            
            /**
             * setmenu
             */
             case '18':
                if (number <= 12) {
                    cmd = `${prefix}setmenu ${number}`;
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
                    cmd = `${prefix}setalive ${number}`;
                } else {
                    cmd = `_404`;
                }
             break;
             
            /**
             * setreply
             */
             case '29':
                if (number <= 5) {
                    cmd = `${prefix}setreply ${number}`;
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
                if (number === 0) cmd = `${prefix}delcmdhash ${hashes.join(" ")}`;
                else if (number > hashes.length) cmd = `_404`;
                else cmd = `${prefix}delcmdhash ${hashes[number - 1]}`;
              }
              break;
              
             /**
              * grouprequest
              */
              case '31': {
                const mentions = body.quoted.contextInfo.mentionedJid;
                if (number > mentions.length) cmd = `_404`;
                else if (body.text === "0") cmd = `${prefix}rejectall ${mentions.join(" ")}`;
                else if (body.text === "00") cmd = `${prefix}acceptall ${mentions.join(" ")}`;
                else cmd = `${prefix}acceptall ${mentions[number - 1]}`;
              }
              break;
              
              /**
               * plugins
               */
              case '32': {
                function extractUrls(message) {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const urls = message.match(urlRegex);
                    return urls || [];
                }
                const urls = extractUrls(message);
                const link = urls[number -1];
                if (body.text === "0") cmd = `${prefix}bulkplugindelete ${urls.join(" ")}`;
                else if (link !== undefined) cmd = `${prefix}delplugin ${link}`;
                else cmd = `_404`;
              }
              break;
              
              /**
               * pluginstore
               */
              case '33': {
                function extractUrls(message) {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const urls = message.match(urlRegex);
                    return urls || [];
                }
                const urls = extractUrls(message);
                const link = urls[number -1];
                if (body.text === "0") cmd = `${prefix}bulkplugininstall ${urls.join(" ")}`;
                else if (link !== undefined) cmd = `${prefix}install ${link}`;
                else cmd = `_404`;
              }
              break;
              
             /**
              * (@ytsselector)
              */
              case '34': {
                function extractVID(message) {
                    const vidMatch = message.match(/> VID: ([\w-]+)/);
                    return vidMatch ? vidMatch[1] : null;
                }
                const vid = extractVID(message);
                if (/1/.test(number)) cmd = `${prefix}ytv2 https://youtube.com/watch?v=${vid} 360p`;
                else if (/2/.test(number)) cmd = `${prefix}ytvdoc https://youtube.com/watch?v=${vid}`;
                else if (/3/.test(number)) cmd = `${prefix}yta2 https://youtube.com/watch?v=${vid} mp3`;
                else if (/4/.test(number)) cmd = `${prefix}ytadoc https://youtube.com/watch?v=${vid}`;
                else cmd = `_404`;
              }
              break;
              
             /**
              * @enable
              * @disable
              */
              case '35': case '36': {
                const selector = (id === '35') ? "enable" : "disable";
                if (number === 1) cmd = `${prefix + selector} Antilink`;
                else if (number === 2) cmd = `${prefix + selector} Antibot`;
                else if (number === 3) cmd = `${prefix + selector} Antitoxic`;
                else if (number === 4) cmd = `${prefix + selector} Antivirus`;
                else if (number === 5) cmd = `${prefix + selector} Antipicture`;
                else if (number === 6) cmd = `${prefix + selector} Antivideo`;
                else if (number === 7) cmd = `${prefix + selector} Antisticker`;
                else if (number === 8) cmd = `${prefix + selector} Antispam`;
                else if (number === 9) cmd = `${prefix + selector} gcchatbot`;
                else if (number === 10) cmd = `${prefix + selector} NSFW`;
                else cmd = `_404`;
              }
              break;
             
             /**
              * @mode
              */
              case '37':
                if (number === 1) cmd = `${prefix}mode public`;
                else if (number === 2) cmd = `${prefix}mode self`;
                else cmd = `_404`;
              break;
              
             /**
              * @prefix
              */
              case '38':
                if (number === 1) cmd = `${prefix}prefix single`;
                else if (number === 2) cmd = `${prefix}prefix multi`;
                else if (number === 3) cmd = `${prefix}prefix all`;
                else cmd = `_404`;
              break;
              
            /**
             * setreply
             */
             case '39':
                if (number <= 11) {
                    cmd = `${prefix}setgreetings ${number}`;
                } else {
                    cmd = `_404`;
                }
             break;
             
             /**
              * playstore
              */
              case '40': {
              function extractUrls(message) {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const urls = message.match(urlRegex);
                    return urls || [];
                }
                const urls = extractUrls(message);
                const link = urls[number -1];
                if (link !== undefined) cmd = `${prefix}playstoredl ${link}`;
                else cmd = `_404`;
              }
              break;
              
              /**
              * playstore
              */
              case '41': {
              function extractUrls(message) {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const urls = message.match(urlRegex);
                    return urls || [];
                }
                const urls = extractUrls(message);
                const link = urls[number -1];
                if (link !== undefined) cmd = `${prefix}SoundClouddl ${link}`;
                else cmd = `_404`;
              }
              break;
              
              /**
              * playstore
              */
              case '42': {
              function extractUrls(message) {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const urls = message.match(urlRegex);
                    return urls || [];
                }
                const urls = extractUrls(message);
                const link = urls[number -1];
                if (link !== undefined) cmd = `${prefix}wattread ${link}`;
                else cmd = `_404`;
              }
              break;
              
              /**
              * playstore
              */
              case '43': {
              function extractUrls(message) {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const urls = message.match(urlRegex);
                    return urls || [];
                }
                const urls = extractUrls(message);
                const link = urls[number -1];
                if (link !== undefined) cmd = `${prefix}happymoddl ${link}`;
                else cmd = `_404`;
              }
              break;
              
             /**
             * setlist
             */
             case '44':
                if (number <= 5) {
                    cmd = `${prefix}setlist ${number}`;
                } else {
                    cmd = `_404`;
                }
             break;

            /**
            * setytsmsg
            */
             case '47':
                if (number <= 3) {
                    cmd = `${prefix}setlist ${number}`;
                } else {
                    cmd = `_404`;
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
