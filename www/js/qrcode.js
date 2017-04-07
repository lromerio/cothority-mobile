/**
 * Scan a qr-code using the official phonegap plugin.
 * In case of success returns the scanned string, otherwise an empty string
 * and alert the user.
 *
 * @returns {string}
 */
function qrcodeScan() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(!result.cancelled) {
                return result.text;
            } else {
                alert("You have cancelled scan");
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );

    return '';
}

/**
 * Encode the given string in to a qr-code and shows it to the user.
 * In case of error alert the user.
 *
 * @param toEncode
 */
function qrcodeCreate(toEncode) {
    cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, toEncode,
        function (success) {alert("Encode succes: " + success)},
        function (fail) {alert("Encoding failed: " + fail)}
    );
}