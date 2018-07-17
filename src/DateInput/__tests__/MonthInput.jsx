import React from 'react';
import { mount } from 'enzyme';

import MonthInput from '../MonthInput';

/* eslint-disable comma-dangle */

describe('MonthInput', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {},
  };

  it('renders an input', () => {
    const component = mount(
      <MonthInput {...defaultProps} />
    );

    const input = component.find('input[type="number"]');

    expect(input).toHaveLength(1);
  });

  it('renders "0" given showLeadingZeros if day is <10', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        showLeadingZeros
        value={9}
      />
    );

    const input = component.find('input[type="number"]');

    expect(component.text()).toContain('0');
    expect(input.prop('className')).toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if day is >=10', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        showLeadingZeros
        value={10}
      />
    );

    const input = component.find('input[type="number"]');

    expect(component.text()).not.toContain('0');
    expect(input.prop('className')).not.toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if not given showLeadingZeros', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        value={9}
      />
    );

    const input = component.find('input[type="number"]');

    expect(component.text()).not.toContain('0');
    expect(input.prop('className')).not.toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('has proper name defined', () => {
    const component = mount(
      <MonthInput {...defaultProps} />
    );

    const input = component.find('input[type="number"]');

    expect(input.prop('name')).toBe('month');
  });

  it('does not disable input by default', () => {
    const component = mount(
      <MonthInput {...defaultProps} />
    );

    const input = component.find('input[type="number"]');

    expect(input.prop('disabled')).toBeFalsy();
  });

  it('disables input given disabled flag', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        disabled
      />
    );

    const input = component.find('input[type="number"]');

    expect(input.prop('disabled')).toBeTruthy();
  });

  it('is not required input by default', () => {
    const component = mount(
      <MonthInput {...defaultProps} />
    );

    const input = component.find('input[type="number"]');

    expect(input.prop('required')).toBeFalsy();
  });

  it('required input given required flag', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        required
      />
    );

    const input = component.find('input[type="number"]');

    expect(input.prop('required')).toBeTruthy();
  });

  it('calls itemRef properly', () => {
    const itemRef = jest.fn();

    mount(
      <MonthInput
        {...defaultProps}
        itemRef={itemRef}
      />
    );

    expect(itemRef).toHaveBeenCalled();
    expect(itemRef).toHaveBeenCalledWith(expect.any(HTMLInputElement), 'month');
  });

  it('has min = 1 by default', () => {
    const component = mount(
      <MonthInput {...defaultProps} />
    );

    const input = component.find('input[type="number"]');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = 1 given minDate in a past year', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        year={2018}
        minDate={new Date(2017, 6, 1)}
      />
    );

    const input = component.find('input[type="number"]');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = (month in minDate) given minDate in a current year', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        year={2018}
        minDate={new Date(2018, 6, 1)}
      />
    );

    const input = component.find('input[type="number"]');

    expect(input.prop('min')).toBe(7);
  });

  it('has max = 12 by default', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        year={2018}
      />
    );

    const input = component.find('input[type="number"]');

    expect(input.prop('max')).toBe(12);
  });

  it('has max = 12 given maxDate in a future year', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        year={2018}
        maxDate={new Date(2019, 6, 1)}
      />
    );

    const input = component.find('input[type="number"]');

    expect(input.prop('max')).toBe(12);
  });

  it('has max = (month in maxDate) given maxDate in a current year', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        year={2018}
        maxDate={new Date(2018, 6, 1)}
      />
    );

    const input = component.find('input[type="number"]');

    expect(input.prop('max')).toBe(7);
  });
});
