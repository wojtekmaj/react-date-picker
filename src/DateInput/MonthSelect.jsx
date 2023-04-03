import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { getYear, getMonthHuman } from '@wojtekmaj/date-utils';

import { formatMonth, formatShortMonth } from '../shared/dateFormatter';
import { isMaxDate, isMinDate, isRef } from '../shared/propTypes';
import { safeMin, safeMax } from '../shared/utils';

/* eslint-disable jsx-a11y/no-autofocus */

export default function MonthSelect({
  ariaLabel,
  autoFocus,
  className,
  disabled,
  inputRef,
  locale,
  maxDate,
  minDate,
  onChange,
  onKeyDown,
  placeholder = '--',
  required,
  short,
  value,
  year,
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
      autoFocus={autoFocus}
      className={clsx(`${className}__input`, `${className}__${name}`)}
      data-input="true"
      data-select="true"
      disabled={disabled}
      name={name}
      onChange={onChange}
      onKeyDown={onKeyDown}
      ref={inputRef}
      required={required}
      value={value !== null ? value : ''}
    >
      {!value && <option value="">{placeholder}</option>}
      {dates.map((date) => {
        const month = getMonthHuman(date);
        const disabled = month < minMonth || month > maxMonth;

        return (
          <option key={month} disabled={disabled} value={month}>
            {formatter(locale, date)}
          </option>
        );
      })}
    </select>
  );
}

MonthSelect.propTypes = {
  ariaLabel: PropTypes.string,
  autoFocus: PropTypes.bool,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  inputRef: isRef,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  short: PropTypes.bool,
  value: PropTypes.string,
  year: PropTypes.string,
};
