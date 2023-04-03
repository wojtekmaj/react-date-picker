import { describe, expect, it } from 'vitest';
import React, { createRef } from 'react';
import { render } from '@testing-library/react';

import MonthInput from './MonthInput';

describe('MonthInput', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof MonthInput>;

  it('renders an input', () => {
    const { container } = render(<MonthInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
  });

  it('renders "0" given showLeadingZeros if month is <10', () => {
    const { container } = render(<MonthInput {...defaultProps} showLeadingZeros value="9" />);

    const input = container.querySelector('input');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if month is <10 with leading zero already', () => {
    const { container } = render(<MonthInput {...defaultProps} showLeadingZeros value="09" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if month is >=10', () => {
    const { container } = render(<MonthInput {...defaultProps} showLeadingZeros value="10" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if not given showLeadingZeros', () => {
    const { container } = render(<MonthInput {...defaultProps} value="9" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('applies given aria-label properly', () => {
    const monthAriaLabel = 'Month';

    const { container } = render(<MonthInput {...defaultProps} ariaLabel={monthAriaLabel} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('aria-label', monthAriaLabel);
  });

  it('applies given placeholder properly', () => {
    const monthPlaceholder = 'mm';

    const { container } = render(<MonthInput {...defaultProps} placeholder={monthPlaceholder} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('placeholder', monthPlaceholder);
  });

  it('has proper name defined', () => {
    const { container } = render(<MonthInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('name', 'month');
  });

  it('has proper className defined', () => {
    const className = 'react-date-picker';

    const { container } = render(<MonthInput {...defaultProps} className={className} />);

    const input = container.querySelector('input');

    expect(input).toHaveClass('react-date-picker__input');
    expect(input).toHaveClass('react-date-picker__month');
  });

  it('displays given value properly', () => {
    const value = '11';

    const { container } = render(<MonthInput {...defaultProps} value={value} />);

    const input = container.querySelector('input');

    expect(input).toHaveValue(Number(value));
  });

  it('does not disable input by default', () => {
    const { container } = render(<MonthInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', () => {
    const { container } = render(<MonthInput {...defaultProps} disabled />);

    const input = container.querySelector('input');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', () => {
    const { container } = render(<MonthInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', () => {
    const { container } = render(<MonthInput {...defaultProps} required />);

    const input = container.querySelector('input');

    expect(input).toBeRequired();
  });

  it('handles inputRef properly', () => {
    const inputRef = createRef<HTMLInputElement>();

    render(<MonthInput {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has min = "1" by default', () => {
    const { container } = render(<MonthInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = "1" given minDate in a past year', () => {
    const { container } = render(
      <MonthInput {...defaultProps} minDate={new Date(2017, 6, 1)} year="2018" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = (month in minDate) given minDate in a current year', () => {
    const { container } = render(
      <MonthInput {...defaultProps} minDate={new Date(2018, 6, 1)} year="2018" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '7');
  });

  it('has max = "12" by default', () => {
    const { container } = render(<MonthInput {...defaultProps} year="2018" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '12');
  });

  it('has max = "12" given maxDate in a future year', () => {
    const { container } = render(
      <MonthInput {...defaultProps} maxDate={new Date(2019, 6, 1)} year="2018" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '12');
  });

  it('has max = (month in maxDate) given maxDate in a current year', () => {
    const { container } = render(
      <MonthInput {...defaultProps} maxDate={new Date(2018, 6, 1)} year="2018" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '7');
  });
});
