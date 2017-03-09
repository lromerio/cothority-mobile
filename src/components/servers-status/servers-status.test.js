jest.mock('../../services/status', () => class {
  subscribe = jest.fn();
  unsubscribe = jest.fn();
});

import React from 'react'
import Faker from 'faker'
import {mount} from 'enzyme'

import ServersStatus from './servers-status'
import StatusService from '../../services/status'

/**
 * Source: https://github.com/Gilthoniel/cothority-web
 */
describe(ServersStatus, () => {

  it('should render without crashing', () => {
    const wrapper = mount(<ServersStatus/>);

    expect(wrapper.hasClass("servers-status")).toBeTruthy();
  });

  const MOCK_STATUS = {
    timestamp: Date.now(),
    server: {
      address: Faker.internet.ip()
    },
    system: {Status: {field: {
      Description: Faker.lorem.sentence(),
      Host: Faker.internet.ip(),
      ConnType: Faker.lorem.word(),
      Port: Faker.random.number(),
      Uptime: '1m30.0s',
      RX_bytes: Faker.random.number(),
      TX_bytes: Faker.random.number(),
      Available_Services: Faker.lorem.sentence(),
      Version: Faker.lorem.word()
    }}}
  };

  it('should render the server status', () => {
    const wrapper = mount(<ServersStatus/>);
    wrapper.instance().onStatusUpdate({
      localhost: MOCK_STATUS
    });

    const fields = MOCK_STATUS.system.Status.field;
    expect(wrapper.text().indexOf(fields.Description) >= 0).toBeTruthy();
    const traffic = Number((fields.RX_bytes + fields.TX_bytes) / 90).toFixed(2);
    expect(wrapper.text().indexOf(traffic+"") >= 0).toBeTruthy();
  });

  const MOCK_ERROR_STATUS = {
    timestamp: Date.now(),
    server: {address: Faker.internet.ip()}
  };

  it('should display an error status', () => {
    const wrapper = mount(<ServersStatus/>);
    wrapper.instance().onStatusUpdate({
      localhost: MOCK_ERROR_STATUS
    });

    expect(wrapper.find('tbody tr').hasClass("has-error")).toBeTruthy();
  });

  it('should subscribe and unsubscribe', () => {
    const wrapper = mount(<ServersStatus/>);
    const service = wrapper.instance().service;
    wrapper.unmount();

    expect(service.subscribe).toHaveBeenCalledTimes(1);
    expect(service.unsubscribe).toHaveBeenCalledTimes(1);
  });

});