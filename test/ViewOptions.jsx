import React from 'react';
import PropTypes from 'prop-types';

export default function ViewOptions({
  disabled,
  setState,
  showLeadingZeros,
  showNeighboringMonth,
  showWeekNumbers,
}) {
  function onDisabledChange(event) {
    const { checked } = event.target;

    setState({ disabled: checked });
  }

  function onShowLeadingZerosChange(event) {
    const { checked } = event.target;

    setState({ showLeadingZeros: checked });
  }

  function onShowWeekNumbersChange(event) {
    const { checked } = event.target;

    setState({ showWeekNumbers: checked });
  }

  function onShowNeighboringMonthChange(event) {
    const { checked } = event.target;

    setState({ showNeighboringMonth: checked });
  }

  return (
    <fieldset id="viewoptions">
      <legend htmlFor="viewoptions">
        View options
      </legend>

      <div>
        <input
          id="disabled"
          type="checkbox"
          checked={disabled}
          onChange={onDisabledChange}
        />
        <label htmlFor="disabled">
          Disabled
        </label>
      </div>

      <div>
        <input
          id="showLeadingZeros"
          type="checkbox"
          checked={showLeadingZeros}
          onChange={onShowLeadingZerosChange}
        />
        <label htmlFor="showLeadingZeros">
          Show leading zeros
        </label>
      </div>

      <div>
        <input
          id="showWeekNumbers"
          type="checkbox"
          checked={showWeekNumbers}
          onChange={onShowWeekNumbersChange}
        />
        <label htmlFor="showWeekNumbers">
          Show week numbers
        </label>
      </div>

      <div>
        <input
          id="showNeighboringMonth"
          type="checkbox"
          checked={showNeighboringMonth}
          onChange={onShowNeighboringMonthChange}
        />
        <label htmlFor="showNeighboringMonth">
          {'Show neighboring month\'s days'}
        </label>
      </div>
    </fieldset>
  );
}

ViewOptions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  setState: PropTypes.func.isRequired,
  showLeadingZeros: PropTypes.bool.isRequired,
  showNeighboringMonth: PropTypes.bool.isRequired,
  showWeekNumbers: PropTypes.bool.isRequired,
};
