import { getYear, getMonthHuman } from '@wojtekmaj/date-utils';

import Input from './Input.js';

import { safeMin, safeMax } from '../shared/utils.js';

type MonthInputProps = {
  maxDate?: Date;
  minDate?: Date;
  year?: string | null;
} & Omit<React.ComponentProps<typeof Input>, 'max' | 'min' | 'name'>;

export default function MonthInput({ maxDate, minDate, year, ...otherProps }: MonthInputProps) {
  function isSameYear(date: Date) {
    return date && year === getYear(date).toString();
  }

  const maxMonth = safeMin(12, maxDate && isSameYear(maxDate) && getMonthHuman(maxDate));
  const minMonth = safeMax(1, minDate && isSameYear(minDate) && getMonthHuman(minDate));

  return <Input max={maxMonth} min={minMonth} name="month" {...otherProps} />;
}
