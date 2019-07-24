import React from 'react';
import { mount } from 'enzyme';

import DayInput from '../DayInput';

/* eslint-disable comma-dangle */

describe('DayInput', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {},
  };

  it('renders an input', () => {
    const component = mount(
      <DayInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input).toHaveLength(1);
  });

  it('renders "0" given showLeadingZeros if day is <10', () => {
    const component = mount(
      <DayInput
        {...defaultProps}
        showLeadingZeros
        value={9}
      />
    );

    const input = component.find('input');

    expect(component.text()).toContain('0');
    expect(input.prop('className')).toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if day is >=10', () => {
    const component = mount(
      <DayInput
        {...defaultProps}
        showLeadingZeros
        value={10}
      />
    );

    const input = component.find('input');

    expect(component.text()).not.toContain('0');
    expect(input.prop('className')).not.toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if not given showLeadingZeros', () => {
    const component = mount(
      <DayInput
        {...defaultProps}
        value={9}
      />
    );

    const input = component.find('input');

    expect(component.text()).not.toContain('0');
    expect(input.prop('className')).not.toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('applies given aria-label properly', () => {
    const dayAriaLabel = 'Day';

    const component = mount(
      <DayInput
        {...defaultProps}
        dayAriaLabel={dayAriaLabel}
      />
    );

    const select = component.find('input');

    expect(select.prop('aria-label')).toBe(dayAriaLabel);
  });

  it('applies given placeholder properly', () => {
    const dayPlaceholder = 'dd';

    const component = mount(
      <DayInput
        {...defaultProps}
        placeholder={dayPlaceholder}
      />
    );

    const select = component.find('input');

    expect(select.prop('placeholder')).toBe(dayPlaceholder);
  });

  it('has proper name defined', () => {
    const component = mount(
      <DayInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('name')).toBe('day');
  });

  it('has proper className defined', () => {
    const className = 'react-date-picker';

    const component = mount(
      <DayInput
        {...defaultProps}
        className={className}
      />
    );

    const input = component.find('input');

    expect(input.hasClass('react-date-picker__input')).toBe(true);
    expect(input.hasClass('react-date-picker__day')).toBe(true);
  });

  it('displays given value properly', () => {
    const value = 11;

    const component = mount(
      <DayInput
        {...defaultProps}
        value={value}
      />
    );

    const input = component.find('input');

    expect(input.prop('value')).toBe(value);
  });

  it('does not disable input by default', () => {
    const component = mount(
      <DayInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeFalsy();
  });

  it('disables input given disabled flag', () => {
    const component = mount(
      <DayInput
        {...defaultProps}
        disabled
      />
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeTruthy();
  });

  it('is not required input by default', () => {
    const component = mount(
      <DayInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('required')).toBeFalsy();
  });

  it('required input given required flag', () => {
    const component = mount(
      <DayInput
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
      <DayInput
        {...defaultProps}
        itemRef={itemRef}
      />
    );

    expect(itemRef).toHaveBeenCalled();
    expect(itemRef).toHaveBeenCalledWith(expect.any(HTMLInputElement), 'day');
  });

  it('has min = 1 by default', () => {
    const component = mount(
      <DayInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = 1 given minDate in a past month', () => {
    const component = mount(
      <DayInput
        {...defaultProps}
        year={2018}
        month={1}
        minDate={new Date(2017, 11, 15)}
      />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = (day in minDate) given minDate in a current month', () => {
    const component = mount(
      <DayInput
        {...defaultProps}
        year={2018}
        month={1}
        minDate={new Date(2018, 0, 15)}
      />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(15);
  });

  it('has max = (number of days in current month) by default', () => {
    const numberOfDaysInJanuary2018 = new Date(2018, 1, 0).getDate();

    const component = mount(
      <DayInput
        {...defaultProps}
        year={2018}
        month={1}
      />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(numberOfDaysInJanuary2018);
  });

  it('has max = (number of days in current month) given maxDate in a future month', () => {
    const numberOfDaysInJanuary2018 = new Date(2018, 1, 0).getDate();

    const component = mount(
      <DayInput
        {...defaultProps}
        year={2018}
        month={1}
        maxDate={new Date(2018, 1, 15)}
      />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(numberOfDaysInJanuary2018);
  });

  it('has max = (day in maxDate) given maxDate in a current month', () => {
    const component = mount(
      <DayInput
        {...defaultProps}
        year={2018}
        month={1}
        maxDate={new Date(2018, 0, 15)}
      />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(15);
  });
});
