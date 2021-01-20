import React from 'react';
import PropTypes from 'prop-types';
import { getISOLocalDate } from '@wojtekmaj/date-utils';

export default function ValidityOptions({
  maxDate,
  minDate,
  required,
  setMaxDate,
  setMinDate,
  setRequired,
}) {
  function onMinChange(event) {
    const { value } = event.target;

    setMinDate(value ? new Date(value) : null);
  }

  function onMaxChange(event) {
    const { value } = event.target;

    setMaxDate(value ? new Date(value) : null);
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
          onClick={() => setMinDate(null)}
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
          onClick={() => setMaxDate(null)}
          type="button"
        >
          Clear
        </button>
      </div>

      <div>
        <input
          checked={required}
          id="required"
          onChange={(event) => setRequired(event.target.checked)}
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
  setMaxDate: PropTypes.func.isRequired,
  setMinDate: PropTypes.func.isRequired,
  setRequired: PropTypes.func.isRequired,
};
