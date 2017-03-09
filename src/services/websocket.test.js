import CothorityWebsocket from './websocket'
import CothorityMessages from '../lib/cothority-messages'
import Faker from 'faker'
import {Server} from 'mock-socket'

/**
 * Source: https://github.com/Gilthoniel/cothority-web
 */
const MOCK_STATUS_RESPONSE = {
  server: {
    address: Faker.internet.ip(),
    description: Faker.lorem.sentence(),
    id: new Uint8Array([0, 0, 0, 0]),
    public: new Uint8Array([1, 1, 1, 1])
  },
  system: {
    Status: {
      field: {
        test: Faker.lorem.sentence()
      }
    }
  }
};

describe(CothorityWebsocket, () => {

  beforeAll(() => {
    const mockServer = new Server('ws://localhost/Status/Request');
    mockServer.on('message', () => {
      mockServer.send(CothorityMessages.encodeMessage('StatusResponse', MOCK_STATUS_RESPONSE));
    });

    const mockErrorServer = new Server('ws://localhost:1/Status/Request');
    mockErrorServer.on('message', () => {
      mockErrorServer.emit('error');
    });
  });

  it('should create and persist the socket', () => {
    expect.assertions(2);

    return new Promise((resolve) => {
      CothorityWebsocket.getStatus('localhost').then(() => {
        const socket = CothorityWebsocket.status.localhost;
        expect(socket).toBeDefined();

        CothorityWebsocket.getStatus('localhost').then(() => {
          expect(CothorityWebsocket.status.localhost).toBe(socket);

          resolve();
        });
      });
    });
  });

  it('should announce an error', () => {
    expect.assertions(1);

    return CothorityWebsocket.getStatus('localhost:1').catch(() => {
      expect(true).toBeTruthy();
    });
  });

  it('should create a new one in case of error', () => {
    expect.assertions(2);

    return new Promise((resolve) => {
      CothorityWebsocket.getStatus('localhost').then(() => {
        const socket = CothorityWebsocket.status.localhost;
        socket.close();

        CothorityWebsocket.getStatus('localhost').then(() => {
          expect(CothorityWebsocket.status.localhost).toBeDefined();
          expect(CothorityWebsocket.status.localhost !== socket).toBeTruthy();

          resolve();
        });
      });
    });
  });

  it('should decode a status response', () => {
    return CothorityWebsocket.getStatus('localhost').then((status) => {
      expect(status).toBeDefined();
      expect(status.server.address).toBe(MOCK_STATUS_RESPONSE.server.address);
      expect(status.server.description).toBe(MOCK_STATUS_RESPONSE.server.description);
      expect(status.server.id.toString()).toBe(MOCK_STATUS_RESPONSE.server.id.toString());
      expect(status.server.public.toString()).toBe(MOCK_STATUS_RESPONSE.server.public.toString());
      expect(status.system.Status.field.test).toBe(MOCK_STATUS_RESPONSE.system.Status.field.test);
    });
  });

});