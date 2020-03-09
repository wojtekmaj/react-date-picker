import React from 'react';
import PropTypes from 'prop-types';
import { getISOLocalDate } from '@wojtekmaj/date-utils';

export default function ValidityOptions({
  maxDate,
  minDate,
  required,
  setState,
}) {
  function onMinChange(event) {
    const { value } = event.target;

    setState({ minDate: value ? new Date(value) : null });
  }

  function onMaxChange(event) {
    const { value } = event.target;

    setState({ maxDate: value ? new Date(value) : null });
  }

  return (
    <fieldset id="ValidityOptions">
      <legend htmlFor="ValidityOptions">
        Minimum and maximum date
      </legend>

      <div>
        <label htmlFor="minDate">
          Minimum date
        </label>
        <input
          id="minDate"
          onChange={onMinChange}
          type="date"
          value={minDate ? getISOLocalDate(minDate) : ''}
        />
        &nbsp;
        <button
          onClick={() => setState({ minDate: null })}
          type="button"
        >
          Clear
        </button>
      </div>

      <div>
        <label htmlFor="maxDate">
          Maximum date
        </label>
        <input
          id="maxDate"
          onChange={onMaxChange}
          type="date"
          value={maxDate ? getISOLocalDate(maxDate) : ''}
        />
        &nbsp;
        <button
          onClick={() => setState({ maxDate: null })}
          type="button"
        >
          Clear
        </button>
      </div>

      <div>
        <input
          checked={required}
          id="required"
          onChange={event => setState({ required: event.target.checked })}
          type="checkbox"
        />
        <label htmlFor="required">
          Required
        </label>
      </div>
    </fieldset>
  );
}

ValidityOptions.propTypes = {
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  required: PropTypes.bool,
  setState: PropTypes.func.isRequired,
};
