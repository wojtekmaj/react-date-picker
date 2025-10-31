import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { createRef } from 'react';

import DayInput from './DayInput.js';

describe('DayInput', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof DayInput>;

  it('renders an input', async () => {
    await render(<DayInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toBeInTheDocument();
  });

  it('renders "0" given showLeadingZeros if day is <10', async () => {
    const { container } = await render(<DayInput {...defaultProps} showLeadingZeros value="9" />);

    const input = page.getByRole('spinbutton');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if day is <10 with leading zero already', async () => {
    const { container } = await render(<DayInput {...defaultProps} showLeadingZeros value="09" />);

    const input = page.getByRole('spinbutton');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if day is >=10', async () => {
    const { container } = await render(<DayInput {...defaultProps} showLeadingZeros value="10" />);

    const input = page.getByRole('spinbutton');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if not given showLeadingZeros', async () => {
    const { container } = await render(<DayInput {...defaultProps} value="9" />);

    const input = page.getByRole('spinbutton');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('applies given aria-label properly', async () => {
    const dayAriaLabel = 'Day';

    await render(<DayInput {...defaultProps} ariaLabel={dayAriaLabel} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('aria-label', dayAriaLabel);
  });

  it('applies given placeholder properly', async () => {
    const dayPlaceholder = 'dd';

    await render(<DayInput {...defaultProps} placeholder={dayPlaceholder} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('placeholder', dayPlaceholder);
  });

  it('has proper name defined', async () => {
    await render(<DayInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('name', 'day');
  });

  it('has proper className defined', async () => {
    const className = 'react-date-picker';

    await render(<DayInput {...defaultProps} className={className} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveClass('react-date-picker__input');
    expect(input).toHaveClass('react-date-picker__day');
  });

  it('displays given value properly', async () => {
    const value = '11';

    await render(<DayInput {...defaultProps} value={value} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveValue(Number(value));
  });

  it('does not disable input by default', async () => {
    await render(<DayInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', async () => {
    await render(<DayInput {...defaultProps} disabled />);

    const input = page.getByRole('spinbutton');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', async () => {
    await render(<DayInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', async () => {
    await render(<DayInput {...defaultProps} required />);

    const input = page.getByRole('spinbutton');

    expect(input).toBeRequired();
  });

  it('handles inputRef properly', async () => {
    const inputRef = createRef<HTMLInputElement>();

    await render(<DayInput {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has min = "1" by default', async () => {
    await render(<DayInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = "1" given minDate in a past month', async () => {
    await render(
      <DayInput {...defaultProps} minDate={new Date(2017, 11, 15)} month="1" year="2018" />,
    );

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = (day in minDate) given minDate in a current month', async () => {
    await render(
      <DayInput {...defaultProps} minDate={new Date(2018, 0, 15)} month="1" year="2018" />,
    );

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('min', '15');
  });

  it('has max = (number of days in current month) by default', async () => {
    const numberOfDaysInJanuary2018 = new Date(2018, 1, 0).getDate();

    await render(<DayInput {...defaultProps} month="1" year="2018" />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('max', `${numberOfDaysInJanuary2018}`);
  });

  it('has max = (number of days in current month) given maxDate in a future month', async () => {
    const numberOfDaysInJanuary2018 = new Date(2018, 1, 0).getDate();

    await render(
      <DayInput {...defaultProps} maxDate={new Date(2018, 1, 15)} month="1" year="2018" />,
    );

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('max', `${numberOfDaysInJanuary2018}`);
  });

  it('has max = (day in maxDate) given maxDate in a current month', async () => {
    await render(
      <DayInput {...defaultProps} maxDate={new Date(2018, 0, 15)} month="1" year="2018" />,
    );

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('max', '15');
  });
});
