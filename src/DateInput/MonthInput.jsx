import React from 'react';
import PropTypes from 'prop-types';
import { getYear, getMonthHuman } from '@wojtekmaj/date-utils';

import Input from './Input';

import { isMaxDate, isMinDate } from '../shared/propTypes';
import { safeMin, safeMax } from '../shared/utils';

export default function MonthInput({
  maxDate,
  minDate,
  year,
  ...otherProps
}) {
  function isSameYear(date) {
    return date && year === getYear(date);
  }

  const maxMonth = safeMin(12, isSameYear(maxDate) && getMonthHuman(maxDate));
  const minMonth = safeMax(1, isSameYear(minDate) && getMonthHuman(minDate));

  return (
    <Input
      max={maxMonth}
      min={minMonth}
      name="month"
      {...otherProps}
    />
  );
}

MonthInput.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
  year: PropTypes.number,
};
