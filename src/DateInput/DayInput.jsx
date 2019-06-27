import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import {
  getDay,
  getDaysInMonth,
  getMonth,
  getYear,
} from '../shared/dates';
import { isMaxDate, isMinDate } from '../shared/propTypes';
import { min, max } from '../shared/utils';

export default function DayInput({
  dayAriaLabel,
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

  const maxDay = min(
    currentMonthMaxDays,
    maxDate && year === getYear(maxDate) && month === getMonth(maxDate) && getDay(maxDate),
  );

  const minDay = max(
    1, minDate && year === getYear(minDate) && month === getMonth(minDate) && getDay(minDate),
  );

  return (
    <Input
      name="day"
      ariaLabel={dayAriaLabel}
      max={maxDay}
      min={minDay}
      {...otherProps}
    />
  );
}

DayInput.propTypes = {
  className: PropTypes.string.isRequired,
  dayAriaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  maxDate: isMaxDate,
  minDate: isMinDate,
  month: PropTypes.number,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
  year: PropTypes.number,
};
