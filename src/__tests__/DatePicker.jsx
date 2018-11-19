import React from 'react';
import { mount } from 'enzyme';

import DatePicker from '../DatePicker';

/* eslint-disable comma-dangle */

describe('DatePicker', () => {
  it('passes default name to DateInput', () => {
    const component = mount(
      <DatePicker />
    );

    const dateInput = component.find('DateInput');

    expect(dateInput.prop('name')).toBe('date');
  });

  it('passes custom name to DateInput', () => {
    const name = 'testName';

    const component = mount(
      <DatePicker name={name} />
    );

    const dateInput = component.find('DateInput');

    expect(dateInput.prop('name')).toBe(name);
  });

  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const component = mount(
      <DatePicker className={className} />
    );

    const wrapperClassName = component.prop('className');

    expect(wrapperClassName.includes(className)).toBe(true);
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
    const calendarWrapperClassName = calendar.prop('className');

    expect(calendarWrapperClassName.includes(calendarClassName)).toBe(true);
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

    const clearButton = component.find('button.react-date-picker__clear-button');

    expect(clearButton).toHaveLength(1);
  });

  it('renders calendar button', () => {
    const component = mount(
      <DatePicker />
    );

    const calendarButton = component.find('button.react-date-picker__calendar-button');

    expect(calendarButton).toHaveLength(1);
  });

  it('renders DateInput and Calendar components when given isOpen flag', () => {
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

  it('closes Calendar component when focused outside', () => {
    const component = mount(
      <DatePicker isOpen />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);

    dayInput.simulate('blur');
    component.update();

    expect(component.state('isOpen')).toBe(false);
  });

  it('does not close Calendar component when focused inside', () => {
    const component = mount(
      <DatePicker isOpen />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.simulate('blur');
    monthInput.simulate('focus');
    component.update();

    expect(component.state('isOpen')).toBe(true);
  });
});
