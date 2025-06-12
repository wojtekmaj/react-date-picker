import { getYear, getMonthHuman, getDate, getDaysInMonth } from '@wojtekmaj/date-utils';

import Input from './Input.js';

import { safeMin, safeMax } from '../shared/utils.js';

type DayInputProps = {
  maxDate?: Date;
  minDate?: Date;
  month?: string | null;
  year?: string | null;
} & Omit<React.ComponentProps<typeof Input>, 'max' | 'min' | 'name'>;

export default function DayInput({
  maxDate,
  minDate,
  month,
  year,
  ...otherProps
}: DayInputProps): React.ReactElement {
  const { maxDay, minDay } = getMinMaxDays({ minDate, maxDate, month, year });

  return <Input max={maxDay} min={minDay} name="day" {...otherProps} />;
}

export function getMinMaxDays(args: DayInputProps): {
  maxDay: number;
  minDay: number;
} {
  const { minDate, maxDate, month, year } = args;

  const currentMonthMaxDays = (() => {
    if (!month) {
      return 31;
    }

    return getDaysInMonth(new Date(Number(year), Number(month) - 1, 1));
  })();

  function isSameMonth(date: Date) {
    return year === getYear(date).toString() && month === getMonthHuman(date).toString();
  }

  const maxDay = safeMin(currentMonthMaxDays, maxDate && isSameMonth(maxDate) && getDate(maxDate));
  const minDay = safeMax(1, minDate && isSameMonth(minDate) && getDate(minDate));

  return { maxDay, minDay };
}

export function checkDayInputValidity(inputProps: DayInputProps, dayValue?: string): boolean {
  const { minDay, maxDay } = getMinMaxDays(inputProps);
  // Create an in-memory input element
  const input = document.createElement('input');
  input.type = 'number';
  input.name = 'day';
  input.min = minDay.toString();
  input.max = maxDay.toString();
  input.required = true;
  input.value = dayValue || '';
  // The browser will now validate the value based on min/max/required
  return input.checkValidity();
}
