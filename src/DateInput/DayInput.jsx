import React from 'react';
import PropTypes from 'prop-types';
import {
  getYear,
  getMonthHuman,
  getDate,
  getDaysInMonth,
} from '@wojtekmaj/date-utils';

import Input from './Input';

import { isMaxDate, isMinDate, isRef } from '../shared/propTypes';
import { safeMin, safeMax } from '../shared/utils';

export default function DayInput({
  maxDate,
  minDate,
  month,
  year,
  ...otherProps
}) {
  const currentMonthMaxDays = (() => {
    if (!month) {
      return 31;
    }

    return getDaysInMonth(new Date(year, month - 1, 1));
  })();

  function isSameMonth(date) {
    return date && year === getYear(date).toString() && month === getMonthHuman(date).toString();
  }

  const maxDay = safeMin(currentMonthMaxDays, isSameMonth(maxDate) && getDate(maxDate));
  const minDay = safeMax(1, isSameMonth(minDate) && getDate(minDate));

  return (
    <Input
      max={maxDay}
      min={minDay}
      name="day"
      {...otherProps}
    />
  );
}

DayInput.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  inputRef: isRef,
  maxDate: isMaxDate,
  minDate: isMinDate,
  month: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.string,
  year: PropTypes.string,
};
