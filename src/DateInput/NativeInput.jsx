import React from 'react';
import PropTypes from 'prop-types';
import {
  getYear,
  getISOLocalDate,
  getISOLocalMonth,
} from '@wojtekmaj/date-utils';

import { isMaxDate, isMinDate, isValueType } from '../shared/propTypes';

const nativeInputType = (valueType) => {
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
};

const nativeValueParser = (valueType) => {
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
};

export default function NativeInput({
  ariaLabel,
  customInput = () => <input />,
  customInputStyle = {},
  customInputOverrides = [],
  disabled,
  maxDate,
  minDate,
  name,
  onChange,
  required,
  value,
  valueType,
}) {

  function stopPropagation(event) {
    event.stopPropagation();
  }

  const inputStyle = {
    visibility: 'hidden',
    position: 'absolute',
    top: '-9999px',
    left: '-9999px',
    ...customInputStyle,
  };

  const inputProps = {
    'aria-label': ariaLabel,
    disabled,
    max: maxDate ? nativeValueParser(maxDate) : null,
    min: minDate ? nativeValueParser(minDate) : null,
    name,
    onChange,
    onFocus: stopPropagation,
    required,
    type: nativeInputType(valueType),
    value: value ? nativeValueParser(valueType)(value) : '',
  };

  const filteredInputProps = Object.keys(inputProps)
    .reduce((obj, key) => customInputOverrides && customInputOverrides.includes(key)
      ? { ...obj }
      : { ...obj, [key]: inputProps[key] },
    {});

  const InputComponent = customInput;

  return <InputComponent {...filteredInputProps} style={inputStyle} />;
}

NativeInput.propTypes = {
  ariaLabel: PropTypes.string,
  customInput: PropTypes.func,
  customInputOverrides: PropTypes.arrayOf(PropTypes.string),
  customInputStyle: PropTypes.objectOf(PropTypes.any),
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
