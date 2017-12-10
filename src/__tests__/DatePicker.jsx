import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import DatePicker from '../DatePicker';

configure({ adapter: new Adapter() });

/* eslint-disable comma-dangle */

jest.mock('../../node_modules/react-calendar/build/Calendar.less', () => ({}));

describe('DatePicker', () => {
  it('renders DateInput component', () => {
    const component = mount(
      <DatePicker />
    );

    const dateInput = component.find('DateInput');

    expect(dateInput.length).toBe(1);
  });

  it('renders DateInput and Calendar component when given isOpen flag', () => {
    const component = mount(
      <DatePicker isOpen />
    );

    const dateInput = component.find('DateInput');
    const calendar = component.find('Calendar');

    expect(dateInput.length).toBe(1);
    expect(calendar.length).toBe(1);
  });

  it('opens Calendar component when given isOpen flag by changing props', () => {
    const component = mount(
      <DatePicker />
    );

    const calendar = component.find('Calendar');

    expect(calendar.length).toBe(0);

    component.setProps({ isOpen: true });
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2.length).toBe(1);
  });

  it('opens Calendar component when clicking on a button', () => {
    const component = mount(
      <DatePicker />
    );

    const calendar = component.find('Calendar');
    const button = component.find('button.react-date-picker__calendar-button');

    expect(calendar.length).toBe(0);

    button.simulate('click');
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2.length).toBe(1);
  });

  it('opens Calendar component when focusing on an input inside', () => {
    const component = mount(
      <DatePicker />
    );

    const calendar = component.find('Calendar');
    const input = component.find('input[name="day"]');

    expect(calendar.length).toBe(0);

    input.simulate('focus');
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2.length).toBe(1);
  });
});
