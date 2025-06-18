import { useId } from 'react';
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
  const minDateId = useId();
  const maxDateId = useId();
  const requiredId = useId();

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
        <label htmlFor={minDateId}>Minimum date</label>
        <input
          id={minDateId}
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
        <label htmlFor={maxDateId}>Maximum date</label>
        <input
          id={maxDateId}
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
          id={requiredId}
          onChange={(event) => setRequired(event.target.checked)}
          type="checkbox"
        />
        <label htmlFor={requiredId}>Required</label>
      </div>
    </fieldset>
  );
}
