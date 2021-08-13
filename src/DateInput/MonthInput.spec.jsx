import React from 'react';
import { mount } from 'enzyme';

import MonthInput from './MonthInput';

describe('MonthInput', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {},
  };

  it('renders an input', () => {
    const component = mount(
      <MonthInput {...defaultProps} />,
    );

    const input = component.find('input');

    expect(input).toHaveLength(1);
  });

  it('renders "0" given showLeadingZeros if month is <10', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        showLeadingZeros
        value="9"
      />,
    );

    const input = component.find('input');

    expect(component.text()).toContain('0');
    expect(input.prop('className')).toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if month is <10 with leading zero already', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        showLeadingZeros
        value="09"
      />,
    );

    const input = component.find('input');

    expect(component.text()).not.toContain('0');
    expect(input.prop('className')).not.toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if month is >=10', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        showLeadingZeros
        value="10"
      />,
    );

    const input = component.find('input');

    expect(component.text()).not.toContain('0');
    expect(input.prop('className')).not.toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if not given showLeadingZeros', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        value="9"
      />,
    );

    const input = component.find('input');

    expect(component.text()).not.toContain('0');
    expect(input.prop('className')).not.toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('applies given aria-label properly', () => {
    const monthAriaLabel = 'Month';

    const component = mount(
      <MonthInput
        {...defaultProps}
        ariaLabel={monthAriaLabel}
      />,
    );

    const input = component.find('input');

    expect(input.prop('aria-label')).toBe(monthAriaLabel);
  });

  it('applies given placeholder properly', () => {
    const monthPlaceholder = 'mm';

    const component = mount(
      <MonthInput
        {...defaultProps}
        placeholder={monthPlaceholder}
      />,
    );

    const input = component.find('input');

    expect(input.prop('placeholder')).toBe(monthPlaceholder);
  });

  it('has proper name defined', () => {
    const component = mount(
      <MonthInput {...defaultProps} />,
    );

    const input = component.find('input');

    expect(input.prop('name')).toBe('month');
  });

  it('has proper className defined', () => {
    const className = 'react-date-picker';

    const component = mount(
      <MonthInput
        {...defaultProps}
        className={className}
      />,
    );

    const input = component.find('input');

    expect(input.hasClass('react-date-picker__input')).toBe(true);
    expect(input.hasClass('react-date-picker__month')).toBe(true);
  });

  it('displays given value properly', () => {
    const value = '11';

    const component = mount(
      <MonthInput
        {...defaultProps}
        value={value}
      />,
    );

    const input = component.find('input');

    expect(input.prop('value')).toBe(value);
  });

  it('does not disable input by default', () => {
    const component = mount(
      <MonthInput {...defaultProps} />,
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeFalsy();
  });

  it('disables input given disabled flag', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        disabled
      />,
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeTruthy();
  });

  it('is not required input by default', () => {
    const component = mount(
      <MonthInput {...defaultProps} />,
    );

    const input = component.find('input');

    expect(input.prop('required')).toBeFalsy();
  });

  it('required input given required flag', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        required
      />,
    );

    const input = component.find('input');

    expect(input.prop('required')).toBeTruthy();
  });

  it('calls inputRef properly', () => {
    const inputRef = jest.fn();

    mount(
      <MonthInput
        {...defaultProps}
        inputRef={inputRef}
      />,
    );

    expect(inputRef).toHaveBeenCalled();
    expect(inputRef).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('has min = 1 by default', () => {
    const component = mount(
      <MonthInput {...defaultProps} />,
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = 1 given minDate in a past year', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        minDate={new Date(2017, 6, 1)}
        year="2018"
      />,
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = (month in minDate) given minDate in a current year', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        minDate={new Date(2018, 6, 1)}
        year="2018"
      />,
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(7);
  });

  it('has max = 12 by default', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        year="2018"
      />,
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(12);
  });

  it('has max = 12 given maxDate in a future year', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        maxDate={new Date(2019, 6, 1)}
        year="2018"
      />,
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(12);
  });

  it('has max = (month in maxDate) given maxDate in a current year', () => {
    const component = mount(
      <MonthInput
        {...defaultProps}
        maxDate={new Date(2018, 6, 1)}
        year="2018"
      />,
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(7);
  });
});
