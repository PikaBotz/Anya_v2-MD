'use strict';

var trim = require('trim');

module.exports = function(n) {

    var type = typeof n;

    if (type !== 'string' && type !== 'number'){
        return false;
    }

    if (type === 'string'){
        n = n.replace(/[,|.]/g, '');
        if (n.trim() === ''){
            return false;
        } else {
            n = +n;
        }
    }

    return typeof n === 'number' && n - n < 1;

};
