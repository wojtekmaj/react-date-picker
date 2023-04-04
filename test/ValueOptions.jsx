import React from 'react';
import PropTypes from 'prop-types';
import { getISOLocalDate } from '@wojtekmaj/date-utils';

export default function ValueOptions({ setValue, value }) {
  const date = [].concat(value)[0];

  function onChange(event) {
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
          value={date ? getISOLocalDate(date) : ''}
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
