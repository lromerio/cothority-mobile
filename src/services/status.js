import ServersList from '../constants/servers'
import CothorityWS from './websocket'

const REFRESH_INTERVAL = 30000;

/**
 * Source: https://github.com/Gilthoniel/cothority-web
 */
export default class StatusService {

  status = {};
  listeners = [];

  constructor(refreshInterval = REFRESH_INTERVAL, status) {

    // Set up a timer to update status every 30s
    const self = this;
    const updateStatus = function () {
      ServersList.forEach((address) => CothorityWS.getStatus(address)
        .then((response) => {
          response.timestamp = Date.now();
          self.status[address] = response;
          self.triggerUpdate();
        })
        .catch(() => {
          self.status[address] = {
            timestamp: Date.now(),
            server: {address}
          };
          self.triggerUpdate();
        })
      );

      setTimeout(updateStatus, refreshInterval);
    };

    updateStatus();
  }

  triggerUpdate() {
    this.listeners.forEach((listener) => {
      this._triggerEvent(listener);
    });
  }

  subscribe(listener) {
    if (this.listeners.indexOf(listener) === -1) {
      this.listeners.push(listener);

      this._triggerEvent(listener);
    }
  }

  unsubscribe(listener) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  _triggerEvent(listener) {
    if (typeof listener.onStatusUpdate === 'function') {
      listener.onStatusUpdate(this.status);
    }
  }
}