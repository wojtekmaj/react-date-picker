import React from 'react';
import PropTypes from 'prop-types';
import { getYear, getISOLocalDate, getISOLocalMonth } from '@wojtekmaj/date-utils';

import { isMaxDate, isMinDate, isValueType } from '../shared/propTypes';

type NativeInputProps = {
  ariaLabel?: string;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  value?: Date | null;
  valueType: 'century' | 'decade' | 'year' | 'month' | 'day';
};

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
}: NativeInputProps) {
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
        throw new Error('Invalid valueType');
    }
  })();

  const nativeValueParser = (() => {
    switch (valueType) {
      case 'decade':
      case 'year':
        return getYear;
      case 'month':
        return getISOLocalMonth;
      case 'day':
        return getISOLocalDate;
      default:
        throw new Error('Invalid valueType');
    }
  })();

  function stopPropagation(event: React.FocusEvent<HTMLInputElement>) {
    event.stopPropagation();
  }

  return (
    <input
      aria-label={ariaLabel}
      disabled={disabled}
      hidden
      max={maxDate ? nativeValueParser(maxDate) : undefined}
      min={minDate ? nativeValueParser(minDate) : undefined}
      name={name}
      onChange={onChange}
      onFocus={stopPropagation}
      required={required}
      style={{
        visibility: 'hidden',
        position: 'absolute',
        zIndex: '-999',
      }}
      type={nativeInputType}
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
  value: PropTypes.instanceOf(Date),
  valueType: isValueType,
};
