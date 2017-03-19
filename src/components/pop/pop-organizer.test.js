import React from "react";
import {mount} from "enzyme";
import PopOrganizer from "./pop-organizer";

describe(PopOrganizer, () => {

    it('should render first phase', () => {
        const wrapper = mount(<PopOrganizer/>);

        expect(wrapper.find("address_input")).toBeTruthy();
    });

    it('should render second phase', () => {
        const wrapper = mount(<PopOrganizer/>);

        wrapper.setState({phase: 1});
        expect(wrapper.find("pin_input")).toBeTruthy();
    });

    it('should render third phase', () => {
        const wrapper = mount(<PopOrganizer/>);

        wrapper.setState({phase: 2});
        expect(wrapper.find("name_input")).toBeTruthy();
        expect(wrapper.find("location_input")).toBeTruthy();
        expect(wrapper.find("date_input")).toBeTruthy();
        expect(wrapper.find("description_input")).toBeTruthy();
        expect(wrapper.find("organizers_input")).toBeTruthy();

    });

    it('should render recap screen', () => {
        const wrapper = mount(<PopOrganizer/>);

        wrapper.setState({phase: 3});
        expect(wrapper.find("pop_party_recap")).toBeTruthy();
    });

    it('should render first phase as default screen', () => {
        const wrapper = mount(<PopOrganizer/>);

        wrapper.setState({phase: -1});
        expect(wrapper.find("pop_party_recap")).toBeTruthy();
    });
});