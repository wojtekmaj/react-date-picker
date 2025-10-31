import { describe, expect, it } from 'vitest';
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
    const { container } = await render(<DayInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
  });

  it('renders "0" given showLeadingZeros if day is <10', async () => {
    const { container } = await render(<DayInput {...defaultProps} showLeadingZeros value="9" />);

    const input = container.querySelector('input');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if day is <10 with leading zero already', async () => {
    const { container } = await render(<DayInput {...defaultProps} showLeadingZeros value="09" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if day is >=10', async () => {
    const { container } = await render(<DayInput {...defaultProps} showLeadingZeros value="10" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if not given showLeadingZeros', async () => {
    const { container } = await render(<DayInput {...defaultProps} value="9" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('applies given aria-label properly', async () => {
    const dayAriaLabel = 'Day';

    const { container } = await render(<DayInput {...defaultProps} ariaLabel={dayAriaLabel} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('aria-label', dayAriaLabel);
  });

  it('applies given placeholder properly', async () => {
    const dayPlaceholder = 'dd';

    const { container } = await render(<DayInput {...defaultProps} placeholder={dayPlaceholder} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('placeholder', dayPlaceholder);
  });

  it('has proper name defined', async () => {
    const { container } = await render(<DayInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('name', 'day');
  });

  it('has proper className defined', async () => {
    const className = 'react-date-picker';

    const { container } = await render(<DayInput {...defaultProps} className={className} />);

    const input = container.querySelector('input');

    expect(input).toHaveClass('react-date-picker__input');
    expect(input).toHaveClass('react-date-picker__day');
  });

  it('displays given value properly', async () => {
    const value = '11';

    const { container } = await render(<DayInput {...defaultProps} value={value} />);

    const input = container.querySelector('input');

    expect(input).toHaveValue(Number(value));
  });

  it('does not disable input by default', async () => {
    const { container } = await render(<DayInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', async () => {
    const { container } = await render(<DayInput {...defaultProps} disabled />);

    const input = container.querySelector('input');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', async () => {
    const { container } = await render(<DayInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', async () => {
    const { container } = await render(<DayInput {...defaultProps} required />);

    const input = container.querySelector('input');

    expect(input).toBeRequired();
  });

  it('handles inputRef properly', async () => {
    const inputRef = createRef<HTMLInputElement>();

    await render(<DayInput {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has min = "1" by default', async () => {
    const { container } = await render(<DayInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = "1" given minDate in a past month', async () => {
    const { container } = await render(
      <DayInput {...defaultProps} minDate={new Date(2017, 11, 15)} month="1" year="2018" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = (day in minDate) given minDate in a current month', async () => {
    const { container } = await render(
      <DayInput {...defaultProps} minDate={new Date(2018, 0, 15)} month="1" year="2018" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '15');
  });

  it('has max = (number of days in current month) by default', async () => {
    const numberOfDaysInJanuary2018 = new Date(2018, 1, 0).getDate();

    const { container } = await render(<DayInput {...defaultProps} month="1" year="2018" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', `${numberOfDaysInJanuary2018}`);
  });

  it('has max = (number of days in current month) given maxDate in a future month', async () => {
    const numberOfDaysInJanuary2018 = new Date(2018, 1, 0).getDate();

    const { container } = await render(
      <DayInput {...defaultProps} maxDate={new Date(2018, 1, 15)} month="1" year="2018" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', `${numberOfDaysInJanuary2018}`);
  });

  it('has max = (day in maxDate) given maxDate in a current month', async () => {
    const { container } = await render(
      <DayInput {...defaultProps} maxDate={new Date(2018, 0, 15)} month="1" year="2018" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '15');
  });
});
