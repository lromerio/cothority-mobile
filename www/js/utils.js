/**
 * Transform a byte buffer into an hex-string.
 *
 * @param buf
 * @returns {string}
 */
function buf2hex(buf) {

    var result = '';

    for (var i = 0; i < buf.length; i++) {
        var hex = buf[i].toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        result += hex;
    }

    return result;
}

/**
 * Transform an hex-string into a byte buffer.
 * If the hex-string was malformed and/or there was an error returns an empty string.
 *
 * @param hexStr
 * @returns {Array}
 */
function hex2buf(hexStr) {

    var result = [];

    if (hexStr.match(/[0-9|a-f]*/) && Math.floor(hexStr.length % 2) === 0) {
        for (var i = 0; i < hexStr.length; i = i + 2) {

            var hex = hexStr.substr(i, 2);
            var number = parseInt(hex, 16);

            // hexStr contained an invalid char
            if(isNaN(number)) {
                return [];
            }

            result.push(number);
        }
    }

    return result;
}

 /**
  * Extract address and skipchain id from a string of the form:
  * cisc://192.33.210.8:8002/5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fb03e9e49fdd9caa2c0
  *
  * A valid input starts with 'cisc://'. In case of malformed input return an empty array.
  *
  * @param s
  * @returns {Array}
  */
 function extractId(s) {
     var res = [];

     // Verify prefix
     if(s.startsWith('cisc://')) {
        res = s.substr(7).split('/');

        // Verify content
        if(res.length === 2 && res[1].match(/([0-9|a-f]{64})/)) {
            const address = res[0].split(':');

            // Verify IP and port format
            if (address.length === 2) {
                const ip = address[0].split('.');

                if(ip.length === 4 && address[0].match(/([0-9]{1,3}\.){3}[0-9]{1,3}/) &&
                    address[1].length <= 4 && address[1].match(/([0-9]{1,4})/)) {

                    return res;
                }
            }
        }
    }

    // The string was malformed
    return [];
}