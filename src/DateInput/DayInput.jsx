import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import {
  getDay,
  getDaysInMonth,
  getMonth,
  getYear,
} from '../shared/dates';
import { isMaxDate, isMinDate } from '../shared/propTypes';
import { min, max, updateInputWidth } from '../shared/utils';

const select = element => element && element.select();

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
      className, disabled, itemRef, value, onChange, onKeyDown, required, showLeadingZeros,
    } = this.props;

    const name = 'day';
    const hasLeadingZero = showLeadingZeros && value !== null && value < 10;
    const setValue = (value !== null && value < 10) ? `0${value}` : value; // Add 0 inside input if value is less than 10
    return [
      (hasLeadingZero ? '' : null), // Don't add 0 out of input type
      <input
        key="day"
        className={mergeClassNames(
          `${className}__input`,
          `${className}__day`,
          hasLeadingZero && `${className}__input--hasLeadingZero`,
        )}
        disabled={disabled}
        name={name}
        max={maxDay}
        min={minDay}
        onChange={onChange}
        onFocus={event => select(event.target)}
        onKeyDown={onKeyDown}
        onKeyUp={event => updateInputWidth(event.target)}
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
        type="number"
        value={setValue !== null ? setValue : ''} // Set Final value with or without 0
      />,
    ];
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
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
  year: PropTypes.number,
};
