import CothorityMessages from '../lib/cothority-messages'

const EMPTY_MESSAGE = new Uint8Array([]);

/**
 * Source: https://github.com/Gilthoniel/cothority-web
 */
class CothorityWebsocket {

  status = {};

  getStatus(address) {

    // The promise will resolve when the socket sends back the response of the call
    return new Promise((resolve, reject) => {
      if (!this.status.hasOwnProperty(address) || this.status[address].readyState > 2) {
        const socket = new WebSocket(`ws://${address}/Status/Request`);
        socket.binaryType = 'arraybuffer';

        this.status[address] = socket;
      }

      const socket = this.status[address];

      function onError(e) {
        reject(e);
        socket.removeEventListener('error', onError);
      }

      socket.addEventListener('error', onError);

      function onMessage(e) {
        const s = CothorityMessages.decodeStatusResponse(e.data);
        resolve(s);

        // Clean
        socket.removeEventListener('message', onMessage);
      }

      socket.addEventListener('message', onMessage);

      if (socket.readyState === 0) {
        // socket is not yet opened
        socket.addEventListener('open', () => {
          // Send an empty message to trigger the status
          socket.send(EMPTY_MESSAGE);
        });
      } else {
        socket.send(EMPTY_MESSAGE);
      }
    });

  }

}

export default new CothorityWebsocket();