/**
 * Use the CothorityProtoBuf library (https://github.com/Gilthoniel/CothorityProtoBuf)
 * to communicate with the  DEDIS conodes.
 *
 * @author Lucio Romerio (lucio.romerio@epfl.ch)
 */

// A series of Socket arrays, one for type of message, used to avoid creating
// multiple sockets when sending multiple messages to the same conode.
var srSocket = {};
var cuSocket = {};
var puSocket = {};
var psSocket = {};
var pvSocket = {};

/**
 * Contains two function used as callbacks, they takes care to show success and error messages.
 *
 * @type {{fail: callbacks.fail, success: callbacks.success}}
 */
var callbacks = {
    fail: function (e) {
        document.getElementById("ws_result").innerHTML = '<span style = "color: red;">ERROR: </span>' + e.data;
    },
    success: function (e) {
        document.getElementById("ws_result").innerHTML = '<span style = "color: green;">SUCCESS: </span>' + e.data;
    }
};

/**
 * Send a Status request to the given address.
 */
function getStatus(address, handler) {

    this.srSocket[address] = createSocket(
        this.srSocket[address],
        address + '/Status/Request',
        callbacks.fail, function(r){handler(r);},
        new Uint8Array([])
    );
}

/**
 * Use user's input to create a ConfigUpdate and send it.
 *
 * @param address
 * @param message
 * @param handler
 */
function configUpdate(address, message, handler){

    this.cuSocket[address] = createSocket(
        this.cuSocket[address],
        address + '/Identity/ConfigUpdate',
        callbacks.fail, function(r) {handler(r);},
        message
    );
}

/**
 * Use user's input to create a ProposeUpdate and send it.
 *
 * @param address
 * @param message
 * @param handler
 */
function proposeUpdate(address, message, handler){

    this.puSocket[address] = createSocket(
        this.puSocket[address],
        address + '/Identity/ProposeUpdate',
        callbacks.fail, function(r) {handler(r);},
        message
    );
}

/**
 * Use user's input to create a ProposeSend and send it.
 *
 * @param address
 * @param message
 * @param handler
 */
function proposeSend(address, message, handler) {

    this.psSocket[address] = createSocket(
        this.psSocket[address],
        address + '/Identity/ProposeSend',
        callbacks.fail, function(r) {handler(r)},
        message
    );
}

/**
 * Use user's input to create a ProposeVote and send it.
 *
 * @param address
 * @param message
 * @param handler
 */
function proposeVote(address, message, handler) {

    this.pvSocket[address] = createSocket(
        this.pvSocket[address],
        address + '/Identity/ProposeVote',
        callbacks.fail, function(r) {handler(r)},
        message
    );
}

/**
 * Adapted from: https://github.com/Gilthoniel/cothority-web (3 June 2017)
 *
 * Use the existing socket or create a new one if required.
 *
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

        alert(e);
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