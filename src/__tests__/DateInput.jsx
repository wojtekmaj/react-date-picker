import React from 'react';
import { mount } from 'enzyme';

import DateInput from '../DateInput';

/* eslint-disable comma-dangle */

const keyCodes = {
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
  '-': 189,
  '.': 190,
  '/': 191,
};

const getKey = key => ({
  keyCode: keyCodes[key],
  which: keyCodes[key],
  key,
});

describe('DateInput', () => {
  const defaultProps = {
    className: 'react-date-picker__inputGroup',
  };

  it('renders a native input and custom inputs', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput).toHaveLength(1);
    expect(customInputs).toHaveLength(3);
  });

  it('does not render day input when maxDetail is "year" or less', () => {
    const component = mount(
      <DateInput
        {...defaultProps}
        maxDetail="year"
      />
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
      <DateInput
        {...defaultProps}
        maxDetail="decade"
      />
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
      <DateInput
        {...defaultProps}
        value={date}
      />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.getDOMNode().value).toBe('2017-09-30');
    expect(customInputs.at(0).getDOMNode().value).toBe('9');
    expect(customInputs.at(1).getDOMNode().value).toBe('30');
    expect(customInputs.at(2).getDOMNode().value).toBe('2017');
  });

  it('shows empty value in all inputs correctly', () => {
    const component = mount(
      <DateInput
        {...defaultProps}
        value={null}
      />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.getDOMNode().value).toBe('');
    expect(customInputs.at(0).getDOMNode().value).toBe('');
    expect(customInputs.at(1).getDOMNode().value).toBe('');
    expect(customInputs.at(2).getDOMNode().value).toBe('');
  });

  it('clears the value correctly', () => {
    const date = new Date(2017, 8, 30);

    const component = mount(
      <DateInput
        {...defaultProps}
        value={date}
      />
    );

    component.setProps({ value: null });

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.getDOMNode().value).toBe('');
    expect(customInputs.at(0).getDOMNode().value).toBe('');
    expect(customInputs.at(1).getDOMNode().value).toBe('');
    expect(customInputs.at(2).getDOMNode().value).toBe('');
  });

  it('renders custom inputs in a proper order', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const customInputs = component.find('input[type="number"]');

    expect(customInputs.at(0).prop('name')).toBe('month');
    expect(customInputs.at(1).prop('name')).toBe('day');
    expect(customInputs.at(2).prop('name')).toBe('year');
  });

  it('renders proper input separators', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const separators = component.find('.react-date-picker__inputGroup__divider');

    expect(separators).toHaveLength(2);
    expect(separators.at(0).text()).toBe('/');
  });

  it('renders proper amount of separators', () => {
    const component = mount(
      <DateInput
        {...defaultProps}
        maxDetail="year"
      />
    );

    const separators = component.find('.react-date-picker__inputGroup__divider');
    const customInputs = component.find('input[type="number"]');

    expect(separators).toHaveLength(customInputs.length - 1);
  });

  it('jumps to the next field when right arrow is pressed', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.getDOMNode().focus();

    expect(document.activeElement).toBe(dayInput.getDOMNode());

    dayInput.simulate('keydown', getKey('ArrowRight'));

    expect(document.activeElement).toBe(monthInput.getDOMNode());
  });

  it('jumps to the next field when separator key is pressed', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.getDOMNode().focus();

    expect(document.activeElement).toBe(dayInput.getDOMNode());

    const separators = component.find('.react-date-picker__inputGroup__divider');
    const separatorKey = separators.at(0).text();
    dayInput.simulate('keydown', getKey(separatorKey));

    expect(document.activeElement).toBe(monthInput.getDOMNode());
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const customInputs = component.find('input[type="number"]');
    const yearInput = customInputs.at(2);

    yearInput.getDOMNode().focus();

    expect(document.activeElement).toBe(yearInput.getDOMNode());

    yearInput.simulate('keydown', getKey('ArrowRight'));

    expect(document.activeElement).toBe(yearInput.getDOMNode());
  });

  it('jumps to the previous field when left arrow is pressed', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    monthInput.getDOMNode().focus();

    expect(document.activeElement).toBe(monthInput.getDOMNode());

    monthInput.simulate('keydown', getKey('ArrowLeft'));

    expect(document.activeElement).toBe(dayInput.getDOMNode());
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);

    dayInput.getDOMNode().focus();

    expect(document.activeElement).toBe(dayInput.getDOMNode());

    dayInput.simulate('keydown', getKey('ArrowLeft'));

    expect(document.activeElement).toBe(dayInput.getDOMNode());
  });

  it('triggers onChange correctly when changed custom input', () => {
    const onChange = jest.fn();
    const date = new Date(2017, 8, 30);

    const component = mount(
      <DateInput
        {...defaultProps}
        onChange={onChange}
        value={date}
      />
    );

    const customInputs = component.find('input[type="number"]');

    customInputs.at(1).getDOMNode().value = '20';
    customInputs.at(1).simulate('change');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 20), false);
  });

  it('triggers onChange correctly when cleared custom inputs', () => {
    const onChange = jest.fn();
    const date = new Date(2017, 8, 30);

    const component = mount(
      <DateInput
        {...defaultProps}
        onChange={onChange}
        value={date}
      />
    );

    const customInputs = component.find('input[type="number"]');

    customInputs.forEach((customInput) => {
      customInput.getDOMNode().value = ''; // eslint-disable-line no-param-reassign
      customInput.simulate('change');
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null, false);
  });

  it('triggers onChange correctly when changed native input', () => {
    const onChange = jest.fn();
    const date = new Date(2017, 8, 30);

    const component = mount(
      <DateInput
        {...defaultProps}
        onChange={onChange}
        value={date}
      />
    );

    const nativeInput = component.find('input[type="date"]');

    nativeInput.getDOMNode().value = '2017-09-20';
    nativeInput.simulate('change');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 20), false);
  });

  it('triggers onChange correctly when cleared native input', () => {
    const onChange = jest.fn();
    const date = new Date(2017, 8, 30);

    const component = mount(
      <DateInput
        {...defaultProps}
        onChange={onChange}
        value={date}
      />
    );

    const nativeInput = component.find('input[type="date"]');

    nativeInput.getDOMNode().value = '';
    nativeInput.simulate('change');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(null, false);
  });
});
