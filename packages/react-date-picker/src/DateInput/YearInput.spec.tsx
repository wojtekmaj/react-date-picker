import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { createRef } from 'react';

import YearInput from './YearInput.js';
import { page } from 'vitest/browser';

describe('YearInput', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof YearInput>;

  it('renders an input', async () => {
    await render(<YearInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toBeInTheDocument();
  });

  it('applies given aria-label properly', async () => {
    const yearAriaLabel = 'Year';

    await render(<YearInput {...defaultProps} ariaLabel={yearAriaLabel} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('aria-label', yearAriaLabel);
  });

  it('applies given placeholder properly', async () => {
    const yearPlaceholder = 'Year';

    await render(<YearInput {...defaultProps} placeholder={yearPlaceholder} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('placeholder', yearPlaceholder);
  });

  it('has proper name defined', async () => {
    await render(<YearInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('name', 'year');
  });

  it('has proper className defined', async () => {
    const className = 'react-date-picker';

    await render(<YearInput {...defaultProps} className={className} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveClass('react-date-picker__input');
    expect(input).toHaveClass('react-date-picker__year');
  });

  it('displays given value properly', async () => {
    const value = '2018';

    await render(<YearInput {...defaultProps} value={value} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveValue(Number(value));
  });

  it('does not disable input by default', async () => {
    await render(<YearInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', async () => {
    await render(<YearInput {...defaultProps} disabled />);

    const input = page.getByRole('spinbutton');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', async () => {
    await render(<YearInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', async () => {
    await render(<YearInput {...defaultProps} required />);

    const input = page.getByRole('spinbutton');

    expect(input).toBeRequired();
  });

  it('handles inputRef properly', async () => {
    const inputRef = createRef<HTMLInputElement>();

    await render(<YearInput {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has min = "1" by default', async () => {
    await render(<YearInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = (year in minDate) given minDate', async () => {
    await render(<YearInput {...defaultProps} minDate={new Date(2018, 6, 1)} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('min', '2018');
  });

  it('has max = "275760" by default', async () => {
    await render(<YearInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('max', '275760');
  });

  it('has max = (year in maxDate) given maxDate', async () => {
    await render(<YearInput {...defaultProps} maxDate={new Date(2018, 6, 1)} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('max', '2018');
  });
});
