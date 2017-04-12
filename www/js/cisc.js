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
        skipchain = conodeInfo[1];

        // TODO: remove this (debug alert)
        alert('Address: ' + address + '\n Skipchain: ' + skipchain);

        // TODO: send ConfigUpdate and pass below code as handler
        // Update buttons
        document.getElementById("cisc_first").style.display = 'none';
        document.getElementById("cisc_second").style.display = 'block';
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
            handler(res);
        });
    } else {
        alert('Id field cannot be empty!');
        handler('');
    }
}

/**
 * If the input is a valid publi key: send a ProposeSend to the conode
 * and handle the result.
 *
 * @param key
 */
function ciscPropose_handler(key) {
    if (key.length === 32) {
        /**
         * TODO
         * 1) Update Config with pubkey and key name
         * 2) Send Propose send passing as an handler what
         *      bellow (adapted to handle a failure)
         */

            // Show success message
        const html = '<span style = "color: green;">Procedure successfully completed!</span>';
        document.getElementById("cisc_third").innerHTML = html;

        // Update buttons
        document.getElementById("cisc_second").style.display = 'none';
        document.getElementById("cisc_third").style.display = 'block';
    }
}