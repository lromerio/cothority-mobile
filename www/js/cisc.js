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

        //address = conodeInfo[0];
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

        // Create ProposeSend
        //var newDevice = CothorityProtobuf.createDevice(key);
        //config.device[keyName] = newDevice;

        var message = CothorityProtobuf.createProposeSend(skipchain, config);
        console.log(message);
/*
        // TODO: hardcoded 10 (instead of 18)
        var x = message.slice(0, 34);
        var y = new Uint8Array(92);
        y.set(x, 0);
        y.set(resp, 34);
        console.log(y);
        console.log(resp);
*/

        proposeSend(address, message, function(response) {

            var device = CothorityProtobuf.decodeConfigUpdateReply(response).config.Device;

            //console.log(device);

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