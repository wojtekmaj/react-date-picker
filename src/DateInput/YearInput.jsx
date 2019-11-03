import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import { getYear } from '../shared/dates';
import { isMaxDate, isMinDate, isValueType } from '../shared/propTypes';
import { max, min } from '../shared/utils';

export default function YearInput({
  maxDate,
  minDate,
  placeholder = '----',
  valueType,
  ...otherProps
}) {
  const maxYear = min(275760, maxDate && getYear(maxDate));
  const minYear = max(1000, minDate && getYear(minDate));

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

YearInput.propTypes = {
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
  value: PropTypes.number,
  valueType: isValueType,
};
