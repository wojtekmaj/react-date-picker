import { describe, expect, it } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';

import NativeInput from './NativeInput';

describe('NativeInput', () => {
  const defaultProps = {
    onChange: () => {
      // Intentionally empty
    },
    valueType: 'day',
  } satisfies React.ComponentProps<typeof NativeInput>;

  it('renders an input', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
  });

  it('applies given aria-label properly', () => {
    const nativeInputAriaLabel = 'Date';

    const { container } = render(
      <NativeInput {...defaultProps} ariaLabel={nativeInputAriaLabel} />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('aria-label', nativeInputAriaLabel);
  });

  it('has proper name defined', () => {
    const name = 'testName';

    const { container } = render(<NativeInput {...defaultProps} name={name} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('name', name);
  });

  it.each`
    valueType   | parsedValue
    ${'day'}    | ${'2019-06-01'}
    ${'month'}  | ${'2019-06'}
    ${'year'}   | ${2019}
    ${'decade'} | ${2019}
  `('displays given value properly if valueType is $valueType', ({ valueType, parsedValue }) => {
    const value = new Date(2019, 5, 1);

    const { container } = render(
      <NativeInput {...defaultProps} value={value} valueType={valueType} />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveValue(parsedValue);
  });

  it('does not disable input by default', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', () => {
    const { container } = render(<NativeInput {...defaultProps} disabled />);

    const input = container.querySelector('input');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', () => {
    const { container } = render(<NativeInput {...defaultProps} required />);

    const input = container.querySelector('input');

    expect(input).toBeRequired();
  });

  it('has no min by default', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toHaveAttribute('min');
  });

  it.each`
    valueType   | parsedMin
    ${'day'}    | ${'2019-01-01'}
    ${'month'}  | ${'2019-01'}
    ${'year'}   | ${'2019'}
    ${'decade'} | ${'2019'}
  `(
    'has proper min for minDate which is a full year if valueType is $valueType',
    ({ valueType, parsedMin }) => {
      const { container } = render(
        <NativeInput {...defaultProps} minDate={new Date(2019, 0, 1)} valueType={valueType} />,
      );

      const input = container.querySelector('input');

      expect(input).toHaveAttribute('min', parsedMin);
    },
  );

  it.each`
    valueType   | parsedMin
    ${'day'}    | ${'2019-06-01'}
    ${'month'}  | ${'2019-06'}
    ${'year'}   | ${'2019'}
    ${'decade'} | ${'2019'}
  `(
    'has proper min for minDate which is not a full year if valueType is $valueType',
    ({ valueType, parsedMin }) => {
      const { container } = render(
        <NativeInput {...defaultProps} minDate={new Date(2019, 5, 1)} valueType={valueType} />,
      );

      const input = container.querySelector('input');

      expect(input).toHaveAttribute('min', parsedMin);
    },
  );

  it('has no max by default', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toHaveAttribute('max');
  });

  it.each`
    valueType   | parsedMax
    ${'day'}    | ${'2020-01-01'}
    ${'month'}  | ${'2020-01'}
    ${'year'}   | ${'2020'}
    ${'decade'} | ${'2020'}
  `(
    'has proper max for maxDate which is a full year if valueType is $valueType',
    ({ valueType, parsedMax }) => {
      const { container } = render(
        <NativeInput {...defaultProps} maxDate={new Date(2020, 0, 1)} valueType={valueType} />,
      );

      const input = container.querySelector('input');

      expect(input).toHaveAttribute('max', parsedMax);
    },
  );

  it.each`
    valueType   | parsedMax
    ${'day'}    | ${'2020-06-01'}
    ${'month'}  | ${'2020-06'}
    ${'year'}   | ${'2020'}
    ${'decade'} | ${'2020'}
  `(
    'has proper max for maxDate which is not a full year if valueType is $valueType',
    ({ valueType, parsedMax }) => {
      const { container } = render(
        <NativeInput {...defaultProps} maxDate={new Date(2020, 5, 1)} valueType={valueType} />,
      );

      const input = container.querySelector('input');

      expect(input).toHaveAttribute('max', parsedMax);
    },
  );
});
