
// Current currTab: true for share, false for delete
var currTab = true;

/**
 * Retrieve all keyPair names from the database and show them.
 */
function displayKeys() {

    // Retrieve all keyPairs
    var sql = "select K.name from key K";

    dbAction(sql, [], function(res) {

        // Populate key list
        var html = 'Your keys<hr>';
        for (var i = 0; i < res.rows.length; ++i) {
            var keyName  = res.rows.item(i).name;
            html += '<button class="list" onclick="keyAction(this.innerHTML);">' + keyName + '</button>';
        }

        // Update GUI
        document.getElementById("key_list").innerHTML = html;
    });
}

/**
 * Delete key or create a qr-code encoding it depending on the current currTab.
 *
 * @param keyName
 */
function keyAction(keyName) {

    var sql = "";

    if (currTab) {

        // Get key
        sql = "select K.keyPair from key K where K.name = ?";
        dbAction(sql, [keyName.toString()], function (res) {

            if (res.rows.length === 1) {

                // Extract public key and create qr-code
                var key = buf2hex(cryptoJS.publicKey(hex2buf(res.rows.item(0).keyPair)));

                qrcodeCreate(key);
            }
        });
    } else {
        // Delete key
        if (confirm("Are you sure you want to delete this key pair?")) {
            sql = "delete from key where name = ?";
            dbAction(sql, [keyName.toString()], function(r){displayKeys()});
        }
    }
}

/**
 * Update GUI and currTab to be coherent with the share tab
 */
function shareCallback() {
    currTab = true;

    document.getElementById("share_button").style.color = "#008CBA";
    document.getElementById("delete_button").style.color = "#999999";
}

/**
 * Update GUI and currTab to be coherent with the delete tab
 */
function deleteCallback() {
    currTab = false;

    document.getElementById("share_button").style.color = "#999999";
    document.getElementById("delete_button").style.color = "#008CBA";
}