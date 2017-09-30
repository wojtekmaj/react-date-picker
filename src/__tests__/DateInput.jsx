import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import DateInput from '../DateInput';

configure({ adapter: new Adapter() });

/* eslint-disable comma-dangle */

describe('DateInput', () => {
  it('renders a form, button, native input and custom inputs', () => {
    const component = mount(
      <DateInput />
    );

    const form = component.find('form');
    const button = component.find('button');
    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(form.length).toBe(1);
    expect(button.length).toBe(1);
    expect(nativeInput.length).toBe(1);
    expect(customInputs.length).toBe(3);
  });

  it('does not render day input when maxDetail is "year" or less', () => {
    const component = mount(
      <DateInput maxDetail="year" />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.find('input[name="day"]');
    const monthInput = customInputs.find('input[name="month"]');
    const yearInput = customInputs.find('input[name="year"]');

    expect(customInputs.length).toBe(2);
    expect(dayInput.length).toBe(0);
    expect(monthInput.length).toBe(1);
    expect(yearInput.length).toBe(1);
  });

  it('does not render day and month inputs when maxDetail is "decade" or less', () => {
    const component = mount(
      <DateInput maxDetail="decade" />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.find('input[name="day"]');
    const monthInput = customInputs.find('input[name="month"]');
    const yearInput = customInputs.find('input[name="year"]');

    expect(customInputs.length).toBe(2);
    expect(dayInput.length).toBe(0);
    expect(monthInput.length).toBe(0);
    expect(yearInput.length).toBe(1);
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

    expect(customInputs.at(0).props().name).toBe('month');
    expect(customInputs.at(1).props().name).toBe('day');
    expect(customInputs.at(2).props().name).toBe('year');
  });

  it('renders proper input separators (en-US)', () => {
    const component = mount(
      <DateInput
        locale="en-US"
      />
    );

    const separators = component.find('form').text();

    expect(separators).toHaveLength(2);
    expect(separators[0]).toBe('/');
  });
});
