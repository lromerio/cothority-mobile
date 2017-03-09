import React from 'react'
import {mount} from 'enzyme'

import LastUpdate from './last-update'

/**
 * Source: https://github.com/Gilthoniel/cothority-web
 */
describe(LastUpdate, () => {

  it('should render without crashing', () => {
    const ts = Date.now();
    const wrapper = mount(<LastUpdate timestamp={ts}/>);

    expect(wrapper.text()).toBe("0s");
  });

  it('should update the counter', () => {
    const ts = Date.now();
    const wrapper = mount(<LastUpdate timestamp={ts} refresh={1000}/>);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          expect(wrapper.text()).toBe('1s');
        } catch (e) {
          console.log(e);
          reject();
          return;
        }

        resolve();
      }, 1000);
    });
  });

  it('should clear the interval', () => {
    const wrapper = mount(<LastUpdate timestamp={Date.now()} />);
    wrapper.instance().componentWillUnmount();

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(wrapper.text()).toBe("0s");
        resolve();
      }, 1000);
    });
  });

});