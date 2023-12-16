exports.userPrefix = async function (body, mode) {
     const Config = require('../../config');
     const symbolsRegex = /^[.!;:\/&_\-$#@\%=]/;
             
     /**
      * Check if the settings is on All prefix on cloud
      * if all prefix is true, single prefix is false then use this section
      * return prefix as: null, any, Config.prefa
      * {@creator: https://github.com/PikaBotz}
      */
     if (mode === 'all') {
         var prefix = (() => {
             if (symbolsRegex.test(body)) {
                 return body.match(symbolsRegex)[0];
             } else if (!/^\W/.test(body)) {
                 return '';
             } else if (Config.prefix && !body.startsWith(Config.prefix)) {
                 return '';
             } else {
                 return Config.prefix || '';
             }
         })();
         var isCmd = body.startsWith(prefix);
         var command = isCmd ? body.replace(prefix, '').split(' ')[0].toLowerCase() : '';
 
     /**
      * Check if the settings is on Multi on cloud
      * if all prefix is false, single prefix is false then use this section 
      * return prefix as: any, Config.prefa
      * {@creator: https://github.com/PikaBotz}
      */
     } else if (mode === 'multi') {
         var prefix = (() => {
             if (typeof body === 'string' && symbolsRegex.test(body)) {
                 return body.match(symbolsRegex)[0];
             } else if (typeof body === 'string' && !/^\W/.test(body)) {
                 return Config.prefa;
             } else if (Config.prefix && typeof body === 'string' && !body.startsWith(Config.prefix)) {
                 return Config.prefa;
             } else {
                 return Config.prefa;
             }
         })();
         var isCmd = typeof body === 'string' && body.startsWith(prefix);
         var command = isCmd ? body.replace(prefix, '').split(' ')[0].toLowerCase() : '';
 
     /**
      * Check if the settings is on Single on cloud
      * if all prefix is true, single prefix is false then use this section
      * return prefix as: Config.prefa
      * {@creator: https://github.com/PikaBotz}
      */
     } else if (mode === 'single') {
         var prefix = Config.prefa;
         var isCmd = body.startsWith(prefix);
         var command = isCmd ? body.replace(prefix, '').split(' ')[0].toLowerCase() : '';
     }
 
     return {
         prefix: (prefix === null) ? ' ' : prefix,
         isCmd: isCmd,
         command: command
     }
 }