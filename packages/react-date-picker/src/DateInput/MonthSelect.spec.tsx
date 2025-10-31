import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { createRef } from 'react';

import MonthSelect from './MonthSelect.js';

describe('MonthSelect', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof MonthSelect>;

  it('renders a select', async () => {
    await render(<MonthSelect {...defaultProps} />);

    const select = page.getByRole('combobox');
    expect(select).toBeInTheDocument();

    const options = select.getByRole('option');
    expect(options).toHaveLength(13); // 12 months + empty option
  });

  it('applies given aria-label properly', async () => {
    const monthAriaLabel = 'Month';

    await render(<MonthSelect {...defaultProps} ariaLabel={monthAriaLabel} />);

    const select = page.getByRole('combobox');

    expect(select).toHaveAttribute('aria-label', monthAriaLabel);
  });

  it('has proper placeholder by default', async () => {
    await render(<MonthSelect {...defaultProps} />);

    const options = page.getByRole('option');
    const firstOption = options.first();

    expect(firstOption).toHaveTextContent('--');
  });

  it('displays given placeholder properly', async () => {
    const monthPlaceholder = 'mm';

    await render(<MonthSelect {...defaultProps} placeholder={monthPlaceholder} />);

    const options = page.getByRole('option');
    const firstOption = options.first();

    expect(firstOption).toHaveTextContent(monthPlaceholder);
  });

  it('has proper name defined', async () => {
    await render(<MonthSelect {...defaultProps} />);

    const select = page.getByRole('combobox');

    expect(select).toHaveAttribute('name', 'month');
  });

  it('has proper className defined', async () => {
    const className = 'react-date-picker';

    await render(<MonthSelect {...defaultProps} className={className} />);

    const select = page.getByRole('combobox');

    expect(select).toHaveClass('react-date-picker__input');
    expect(select).toHaveClass('react-date-picker__month');
  });

  it('displays given value properly', async () => {
    const value = '11';

    await render(<MonthSelect {...defaultProps} value={value} />);

    const select = page.getByRole('combobox');

    expect(select).toHaveValue(value);
  });

  it('does not disable select by default', async () => {
    await render(<MonthSelect {...defaultProps} />);

    const select = page.getByRole('combobox');

    expect(select).not.toBeDisabled();
  });

  it('disables select given disabled flag', async () => {
    await render(<MonthSelect {...defaultProps} disabled />);

    const select = page.getByRole('combobox');

    expect(select).toBeDisabled();
  });

  it('is not required select by default', async () => {
    await render(<MonthSelect {...defaultProps} />);

    const select = page.getByRole('combobox');

    expect(select).not.toBeRequired();
  });

  it('required select given required flag', async () => {
    await render(<MonthSelect {...defaultProps} required />);

    const select = page.getByRole('combobox');

    expect(select).toBeRequired();
  });

  it('handles inputRef properly', async () => {
    const inputRef = createRef<HTMLSelectElement>();

    await render(<MonthSelect {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('has all options enabled by default', async () => {
    await render(<MonthSelect {...defaultProps} />);

    const select = page.getByRole('combobox');
    const options = select.getByRole('option').all();

    for (const option of options) {
      expect(option).not.toBeDisabled();
    }
  });

  it('has all options enabled given minDate in a past year', async () => {
    await render(<MonthSelect {...defaultProps} minDate={new Date(2017, 6, 1)} year="2018" />);

    const select = page.getByRole('combobox');
    const options = select.getByRole('option').all().slice(1); // Getting rid of "--" option

    for (const option of options) {
      expect(option).not.toBeDisabled();
    }
  });

  it('has first (month in minDate) options disabled given minDate in a current year', async () => {
    await render(<MonthSelect {...defaultProps} minDate={new Date(2018, 6, 1)} year="2018" />);

    const select = page.getByRole('combobox');
    const options = select.getByRole('option').all().slice(1); // Getting rid of "--" option

    // January - June
    for (const option of options.slice(0, 6)) {
      expect(option).toBeDisabled();
    }
    // July - December
    for (const option of options.slice(6)) {
      expect(option).not.toBeDisabled();
    }
  });

  it('has all options enabled given maxDate in a future year', async () => {
    await render(<MonthSelect {...defaultProps} maxDate={new Date(2019, 6, 1)} year="2018" />);

    const select = page.getByRole('combobox');
    const options = select.getByRole('option').all().slice(1); // Getting rid of "--" option

    for (const option of options) {
      expect(option).not.toBeDisabled();
    }
  });

  it('has last (month in maxDate) options disabled given maxDate in a current year', async () => {
    await render(<MonthSelect {...defaultProps} maxDate={new Date(2018, 6, 1)} year="2018" />);

    const select = page.getByRole('combobox');
    const options = select.getByRole('option').all().slice(1); // Getting rid of "--" option

    // January - July
    for (const option of options.slice(0, 7)) {
      expect(option).not.toBeDisabled();
    }
    // August - December
    for (const option of options.slice(7)) {
      expect(option).toBeDisabled();
    }
  });
});
