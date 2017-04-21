var address = '';
var skipchain = '';

var config;

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

        // TODO: remove this (debug alert)
        alert('Address: ' + address + '\n Skipchain: ' + skipchain);

        // Create ConfigUpdate
        var message = CothorityProtobuf.createConfigUpdate(id);

        configUpdate(address, message, function(response) {

            // Decode message and store config
            config = CothorityProtobuf.decodeConfigUpdateReply(response);

            // Update buttons
            document.getElementById("cisc_first").style.display = 'none';
            document.getElementById("cisc_second").style.display = 'block';
        });
    } else {
        alert('Invalid qr-code');
    }
}

/**
 * If a valid unqiue id has been inserted: generate a new keys pair
 * and call the given handler.
 */
function ciscPropose(handler) {

    // Get key name
    var keyName = document.getElementById("keyPairName").value;

    if(keyName !== '') {
        // Generate and store a new keys pair
        cryptoGenerateAndStore(keyName, function(res) {
            handler(keyName, res);
        });
    } else {
        alert('Id field cannot be empty!');
        handler('');
    }
}

/**
 * If the input is a valid public key (and her name): send a ProposeSend to the conode
 * and handle the result.
 *
 * @param keyName
 * @param key
 */
function ciscPropose_handler(keyName, key) {
    if (key.length === 32) {

        // Create ProposeSend
        config.device[keyName] = key;
        var message = CothorityProtobuf.createProposeSend(id, config);

        proposeSend(address, message, function(response) {

            var device = CothorityProtobuf.decodeConfigUpdateReply(response).device;

            // Prepare result message
            var html;
            if(keyName in device && device[keyName] === key) {
                 html = '<span style = "color: green;">Procedure successfully completed!</span>';
            } else {
                html = '<span style = "color: red;">Propose refused by the conode.</span>';
            }

            // Update GUI
            document.getElementById("cisc_third").innerHTML = html;
            document.getElementById("cisc_second").style.display = 'none';
            document.getElementById("cisc_third").style.display = 'block';
        });
    }
}