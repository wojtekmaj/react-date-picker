import { describe, expect, it } from 'vitest';
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
    const { container } = await render(<MonthSelect {...defaultProps} />);

    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select).toBeInTheDocument();

    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(13); // 12 months + empty option
  });

  it('applies given aria-label properly', async () => {
    const monthAriaLabel = 'Month';

    const { container } = await render(
      <MonthSelect {...defaultProps} ariaLabel={monthAriaLabel} />,
    );

    const select = container.querySelector('select');

    expect(select).toHaveAttribute('aria-label', monthAriaLabel);
  });

  it('has proper placeholder by default', async () => {
    const { container } = await render(<MonthSelect {...defaultProps} />);

    const options = container.querySelectorAll('option');
    const firstOption = options[0];

    expect(firstOption).toHaveTextContent('--');
  });

  it('displays given placeholder properly', async () => {
    const monthPlaceholder = 'mm';

    const { container } = await render(
      <MonthSelect {...defaultProps} placeholder={monthPlaceholder} />,
    );

    const options = container.querySelectorAll('option');
    const firstOption = options[0];

    expect(firstOption).toHaveTextContent(monthPlaceholder);
  });

  it('has proper name defined', async () => {
    const { container } = await render(<MonthSelect {...defaultProps} />);

    const select = container.querySelector('select');

    expect(select).toHaveAttribute('name', 'month');
  });

  it('has proper className defined', async () => {
    const className = 'react-date-picker';

    const { container } = await render(<MonthSelect {...defaultProps} className={className} />);

    const select = container.querySelector('select');

    expect(select).toHaveClass('react-date-picker__input');
    expect(select).toHaveClass('react-date-picker__month');
  });

  it('displays given value properly', async () => {
    const value = '11';

    const { container } = await render(<MonthSelect {...defaultProps} value={value} />);

    const select = container.querySelector('select');

    expect(select).toHaveValue(value);
  });

  it('does not disable select by default', async () => {
    const { container } = await render(<MonthSelect {...defaultProps} />);

    const select = container.querySelector('select');

    expect(select).not.toBeDisabled();
  });

  it('disables select given disabled flag', async () => {
    const { container } = await render(<MonthSelect {...defaultProps} disabled />);

    const select = container.querySelector('select');

    expect(select).toBeDisabled();
  });

  it('is not required select by default', async () => {
    const { container } = await render(<MonthSelect {...defaultProps} />);

    const select = container.querySelector('select');

    expect(select).not.toBeRequired();
  });

  it('required select given required flag', async () => {
    const { container } = await render(<MonthSelect {...defaultProps} required />);

    const select = container.querySelector('select');

    expect(select).toBeRequired();
  });

  it('handles inputRef properly', async () => {
    const inputRef = createRef<HTMLSelectElement>();

    await render(<MonthSelect {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('has all options enabled by default', async () => {
    const { container } = await render(<MonthSelect {...defaultProps} />);

    const select = container.querySelector('select') as HTMLSelectElement;
    const options = Array.from(select.querySelectorAll('option'));

    for (const option of options) {
      expect(option).not.toBeDisabled();
    }
  });

  it('has all options enabled given minDate in a past year', async () => {
    const { container } = await render(
      <MonthSelect {...defaultProps} minDate={new Date(2017, 6, 1)} year="2018" />,
    );

    const select = container.querySelector('select') as HTMLSelectElement;
    const options = Array.from(select.querySelectorAll('option[value]'));

    for (const option of options) {
      expect(option).not.toBeDisabled();
    }
  });

  it('has first (month in minDate) options disabled given minDate in a current year', async () => {
    const { container } = await render(
      <MonthSelect {...defaultProps} minDate={new Date(2018, 6, 1)} year="2018" />,
    );

    const select = container.querySelector('select') as HTMLSelectElement;
    const options = Array.from(select.querySelectorAll('option')).slice(1); // Getting rid of "--" option

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
    const { container } = await render(
      <MonthSelect {...defaultProps} maxDate={new Date(2019, 6, 1)} year="2018" />,
    );

    const select = container.querySelector('select') as HTMLSelectElement;
    const options = Array.from(select.querySelectorAll('option')).slice(1); // Getting rid of "--" option

    for (const option of options) {
      expect(option).not.toBeDisabled();
    }
  });

  it('has last (month in maxDate) options disabled given maxDate in a current year', async () => {
    const { container } = await render(
      <MonthSelect {...defaultProps} maxDate={new Date(2018, 6, 1)} year="2018" />,
    );

    const select = container.querySelector('select') as HTMLSelectElement;
    const options = Array.from(select.querySelectorAll('option')).slice(1); // Getting rid of "--" option

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
