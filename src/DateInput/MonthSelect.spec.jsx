import React from 'react';
import { mount } from 'enzyme';

import MonthSelect from './MonthSelect';

describe('MonthSelect', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {},
  };

  it('renders a select', () => {
    const component = mount(
      <MonthSelect {...defaultProps} />,
    );

    const select = component.find('select');
    const options = select.find('option');

    expect(select).toHaveLength(1);
    expect(options).toHaveLength(13); // 12 months + empty option
  });

  it('applies given aria-label properly', () => {
    const monthAriaLabel = 'Month';

    const component = mount(
      <MonthSelect
        {...defaultProps}
        ariaLabel={monthAriaLabel}
      />,
    );

    const select = component.find('select');

    expect(select.prop('aria-label')).toBe(monthAriaLabel);
  });

  it('has proper placeholder by default', () => {
    const component = mount(
      <MonthSelect {...defaultProps} />,
    );

    const options = component.find('option');
    const firstOption = options.first();

    expect(firstOption.text()).toBe('--');
  });

  it('displays given placeholder properly', () => {
    const monthPlaceholder = 'mm';

    const component = mount(
      <MonthSelect
        {...defaultProps}
        placeholder={monthPlaceholder}
      />,
    );

    const options = component.find('option');
    const firstOption = options.first();

    expect(firstOption.text()).toBe(monthPlaceholder);
  });

  it('has proper name defined', () => {
    const component = mount(
      <MonthSelect {...defaultProps} />,
    );

    const select = component.find('select');

    expect(select.prop('name')).toBe('month');
  });

  it('has proper className defined', () => {
    const className = 'react-date-picker';

    const component = mount(
      <MonthSelect
        {...defaultProps}
        className={className}
      />,
    );

    const select = component.find('select');

    expect(select.hasClass('react-date-picker__input')).toBe(true);
    expect(select.hasClass('react-date-picker__month')).toBe(true);
  });

  it('displays given value properly', () => {
    const value = '11';

    const component = mount(
      <MonthSelect
        {...defaultProps}
        value={value}
      />,
    );

    const select = component.find('select');

    expect(select.prop('value')).toBe(value);
  });

  it('does not disable select by default', () => {
    const component = mount(
      <MonthSelect {...defaultProps} />,
    );

    const select = component.find('select');

    expect(select.prop('disabled')).toBeFalsy();
  });

  it('disables select given disabled flag', () => {
    const component = mount(
      <MonthSelect
        {...defaultProps}
        disabled
      />,
    );

    const select = component.find('select');

    expect(select.prop('disabled')).toBeTruthy();
  });

  it('is not required select by default', () => {
    const component = mount(
      <MonthSelect {...defaultProps} />,
    );

    const select = component.find('select');

    expect(select.prop('required')).toBeFalsy();
  });

  it('required select given required flag', () => {
    const component = mount(
      <MonthSelect
        {...defaultProps}
        required
      />,
    );

    const select = component.find('select');

    expect(select.prop('required')).toBeTruthy();
  });

  it('calls itemRef properly', () => {
    const itemRef = jest.fn();

    mount(
      <MonthSelect
        {...defaultProps}
        itemRef={itemRef}
      />,
    );

    expect(itemRef).toHaveBeenCalled();
    expect(itemRef).toHaveBeenCalledWith(expect.any(HTMLSelectElement), 'month');
  });

  it('has all options enabled by default', () => {
    const component = mount(
      <MonthSelect {...defaultProps} />,
    );

    const select = component.find('select');
    const options = select.find('option');

    options.forEach((option) => {
      expect(option.prop('disabled')).toBeFalsy();
    });
  });

  it('has all options enabled given minDate in a past year', () => {
    const component = mount(
      <MonthSelect
        {...defaultProps}
        minDate={new Date(2017, 6, 1)}
        year="2018"
      />,
    );

    const select = component.find('select');
    const options = select.find('option[value]');

    options.forEach((option) => {
      expect(option.prop('disabled')).toBeFalsy();
    });
  });

  it('has first (month in minDate) options disabled given minDate in a current year', () => {
    const component = mount(
      <MonthSelect
        {...defaultProps}
        minDate={new Date(2018, 6, 1)}
        year="2018"
      />,
    );

    const select = component.find('select');
    const options = select.find('option').slice(1); // Getting rid of "--" option

    // January - June
    options.slice(0, 6).forEach((option) => {
      expect(option.prop('disabled')).toBeTruthy();
    });
    // July - December
    options.slice(6).forEach((option) => {
      expect(option.prop('disabled')).toBeFalsy();
    });
  });

  it('has all options enabled given maxDate in a future year', () => {
    const component = mount(
      <MonthSelect
        {...defaultProps}
        maxDate={new Date(2019, 6, 1)}
        year="2018"
      />,
    );

    const select = component.find('select');
    const options = select.find('option').slice(1); // Getting rid of "--" option

    options.forEach((option) => {
      expect(option.prop('disabled')).toBeFalsy();
    });
  });

  it('has last (month in maxDate) options disabled given maxDate in a current year', () => {
    const component = mount(
      <MonthSelect
        {...defaultProps}
        maxDate={new Date(2018, 6, 1)}
        year="2018"
      />,
    );

    const select = component.find('select');
    const options = select.find('option').slice(1); // Getting rid of "--" option

    // January - July
    options.slice(0, 7).forEach((option) => {
      expect(option.prop('disabled')).toBeFalsy();
    });
    // August - December
    options.slice(7).forEach((option) => {
      expect(option.prop('disabled')).toBeTruthy();
    });
  });
});
