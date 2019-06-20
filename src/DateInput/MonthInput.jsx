import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import { getMonth, getYear } from '../shared/dates';
import { isMaxDate, isMinDate } from '../shared/propTypes';
import { min, max } from '../shared/utils';

export default class MonthInput extends PureComponent {
  get maxMonth() {
    const { maxDate, year } = this.props;
    return min(12, maxDate && year === getYear(maxDate) && getMonth(maxDate));
  }

  get minMonth() {
    const { minDate, year } = this.props;
    return max(1, minDate && year === getYear(minDate) && getMonth(minDate));
  }

  render() {
    const { maxMonth, minMonth } = this;
    const {
      maxDate,
      minDate,
      monthAriaLabel,
      year,
      ...otherProps
    } = this.props;

    return (
      <Input
        name="month"
        ariaLabel={monthAriaLabel}
        max={maxMonth}
        min={minMonth}
        {...otherProps}
      />
    );
  }
}

MonthInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  maxDate: isMaxDate,
  minDate: isMinDate,
  monthAriaLabel: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
  year: PropTypes.number,
};
