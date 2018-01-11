import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  getDay,
  getDaysInMonth,
  getMonth,
  getYear,
} from '../shared/dates';
import { isMaxDate, isMinDate } from '../shared/propTypes';
import { min, max, updateInputWidth } from '../shared/utils';

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
      itemRef, value, onChange, onKeyDown, required,
    } = this.props;

    return (
      <input
        className="react-date-picker__button__input__day"
        name="day"
        max={maxDay}
        min={minDay}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="--"
        ref={(ref) => {
          if (!ref) return;

          updateInputWidth(ref);

          if (itemRef) {
            itemRef(ref);
          }
        }}
        required={required}
        type="number"
        value={value !== null ? value : ''}
      />
    );
  }
}

DayInput.propTypes = {
  itemRef: PropTypes.func,
  maxDate: isMaxDate,
  minDate: isMinDate,
  month: PropTypes.number,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.number,
  year: PropTypes.number,
};
