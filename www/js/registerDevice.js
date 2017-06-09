/**
 * Wrap all functions specific to 'www/registerDevice.html'.
 *
 * @author Lucio Romerio (lucio.romerio@epfl.ch)
 */

// Conode information
var address = '';
var skipchain = '';

// Session information
var config;
var keyName = '';

/**
 * Used as a callback for a qr-code scan.
 * Extract conode information from the scanned qr-code and send a ConfigUpdate to it.
 *
 * @param scanResult
 */
function ciscQrScanned(scanResult) {

    conodeInfo = extractId(scanResult);

    if(conodeInfo.length === 2) {

        address = conodeInfo[0];

        // Check whether the device is already paired to this conode.
        var sql = "select C.serverId from conodes C where C.address = ?";
        dbAction(sql, [address], function(res) {
            if (res.rows.length !== 0) {
                alert("Device already registered to this conode.");
            } else {
                skipchain = hex2buf(conodeInfo[1]);

                // Create ConfigUpdate
                const message = CothorityProtobuf.createConfigUpdate(skipchain);

                configUpdate(address, message, function(e) {

                        document.getElementById("cisc_second").innerHTML = "<span style = 'color: red;'>ERROR: </span>" + e.data;
                        document.getElementById("cisc_first").style.display = 'none';
                        document.getElementById("cisc_second").style.display = 'block';

                    }, function(response) {

                        // Decode message and store config
                        config = CothorityProtobuf.decodeConfigUpdateReply(response).config;

                        // Update GUI
                        document.getElementById("threshold").innerHTML = config.threshold;
                        document.getElementById("cisc_first").style.display = 'none';
                        document.getElementById("cisc_second").style.display = 'block';
                    }
                );
            }
        });
    } else {
        alert('Invalid qr-code.');
    }
}

/**
 * If a valid unique id has been inserted: generate a new keys pair and return
 * the public one to the given handler.
 *
 * @param handler
 */
function registerDevice(handler) {

    // Get key name
    keyName = document.getElementById("keyPairName").value;

    if (keyName === '') {
        alert('Id field cannot be empty!');
        handler('');
    } else if (keyName in config.device) {
        alert('Device name not available');
        handler('');
    } else {

        // Generate keys pair
        var keyPair = cryptoJS.keyPair();
        var hexKeyPair = buf2hex(keyPair);
        var hexId = buf2hex(skipchain);

        // Add new entry to database
        var sql = "insert into conodes(address, serverId, deviceId, keyPair) values(?,?,?,?)";

        dbAction(sql, [address, hexId, keyName, hexKeyPair], function() {

            // Add new device to config and create ProposeSend
            var pubKey = cryptoJS.publicKey(keyPair);
            config.device[keyName] = CothorityProtobuf.createDevice(pubKey);
            const message = CothorityProtobuf.createProposeSend(skipchain, config);

            proposeSend(address, message, function(e) {

                    document.getElementById("cisc_third").innerHTML = "<span style = 'color: red;'>ERROR: </span>"
                        + e.data;
                    document.getElementById("cisc_second").style.display = 'none';
                    document.getElementById("cisc_third").style.display = 'block';

                }, function () {

                    // Update GUI
                    //document.getElementById("threshold").innerHTML = 'Threshold: ' + config.threshold;
                    document.getElementById("cisc_second").style.display = 'none';
                    document.getElementById("cisc_third").style.display = 'block';
                }
            );
        });
    }
}