/**
 * Scan a qr-code using the official phonegap plugin, then pass the resulting string
 * (or an empty one in case of failure) to the given handler.
 *
 * @param handler
 */
function qrcodeScan(handler) {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(!result.cancelled) {
                handler(result.text.toString());
            } else {
                alert("You have cancelled scan");
                handler('');
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
            handler('');
        }
    );
}

/**
 * Encode the given string in to a qr-code and shows it to the user.
 * In case of error alert the user.
 *
 * @param toEncode
 */
function qrcodeCreate(toEncode) {
    
    cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, toEncode,
        function (success) {
            alert('succes');
            alert("Encode succes: " + success);
        },
        function (fail) {
            alert("Encoding failed: " + fail);
        }
    );
}