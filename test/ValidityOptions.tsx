import React from 'react';
import { getISOLocalDate } from '@wojtekmaj/date-utils';

type ValidityOptionsProps = {
  maxDate?: Date;
  minDate?: Date;
  required?: boolean;
  setMaxDate: (maxDate: Date | undefined) => void;
  setMinDate: (minDate: Date | undefined) => void;
  setRequired: (required: boolean) => void;
};

export default function ValidityOptions({
  maxDate,
  minDate,
  required,
  setMaxDate,
  setMinDate,
  setRequired,
}: ValidityOptionsProps) {
  function onMinChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setMinDate(value ? new Date(value) : undefined);
  }

  function onMaxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setMaxDate(value ? new Date(value) : undefined);
  }

  return (
    <fieldset>
      <legend>Minimum and maximum date</legend>

      <div>
        <label htmlFor="minDate">Minimum date</label>
        <input
          id="minDate"
          onChange={onMinChange}
          type="date"
          value={minDate ? getISOLocalDate(minDate) : ''}
        />
        &nbsp;
        <button onClick={() => setMinDate(undefined)} type="button">
          Clear
        </button>
      </div>

      <div>
        <label htmlFor="maxDate">Maximum date</label>
        <input
          id="maxDate"
          onChange={onMaxChange}
          type="date"
          value={maxDate ? getISOLocalDate(maxDate) : ''}
        />
        &nbsp;
        <button onClick={() => setMaxDate(undefined)} type="button">
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
        <label htmlFor="required">Required</label>
      </div>
    </fieldset>
  );
}
