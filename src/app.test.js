import React from 'react';
import ReactDOM from 'react-dom';
import {mount} from 'enzyme'

import App from './app';
import ServersStatus from './components/servers-status/servers-status'
import PopOrganizer from './components/pop/pop-organizer'
import PopAttendee from './components/pop/pop-attendee'

describe(App, () => {

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App />, div);
    });

    it('should render the menu button', () => {
        const wrapper = mount(<App/>);

        expect(wrapper.find("menu_button")).toBeTruthy();
        expect(wrapper.text().indexOf("HOME") >= 0).toBeTruthy();
    });

    it('should render the menu', () => {
        const wrapper = mount(<App/>);

        expect(wrapper.text().indexOf("Status") >= 0).toBeTruthy();
    });

    it('should render ServerStatus', () => {
        const wrapper = mount(<App/>);
        wrapper.setState({currentPage: 1});

        expect(wrapper.text().indexOf("Status") >= 0).toBeFalsy();
        expect(wrapper.contains([<ServersStatus/>])).toBeTruthy();
    });

    it('should render PopOrganizer', () => {
        const wrapper = mount(<App/>);
        wrapper.setState({currentPage: 2});

        expect(wrapper.text().indexOf("Status") >= 0).toBeFalsy();
        expect(wrapper.contains([<PopOrganizer/>])).toBeTruthy();
    });

    it('should render PopAttendee', () => {
        const wrapper = mount(<App/>);
        wrapper.setState({currentPage: 3});

        expect(wrapper.text().indexOf("Status") >= 0).toBeFalsy();
        expect(wrapper.contains([<PopAttendee/>])).toBeTruthy();
    });

    it('should render menu as default screen', () => {
        const wrapper = mount(<App/>);
        wrapper.setState({currentPage: -1});

        expect(wrapper.text().indexOf("Status") >= 0).toBeTruthy();
    });
});