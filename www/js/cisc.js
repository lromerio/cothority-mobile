
// Conode information
var address = '';
var skipchain = '';

// Session information
var config;
var keyName = '';
var pubKey = '';

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

    // Get key name
    keyName = document.getElementById("keyPairName").value;

    if(keyName !== '') {
        // Generate and store a new keys pair
        cryptoGenerateAndStore(keyName, function(res) {
            handler(res);
        });
    } else {
        alert('Id field cannot be empty!');
        handler('');
    }
}

/**
 * If the input is a valid public key: send a ProposeSend to the conode
 * and handle the result.
 *
 * @param key
 */
function ciscPropose_handler(key) {
    if (key.length === 32) {

        // Store pubKey
        pubKey =  key;

        // Add new device to config and create ProposeSend
        config.device[keyName] = CothorityProtobuf.createDevice(pubKey);
        const message = CothorityProtobuf.createProposeSend(skipchain, config);

        proposeSend(address, message, function(response) {

            // Update GUI
            document.getElementById("threshold").innerHTML = 'Threshold: ' + config.threshold;
            document.getElementById("cisc_second").style.display = 'none';
            document.getElementById("cisc_third").style.display = 'block';
        });
    }
}

/**
 * Send a ConfigUpdate to the conode and verifies whether the proposition was accepted or not.
 * Show a message with the result to the user.
 */
function ciscVerification() {

    const message = CothorityProtobuf.createConfigUpdate(skipchain);

    configUpdate(address, message, function(response) {

        // Decode response
        device = CothorityProtobuf.decodeConfigUpdateReply(response).config.device;

        // Update GUI
        var html;
        if(keyName in device && config.device[keyName].point === pubKey) {
            html = '<span style = "color: green;">Procedure successfully completed!</span>';
        } else {
            html = '<span style = "color: red;">Proposition refused by the conode.</span>';
        }
        document.getElementById("cisc_fourth").innerHTML = html;
        document.getElementById("cisc_third").style.display = 'none';
        document.getElementById("cisc_fourth").style.display = 'block';
    });
}