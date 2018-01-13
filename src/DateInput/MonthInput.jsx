import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  getMonth,
  getYear,
} from '../shared/dates';
import { isMaxDate, isMinDate } from '../shared/propTypes';
import { min, max, updateInputWidth } from '../shared/utils';

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
      itemRef, value, onChange, onKeyDown, required, showLeadingZeros,
    } = this.props;

    const hasLeadingZero = showLeadingZeros && value !== null && value < 10;

    return [
      (hasLeadingZero ? '0' : null),
      <input
        key="month"
        className="react-date-picker__button__input__month"
        name="month"
        max={maxMonth}
        min={minMonth}
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
        type="number"
        required={required}
        value={value !== null ? value : ''}
      />,
    ];
  }
}

MonthInput.propTypes = {
  itemRef: PropTypes.func,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
  year: PropTypes.number,
};
