function displayKeys() {

    // Retrieve all keyPairs
    var sql = "select K.name from key K";

    dbRetrieve(sql, [], function(res) {

        // Populate key list
        var html = '<hr>';
        for (var i = 0; i < res.rows.length; ++i) {
            var keyName  = res.rows.item(i).name;
            html += '<span target="_blank" onclick="showPubKey($(this).text());">' + keyName + '</span><br/><hr>';
        }

        // Update GUI
        document.getElementById("key_list").innerHTML = html;
    });
}

function showPubKey(keyName) {

    // Retrieve all keyPairs
    var sql = "select K.keyPair from key K where K.name = ?";

    dbRetrieve(sql, [keyName], function(res) {

        if (res.rows.length === 1) {

            var key = buf2hex(cryptoJS.publicKey(res.rows.item(0)));

            qrcodeCreate(key);
        }
    });
}