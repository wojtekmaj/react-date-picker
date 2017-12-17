import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  getMonth,
  getYear,
} from '../shared/dates';
import { isDetail, isMaxDate, isMinDate } from '../shared/propTypes';
import { min, max, updateInputWidth } from '../shared/utils';

const allViews = ['century', 'decade', 'year', 'month'];

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
    const { maxDetail } = this.props;

    // Do not display if maxDetail is "decade" or less
    if (allViews.indexOf(maxDetail) < 2) {
      return null;
    }

    const { maxMonth, minMonth } = this;
    const {
      itemRef, value, onChange, onKeyDown, required,
    } = this.props;

    return (
      <input
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
      />
    );
  }
}

MonthInput.propTypes = {
  itemRef: PropTypes.func,
  maxDate: isMaxDate,
  maxDetail: isDetail.isRequired,
  minDate: isMinDate,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.number,
  year: PropTypes.number,
};
