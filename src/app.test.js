import React from 'react';
import ReactDOM from 'react-dom';
import {mount} from 'enzyme'

import App from './app';
import ServersStatus from './components/servers-status/servers-status'

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
});