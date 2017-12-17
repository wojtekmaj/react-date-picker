import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  getISOLocalDate,
  getISOLocalMonth,
  getYear,
} from '../shared/dates';
import { isMaxDate, isMinDate, isValueType } from '../shared/propTypes';

export default class NativeInput extends PureComponent {
  get nativeInputType() {
    switch (this.props.valueType) {
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
  }

  get nativeValueParser() {
    switch (this.props.valueType) {
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
  }

  stopPropagation = event => event.stopPropagation()

  render() {
    const { nativeValueParser } = this;

    const {
      maxDate, minDate, onChange, required, value,
    } = this.props;

    return (
      <input
        type={this.nativeInputType}
        max={maxDate ? nativeValueParser(maxDate) : null}
        min={minDate ? nativeValueParser(minDate) : null}
        name="date"
        onChange={onChange}
        onFocus={this.stopPropagation}
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
}

NativeInput.propTypes = {
  maxDate: isMaxDate,
  minDate: isMinDate,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  valueType: isValueType,
};
