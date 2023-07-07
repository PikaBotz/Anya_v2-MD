'use strict';
(function(escope) {
    function base64ToBrowser(buffer) {
        return window.btoa([].slice.call(new Uint8Array(buffer)).map(function(bin) { return String.fromCharCode(bin); }).join(''));
    }

    function imageToBase64Browser(urlOrImage, param) {
        if (!('fetch' in window && 'Promise' in window)) {
            return Promise.reject('[*] image-to-base64 is not compatible with your browser.');
        }
        return fetch(urlOrImage, param || {}).then(function(response) {
            return response.arrayBuffer();
        }).then(base64ToBrowser);
    }

    if (typeof module !== 'undefined') {
        module.exports = imageToBase64Browser;
    } else {
        escope.imageToBase64 = imageToBase64Browser;
    }
})(this);
