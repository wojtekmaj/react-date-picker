import React from 'react';
import PropTypes from 'prop-types';
import { getISOLocalDate } from '@wojtekmaj/date-utils';

import type { LooseValue } from './shared/types';

type ValueOptionsProps = {
  setValue: (value: LooseValue) => void;
  value?: LooseValue;
};

export default function ValueOptions({ setValue, value }: ValueOptionsProps) {
  const [date] = Array.isArray(value) ? value : [value];

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value: nextValue } = event.target;

    setValue(nextValue && new Date(nextValue));
  }

  return (
    <fieldset>
      <legend>Set date externally</legend>

      <div>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          onChange={onChange}
          type="date"
          value={date && date instanceof Date ? getISOLocalDate(date) : date || undefined}
        />
        &nbsp;
        <button onClick={() => setValue(null)} type="button">
          Clear to null
        </button>
        <button onClick={() => setValue('')} type="button">
          Clear to empty string
        </button>
      </div>
    </fieldset>
  );
}

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

const isValueOrValueArray = PropTypes.oneOfType([isValue, PropTypes.arrayOf(isValue)]);

ValueOptions.propTypes = {
  setValue: PropTypes.func.isRequired,
  value: isValueOrValueArray,
};
