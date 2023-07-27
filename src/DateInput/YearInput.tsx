import React from 'react';
import { getYear } from '@wojtekmaj/date-utils';

import Input from './Input.js';

import { safeMax, safeMin } from '../shared/utils.js';

type YearInputProps = {
  maxDate?: Date;
  minDate?: Date;
  placeholder?: string;
  valueType?: 'century' | 'decade' | 'year' | 'month' | 'day';
} & Omit<React.ComponentProps<typeof Input>, 'max' | 'min' | 'name'>;

export default function YearInput({
  maxDate,
  minDate,
  placeholder = '----',
  valueType,
  ...otherProps
}: YearInputProps) {
  const maxYear = safeMin(275760, maxDate && getYear(maxDate));
  const minYear = safeMax(1, minDate && getYear(minDate));

  const yearStep = (() => {
    if (valueType === 'century') {
      return 10;
    }

    return 1;
  })();

  return (
    <Input
      max={maxYear}
      min={minYear}
      name="year"
      placeholder={placeholder}
      step={yearStep}
      {...otherProps}
    />
  );
}
