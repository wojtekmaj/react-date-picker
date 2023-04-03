import React from 'react';
import PropTypes from 'prop-types';
import { getYear, getMonthHuman } from '@wojtekmaj/date-utils';

import Input from './Input';

import { isMaxDate, isMinDate, isRef } from '../shared/propTypes';
import { safeMin, safeMax } from '../shared/utils';

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

MonthInput.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  inputRef: isRef,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.string,
  year: PropTypes.string,
};
