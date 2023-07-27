import React from 'react';
import { getYear, getMonthHuman, getDate, getDaysInMonth } from '@wojtekmaj/date-utils';

import Input from './Input.js';

import { safeMin, safeMax } from '../shared/utils.js';

type DayInputProps = {
  maxDate?: Date;
  minDate?: Date;
  month?: string | null;
  year?: string | null;
} & Omit<React.ComponentProps<typeof Input>, 'max' | 'min' | 'name'>;

export default function DayInput({ maxDate, minDate, month, year, ...otherProps }: DayInputProps) {
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

  return <Input max={maxDay} min={minDay} name="day" {...otherProps} />;
}
