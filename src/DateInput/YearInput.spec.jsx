import React from 'react';
import { mount } from 'enzyme';

import YearInput from './YearInput';

/* eslint-disable comma-dangle */

describe('YearInput', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {},
  };

  it('renders an input', () => {
    const component = mount(
      <YearInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input).toHaveLength(1);
  });

  it('applies given aria-label properly', () => {
    const yearAriaLabel = 'Year';

    const component = mount(
      <YearInput
        {...defaultProps}
        ariaLabel={yearAriaLabel}
      />
    );

    const input = component.find('input');

    expect(input.prop('aria-label')).toBe(yearAriaLabel);
  });

  it('applies given placeholder properly', () => {
    const yearPlaceholder = 'Year';

    const component = mount(
      <YearInput
        {...defaultProps}
        placeholder={yearPlaceholder}
      />
    );

    const input = component.find('input');

    expect(input.prop('placeholder')).toBe(yearPlaceholder);
  });

  it('has proper name defined', () => {
    const component = mount(
      <YearInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('name')).toBe('year');
  });

  it('has proper className defined', () => {
    const className = 'react-date-picker';

    const component = mount(
      <YearInput
        {...defaultProps}
        className={className}
      />
    );

    const input = component.find('input');

    expect(input.hasClass('react-date-picker__input')).toBe(true);
    expect(input.hasClass('react-date-picker__year')).toBe(true);
  });

  it('displays given value properly', () => {
    const value = 2018;

    const component = mount(
      <YearInput
        {...defaultProps}
        value={value}
      />
    );

    const input = component.find('input');

    expect(input.prop('value')).toBe(value);
  });

  it('does not disable input by default', () => {
    const component = mount(
      <YearInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeFalsy();
  });

  it('disables input given disabled flag', () => {
    const component = mount(
      <YearInput
        {...defaultProps}
        disabled
      />
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeTruthy();
  });

  it('is not required input by default', () => {
    const component = mount(
      <YearInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('required')).toBeFalsy();
  });

  it('required input given required flag', () => {
    const component = mount(
      <YearInput
        {...defaultProps}
        required
      />
    );

    const input = component.find('input');

    expect(input.prop('required')).toBeTruthy();
  });

  it('calls itemRef properly', () => {
    const itemRef = jest.fn();

    mount(
      <YearInput
        {...defaultProps}
        itemRef={itemRef}
      />
    );

    expect(itemRef).toHaveBeenCalled();
    expect(itemRef).toHaveBeenCalledWith(expect.any(HTMLInputElement), 'year');
  });

  it('has min = 0 by default', () => {
    const component = mount(
      <YearInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(0);
  });

  it('has min = (year in minDate) given minDate', () => {
    const component = mount(
      <YearInput
        {...defaultProps}
        minDate={new Date(2018, 6, 1)}
      />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(2018);
  });

  it('has max = 275760 by default', () => {
    const component = mount(
      <YearInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(275760);
  });

  it('has max = (year in maxDate) given maxDate', () => {
    const component = mount(
      <YearInput
        {...defaultProps}
        maxDate={new Date(2018, 6, 1)}
      />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(2018);
  });
});
