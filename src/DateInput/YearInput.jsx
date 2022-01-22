import React from 'react';
import PropTypes from 'prop-types';
import { getYear } from '@wojtekmaj/date-utils';

import Input from './Input';

import {
  isMaxDate,
  isMinDate,
  isRef,
  isValueType,
} from '../shared/propTypes';
import { safeMax, safeMin } from '../shared/utils';

export default function YearInput({
  maxDate,
  minDate,
  placeholder = '----',
  valueType,
  ...otherProps
}) {
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

YearInput.propTypes = {
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
  tabIndex: PropTypes.number,
  value: PropTypes.string,
  valueType: isValueType,
};
