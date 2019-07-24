import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import { getMonth, getYear } from '../shared/dates';
import { isMaxDate, isMinDate } from '../shared/propTypes';
import { min, max } from '../shared/utils';

export default function MonthInput({
  maxDate,
  minDate,
  year,
  ...otherProps
}) {
  const maxMonth = min(12, maxDate && year === getYear(maxDate) && getMonth(maxDate));
  const minMonth = max(1, minDate && year === getYear(minDate) && getMonth(minDate));

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
