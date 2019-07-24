import React from 'react';
import PropTypes from 'prop-types';

import {
  getISOLocalDate,
  getISOLocalMonth,
  getYear,
} from '../shared/dates';
import { isMaxDate, isMinDate, isValueType } from '../shared/propTypes';

export default function NativeInput({
  ariaLabel,
  disabled,
  maxDate,
  minDate,
  name,
  onChange,
  required,
  value,
  valueType,
}) {
  const nativeInputType = (() => {
    switch (valueType) {
      case 'decade':
      case 'year':
        return 'number';
      case 'month':
        return 'month';
      case 'day':
        return 'date';
      default:
        throw new Error('Invalid valueType.');
    }
  })();

  const nativeValueParser = (() => {
    switch (valueType) {
      case 'century':
      case 'decade':
      case 'year':
        return getYear;
      case 'month':
        return getISOLocalMonth;
      case 'day':
        return getISOLocalDate;
      default:
        throw new Error('Invalid valueType.');
    }
  })();

  function stopPropagation(event) {
    event.stopPropagation();
  }

  return (
    <input
      type={nativeInputType}
      aria-label={ariaLabel}
      disabled={disabled}
      max={maxDate ? nativeValueParser(maxDate) : null}
      min={minDate ? nativeValueParser(minDate) : null}
      name={name}
      onChange={onChange}
      onFocus={stopPropagation}
      required={required}
      style={{
        visibility: 'hidden',
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
      }}
      value={value ? nativeValueParser(value) : ''}
    />
  );
}

NativeInput.propTypes = {
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  maxDate: isMaxDate,
  minDate: isMinDate,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  valueType: isValueType,
};
