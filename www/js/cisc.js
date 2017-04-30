var address = '';
var skipchain = '';

var config;
var keyName = '';
var pubKey = '';

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

            console.log(config);
            console.log(buf2hex(config.device['test1212'].point));

            const fields = {
                config: config
            };

            //console.log(CothorityProtobuf.encodeMessage('ConfigUpdateReply', fields));
            //console.log(CothorityProtobuf.decodeConfigUpdateReply(CothorityProtobuf.encodeMessage('ConfigUpdateReply', fields)).config)

            // Update GUI
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

        // Sore pubKey
        pubKey =  key;
        console.log(pubKey);

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

function ciscVerification() {

    var message = CothorityProtobuf.createConfigUpdate(skipchain);

    configUpdate(address, message, function(response) {

        // Decode message
        device = CothorityProtobuf.decodeConfigUpdateReply(response).config.device;

        console.log(device);

        // Prepare result message
        var html;
        if(keyName in device && config.device[keyName].point === pubKey) {
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