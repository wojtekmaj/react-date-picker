import { describe, expect, it } from 'vitest';
import React, { createRef } from 'react';
import { render } from '@testing-library/react';

import MonthSelect from './MonthSelect.js';

describe('MonthSelect', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof MonthSelect>;

  it('renders a select', () => {
    const { container } = render(<MonthSelect {...defaultProps} />);

    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select).toBeInTheDocument();

    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(13); // 12 months + empty option
  });

  it('applies given aria-label properly', () => {
    const monthAriaLabel = 'Month';

    const { container } = render(<MonthSelect {...defaultProps} ariaLabel={monthAriaLabel} />);

    const select = container.querySelector('select');

    expect(select).toHaveAttribute('aria-label', monthAriaLabel);
  });

  it('has proper placeholder by default', () => {
    const { container } = render(<MonthSelect {...defaultProps} />);

    const options = container.querySelectorAll('option');
    const firstOption = options[0];

    expect(firstOption).toHaveTextContent('--');
  });

  it('displays given placeholder properly', () => {
    const monthPlaceholder = 'mm';

    const { container } = render(<MonthSelect {...defaultProps} placeholder={monthPlaceholder} />);

    const options = container.querySelectorAll('option');
    const firstOption = options[0];

    expect(firstOption).toHaveTextContent(monthPlaceholder);
  });

  it('has proper name defined', () => {
    const { container } = render(<MonthSelect {...defaultProps} />);

    const select = container.querySelector('select');

    expect(select).toHaveAttribute('name', 'month');
  });

  it('has proper className defined', () => {
    const className = 'react-date-picker';

    const { container } = render(<MonthSelect {...defaultProps} className={className} />);

    const select = container.querySelector('select');

    expect(select).toHaveClass('react-date-picker__input');
    expect(select).toHaveClass('react-date-picker__month');
  });

  it('displays given value properly', () => {
    const value = '11';

    const { container } = render(<MonthSelect {...defaultProps} value={value} />);

    const select = container.querySelector('select');

    expect(select).toHaveValue(value);
  });

  it('does not disable select by default', () => {
    const { container } = render(<MonthSelect {...defaultProps} />);

    const select = container.querySelector('select');

    expect(select).not.toBeDisabled();
  });

  it('disables select given disabled flag', () => {
    const { container } = render(<MonthSelect {...defaultProps} disabled />);

    const select = container.querySelector('select');

    expect(select).toBeDisabled();
  });

  it('is not required select by default', () => {
    const { container } = render(<MonthSelect {...defaultProps} />);

    const select = container.querySelector('select');

    expect(select).not.toBeRequired();
  });

  it('required select given required flag', () => {
    const { container } = render(<MonthSelect {...defaultProps} required />);

    const select = container.querySelector('select');

    expect(select).toBeRequired();
  });

  it('handles inputRef properly', () => {
    const inputRef = createRef<HTMLSelectElement>();

    render(<MonthSelect {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('has all options enabled by default', () => {
    const { container } = render(<MonthSelect {...defaultProps} />);

    const select = container.querySelector('select') as HTMLSelectElement;
    const options = select.querySelectorAll('option');

    options.forEach((option) => {
      expect(option).not.toBeDisabled();
    });
  });

  it('has all options enabled given minDate in a past year', () => {
    const { container } = render(
      <MonthSelect {...defaultProps} minDate={new Date(2017, 6, 1)} year="2018" />,
    );

    const select = container.querySelector('select') as HTMLSelectElement;
    const options = select.querySelectorAll('option[value]');

    options.forEach((option) => {
      expect(option).not.toBeDisabled();
    });
  });

  it('has first (month in minDate) options disabled given minDate in a current year', () => {
    const { container } = render(
      <MonthSelect {...defaultProps} minDate={new Date(2018, 6, 1)} year="2018" />,
    );

    const select = container.querySelector('select') as HTMLSelectElement;
    const options = Array.from(select.querySelectorAll('option')).slice(1); // Getting rid of "--" option

    // January - June
    options.slice(0, 6).forEach((option) => {
      expect(option).toBeDisabled();
    });
    // July - December
    options.slice(6).forEach((option) => {
      expect(option).not.toBeDisabled();
    });
  });

  it('has all options enabled given maxDate in a future year', () => {
    const { container } = render(
      <MonthSelect {...defaultProps} maxDate={new Date(2019, 6, 1)} year="2018" />,
    );

    const select = container.querySelector('select') as HTMLSelectElement;
    const options = Array.from(select.querySelectorAll('option')).slice(1); // Getting rid of "--" option

    options.forEach((option) => {
      expect(option).not.toBeDisabled();
    });
  });

  it('has last (month in maxDate) options disabled given maxDate in a current year', () => {
    const { container } = render(
      <MonthSelect {...defaultProps} maxDate={new Date(2018, 6, 1)} year="2018" />,
    );

    const select = container.querySelector('select') as HTMLSelectElement;
    const options = Array.from(select.querySelectorAll('option')).slice(1); // Getting rid of "--" option

    // January - July
    options.slice(0, 7).forEach((option) => {
      expect(option).not.toBeDisabled();
    });
    // August - December
    options.slice(7).forEach((option) => {
      expect(option).toBeDisabled();
    });
  });
});
