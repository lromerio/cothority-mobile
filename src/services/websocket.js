import CothorityMessages from '../lib/cothority-messages'

const EMPTY_MESSAGE = new Uint8Array([]);

class CothorityWebsocket {

    status = {};

    getStatus(address) {

        // The promise will resolve when the socket sends back the response of the call
        return new Promise((resolve, reject) => {
            this.status[address] = createSocket(
                this.status[address],
                address + '/Status/Request',
                (e) => reject(e),
                (data) => resolve(CothorityMessages.decodeStatusResponse(data)),
                EMPTY_MESSAGE
            );
        });

    }
}

export default new CothorityWebsocket();

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
        socket = new WebSocket(`ws://${address}`);
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
        socket.addEventListener('open',() => {
            socket.send(message);
        });
    }
    else {
        socket.send(message);
    }

    return socket;
}