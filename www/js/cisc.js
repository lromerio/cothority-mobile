var conodeInfo = [];

var config;

/**
 * If a valid conode id was scanned it handle the result, otherwise simply does nothing.
 *
 * If the scanned id is a valid one, show the result to the user and modify the cisc_button
 * to handle the next phase (sending a ConfigUpdate).
 *
 * @param s
 */
function ciscQrScanned(s) {
    conodeInfo = extractId(s);

    if(conodeInfo.length === 2) {

        // Show conode information to the user
        document.getElementById("scanned_addr").innerHTML = '<span>conodeInfo[0]</span>';
        document.getElementById("scanned_skypchain").innerHTML = '<span>conodeInfo[1]</span>';

        // Update cisc_button behavior
        const html = '<a target="_blank" href="javascript:configUpdate(conodeInfo[0], conodeInfo[1], ciscUpdateReceived);">' +
                        '<button id="scan_button" type="button">Send</button>' +
                     '</a>';
        document.getElementById("cisc_button").innerHTML = html;
    }
}

/**
 * Handle the answer of a conode to a ConfigUpdate.
 *
 * Ask to the user a name for the key pair to associate with this conode
 * and update the cisc_button to handle the next phase (sending a ProposeSend).
 *
 * @param message
 */
function ciscUpdateReceived(message) {

    // Decode conode message
    //config = CothorityProtobuf.decodeMessage('ConfigUpdateReply', message);

    // Ask for key pair name
    const html = '<span>Insert a unique name for this conode' +
                    '<input id="keyPairName"/>' +
                 '</span>';
    document.getElementById("keyPairName").innerHTML = html;

    // Update cisc_button behavior
    const buttonHtml = '<a target="_blank" href="javascript:ciscPropose();">' +
                            '<button id="scan_button" type="button">Propose</button>' +
                       '</a>';
    document.getElementById("cisc_button").innerHTML = html;
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
            document.getElementById("keyPairName").innerHTML = html;
        }
    });
}