function generateKeyPair(hex) {
    var keyPair = cryptoJS.keyPair();
    var pubKey = cryptoJS.publicKey(keyPair);

    if(hex) {
        return buf2hex(pubKey);
    } else {
        return pubKey;
    }
}