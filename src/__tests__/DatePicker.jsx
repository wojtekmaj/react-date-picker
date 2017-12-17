import React from 'react';
import { mount } from 'enzyme';

import DatePicker from '../DatePicker';

/* eslint-disable comma-dangle */

jest.mock('../../node_modules/react-calendar/build/Calendar.less', () => ({}));

describe('DatePicker', () => {
  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const component = mount(
      <DatePicker className={className} />
    );

    const firstDayTileClassName = component.prop('className');

    expect(firstDayTileClassName.includes(className)).toBe(true);
  });

  it('applies calendarClassName to the calendar when given a string', () => {
    const calendarClassName = 'testClassName';

    const component = mount(
      <DatePicker
        calendarClassName={calendarClassName}
        isOpen
      />
    );

    const calendar = component.find('Calendar');
    const firstDayTileClassName = calendar.prop('className');

    expect(firstDayTileClassName.includes(calendarClassName)).toBe(true);
  });

  it('renders DateInput component', () => {
    const component = mount(
      <DatePicker />
    );

    const dateInput = component.find('DateInput');

    expect(dateInput).toHaveLength(1);
  });

  it('renders clear button', () => {
    const component = mount(
      <DatePicker />
    );

    const dateInput = component.find('button.react-date-picker__clear-button');

    expect(dateInput).toHaveLength(1);
  });

  it('renders calendar button', () => {
    const component = mount(
      <DatePicker />
    );

    const dateInput = component.find('button.react-date-picker__calendar-button');

    expect(dateInput).toHaveLength(1);
  });

  it('renders DateInput and Calendar component when given isOpen flag', () => {
    const component = mount(
      <DatePicker isOpen />
    );

    const dateInput = component.find('DateInput');
    const calendar = component.find('Calendar');

    expect(dateInput).toHaveLength(1);
    expect(calendar).toHaveLength(1);
  });

  it('opens Calendar component when given isOpen flag by changing props', () => {
    const component = mount(
      <DatePicker />
    );

    const calendar = component.find('Calendar');

    expect(calendar).toHaveLength(0);

    component.setProps({ isOpen: true });
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2).toHaveLength(1);
  });

  it('opens Calendar component when clicking on a button', () => {
    const component = mount(
      <DatePicker />
    );

    const calendar = component.find('Calendar');
    const button = component.find('button.react-date-picker__calendar-button');

    expect(calendar).toHaveLength(0);

    button.simulate('click');
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2).toHaveLength(1);
  });

  it('opens Calendar component when focusing on an input inside', () => {
    const component = mount(
      <DatePicker />
    );

    const calendar = component.find('Calendar');
    const input = component.find('input[name="day"]');

    expect(calendar).toHaveLength(0);

    input.simulate('focus');
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2).toHaveLength(1);
  });
});
