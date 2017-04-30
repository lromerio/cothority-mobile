function displayKeys() {

    // Retrieve all keyPairs
    var sql = "select K.name from key K";

    dbRetrieve(sql, [], function(res) {

        // Populate key list
        var html = '<hr>';
        for (var i = 0; i < 1; ++i) {
            var keyName  = res.rows.item(i).name;
            html += '<button onclick="showPubKey(this.innerHTML);">' + keyName + '</button>';
        }

        // Update GUI
        document.getElementById("key_list").innerHTML = html;
    });
}

function showPubKey(keyName) {

    // Retrieve all keyPairs
    var sql = "select K.keyPair from key K where K.name = ?";

    dbRetrieve(sql, [keyName.toString()], function(res) {

        if (res.rows.length === 1) {

            // Extract public key and create qr-code
            var key = buf2hex(cryptoJS.publicKey(hex2buf(res.rows.item(0).keyPair)));

            alert(key);

            cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, key,
                function (success) {
                    alert('succes');
                    alert("Encode succes: " + success);
                },
                function (fail) {
                    alert('fail');
                    alert("Encoding failed: " + fail);
                }
            );
        }
    });
}