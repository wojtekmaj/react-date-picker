import React from 'react';
import { shallow } from 'enzyme';

import NativeInput from '../NativeInput';

/* eslint-disable comma-dangle */

describe('NativeInput', () => {
  const defaultProps = {
    onChange: () => {},
    valueType: 'day',
  };

  it('renders an input', () => {
    const component = shallow(
      <NativeInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input).toHaveLength(1);
  });

  it('applies given aria-label properly', () => {
    const nativeInputAriaLabel = 'Date';

    const component = shallow(
      <NativeInput
        {...defaultProps}
        ariaLabel={nativeInputAriaLabel}
      />
    );

    const select = component.find('input');

    expect(select.prop('aria-label')).toBe(nativeInputAriaLabel);
  });

  it('has proper name defined', () => {
    const name = 'testName';

    const component = shallow(
      <NativeInput
        {...defaultProps}
        name={name}
      />
    );

    const input = component.find('input');

    expect(input.prop('name')).toBe(name);
  });

  /* eslint-disable indent */
  it.each`
    valueType   | parsedValue
    ${'day'}    | ${'2019-06-01'}
    ${'month'}  | ${'2019-06'}
    ${'year'}   | ${'2019'}
    ${'decade'} | ${'2019'}
  `('displays given value properly if valueType is $valueType',
  ({ valueType, parsedValue }) => {
    const value = new Date(2019, 5, 1);

    const component = shallow(
      <NativeInput
        {...defaultProps}
        value={value}
        valueType={valueType}
      />
    );

    const input = component.find('input');

    expect(input.prop('value').toString()).toBe(parsedValue);
  });
  /* eslint-enable indent */

  it('does not disable input by default', () => {
    const component = shallow(
      <NativeInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeFalsy();
  });

  it('disables input given disabled flag', () => {
    const component = shallow(
      <NativeInput
        {...defaultProps}
        disabled
      />
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeTruthy();
  });

  it('is not required input by default', () => {
    const component = shallow(
      <NativeInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('required')).toBeFalsy();
  });

  it('required input given required flag', () => {
    const component = shallow(
      <NativeInput
        {...defaultProps}
        required
      />
    );

    const input = component.find('input');

    expect(input.prop('required')).toBeTruthy();
  });

  it('has no min by default', () => {
    const component = shallow(
      <NativeInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBeFalsy();
  });

  it.each`
    valueType   | parsedMin
    ${'day'}    | ${'2019-01-01'}
    ${'month'}  | ${'2019-01'}
    ${'year'}   | ${'2019'}
    ${'decade'} | ${'2019'}
  `('has proper min for minDate which is a full year if valueType is $valueType',
  ({ valueType, parsedMin }) => {
    const component = shallow(
      <NativeInput
        {...defaultProps}
        minDate={new Date(2019, 0, 1)}
        valueType={valueType}
      />
    );

    const input = component.find('input');

    expect(input.prop('min').toString()).toBe(parsedMin);
  });

  it.each`
    valueType   | parsedMin
    ${'day'}    | ${'2019-06-01'}
    ${'month'}  | ${'2019-06'}
    ${'year'}   | ${'2019'}
    ${'decade'} | ${'2019'}
  `('has proper min for minDate which is not a full year if valueType is $valueType',
  ({ valueType, parsedMin }) => {
    const component = shallow(
      <NativeInput
        {...defaultProps}
        minDate={new Date(2019, 5, 1)}
        valueType={valueType}
      />
    );

    const input = component.find('input');

    expect(input.prop('min').toString()).toBe(parsedMin);
  });

  it('has no max by default', () => {
    const component = shallow(
      <NativeInput {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBeFalsy();
  });

  it.each`
    valueType   | parsedMax
    ${'day'}    | ${'2020-01-01'}
    ${'month'}  | ${'2020-01'}
    ${'year'}   | ${'2020'}
    ${'decade'} | ${'2020'}
  `('has proper max for maxDate which is a full year if valueType is $valueType',
  ({ valueType, parsedMax }) => {
    const component = shallow(
      <NativeInput
        {...defaultProps}
        maxDate={new Date(2020, 0, 1)}
        valueType={valueType}
      />
    );

    const input = component.find('input');

    expect(input.prop('max').toString()).toBe(parsedMax);
  });

  it.each`
    valueType   | parsedMax
    ${'day'}    | ${'2020-06-01'}
    ${'month'}  | ${'2020-06'}
    ${'year'}   | ${'2020'}
    ${'decade'} | ${'2020'}
  `('has proper max for maxDate which is not a full year if valueType is $valueType',
  ({ valueType, parsedMax }) => {
    const component = shallow(
      <NativeInput
        {...defaultProps}
        maxDate={new Date(2020, 5, 1)}
        valueType={valueType}
      />
    );

    const input = component.find('input');

    expect(input.prop('max').toString()).toBe(parsedMax);
  });
});
