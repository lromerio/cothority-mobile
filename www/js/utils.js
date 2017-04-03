 function buf2hex(buf) {

    var result = "";

    for (var i = 0; i < buf.length; i++) {
        var hex = buf[i].toString(16);
        if (hex.length === 1) {
            hex = "0" + hex;
        }
        result += hex + "-";
    }
    result = result.substring(0, result.length - 1);

    return result.toUpperCase();
}

function hex2buf(hexStr) {

    var result = [];

    hexStr = hexStr.replace( /-/g, ""); // remove "-"
    if (Math.floor(hexStr.length % 2) === 0) {
        for (var i = 0; i < hexStr.length; i = i + 2) {

            var hex = hexStr.substr(i, 2).toUpperCase();
            var number = parseInt(hex, 16);

            result.push(number);
        }
    }

    return result;
}