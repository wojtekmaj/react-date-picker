import React from 'react';
import { mount } from 'enzyme';

import DateInput from '../DateInput';

/* eslint-disable comma-dangle */

describe('DateInput', () => {
  it('renders a native input and custom inputs', () => {
    const component = mount(
      <DateInput />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput).toHaveLength(1);
    expect(customInputs).toHaveLength(3);
  });

  it('does not render day input when maxDetail is "year" or less', () => {
    const component = mount(
      <DateInput maxDetail="year" />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.find('input[name="day"]');
    const monthInput = customInputs.find('input[name="month"]');
    const yearInput = customInputs.find('input[name="year"]');

    expect(customInputs).toHaveLength(2);
    expect(dayInput).toHaveLength(0);
    expect(monthInput).toHaveLength(1);
    expect(yearInput).toHaveLength(1);
  });

  it('does not render day and month inputs when maxDetail is "decade" or less', () => {
    const component = mount(
      <DateInput maxDetail="decade" />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.find('input[name="day"]');
    const monthInput = customInputs.find('input[name="month"]');
    const yearInput = customInputs.find('input[name="year"]');

    expect(customInputs).toHaveLength(2);
    expect(dayInput).toHaveLength(0);
    expect(monthInput).toHaveLength(0);
    expect(yearInput).toHaveLength(1);
  });

  it('shows a given date in all inputs correctly', () => {
    const date = new Date(2017, 8, 30);

    const component = mount(
      <DateInput value={date} />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.getDOMNode().value).toBe('2017-09-30');
    expect(customInputs.at(0).getDOMNode().value).toBe('9');
    expect(customInputs.at(1).getDOMNode().value).toBe('30');
    expect(customInputs.at(2).getDOMNode().value).toBe('2017');
  });

  it('renders custom inputs in a proper order (en-US)', () => {
    const component = mount(
      <DateInput
        locale="en-US"
      />
    );

    const customInputs = component.find('input[type="number"]');

    expect(customInputs.at(0).prop('name')).toBe('month');
    expect(customInputs.at(1).prop('name')).toBe('day');
    expect(customInputs.at(2).prop('name')).toBe('year');
  });

  it('renders proper input separators (en-US)', () => {
    const component = mount(
      <DateInput
        locale="en-US"
      />
    );

    const separators = component.text();

    expect(separators).toHaveLength(2);
    expect(separators[0]).toBe('/');
  });
});
