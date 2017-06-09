/**
 * Use the CothorityProtoBuf library to communicate with the DEDIS conodes.
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
 * Send a Status request to the given address.
 *
 * @param address
 * @param error     Function callback for errors
 * @param success   Function callback for success
 */
function getStatus(address, error, success) {

    this.srSocket[address] = createSocket(
        this.srSocket[address],
        address + '/Status/Request',
        function(e) {error(e);}, function(r){success(r);},
        new Uint8Array([])
    );
}

/**
 * Use user's input to create a ConfigUpdate and send it.
 *
 * @param address
 * @param message
 * @param error     Function callback for errors
 * @param success   Function callback for success
 */
function configUpdate(address, message, error, success){

    this.cuSocket[address] = createSocket(
        this.cuSocket[address],
        address + '/Identity/ConfigUpdate',
        function(e) {error(e);}, function(r){success(r);},
        message
    );
}

/**
 * Use user's input to create a ProposeUpdate and send it.
 *
 * @param address
 * @param message
 * @param error     Function callback for errors
 * @param success   Function callback for success
 */
function proposeUpdate(address, message, error, success){

    this.puSocket[address] = createSocket(
        this.puSocket[address],
        address + '/Identity/ProposeUpdate',
        function(e) {error(e);}, function(r){success(r);},
        message
    );
}

/**
 * Use user's input to create a ProposeSend and send it.
 *
 * @param address
 * @param message
 * @param error     Function callback for errors
 * @param success   Function callback for success
 */
function proposeSend(address, message, error, success) {

    this.psSocket[address] = createSocket(
        this.psSocket[address],
        address + '/Identity/ProposeSend',
        function(e) {error(e);}, function(r){success(r);},
        message
    );
}

/**
 * Use user's input to create a ProposeVote and send it.
 *
 * @param address
 * @param message
 * @param error     Function callback for errors
 * @param success   Function callback for success
 */
function proposeVote(address, message, error, success) {

    this.pvSocket[address] = createSocket(
        this.pvSocket[address],
        address + '/Identity/ProposeVote',
        function(e) {error(e);}, function(r){success(r);},
        message
    );
}

/**
 * Adapted from: https://github.com/Gilthoniel/cothority-web (3 June 2017)
 *
 * Use the existing socket or create a new one if required.
 *
 * @param socket    WebSocket old socket
 * @param address   String ws address
 * @param error     Function callback if an error occurred
 * @param callback  Function callback when a message is received
 * @param message   ArrayBuffer the message to send
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