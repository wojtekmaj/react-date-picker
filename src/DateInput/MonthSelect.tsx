import React from 'react';
import clsx from 'clsx';
import { getYear, getMonthHuman } from '@wojtekmaj/date-utils';

import { formatMonth, formatShortMonth } from '../shared/dateFormatter.js';
import { safeMin, safeMax } from '../shared/utils.js';

/* eslint-disable jsx-a11y/no-autofocus */

type MonthSelectProps = {
  ariaLabel?: string;
  autoFocus?: boolean;
  className: string;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLSelectElement>;
  locale?: string;
  maxDate?: Date;
  minDate?: Date;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement> & { target: HTMLSelectElement }) => void;
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLSelectElement> & { target: HTMLSelectElement },
  ) => void;
  placeholder?: string;
  required?: boolean;
  short?: boolean;
  value?: string | null;
  year?: string | null;
};

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
}: MonthSelectProps) {
  function isSameYear(date: Date) {
    return date && year === getYear(date).toString();
  }

  const maxMonth = safeMin(12, maxDate && isSameYear(maxDate) && getMonthHuman(maxDate));
  const minMonth = safeMax(1, minDate && isSameYear(minDate) && getMonthHuman(minDate));
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
