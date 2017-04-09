/**
 * Generate a new key pair, store it in the database and return the public key.
 * The key pair is identified by 'keyName'.
 *
 * @param keyName
 * @returns {*}
 */
function cryptoGenerateAndStore(keyName, handler) {
    dbContainsKeyPair(keyName, function(res) {

        if (!res) {
            var keyPair = cryptoJS.keyPair();
            var pubKey = cryptoJS.publicKey(keyPair);
            var hexKeyPair = buf2hex(keyPair);

            dbInsertKeyPair(keyName, hexKeyPair, function(done) {
                if (done) {
                    return handler(pubKey);
                } else {
                    return handler([]);
                }
            });
        } else {
            alert('Key pair ID already used.');
            return handler([]);
        }
    });
}