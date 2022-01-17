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
import { getYearOffset, safeMax, safeMin } from '../shared/utils';

export default function YearInput({
  locale,
  maxDate,
  minDate,
  placeholder = '----',
  value,
  valueType,
  ...otherProps
}) {
  const maxYear = safeMin(275760, maxDate && getYear(maxDate));
  const minYear = safeMax(1, minDate && getYear(minDate));

  const offset = getYearOffset(locale);

  const localizedMaxYear = maxYear + offset;
  const localizedMinYear = minYear + offset;
  const localizedValue = value !== null && value !== '' ? `${Number(value) + offset}` : null;

  const yearStep = (() => {
    if (valueType === 'century') {
      return 10;
    }

    return 1;
  })();

  return (
    <Input
      max={localizedMaxYear}
      min={localizedMinYear}
      name="year"
      placeholder={placeholder}
      step={yearStep}
      value={localizedValue}
      {...otherProps}
    />
  );
}

YearInput.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  inputRef: isRef,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  valueType: isValueType,
};
