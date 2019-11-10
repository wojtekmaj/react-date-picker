import React from 'react';
import PropTypes from 'prop-types';
import {
  getYear,
  getMonthHuman,
  getDate,
  getDaysInMonth,
} from '@wojtekmaj/date-utils';

import Input from './Input';

import { isMaxDate, isMinDate } from '../shared/propTypes';
import { min, max } from '../shared/utils';

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

  const maxDay = min(
    currentMonthMaxDays,
    maxDate && year === getYear(maxDate) && month === getMonthHuman(maxDate) && getDate(maxDate),
  );

  const minDay = max(
    1, minDate && year === getYear(minDate) && month === getMonthHuman(minDate) && getDate(minDate),
  );

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
  itemRef: PropTypes.func,
  maxDate: isMaxDate,
  minDate: isMinDate,
  month: PropTypes.number,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
  year: PropTypes.number,
};
