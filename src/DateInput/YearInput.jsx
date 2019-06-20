import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import { getYear } from '../shared/dates';
import { isMaxDate, isMinDate, isValueType } from '../shared/propTypes';
import { max, min } from '../shared/utils';

export default class YearInput extends PureComponent {
  get maxYear() {
    const { maxDate } = this.props;
    return min(275760, maxDate && getYear(maxDate));
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
      maxDate,
      minDate,
      valueType,
      yearAriaLabel,
      ...otherProps
    } = this.props;

    return (
      <Input
        name="year"
        ariaLabel={yearAriaLabel}
        max={maxYear}
        min={minYear}
        placeholder="----"
        step={yearStep}
        {...otherProps}
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
  onKeyUp: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.number,
  valueType: isValueType,
  yearAriaLabel: PropTypes.string,
};
