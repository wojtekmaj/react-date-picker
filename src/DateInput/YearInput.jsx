import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import { getYear } from '../shared/dates';
import { isMaxDate, isMinDate, isValueType } from '../shared/propTypes';
import { max, min } from '../shared/utils';

export default function YearInput({
  maxDate,
  minDate,
  valueType,
  yearAriaLabel,
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
      name="year"
      ariaLabel={yearAriaLabel}
      max={maxYear}
      min={minYear}
      step={yearStep}
      {...otherProps}
    />
  );
}

YearInput.propTypes = {
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
  yearAriaLabel: PropTypes.string,
};

YearInput.defaultProps = {
  placeholder: '----',
};
