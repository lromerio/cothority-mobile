function generateKeyPair(hex) {
    var keyPair = cryptoJS.keyPair();
    var pubKey = cryptoJS.publicKey(keyPair);

    if(hex) {
        return buf2hex(pubKey);
    } else {
        return pubKey;
    }
}

var buf2hex = function( arr ) {

    var result = "";

    for (var i = 0; i < arr.length; i++) {
        var hex = arr[i].toString(16);
        if (hex.length === 1) {
            hex = "0" + hex;
        }
        result += hex + "-";
    }
    result = result.substring(0, result.length - 1);

    return result.toUpperCase();
};

var hex2buf = function ( hexStr ) {

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
};