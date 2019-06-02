import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import {
  getDay,
  getDaysInMonth,
  getMonth,
  getYear,
} from '../shared/dates';
import { isMaxDate, isMinDate } from '../shared/propTypes';
import { min, max } from '../shared/utils';

export default class DayInput extends PureComponent {
  get currentMonthMaxDays() {
    const { year, month } = this.props;

    if (!month) {
      return 31;
    }

    return getDaysInMonth(new Date(year, month - 1, 1));
  }

  get maxDay() {
    const { maxDate, month, year } = this.props;
    return min(
      this.currentMonthMaxDays,
      maxDate && year === getYear(maxDate) && month === getMonth(maxDate) && getDay(maxDate),
    );
  }

  get minDay() {
    const { minDate, month, year } = this.props;
    return max(
      1, minDate && year === getYear(minDate) && month === getMonth(minDate) && getDay(minDate),
    );
  }

  render() {
    const { maxDay, minDay } = this;
    const {
      maxDate,
      minDate,
      month,
      year,
      ...otherProps
    } = this.props;

    return (
      <Input
        name="day"
        max={maxDay}
        min={minDay}
        {...otherProps}
      />
    );
  }
}

DayInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  maxDate: isMaxDate,
  minDate: isMinDate,
  month: PropTypes.number,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
  year: PropTypes.number,
};
