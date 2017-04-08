var phase = 0;

var address = '';
var ip = '';

var config;

function ciscPhasesHandler() {
    alert('in');
    switch (phase) {
        case 0: ciscQrScan();
                break;
        case 1: ciscUpdateReceived();
                break;
        case 2: ciscPropose();
                break;
        default: // never happens
                alert('lol wtf: ' + phase);
                break;
    }
}

/**
 * If a valid conode id was scanned it handle the result, otherwise simply does nothing.
 *
 * If the scanned id is a valid one, show the result to the user and modify the cisc_button
 * to handle the next phase (sending a ConfigUpdate).
 *
 * @param s
 */
function ciscQrScan() {
    qrcodeScan(function(s) {
        var conodeInfo = extractId(s);

        address = conodeInfo[0];
        ip = conodeInfo[1];

        if (conodeInfo.length === 2) {

            // Show conode information to the user
            document.getElementById("scanned_addr").innerHTML = '<span>' + address + '</span>';
            document.getElementById("scanned_skypchain").innerHTML = '<span>' + ip + '</span>';

            // Update cisc_button behavior
            const html = '<button id="scan_button" type="button">Send</button>';
            document.getElementById("cisc_button").innerHTML = html;

            // Update phase flag
            phase = 1;
        }
    });
}

/**
 * Handle the answer of a conode to a ConfigUpdate.
 *
 * Ask to the user a name for the key pair to associate with this conode
 * and update the cisc_button to handle the next phase (sending a ProposeSend).
 *
 * @param message
 */
function ciscUpdateReceived() {

    // TODO: call configUpdate(address, ip, function(){ciscUpdateReceived)};"

    alert('yo');
    // Decode conode message
    //config = CothorityProtobuf.decodeMessage('ConfigUpdateReply', message);

    // Ask for key pair name
    const html = '<span>Insert a unique name for this conode' +
                    '<input id="keyPairName"/>' +
                 '</span>';
    document.getElementById("keyPairName").innerHTML = html;

    // Update cisc_button behavior
    const buttonHtml = '<button id="scan_button" type="button">Propose</button>';
    document.getElementById("cisc_button").innerHTML = buttonHtml;

    // Update phase flag
    phase = 2;
}

/**
 * Send a ProposeSend and handle the result.
 */
function ciscPropose() {

    // Get key name
    var keyName = document.getElementById("keyPairName").value;

    // Generate and store a new key pair
    cryptoGenerateAndStore(keyName, function(res) {
        if(res.length === 32) {
            /**
             * TODO
             * 1) Update Config with pubkey and key name
             * 2) Send Propose send passing as an handler what
             *      bellow (adapted to handle a failure)
             */

            // Show success message
            const html = '<span style = "color: green;">Procedure successfully completed!</span>';
            document.getElementById("cisc_button_container").innerHTML = html;

            // TODO: evaluate
            // Reset phase flag
            phase = 0;
        }
    });
}