import React from 'react';
import PropTypes from 'prop-types';

export default function ViewOptions({
  disabled,
  isOpen,
  setState,
  showLeadingZeros,
  showNeighboringMonth,
  showWeekNumbers,
}) {
  function onDisabledChange(event) {
    const { checked } = event.target;

    setState({ disabled: checked });
  }

  function onIsOpenChange(event) {
    const { checked } = event.target;

    setState({ isOpen: checked });
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
          checked={disabled}
          id="disabled"
          onChange={onDisabledChange}
          type="checkbox"
        />
        <label htmlFor="disabled">
          Disabled
        </label>
      </div>

      <div>
        <input
          checked={isOpen}
          id="isOpen"
          onChange={onIsOpenChange}
          type="checkbox"
        />
        <label htmlFor="isOpen">
          Calendar open
        </label>
      </div>

      <div>
        <input
          checked={showLeadingZeros}
          id="showLeadingZeros"
          onChange={onShowLeadingZerosChange}
          type="checkbox"
        />
        <label htmlFor="showLeadingZeros">
          Show leading zeros
        </label>
      </div>

      <div>
        <input
          checked={showWeekNumbers}
          id="showWeekNumbers"
          onChange={onShowWeekNumbersChange}
          type="checkbox"
        />
        <label htmlFor="showWeekNumbers">
          Show week numbers
        </label>
      </div>

      <div>
        <input
          checked={showNeighboringMonth}
          id="showNeighboringMonth"
          onChange={onShowNeighboringMonthChange}
          type="checkbox"
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
  isOpen: PropTypes.bool.isRequired,
  setState: PropTypes.func.isRequired,
  showLeadingZeros: PropTypes.bool.isRequired,
  showNeighboringMonth: PropTypes.bool.isRequired,
  showWeekNumbers: PropTypes.bool.isRequired,
};
