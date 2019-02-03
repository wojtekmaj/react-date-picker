import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import {
  getMonth,
  getYear,
} from '../shared/dates';
import { isMaxDate, isMinDate } from '../shared/propTypes';
import {
  min, max, select, updateInputWidth, appendInputValue,
} from '../shared/utils';

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
      className, disabled, itemRef, value, onChange, onKeyDown, required, showLeadingZeros,
    } = this.props;

    const name = 'month';
    const hasLeadingZero = showLeadingZeros && value !== null && value < 10;

    return [
      (hasLeadingZero && <span key="leadingZero" className={`${className}__leadingZero`}>0</span>),
      <input
        key="month"
        className={mergeClassNames(
          `${className}__input`,
          `${className}__month`,
          hasLeadingZero && `${className}__input--hasLeadingZero`,
        )}
        disabled={disabled}
        name={name}
        max={maxMonth}
        min={minMonth}
        onChange={onChange}
        onFocus={event => select(event.target)}
        onKeyDown={onKeyDown}
        onKeyUp={event => appendInputValue(event, onChange)}
        placeholder="--"
        ref={(ref) => {
          if (ref) {
            updateInputWidth(ref);
          }

          if (itemRef) {
            itemRef(ref, name);
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
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
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
