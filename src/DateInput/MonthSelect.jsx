import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import { getMonth, getYear } from '../shared/dates';
import { formatMonth, formatShortMonth } from '../shared/dateFormatter';
import { isMaxDate, isMinDate } from '../shared/propTypes';
import { min, max } from '../shared/utils';

export default function MonthSelect({
  className,
  itemRef,
  locale,
  maxDate,
  minDate,
  monthAriaLabel,
  short,
  year,
  value,
  ...otherProps
}) {
  const maxMonth = min(12, maxDate && year === getYear(maxDate) && getMonth(maxDate));
  const minMonth = max(1, minDate && year === getYear(minDate) && getMonth(minDate));
  const dates = [...Array(12)].map((el, index) => new Date(2019, index, 1));
  const name = 'month';
  const formatter = short ? formatShortMonth : formatMonth;

  return (
    <select
      aria-label={monthAriaLabel}
      className={mergeClassNames(
        `${className}__input`,
        `${className}__month`,
      )}
      name={name}
      ref={(ref) => {
        if (itemRef) {
          itemRef(ref, name);
        }
      }}
      value={value !== null ? value : ''}
      {...otherProps}
    >
      {!value && (
        <option value="">
          --
        </option>
      )}
      {dates.map((date) => {
        const month = getMonth(date);
        const disabled = month < minMonth || month > maxMonth;

        return (
          <option
            key={month}
            disabled={disabled}
            value={month}
          >
            {formatter(locale, date)}
          </option>
        );
      })}
    </select>
  );
}

MonthSelect.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  minDate: isMinDate,
  monthAriaLabel: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  required: PropTypes.bool,
  short: PropTypes.bool,
  value: PropTypes.number,
  year: PropTypes.number,
};
