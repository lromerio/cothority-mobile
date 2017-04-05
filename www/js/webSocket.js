var status = {};

var callbacks = {
    fail: function (e) {
        document.getElementById("ws_result").innerHTML = '<span style = "color: red;">ERROR: </span>' + e.data;
    },
    success: function (e) {
        document.getElementById("ws_result").innerHTML = '<span style = "color: green;">SUCCESS: </span>' + e.data;
    }
};

function getStatus() {

    var address = document.getElementById("address").value;

    this.status[address] = createSocket(
        this.status[address],
        address + '/Status/Request',
        callbacks.fail, callbacks.success,
        new Uint8Array([])
    );
}

function pinRequest() {
    var address = document.getElementById("address").value;
    var pin = document.getElementById("pin").value;
    var key = new Uint8Array([]);

    if (pin.toString().length !== 0) {
        key = generateKeyPair(false);
    }

    this.pinSocket = createSocket(
        this.pinSocket,
        address + '/Pop/PinRequest',
        callbacks.fail, callbacks.success,
        CothorityProtobuf.createPinRequest(pin, key)
    );
}

// cisc://192.33.210.8:8002/5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fb03e9e49fdd9caa2c0

function configUpdate(){
    var address = '192.33.210.8:8002';
    var id = '5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fb03e9e49fdd9caa2c0';

    this.configSocket = createSocket(
        this.configSocket,
        address,
        callbacks.fail, callbacks.success,
        CothorityProtobuf.createConfigUpdate(id)
    );
}

/**
 * Use the existing socket or create a new one if required
 * @param socket WebSocket old socket
 * @param address String ws address
 * @param error Function callback if an error occurred
 * @param callback Function callback when a message is received
 * @param message ArrayBuffer the message to send
 * @returns {*}
 */
function createSocket(socket, address, error, callback, message) {
    if (!socket || socket.readyState > 2) {
        socket = new WebSocket('ws://' + address);
        socket.binaryType = 'arraybuffer';
    }

    function onError(e) {
        socket.removeEventListener('error', onError);
        error(e);
    }
    socket.addEventListener('error', onError);

    function onMessage(e) {
        socket.removeEventListener('message', onMessage);
        callback(e.data);
    }
    socket.addEventListener('message', onMessage);

    if (socket.readyState === 0) {
        socket.addEventListener('open',function(){
            socket.send(message);
    });
    }
    else {
        socket.send(message);
    }

    return socket;
}