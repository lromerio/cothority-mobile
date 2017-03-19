import React from "react";
import {mount} from "enzyme";
import PopAttendee from "./pop-attendee";

describe(PopAttendee, () => {

    it('should render first phase', () => {
        const wrapper = mount(<PopAttendee/>);

        expect(wrapper.text().indexOf("Attend") >= 0).toBeTruthy();
    });
});