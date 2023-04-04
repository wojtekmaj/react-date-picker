import { describe, expect, it } from 'vitest';
import React, { createRef } from 'react';
import { render } from '@testing-library/react';

import YearInput from './YearInput';

describe('YearInput', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof YearInput>;

  it('renders an input', () => {
    const { container } = render(<YearInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
  });

  it('applies given aria-label properly', () => {
    const yearAriaLabel = 'Year';

    const { container } = render(<YearInput {...defaultProps} ariaLabel={yearAriaLabel} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('aria-label', yearAriaLabel);
  });

  it('applies given placeholder properly', () => {
    const yearPlaceholder = 'Year';

    const { container } = render(<YearInput {...defaultProps} placeholder={yearPlaceholder} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('placeholder', yearPlaceholder);
  });

  it('has proper name defined', () => {
    const { container } = render(<YearInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('name', 'year');
  });

  it('has proper className defined', () => {
    const className = 'react-date-picker';

    const { container } = render(<YearInput {...defaultProps} className={className} />);

    const input = container.querySelector('input');

    expect(input).toHaveClass('react-date-picker__input');
    expect(input).toHaveClass('react-date-picker__year');
  });

  it('displays given value properly', () => {
    const value = '2018';

    const { container } = render(<YearInput {...defaultProps} value={value} />);

    const input = container.querySelector('input');

    expect(input).toHaveValue(Number(value));
  });

  it('does not disable input by default', () => {
    const { container } = render(<YearInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', () => {
    const { container } = render(<YearInput {...defaultProps} disabled />);

    const input = container.querySelector('input');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', () => {
    const { container } = render(<YearInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', () => {
    const { container } = render(<YearInput {...defaultProps} required />);

    const input = container.querySelector('input');

    expect(input).toBeRequired();
  });

  it('handles inputRef properly', () => {
    const inputRef = createRef<HTMLInputElement>();

    render(<YearInput {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has min = "1" by default', () => {
    const { container } = render(<YearInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = (year in minDate) given minDate', () => {
    const { container } = render(<YearInput {...defaultProps} minDate={new Date(2018, 6, 1)} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '2018');
  });

  it('has max = "275760" by default', () => {
    const { container } = render(<YearInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '275760');
  });

  it('has max = (year in maxDate) given maxDate', () => {
    const { container } = render(<YearInput {...defaultProps} maxDate={new Date(2018, 6, 1)} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '2018');
  });
});
