var address = '';
var skipchain = '';

var config;
var keyName = '';

//TODO
var resp;


/**
 * If a valid conode qr-code was scanned: extract conode information, use them to
 * send a ConfigUpdate and handle the result.
 *
 * @param s
 */
function ciscQrScanned(s) {

    //conodeInfo = extractId(s);

    //if(conodeInfo.length === 2) {

        //ddress = conodeInfo[0];
        //skipchain = hex2buf(conodeInfo[1]);

        address = "192.33.210.8:8003";
        skipchain = hex2buf("382b3d8fee898cb4e4b978bad0481ecdc994d2a78ff3e1e97c2811d16b68679e");

        // Create ConfigUpdate
        var message = CothorityProtobuf.createConfigUpdate(skipchain);

        configUpdate(address, message, function(response) {


            resp = new Uint8Array(response);

            // Decode message and store config
            config = CothorityProtobuf.decodeConfigUpdateReply(response).config;

            console.log(new Uint8Array(response));
            console.log(config)

            const fields = {
                config: config
            };

            console.log(CothorityProtobuf.encodeMessage('ConfigUpdateReply', fields));
            console.log(CothorityProtobuf.decodeConfigUpdateReply(CothorityProtobuf.encodeMessage('ConfigUpdateReply', fields)).config)

            // Update buttons
            document.getElementById("threshold").innerHTML = config.threshold;

            document.getElementById("cisc_first").style.display = 'none';
            document.getElementById("cisc_second").style.display = 'block';
        });
    //} else {
      //  alert('Invalid qr-code');
    //}
}

/**
 * If a valid unqiue id has been inserted: generate a new keys pair
 * and call the given handler.
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

        // Add new device to config and create ProposeSend
        var newDevice = CothorityProtobuf.createDevice(key);
        config.device[keyName] = newDevice;
        var message = CothorityProtobuf.createProposeSend(skipchain, config);

        //TODO: debug print
        console.log(message);
        console.log(CothorityProtobuf.decodeMessage('ProposeSend', message));

        proposeSend(address, message, function(response) {

            // Update GUI
            document.getElementById("threshold").innerHTML = 'Threshold: ' + config.threshold;
            document.getElementById("cisc_second").style.display = 'none';
            document.getElementById("cisc_third").style.display = 'block';
        });
    }
}

function ciscVerification() {

    var message = CothorityProtobuf.createConfigUpdate(skipchain);

    configUpdate(address, message, function(response) {

        // Decode message
        config = CothorityProtobuf.decodeConfigUpdateReply(response).config;

        // Prepare result message
        var html;
        if(keyName in device && device[keyName] === key) {
            html = '<span style = "color: green;">Procedure successfully completed!</span>';
        } else {
            html = '<span style = "color: red;">Proposition refused by the conode.</span>';
        }

        // Update GUI
        document.getElementById("cisc_fourth").innerHTML = html;
        document.getElementById("cisc_third").style.display = 'none';
        document.getElementById("cisc_fourth").style.display = 'block';
    });
}