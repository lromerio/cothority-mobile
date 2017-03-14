jest.mock('../../services/status', () => class {
    subscribe = jest.fn();
    unsubscribe = jest.fn();
});

import React from 'react'
import Faker from 'faker'
import {mount} from 'enzyme'

import ServersStatus from './servers-status'
import StatusService from '../../services/status'

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

    it('should render valid server entry', () => {
        const wrapper = mount(<ServersStatus/>);
        wrapper.instance().onStatusUpdate({
            localhost: MOCK_STATUS
        });

        const fields = MOCK_STATUS.system.Status.field;
        expect(wrapper.text().indexOf(fields.Description) >= 0).toBeTruthy();
    });

    it('should render server details', () => {
        const wrapper = mount(<ServersStatus/>);
        wrapper.instance().onStatusUpdate({
            localhost: MOCK_STATUS
        });

        const fields = MOCK_STATUS.system.Status.field;
        wrapper.setState({recap: false, data: fields});
        expect(wrapper.text().indexOf(fields.Description) >= 0).toBeTruthy();
        expect(wrapper.text().indexOf(fields.Host) >= 0).toBeTruthy();
        expect(wrapper.text().indexOf(fields.ConnType) >= 0).toBeTruthy();
        expect(wrapper.text().indexOf(fields.Port) >= 0).toBeTruthy();
        expect(wrapper.text().indexOf(fields.Uptime) >= 0).toBeTruthy();
        expect(wrapper.text().indexOf(fields.Available_Services) >= 0).toBeTruthy();
        expect(wrapper.text().indexOf(fields.Version) >= 0).toBeTruthy();

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

        expect(wrapper.find("has-error")).toBeTruthy();
    });

    it('should subscribe and unsubscribe', () => {
        const wrapper = mount(<ServersStatus/>);
        const service = wrapper.instance().service;
        wrapper.unmount();

        expect(service.subscribe).toHaveBeenCalledTimes(1);
        expect(service.unsubscribe).toHaveBeenCalledTimes(1);
    });

});