import React from 'react';
import PropTypes from 'prop-types';
import { getYear, getMonthHuman } from '@wojtekmaj/date-utils';

import Input from './Input';

import { isMaxDate, isMinDate, isRef } from '../shared/propTypes';
import { safeMin, safeMax } from '../shared/utils';

export default function MonthInput({
  maxDate,
  minDate,
  year,
  ...otherProps
}) {
  function isSameYear(date) {
    return date && year === getYear(date).toString();
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
  inputRef: isRef,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  tabIndex: PropTypes.number,
  value: PropTypes.string,
  year: PropTypes.string,
};
