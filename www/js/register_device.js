
// Database status
var dbReady = false;

// Conode information
var address = '';
var skipchain = '';

// Session information
var config;
var keyName = '';

function ciscDbReady() {
    dbReady = true;
}

/**
 * If a valid conode qr-code was scanned: extract conode information, use them to
 * send a ConfigUpdate and handle the result.
 *
 * @param s
 */
function ciscQrScanned(s) {

    conodeInfo = extractId(s);

    if(conodeInfo.length === 2) {

        address = conodeInfo[0];
        skipchain = hex2buf(conodeInfo[1]);

        // Create ConfigUpdate
        const message = CothorityProtobuf.createConfigUpdate(skipchain);

        configUpdate(address, message, function(response) {

            // Decode message and store config
            config = CothorityProtobuf.decodeConfigUpdateReply(response).config;

            // Update GUI
            document.getElementById("threshold").innerHTML = config.threshold;
            document.getElementById("cisc_first").style.display = 'none';
            document.getElementById("cisc_second").style.display = 'block';
        });
    } else {
        alert('Invalid qr-code');
    }
}

/**
 * If a valid unique id has been inserted: generate a new keys pair
 * and return the public one to the given handler.
 *
 * @param handler
 */
function ciscPropose(handler) {

    if (true) {
        // Get key name
        keyName = document.getElementById("keyPairName").value;

        if (keyName === '') {
            alert('Id field cannot be empty!');
            handler('');
        } else if (keyName in config.device) {
            alert('Device name not available');
            handler('');
        } else {

            // TODO: più server diversi, ma al massimo una per server?
            //
            // var sql = "select * from key K where K address = ? AND K.serverId = ?";
            // dbAction(sql, [address, skipchain], function(res) {
            //     if (res.rows.length >= 1) {
            //         alert('Server already registered');
            //         handler('');
            //     }
            // });

            // Generate keys pair
            var keyPair = cryptoJS.keyPair();
            var hexKeyPair = buf2hex(keyPair);

            // Add new entry to database
            var sql = "insert into conodes(address, serverId, deviceId, keyPair) values(?,?,?,?)";

            //var sql = "select * from key";

            dbAction(sql, [address, skipchain, keyName, hexKeyPair], function() {

                alert('db ok');

                // Add new device to config and create ProposeSend
                var pubKey = cryptoJS.publicKey(keyPair);
                config.device[keyName] = CothorityProtobuf.createDevice(pubKey);
                const message = CothorityProtobuf.createProposeSend(skipchain, config);

                proposeSend(address, message, function () {

                    // Update GUI
                    document.getElementById("threshold").innerHTML = 'Threshold: ' + config.threshold;
                    document.getElementById("cisc_second").style.display = 'none';
                    document.getElementById("cisc_third").style.display = 'block';
                });
            });
        }
    } else {
        alert('Database not ready yet!');
    }
}