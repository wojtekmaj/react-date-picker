import React from 'react';

type ViewOptionsProps = {
  disabled: boolean;
  renderInPortal: boolean;
  setDisabled: (disabled: boolean) => void;
  setRenderInPortal: (renderInPortal: boolean) => void;
  setShowLeadingZeros: (showLeadingZeros: boolean) => void;
  setShowNeighboringMonth: (showNeighboringMonth: boolean) => void;
  setShowWeekNumbers: (showWeekNumbers: boolean) => void;
  showLeadingZeros: boolean;
  showNeighboringMonth: boolean;
  showWeekNumbers: boolean;
};

export default function ViewOptions({
  disabled,
  renderInPortal,
  setDisabled,
  setRenderInPortal,
  setShowLeadingZeros,
  setShowNeighboringMonth,
  setShowWeekNumbers,
  showLeadingZeros,
  showNeighboringMonth,
  showWeekNumbers,
}: ViewOptionsProps) {
  function onDisabledChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setDisabled(checked);
  }

  function onShowLeadingZerosChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setShowLeadingZeros(checked);
  }

  function onShowWeekNumbersChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setShowWeekNumbers(checked);
  }

  function onShowNeighboringMonthChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setShowNeighboringMonth(checked);
  }

  function onRenderInPortalChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setRenderInPortal(checked);
  }

  return (
    <fieldset>
      <legend>View options</legend>

      <div>
        <input checked={disabled} id="disabled" onChange={onDisabledChange} type="checkbox" />
        <label htmlFor="disabled">Disabled</label>
      </div>

      <div>
        <input
          checked={showLeadingZeros}
          id="showLeadingZeros"
          onChange={onShowLeadingZerosChange}
          type="checkbox"
        />
        <label htmlFor="showLeadingZeros">Show leading zeros</label>
      </div>

      <div>
        <input
          checked={showWeekNumbers}
          id="showWeekNumbers"
          onChange={onShowWeekNumbersChange}
          type="checkbox"
        />
        <label htmlFor="showWeekNumbers">Show week numbers</label>
      </div>

      <div>
        <input
          checked={showNeighboringMonth}
          id="showNeighboringMonth"
          onChange={onShowNeighboringMonthChange}
          type="checkbox"
        />
        <label htmlFor="showNeighboringMonth">{"Show neighboring month's days"}</label>
      </div>

      <div>
        <input
          checked={renderInPortal}
          id="renderInPortal"
          onChange={onRenderInPortalChange}
          type="checkbox"
        />
        <label htmlFor="renderInPortal">Render in portal</label>
      </div>
    </fieldset>
  );
}
