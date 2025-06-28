import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render } from '@testing-library/react';

import DayInput, { checkDayInputValidity, getMinMaxDays } from './DayInput.js';

describe('DayInput', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof DayInput>;

  it('renders an input', () => {
    const { container } = render(<DayInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
  });

  it('renders "0" given showLeadingZeros if day is <10', () => {
    const { container } = render(<DayInput {...defaultProps} showLeadingZeros value="9" />);

    const input = container.querySelector('input');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if day is <10 with leading zero already', () => {
    const { container } = render(<DayInput {...defaultProps} showLeadingZeros value="09" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if day is >=10', () => {
    const { container } = render(<DayInput {...defaultProps} showLeadingZeros value="10" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if not given showLeadingZeros', () => {
    const { container } = render(<DayInput {...defaultProps} value="9" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('applies given aria-label properly', () => {
    const dayAriaLabel = 'Day';

    const { container } = render(<DayInput {...defaultProps} ariaLabel={dayAriaLabel} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('aria-label', dayAriaLabel);
  });

  it('applies given placeholder properly', () => {
    const dayPlaceholder = 'dd';

    const { container } = render(<DayInput {...defaultProps} placeholder={dayPlaceholder} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('placeholder', dayPlaceholder);
  });

  it('has proper name defined', () => {
    const { container } = render(<DayInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('name', 'day');
  });

  it('has proper className defined', () => {
    const className = 'react-date-picker';

    const { container } = render(<DayInput {...defaultProps} className={className} />);

    const input = container.querySelector('input');

    expect(input).toHaveClass('react-date-picker__input');
    expect(input).toHaveClass('react-date-picker__day');
  });

  it('displays given value properly', () => {
    const value = '11';

    const { container } = render(<DayInput {...defaultProps} value={value} />);

    const input = container.querySelector('input');

    expect(input).toHaveValue(Number(value));
  });

  it('does not disable input by default', () => {
    const { container } = render(<DayInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', () => {
    const { container } = render(<DayInput {...defaultProps} disabled />);

    const input = container.querySelector('input');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', () => {
    const { container } = render(<DayInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', () => {
    const { container } = render(<DayInput {...defaultProps} required />);

    const input = container.querySelector('input');

    expect(input).toBeRequired();
  });

  it('handles inputRef properly', () => {
    const inputRef = createRef<HTMLInputElement>();

    render(<DayInput {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has min = "1" by default', () => {
    const { container } = render(<DayInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = "1" given minDate in a past month', () => {
    const { container } = render(
      <DayInput {...defaultProps} minDate={new Date(2017, 11, 15)} month="1" year="2018" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = (day in minDate) given minDate in a current month', () => {
    const { container } = render(
      <DayInput {...defaultProps} minDate={new Date(2018, 0, 15)} month="1" year="2018" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '15');
  });

  it('has max = (number of days in current month) by default', () => {
    const numberOfDaysInJanuary2018 = new Date(2018, 1, 0).getDate();

    const { container } = render(<DayInput {...defaultProps} month="1" year="2018" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', `${numberOfDaysInJanuary2018}`);
  });

  it('has max = (number of days in current month) given maxDate in a future month', () => {
    const numberOfDaysInJanuary2018 = new Date(2018, 1, 0).getDate();

    const { container } = render(
      <DayInput {...defaultProps} maxDate={new Date(2018, 1, 15)} month="1" year="2018" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', `${numberOfDaysInJanuary2018}`);
  });

  it('has max = (day in maxDate) given maxDate in a current month', () => {
    const { container } = render(
      <DayInput {...defaultProps} maxDate={new Date(2018, 0, 15)} month="1" year="2018" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '15');
  });
});

describe('getMinMaxDays', () => {
  it('returns 1-31 by default', () => {
    const result = getMinMaxDays({});
    expect(result).toEqual({ minDay: 1, maxDay: 31 });
  });

  it('returns 1-29 given month is 2 and year is a leap year', () => {
    const result = getMinMaxDays({ month: '2', year: '2020' });
    expect(result).toEqual({ minDay: 1, maxDay: 29 });
  });

  it('returns 1-28 given month is 2 and year is not a leap year', () => {
    const result = getMinMaxDays({ month: '2', year: '2021' });
    expect(result).toEqual({ minDay: 1, maxDay: 28 });
  });

  it('returns 1-31 for january', () => {
    const result = getMinMaxDays({ month: '1', year: '2021' });
    expect(result).toEqual({ minDay: 1, maxDay: 31 });
  });

  it('returns 1-30 for november', () => {
    const result = getMinMaxDays({ month: '11', year: '2021' });
    expect(result).toEqual({ minDay: 1, maxDay: 30 });
  });

  it('returns minDay 15 if the given minDate fall on the same month and has a day value of 15', () => {
    const result = getMinMaxDays({ minDate: new Date(2021, 10, 15), month: '11', year: '2021' });
    expect(result).toEqual({ minDay: 15, maxDay: 30 });
  });

  it('returns maxDay 15 if the given maxDate fall on the same month and has a day value of 15', () => {
    const result = getMinMaxDays({ maxDate: new Date(2021, 10, 15), month: '11', year: '2021' });
    expect(result).toEqual({ minDay: 1, maxDay: 15 });
  });
});

describe('checkDayInputValidity', () => {
  const testCases = [
    {
      month: '1',
      year: '2024',
      dayValue: '1',
      expectedValidity: true,
    },

    {
      month: '2',
      year: '2023',
      dayValue: '29',
      expectedValidity: false,
    },
    {
      month: '2',
      year: '2024',
      dayValue: '29',
      expectedValidity: true,
    },
    {
      month: '2',
      year: '2024',
      dayValue: '30',
      expectedValidity: false,
    },
    {
      dayValue: '32',
      expectedValidity: false,
    },
    {
      dayValue: '31',
      expectedValidity: true,
    },
  ];

  testCases.forEach((testCase) => {
    it(`returns ${testCase.expectedValidity} for day ${testCase.dayValue} in month ${testCase.month} and year ${testCase.year}`, () => {
      const result = checkDayInputValidity(
        {
          month: testCase.month,
          year: testCase.year,
        },
        testCase.dayValue,
      );
      expect(result).toBe(testCase.expectedValidity);
    });
  });
});
