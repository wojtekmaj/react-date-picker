import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import {
  getYear,
} from '../shared/dates';
import { isMaxDate, isMinDate, isValueType } from '../shared/propTypes';
import { max, updateInputWidth } from '../shared/utils';

export default class YearInput extends PureComponent {
  get maxYear() {
    const { maxDate } = this.props;
    return maxDate ? getYear(maxDate) : null;
  }

  get minYear() {
    const { minDate } = this.props;
    return max(1000, minDate && getYear(minDate));
  }

  get yearStep() {
    const { valueType } = this.props;

    if (valueType === 'century') {
      return 10;
    }
    return 1;
  }

  render() {
    const { maxYear, minYear, yearStep } = this;
    const {
      className, disabled, itemRef, value, onChange, onKeyDown, required,
    } = this.props;

    const name = 'year';

    return (
      <input
        className={mergeClassNames(
          `${className}__input`,
          `${className}__year`,
        )}
        disabled={disabled}
        name={name}
        max={maxYear}
        min={minYear}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="--"
        ref={(ref) => {
          if (ref) {
            updateInputWidth(ref);
          }

          if (itemRef) {
            itemRef(ref, name);
          }
        }}
        required={required}
        step={yearStep}
        type="number"
        value={value !== null ? value : ''}
      />
    );
  }
}

YearInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.number,
  valueType: isValueType,
};
