 function buf2hex(buf) {

    let result = '';

    for (let i = 0; i < buf.length; i++) {
        let hex = buf[i].toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        result += hex;
    }

    return result;
}

function hex2buf(hexStr) {

    let result = [];

    if (Math.floor(hexStr.length % 2) === 0) {
        for (let i = 0; i < hexStr.length; i = i + 2) {

            let hex = hexStr.substr(i, 2);
            let number = parseInt(hex, 16);

            result.push(number);
        }
    }

    return result;
}

 /**
  * Extract address and skipchain id from a string of the form:
  * cisc://192.33.210.8:8002/5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fb03e9e49fdd9caa2c0
  *
  * A valid input starts with 'cisc://'
  *
  * @param s
  * @returns {Array}
  */
 function extractId(s) {
    let res = [];
    if(s.startsWith('cisc://')) {
        res = s.substr(7).split('/');
    }

    if(res.length === 2 && res[1].length === 64) {
        return res;
    } else {
        return [];
    }
}