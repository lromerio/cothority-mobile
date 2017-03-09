jest.mock('./websocket', () => new class {
  getStatus = jest.fn()
});
jest.mock('../constants/servers', () => ["localhost"]);

import StatusService from './status'
import CothorityWS from './websocket'

/**
 * Source: https://github.com/Gilthoniel/cothority-web
 */
describe(StatusService, () => {

  beforeEach(() => {
    CothorityWS.getStatus.mockClear();
  });

  it('should get the status', () => {
    expect.assertions(1);

    const status = {};
    CothorityWS.getStatus.mockReturnValue(Promise.resolve(status));

    return new Promise((resolve) => {
      const service = new StatusService(30000);
      const listener = {
        onStatusUpdate() {
          if (service.status.localhost) {
            expect(service.status.localhost).toBe(status);
            resolve();
          }
        }
      };

      service.subscribe(listener);
    });
  });

  it('should subscribe and unsubscribe', () => {
    const service = new StatusService(30000);
    const listener = {
      onStatusUpdate: jest.fn()
    };

    service.subscribe(listener);
    expect(listener.onStatusUpdate).toHaveBeenCalledTimes(1);
    expect(service.listeners.indexOf(listener) >= 0).toBeTruthy();

    service.subscribe(listener);
    expect(service.listeners.length).toBe(1);

    service.unsubscribe(listener);
    expect(service.listeners.indexOf(listener) === -1).toBeTruthy();

    service.unsubscribe(listener);
    expect(service.listeners.length).toBe(0);
  });

  it('should trigger events with the right interval', () => {
    expect.assertions(1);
    CothorityWS.getStatus.mockReturnValue(Promise.resolve({}));

    const listener = {onStatusUpdate: jest.fn()};
    const service = new StatusService(500);
    service.subscribe(listener);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          expect(listener.onStatusUpdate.mock.calls.length <= 4).toBeTruthy();
        } catch (e) {
          console.log(e);
          reject();
          return;
        }

        resolve();
      }, 1000);
    });
  });

  it('should create the server object on error', () => {
    expect.assertions(1);
    CothorityWS.getStatus.mockReturnValue(Promise.reject());

    return new Promise((resolve) => {
      const service = new StatusService(30000);
      const listener = {
        onStatusUpdate() {
          if (service.status.localhost) {
            expect(service.status.localhost.server).toBeDefined();
            resolve();
          }
        }
      };

      service.subscribe(listener);
    });
  });

  it('should manage a listener without func declaration', () => {
    const listener = {};
    const service = new StatusService(30000);

    service.subscribe(listener);
  });

});