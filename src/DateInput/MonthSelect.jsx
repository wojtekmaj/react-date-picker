import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';
import { getYear, getMonthHuman } from '@wojtekmaj/date-utils';

import { formatMonth, formatShortMonth } from '../shared/dateFormatter';
import { isMaxDate, isMinDate } from '../shared/propTypes';
import { safeMin, safeMax } from '../shared/utils';

export default function MonthSelect({
  ariaLabel,
  className,
  inputRef,
  locale,
  maxDate,
  minDate,
  placeholder = '--',
  short,
  value,
  year,
  ...otherProps
}) {
  function isSameYear(date) {
    return date && year === getYear(date).toString();
  }

  const maxMonth = safeMin(12, isSameYear(maxDate) && getMonthHuman(maxDate));
  const minMonth = safeMax(1, isSameYear(minDate) && getMonthHuman(minDate));
  const dates = [...Array(12)].map((el, index) => new Date(2019, index, 1));
  const name = 'month';
  const formatter = short ? formatShortMonth : formatMonth;

  return (
    <select
      aria-label={ariaLabel}
      className={mergeClassNames(
        `${className}__input`,
        `${className}__${name}`,
      )}
      data-input="true"
      name={name}
      ref={inputRef}
      value={value !== null ? value : ''}
      {...otherProps}
    >
      {!value && (
        <option value="">
          {placeholder}
        </option>
      )}
      {dates.map((date) => {
        const month = getMonthHuman(date);
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
  ariaLabel: PropTypes.string,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  inputRef: PropTypes.func,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  short: PropTypes.bool,
  value: PropTypes.string,
  year: PropTypes.string,
};
